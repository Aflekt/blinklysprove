// Pedestrian crossings (zebra stripes).

import { RBT_A, RBT_B, type Compass, type Roundabout } from './roundabout';
import { REMA } from './rema';

export interface Crosswalk {
  x: number;
  y: number;
  w: number;
  h: number;
  orient: 'h' | 'v';   // road orientation; stripes lay perpendicular
}

function crosswalkBefore(rbt: Roundabout, side: Compass, distance: number, span = 220, thickness = 36): Crosswalk {
  const r = rbt.outerR + distance;
  switch (side) {
    case 'S': return { x: rbt.cx - span / 2, y: rbt.cy + r,             w: span, h: thickness, orient: 'v' };
    case 'N': return { x: rbt.cx - span / 2, y: rbt.cy - r - thickness, w: span, h: thickness, orient: 'v' };
    case 'E': return { x: rbt.cx + r,             y: rbt.cy - span / 2, w: thickness, h: span, orient: 'h' };
    case 'W': return { x: rbt.cx - r - thickness, y: rbt.cy - span / 2, w: thickness, h: span, orient: 'h' };
  }
}

export const CROSSWALKS: Crosswalk[] = [
  // Crossings just outside RBT_A on three sides.
  crosswalkBefore(RBT_A, 'S', 60),
  crosswalkBefore(RBT_A, 'N', 60),
  crosswalkBefore(RBT_A, 'E', 60),
  // Crossings outside RBT_B on three sides.
  crosswalkBefore(RBT_B, 'N', 60),
  crosswalkBefore(RBT_B, 'W', 60),
  crosswalkBefore(RBT_B, 'S', 60),
  // Just north of Rema 1000.
  { x: REMA.x - 40, y: REMA.y - 80, w: REMA.w + 80, h: 36, orient: 'v' },
];
