// vitest-axe 0.1.0 utvider bare det gamle Vi-navnerommet. Dette gjør toHaveNoViolations kjent for Vitest 5.
import "vitest";
import type { AxeMatchers } from "vitest-axe/matchers";

declare module "vitest" {
  interface Assertion<T> extends AxeMatchers {}
  interface AsymmetricMatchersContaining extends AxeMatchers {}
}
