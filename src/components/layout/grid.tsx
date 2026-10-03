import type { ComponentPropsWithoutRef } from "react";
import { gapClass, type Space } from "@/components/layout/space";
import { cn } from "@/lib/cn";

const colsClass = {
  1: "grid-cols-1",
  2: "grid-cols-1 sm:grid-cols-2",
  3: "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3",
  4: "grid-cols-2 lg:grid-cols-4",
};

export type GridProps = ComponentPropsWithoutRef<"div"> & { cols?: keyof typeof colsClass; gap?: Space };

export const Grid = ({ cols = 3, gap = "m", className, ...props }: GridProps) => (
  <div className={cn("grid", colsClass[cols], gapClass[gap], className)} {...props} />
);
