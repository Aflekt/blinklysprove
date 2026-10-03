import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

export const Label = ({ className, ...props }: ComponentPropsWithoutRef<"label">) => (
  // biome-ignore lint/a11y/noLabelWithoutControl: htmlFor kommer fra props
  <label className={cn("vv-form-label", className)} {...props} />
);

export const Input = ({ className, ...props }: ComponentPropsWithoutRef<"input">) => (
  <input className={cn("vv-input", className)} {...props} />
);
