// Avstandstrinnene fra design-system-skillen (4px-skalaen, navn som i 3T).
export type Space = "none" | "xxs" | "xs" | "s" | "m" | "l" | "xl" | "xxl";

export const gapClass: Record<Space, string> = {
  none: "gap-0",
  xxs: "gap-1",
  xs: "gap-2",
  s: "gap-4",
  m: "gap-6",
  l: "gap-10",
  xl: "gap-16",
  xxl: "gap-20",
};

export const paddingYClass: Record<Space, string> = {
  none: "py-0",
  xxs: "py-1",
  xs: "py-2",
  s: "py-4",
  m: "py-6",
  l: "py-10",
  xl: "py-16",
  xxl: "py-20",
};
