// Decoy buildings on dead-end arms — they look like destinations but
// aren't Rema 1000.
//
// Bensin used to live here; it's been promoted to its own module since
// it's now an interactive (refuel) zone.

import { RBT_A, RBT_B } from "./roundabout";

export type DecoyKind = "skole" | "kafe" | "park";

export interface Decoy {
  kind: DecoyKind;
  label: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export const DECOYS: Decoy[] = [
  // North arm of RBT_A.
  { kind: "skole", label: "KARLSEN SKOLE", x: RBT_A.cx - 200, y: 280, w: 400, h: 280 },
  // East arm of RBT_A.
  { kind: "kafe", label: "KAFÉ ARNE", x: 5500, y: RBT_A.cy - 160, w: 320, h: 320 },
  // West arm of RBT_B (dead end park).
  { kind: "park", label: "PARKEN", x: 60, y: RBT_B.cy - 200, w: 220, h: 400 },
];
