// Bensinstasjon (gas station). The player must drive into the trigger
// zone (under the canopy) to refuel before reaching Rema 1000.

import { RBT_B } from "./roundabout";

export const BENSIN = {
  x: RBT_B.cx - 220,
  y: 280,
  w: 440,
  h: 280,
  // Trigger covers the asphalt under the canopy + the pump aisle.
  trigger: {
    x: RBT_B.cx - 200,
    y: 380,
    w: 400,
    h: 200,
  },
};
