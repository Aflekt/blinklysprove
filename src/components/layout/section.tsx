import type { ComponentPropsWithoutRef } from "react";
import { paddingYClass, type Space } from "@/components/layout/space";
import { cn } from "@/lib/cn";

export type SectionProps = ComponentPropsWithoutRef<"section"> & { space?: Space };

export const Section = ({ space = "xl", className, ...props }: SectionProps) => (
  <section className={cn(paddingYClass[space], className)} {...props} />
);
