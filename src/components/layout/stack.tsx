// Layout-klosser har ingen farger eller tekst, bare plassering og avstand fra 4px-skalaen.
import type { ComponentPropsWithoutRef, ElementType } from "react";
import { gapClass, type Space } from "@/components/layout/space";
import { cn } from "@/lib/cn";

const alignClass = { start: "items-start", center: "items-center", end: "items-end", stretch: "items-stretch" };
const justifyClass = {
  start: "justify-start",
  center: "justify-center",
  end: "justify-end",
  between: "justify-between",
};

type FlexProps<T extends ElementType> = {
  as?: T;
  gap?: Space;
  align?: keyof typeof alignClass;
  justify?: keyof typeof justifyClass;
} & ComponentPropsWithoutRef<T>;

export const Stack = <T extends ElementType = "div">({
  as,
  gap = "s",
  align,
  justify,
  className,
  ...props
}: FlexProps<T>) => {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "flex flex-col",
        gapClass[gap],
        align && alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...props}
    />
  );
};

export const Inline = <T extends ElementType = "div">({
  as,
  gap = "xs",
  align = "center",
  justify,
  wrap = true,
  className,
  ...props
}: FlexProps<T> & { wrap?: boolean }) => {
  const Component = as ?? "div";
  return (
    <Component
      className={cn(
        "flex",
        wrap && "flex-wrap",
        gapClass[gap],
        alignClass[align],
        justify && justifyClass[justify],
        className,
      )}
      {...props}
    />
  );
};
