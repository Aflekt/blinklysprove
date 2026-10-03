// Roundabout geometry and Norwegian rule helpers.
//
// Traffic flows counter-clockwise (CCW) viewed from above (right-driving).
// Exits are labelled with their compass direction (N/E/S/W).
//
// Going CCW from each entry, the exits are:
//   S → E (1st), N (2nd), W (3rd), S (back)
//   W → S (1st), E (2nd), N (3rd), W (back)
//   N → W (1st), S (2nd), E (3rd), N (back)
//   E → N (1st), W (2nd), S (3rd), E (back)

export type RoundaboutId = "A" | "B";

export interface Roundabout {
  id: RoundaboutId;
  cx: number;
  cy: number;
  outerR: number;
  innerR: number;
}

export const ROUNDABOUTS: Roundabout[] = [
  { id: "A", cx: 3000, cy: 2700, outerR: 240, innerR: 110 },
  { id: "B", cx: 1500, cy: 2700, outerR: 240, innerR: 110 },
];

export const RBT_A = ROUNDABOUTS[0];
export const RBT_B = ROUNDABOUTS[1];

export type Compass = "N" | "E" | "S" | "W";

// Which compass quadrant a point at angle θ from the centre belongs to.
// Canvas convention: +x = east, +y = south.
export function exitForAngle(angle: number): Compass {
  let a = angle;
  while (a > Math.PI) a -= 2 * Math.PI;
  while (a < -Math.PI) a += 2 * Math.PI;
  if (a >= -Math.PI / 4 && a < Math.PI / 4) return "E";
  if (a >= Math.PI / 4 && a < (3 * Math.PI) / 4) return "S";
  if (a >= (-3 * Math.PI) / 4 && a < -Math.PI / 4) return "N";
  return "W";
}

// Quadrants the player is in once they've gone past the first exit.
export function exitsPastFirst(entry: Compass): Compass[] {
  const order: Record<Compass, Compass[]> = {
    S: ["N", "W", "S"],
    W: ["E", "N", "W"],
    N: ["S", "E", "N"],
    E: ["W", "S", "E"],
  };
  return order[entry];
}

// Exits that require a left blinker (3rd exit + U-turn back to entry).
export function exitsRequiringLeft(entry: Compass): Compass[] {
  const map: Record<Compass, Compass[]> = {
    S: ["W", "S"],
    W: ["N", "W"],
    N: ["E", "N"],
    E: ["S", "E"],
  };
  return map[entry];
}
