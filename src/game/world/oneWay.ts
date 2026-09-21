// One-way road segments (enveiskjøring). Player driving in the opposite
// direction inside one of these rects accumulates a violation.

import { RBT_A } from './roundabout';
import { WORLD, ROAD_W } from './constants';

export type Dir = 'east' | 'west' | 'north' | 'south';

export interface OneWayZone {
  x: number; y: number; w: number; h: number;
  allowed: Dir;
}

export const ONE_WAY_ZONES: OneWayZone[] = [
  // East arm of RBT A — eastbound only.
  {
    x: RBT_A.cx + RBT_A.outerR,
    y: RBT_A.cy - ROAD_W / 2,
    w: WORLD.width - (RBT_A.cx + RBT_A.outerR) - 200,
    h: ROAD_W,
    allowed: 'east',
  },
];
