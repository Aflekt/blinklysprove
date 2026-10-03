// Rema 1000 — the goal. Located south of roundabout B.

import { RBT_B } from "./roundabout";

export const REMA = {
  // Building shell.
  x: RBT_B.cx + 180,
  y: 3950,
  w: 380,
  h: 320,
  // Trigger zone — covers the parking lot in front of the building so the
  // player wins as soon as they pull into the lot.
  trigger: {
    x: RBT_B.cx + 140,
    y: 3850,
    w: 460,
    h: 460,
  },
};
