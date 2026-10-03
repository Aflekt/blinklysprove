// Per-car configuration.

import type { Physics } from "../physics";

export type CarId = "corolla" | "tesla" | "bmw" | "volvo" | "caddy" | "focus";

export interface CarConfig {
  id: CarId;
  name: string;
  blurb: string; // shown on the car-select screen
  body: string;
  roof: string;
  physics?: Partial<Physics>;
  quirks?: {
    blinkerFlipped?: boolean; // Q swaps with W
    instantTopSpeed?: boolean; // accelerator pegs you to MAX_FWD immediately
  };
  lives?: number; // override default 3
}
