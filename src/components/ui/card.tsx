import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

/** Det hvite skjemakortet. Overskrifter og avsnitt inni får stilen sin fra `vv-card` i globals.css. */
export const Card = ({ className, ...props }: ComponentPropsWithoutRef<"div">) => (
  <div className={cn("vv-card", className)} {...props} />
);

/** Ingressen øverst i et kort. */
export const Lead = ({ className, ...props }: ComponentPropsWithoutRef<"p">) => (
  <p className={cn("vv-lead", className)} {...props} />
);
