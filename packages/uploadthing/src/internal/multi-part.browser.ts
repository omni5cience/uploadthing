import * as S from "@effect/schema/Schema";
import { Cause, Effect, Schedule } from "effect";

import {
  contentDisposition,
  fetchEffJson,
  generateUploadThingURL,
  RetryError,
  UploadThingError,
} from "@uploadthing/shared";
import type { ContentDisposition } from "@uploadthing/shared";

import type { MPUResponse } from "./types";
import type { UTReporter } from "./ut-reporter";

export const uploadMultipartWithProgress = (
  file: File,
  presigned: MPUResponse,
  opts: {
    reportEventToUT: UTReporter;
    onUploadProgress?:
      | ((opts: { file: string; progress: number }) => void)
      | undefined;
  },
) =>
  Effect.gen(function* ($) {
    let uploadedBytes = 0;
    const etags = yield* $(
      Effect.forEach(
        presigned.urls,
        (url, index) => {
          const offset = presigned.chunkSize * index;
          const end = Math.min(offset + presigned.chunkSize, file.size);
          const chunk = file.slice(offset, end);

          return uploadPart({
            url,
            chunk: chunk,
            contentDisposition: presigned.contentDisposition,
            fileType: file.type,
            fileName: file.name,
            onProgress: (delta) => {
              uploadedBytes += delta;
              const percent = (uploadedBytes / file.size) * 100;
              opts.onUploadProgress?.({ file: file.name, progress: percent });
            },
          }).pipe(
            Effect.andThen((tag) => ({ tag, partNumber: index + 1 })),
            Effect.retry({
              while: (error) => error instanceof RetryError,
              times: 10,
              schedule: Schedule.fixed(2000),
            }),
          );
        },
        { concurrency: "inherit" },
      ),
      Effect.tapErrorCause((error) =>
        opts.reportEventToUT(
          "failure",
          {
            fileKey: presigned.key,
            uploadId: presigned.uploadId,
            fileName: file.name,
            s3Error: Cause.pretty(error).toString(),
          },
          S.null,
        ),
      ),
    );

    // Tell the server that the upload is complete
    yield* $(
      opts.reportEventToUT(
        "multipart-complete",
        {
          uploadId: presigned.uploadId,
          fileKey: presigned.key,
          etags,
        },
        S.null,
      ),
    );
  });

export const completeMultipartUpload = (
  presigned: { key: string; uploadId: string },
  etags: { tag: string; partNumber: number }[],
) =>
  fetchEffJson(
    generateUploadThingURL("/api/completeMultipart"),
    S.struct({ success: S.boolean, message: S.optional(S.string) }),
    {
      method: "POST",
      body: JSON.stringify({
        fileKey: presigned.key,
        uploadId: presigned.uploadId,
        etags,
      }),
    },
  );

interface UploadPartOptions {
  url: string;
  chunk: Blob;
  fileType: string;
  fileName: string;
  contentDisposition: ContentDisposition;
  onProgress: (progressDelta: number) => void;
}

const uploadPart = (opts: UploadPartOptions) =>
  Effect.async<string, UploadThingError | RetryError>((resume) => {
    const xhr = new XMLHttpRequest();

    xhr.open("PUT", opts.url, true);
    xhr.setRequestHeader("Content-Type", opts.fileType);
    xhr.setRequestHeader(
      "Content-Disposition",
      contentDisposition(opts.contentDisposition, opts.fileName),
    );

    xhr.onload = () => {
      const etag = xhr.getResponseHeader("Etag");
      if (xhr.status >= 200 && xhr.status <= 299 && etag) {
        return resume(Effect.succeed(etag));
      }
      return resume(
        Effect.fail(
          new UploadThingError({
            code: "UPLOAD_FAILED",
            message: "Missing Etag header from uploaded part",
          }),
        ),
      );
    };
    xhr.onerror = () => resume(Effect.fail(new RetryError()));

    let lastProgress = 0;
    xhr.upload.onprogress = (e) => {
      const delta = e.loaded - lastProgress;
      lastProgress += delta;
      opts.onProgress(delta);
    };

    xhr.send(opts.chunk);
  });
