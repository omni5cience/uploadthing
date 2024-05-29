"use client";

import * as React from "react";
import { Dialog, DialogContent } from "@/ui/dialog";
import { type DialogProps } from "@radix-ui/react-dialog";
import { Command as CommandPrimitive } from "cmdk";
import { twMerge } from "tailwind-merge";

const Magic = ({ className }: { className: string }) => (
  <svg
    width="469"
    height="469"
    viewBox="0 0 469 469"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    shapeRendering="geometricPrecision"
    stroke="currentColor"
    strokeLinecap="round"
    strokeLinejoin="round"
    strokeWidth="1.5"
    className={className}
  >
    <path
      d="M237.092 62.3004L266.754 71.4198C267.156 71.5285 267.51 71.765 267.765 72.0934C268.02 72.4218 268.161 72.8243 268.166 73.2399C268.172 73.6555 268.042 74.0616 267.796 74.3967C267.55 74.7318 267.201 74.9777 266.803 75.097L237.141 84.3145C236.84 84.4058 236.566 84.5699 236.344 84.7922C236.121 85.0146 235.957 85.2883 235.866 85.5893L226.747 115.252C226.638 115.653 226.401 116.008 226.073 116.263C225.745 116.517 225.342 116.658 224.926 116.664C224.511 116.669 224.105 116.539 223.77 116.293C223.435 116.047 223.189 115.699 223.069 115.301L213.852 85.6383C213.761 85.3374 213.597 85.0636 213.374 84.8412C213.152 84.6189 212.878 84.4548 212.577 84.3635L182.914 75.2441C182.513 75.1354 182.158 74.8989 181.904 74.5705C181.649 74.2421 181.508 73.8396 181.503 73.424C181.497 73.0084 181.627 72.6023 181.873 72.2672C182.119 71.9321 182.467 71.6863 182.865 71.5669L212.528 62.3494C212.829 62.2582 213.103 62.0941 213.325 61.8717C213.547 61.6494 213.712 61.3756 213.803 61.0747L222.922 31.4121C223.031 31.0109 223.267 30.656 223.596 30.4013C223.924 30.1465 224.327 30.0057 224.742 30.0002C225.158 29.9946 225.564 30.1247 225.899 30.3706C226.234 30.6165 226.48 30.9649 226.599 31.363L235.817 61.0257C235.908 61.3266 236.072 61.6003 236.295 61.8227C236.517 62.0451 236.791 62.2091 237.092 62.3004Z"
      fill="currentColor"
    />
    <path
      d="M155.948 155.848L202.771 168.939C203.449 169.131 204.045 169.539 204.47 170.101C204.895 170.663 205.125 171.348 205.125 172.052C205.125 172.757 204.895 173.442 204.47 174.004C204.045 174.566 203.449 174.974 202.771 175.166L155.899 188.06C155.361 188.209 154.87 188.496 154.475 188.891C154.079 189.286 153.793 189.777 153.644 190.316L140.553 237.138C140.361 237.816 139.953 238.413 139.391 238.838C138.829 239.262 138.144 239.492 137.44 239.492C136.735 239.492 136.05 239.262 135.488 238.838C134.927 238.413 134.519 237.816 134.327 237.138L121.432 190.267C121.283 189.728 120.997 189.237 120.601 188.842C120.206 188.446 119.715 188.16 119.177 188.011L72.3537 174.92C71.676 174.728 71.0795 174.32 70.6547 173.759C70.2299 173.197 70 172.512 70 171.807C70 171.103 70.2299 170.418 70.6547 169.856C71.0795 169.294 71.676 168.886 72.3537 168.694L119.226 155.799C119.764 155.65 120.255 155.364 120.65 154.969C121.046 154.573 121.332 154.082 121.481 153.544L134.572 106.721C134.764 106.043 135.172 105.447 135.734 105.022C136.295 104.597 136.981 104.367 137.685 104.367C138.389 104.367 139.075 104.597 139.637 105.022C140.198 105.447 140.606 106.043 140.798 106.721L153.693 153.593C153.842 154.131 154.128 154.622 154.524 155.018C154.919 155.413 155.41 155.699 155.948 155.848Z"
      fill="currentColor"
    />
    <path
      d="M386.827 289.992C404.33 292.149 403.84 305.828 386.876 307.299C346.623 310.829 298.869 316.271 282.199 360.005C274.844 379.192 269.942 403.2 267.49 432.029C267.427 432.846 267.211 433.626 266.856 434.319C266.501 435.012 266.015 435.602 265.431 436.05C254.988 444.041 251.212 434.186 250.183 425.606C239.2 332.353 214.588 316.909 124.668 306.122C123.892 306.031 123.151 305.767 122.504 305.35C121.857 304.933 121.322 304.375 120.942 303.72C116.399 295.679 119.324 291.038 129.718 289.796C224.688 278.47 236.062 262.83 250.183 169.331C252.177 156.355 257.259 154.083 265.431 162.516C266.51 163.593 267.202 165.099 267.392 166.782C279.257 258.564 293.328 278.617 386.827 289.992Z"
      fill="currentColor"
    />
  </svg>
);

