// Initial NPC placements. Each NPC bounces inside its bounds (or wanders).

import { RBT_A, RBT_B } from '../world/roundabout';
import { REMA } from '../world/rema';
import type { NpcDef } from './types';

export const NPC_DEFS: NpcDef[] = [
  // Pedestrian crossing the south crosswalk of RBT A, east <-> west.
  {
    id: 'ped-rbtA-south',
    kind: 'pedestrian',
    start:    { x: RBT_A.cx - 80, y: RBT_A.cy + RBT_A.outerR + 78 },
    velocity: { x: 35, y: 0 },
    bounds:   { x: RBT_A.cx - 110, y: RBT_A.cy + RBT_A.outerR + 62, w: 220, h: 32 },
  },
  // Pedestrian on the crosswalk just north of Rema.
  {
    id: 'ped-rema',
    kind: 'pedestrian',
    start:    { x: REMA.x + 30, y: REMA.y - 60 },
    velocity: { x: 32, y: 0 },
    bounds:   { x: REMA.x - 30, y: REMA.y - 76, w: REMA.w + 60, h: 32 },
  },
  // Cyclist riding north-south along the south road's east shoulder.
  {
    id: 'bike-south',
    kind: 'cyclist',
    start:    { x: RBT_A.cx - 180, y: 3400 },
    velocity: { x: 0, y: 90 },
    bounds:   { x: RBT_A.cx - 195, y: 3000, w: 30, h: 1200 },
  },
  // Dog wandering in the Park area west of RBT_B.
  {
    id: 'dog-park',
    kind: 'dog',
    start:    { x: 180, y: RBT_B.cy },
    velocity: { x: 40, y: 25 },
    bounds:   { x: 70, y: RBT_B.cy - 180, w: 200, h: 360 },
    wandering: true,
    color: '#8c5a2c',
  },
];
