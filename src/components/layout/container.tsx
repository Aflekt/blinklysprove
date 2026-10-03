import type { ComponentPropsWithoutRef } from "react";
import { cn } from "@/lib/cn";

// Prøven har én bredde (max-w-5xl) med fast sidemarg, som skjemaene hos en etat.
const widthClass = { s: "max-w-xl", m: "max-w-3xl", l: "max-w-5xl", full: "max-w-none" };

export type ContainerProps = ComponentPropsWithoutRef<"div"> & {
  as?: "div" | "main" | "header" | "footer";
  width?: keyof typeof widthClass;
};

export const Container = ({ as: Component = "div", width = "l", className, ...props }: ContainerProps) => (
  <Component className={cn("mx-auto w-full px-8", widthClass[width], className)} {...props} />
);