const Command = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive>
>(({ className, ...props }, ref) => (
  <CommandPrimitive
    ref={ref}
    className={twMerge(
      "bg-popover text-popover-foreground flex h-full w-full flex-col overflow-hidden rounded-md",
      className,
    )}
    {...props}
  />
));
Command.displayName = CommandPrimitive.displayName;

interface CommandDialogProps extends DialogProps {}

const CommandDialog = ({ children, ...props }: CommandDialogProps) => {
  return (
    <Dialog {...props}>
      <DialogContent className="overflow-hidden p-0 shadow-lg">
        <Command className="[&_[cmdk-group-heading]]:text-muted-foreground [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:font-medium [&_[cmdk-group]:not([hidden])_~[cmdk-group]]:pt-0 [&_[cmdk-group]]:px-2 [&_[cmdk-input-wrapper]_svg]:h-5 [&_[cmdk-input-wrapper]_svg]:w-5 [&_[cmdk-input]]:h-12 [&_[cmdk-item]]:px-2 [&_[cmdk-item]]:py-3 [&_[cmdk-item]_svg]:h-5 [&_[cmdk-item]_svg]:w-5">
          {children}
        </Command>
      </DialogContent>
    </Dialog>
  );
};

const CommandInput = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Input>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Input>
>(({ className, ...props }, ref) => (
  <div className="flex items-center border-b px-4" cmdk-input-wrapper="">
    <Magic className="mr-2 h-4 w-4 shrink-0 text-purple-500 " />
    <CommandPrimitive.Input
      ref={ref}
      className={twMerge(
        "placeholder:text-muted-foreground flex h-11 w-full rounded-md bg-transparent py-3 text-sm outline-none disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    />
  </div>
));

CommandInput.displayName = CommandPrimitive.Input.displayName;

const CommandList = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.List>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.List>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.List
    ref={ref}
    className={twMerge(
      "max-h-[300px] overflow-y-auto overflow-x-hidden",
      className,
    )}
    {...props}
  />
));

CommandList.displayName = CommandPrimitive.List.displayName;

const CommandEmpty = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Empty>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Empty>
>((props, ref) => (
  <CommandPrimitive.Empty
    ref={ref}
    className="py-6 text-center text-sm"
    {...props}
  />
));

CommandEmpty.displayName = CommandPrimitive.Empty.displayName;

const CommandGroup = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Group>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Group>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Group
    ref={ref}
    className={twMerge(
      "text-foreground [&_[cmdk-group-heading]]:text-muted-foreground overflow-hidden p-1 [&_[cmdk-group-heading]]:px-2 [&_[cmdk-group-heading]]:py-1.5 [&_[cmdk-group-heading]]:text-xs [&_[cmdk-group-heading]]:font-medium",
      className,
    )}
    {...props}
  />
));

CommandGroup.displayName = CommandPrimitive.Group.displayName;

const CommandSeparator = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Separator>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Separator>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Separator
    ref={ref}
    className={twMerge("bg-border -mx-1 h-px", className)}
    {...props}
  />
));
CommandSeparator.displayName = CommandPrimitive.Separator.displayName;

const CommandItem = React.forwardRef<
  React.ElementRef<typeof CommandPrimitive.Item>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive.Item>
>(({ className, ...props }, ref) => (
  <CommandPrimitive.Item
    ref={ref}
    className={twMerge(
      "aria-selected:bg-accent aria-selected:text-accent-foreground relative flex cursor-default select-none items-center rounded-sm px-2 py-1.5 text-sm outline-none data-[disabled]:pointer-events-none data-[disabled]:opacity-50",
      className,
    )}
    {...props}
  />
));

CommandItem.displayName = CommandPrimitive.Item.displayName;

const CommandShortcut = ({
  className,
  ...props
}: React.HTMLAttributes<HTMLSpanElement>) => {
  return (
    <span
      className={twMerge(
        "text-muted-foreground ml-auto text-xs tracking-widest",
        className,
      )}
      {...props}
    />
  );
};
CommandShortcut.displayName = "CommandShortcut";

export {
  Command,
  CommandDialog,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
  CommandShortcut,
  CommandSeparator,
};
