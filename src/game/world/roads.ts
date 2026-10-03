// Straight road segments. Two roundabouts are connected by an east-west
// road. Each roundabout has additional dead-end arms leading to decoy
// buildings, so the route to Rema 1000 is not memorisable on first try.

import { ROAD_W, WORLD } from "./constants";
import { RBT_A, RBT_B } from "./roundabout";

export interface RoadRect {
  x: number;
  y: number;
  w: number;
  h: number;
  orient: "h" | "v";
}

export const ROADS: RoadRect[] = [
  // ── Roundabout A (centre) ───────────────────────────────────────────
  // South road from RBT_A down to player start.
  {
    x: RBT_A.cx - ROAD_W / 2,
    y: RBT_A.cy + RBT_A.innerR,
    w: ROAD_W,
    h: WORLD.height - (RBT_A.cy + RBT_A.innerR),
    orient: "v",
  },
  // North arm of RBT_A — leads to Skole (decoy).
  { x: RBT_A.cx - ROAD_W / 2, y: 600, w: ROAD_W, h: RBT_A.cy - RBT_A.innerR - 600, orient: "v" },
  // East arm of RBT_A — leads to Kafé (decoy).
  { x: RBT_A.cx + RBT_A.innerR, y: RBT_A.cy - ROAD_W / 2, w: 5800 - (RBT_A.cx + RBT_A.innerR), h: ROAD_W, orient: "h" },

  // ── Connector A ↔ B (east-west between the two roundabouts) ─────────
  {
    x: RBT_B.cx + RBT_B.innerR,
    y: RBT_A.cy - ROAD_W / 2,
    w: RBT_A.cx - RBT_A.innerR - (RBT_B.cx + RBT_B.innerR),
    h: ROAD_W,
    orient: "h",
  },

  // ── Roundabout B (west) ─────────────────────────────────────────────
  // North arm of RBT_B — leads to Bensin (decoy).
  { x: RBT_B.cx - ROAD_W / 2, y: 600, w: ROAD_W, h: RBT_B.cy - RBT_B.innerR - 600, orient: "v" },
  // West arm of RBT_B — leads to Park (decoy / dead end).
  { x: 200, y: RBT_B.cy - ROAD_W / 2, w: RBT_B.cx - RBT_B.innerR - 200, h: ROAD_W, orient: "h" },
  // South arm of RBT_B — leads to Rema 1000 (the goal).
  { x: RBT_B.cx - ROAD_W / 2, y: RBT_B.cy + RBT_B.innerR, w: ROAD_W, h: 4400 - (RBT_B.cy + RBT_B.innerR), orient: "v" },
];
