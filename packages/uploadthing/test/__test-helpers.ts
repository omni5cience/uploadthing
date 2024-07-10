import * as S from "@effect/schema/Schema";
import type { StrictRequest } from "msw";
import { http, HttpResponse } from "msw";
import { setupServer } from "msw/node";
import { afterAll, beforeAll, it as itBase, vi } from "vitest";

import { UPLOADTHING_VERSION } from "../src/internal/config";
import { UploadThingToken } from "../src/internal/shared-schemas";
import type { ActionType } from "../src/internal/shared-schemas";

export const requestSpy = vi.fn<[string, RequestInit]>();
export const requestsToDomain = (domain: string) =>
  requestSpy.mock.calls.filter(([url]) => url.includes(domain));

export const middlewareMock = vi.fn();
export const uploadCompleteMock = vi.fn();
export const onErrorMock = vi.fn();

const tokenData = {
  apiKey: "sk_foo",
  appId: "app-1",
  regions: ["fra1"] as const,
};
export const testToken = {
  encoded: S.encodeSync(UploadThingToken)(tokenData),
  decoded: tokenData,
};

export const API_URL =
  process.env.UPLOADTHING_API_URL ?? "https://api.uploadthing.com";
export const UTFS_IO_URL = process.env.UPLOADTHING_API_URL
  ? "https://uploadthing-dev-fra1.s3.eu-central-1.amazonaws.com"
  : "https://utfs.io/f";

export const createApiUrl = (slug: string, action?: typeof ActionType.Type) => {
  const url = new URL("http://localhost:3000");
  url.searchParams.set("slug", slug);
  if (action) url.searchParams.set("actionType", action);
  return url;
};

export const doNotExecute = (_fn: (...args: any[]) => any) => {
  // noop
};

export const baseHeaders = {
  "x-uploadthing-version": UPLOADTHING_VERSION,
  "x-uploadthing-package": "vitest",
};

/**
 * Call this in each MSW handler to spy on the request
 * and provide an easy way to assert on the request
 */
const callRequestSpy = async (request: StrictRequest<any>) =>
  requestSpy(new URL(request.url).toString(), {
    method: request.method,
    headers: Object.fromEntries(request.headers),
    body: await (() => {
      if (request.method === "GET") return null;
      const ct = request.headers.get("content-type");
      const cloned = request.clone();
      if (ct?.includes("application/json")) return cloned.json();
      if (ct?.includes("multipart/form-data")) return cloned.formData();
      return cloned.blob();
    })(),
  });

const msw = setupServer();
beforeAll(() => {
  msw.listen({ onUnhandledRequest: "bypass" });
});
afterAll(() => msw.close());

export const resetMocks = () => msw.close();

/**
 * Extend the base `it` function to provide a `db` instance to our tests
 * and extend the MSW handlers to mock the UploadThing API
 *
 * NOTE:: Tests **must** destruct the `db` instance from the test context for it to be used
 * @example it("should do something", ({ db }) => { ... })
 */
export const it = itBase.extend({
  // eslint-disable-next-line no-empty-pattern
  db: async ({}, use) => {
    const files: any[] = [];
    const db = {
      files,
      insertFile: (file: any) => files.push(file),
      getFileByKey: (key: string) => files.find((f) => f.key === key),
    };
    msw.use(
      /**
       * S3
       */
      http.post("https://bucket.s3.amazonaws.com", async ({ request }) => {
        await callRequestSpy(request);
        return new HttpResponse();
      }),
      http.put("https://bucket.s3.amazonaws.com/:key", async ({ request }) => {
        await callRequestSpy(request);
        return new HttpResponse(null, {
          status: 204,
          headers: { ETag: "abc123" },
        });
      }),
      /**
       * Static Assets
       */
      http.get("https://cdn.foo.com/:fileKey", async ({ request }) => {
        await callRequestSpy(request);
        return HttpResponse.text("Lorem ipsum doler sit amet");
      }),
      http.get(`${UTFS_IO_URL}/:key`, async ({ request }) => {
        await callRequestSpy(request);
        return HttpResponse.text("Lorem ipsum doler sit amet");
      }),
      /**
       * UploadThing Ingest
       */
      http.all<{ key: string }>(
        `https://fra1.ingest.uploadthing.com/:key`,
        async ({ request, params }) => {
          await callRequestSpy(request);
          return HttpResponse.json({
            url: `${UTFS_IO_URL}/${params.key}`,
            serverData: null,
          });
        },
      ),
      /**
       * UploadThing API
       */
      http.post(`${API_URL}/v6/requestFileAccess`, async ({ request }) => {
        await callRequestSpy(request);
        return HttpResponse.json({
          url: `${UTFS_IO_URL}/someFileKey?x-some-amz=query-param`,
        });
      }),
      http.post(`${API_URL}/v6/updateACL`, async ({ request }) => {
        await callRequestSpy(request);
        return HttpResponse.json({ success: true });
      }),
    );
    await use(db); // provide test context
    files.length = 0; // clear files after each test
  },
});

/**
 * Call this in your test to make the ingest request fail
 */
export const useBadIngestServer = () =>
  msw.use(
    http.put(
      `https://fra1.ingest.uploadthing.com/:key`,
      async ({ request, params }) => {
        await callRequestSpy(request);

        return new HttpResponse(null, { status: 403 });
      },
    ),
  );

export const useBadUTApi = () =>
  msw.use(
    http.post(`${API_URL}/*`, async () => {
      return HttpResponse.json({ error: "Not found" }, { status: 404 });
    }),
  );
