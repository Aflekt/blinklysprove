import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Etatsknappen. Utseendet ligger i `vv-btn` i globals.css, sammen med resten av skjemadelen. */
export const Button = ({
  type = "button",
  variant = "primary",
  className,
  ...props
}: ComponentPropsWithoutRef<"button"> & { variant?: "primary" | "secondary" }) => (
  <button type={type} className={cn("vv-btn", variant === "secondary" && "vv-btn-secondary", className)} {...props} />
);
