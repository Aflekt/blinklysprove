// Static road signs placed around the world.

import { ROUNDABOUTS, RBT_A, RBT_B, type Compass, type Roundabout } from './roundabout';
import { BENSIN } from './bensin';
import { REMA } from './rema';

export type SignKind =
  | 'yield'        // vikepliktstrekant
  | 'roundabout'   // varselskilt rundkjøring
  | 'speed50'
  | 'crosswalk'
  | 'oneway'       // enveiskjøring (blue rectangle, white arrow)
  | 'deadend'      // blindvei (blue rectangle, white T)
  | 'bikepath'     // sykkelsti (blue square, bike)
  | 'noentry';     // innkjøring forbudt (red circle, white bar)

export interface Sign {
  kind: SignKind;
  x: number;
  y: number;
  rotation: number;   // 0 = facing east
}

function approachSign(rbt: Roundabout, side: Compass, kind: SignKind, distance: number): Sign {
  const r = rbt.outerR + distance;
  const offset = 130;
  switch (side) {
    case 'S': return { kind, x: rbt.cx + offset, y: rbt.cy + r,      rotation: -Math.PI / 2 };
    case 'N': return { kind, x: rbt.cx - offset, y: rbt.cy - r,      rotation:  Math.PI / 2 };
    case 'E': return { kind, x: rbt.cx + r,      y: rbt.cy + offset, rotation:  Math.PI };
    case 'W': return { kind, x: rbt.cx - r,      y: rbt.cy - offset, rotation:  0 };
  }
}

const SIDES: Compass[] = ['N', 'E', 'S', 'W'];

export const SIGNS: Sign[] = [
  // Yield + roundabout warning on every approach.
  ...ROUNDABOUTS.flatMap((rbt) =>
    SIDES.flatMap((side) => [
      approachSign(rbt, side, 'yield',      60),
      approachSign(rbt, side, 'roundabout', 320),
    ]),
  ),
  // Speed limit on the south road just south of the player spawn.
  approachSign(RBT_A, 'S', 'speed50', 1200),

  // Enveiskjøring — the east arm of RBT A is one-way eastbound.
  { kind: 'oneway',  x: RBT_A.cx + RBT_A.outerR + 200, y: RBT_A.cy - 150, rotation: 0 },
  // Blindvei — west of RBT B (the Park dead-end).
  { kind: 'deadend', x: RBT_B.cx - RBT_B.outerR - 200, y: RBT_B.cy - 150, rotation: 0 },
  // Sykkelsti along the south road (player's main route).
  { kind: 'bikepath', x: RBT_A.cx - 200, y: 3400, rotation: -Math.PI / 2 },
  { kind: 'bikepath', x: RBT_A.cx - 200, y: 4000, rotation: -Math.PI / 2 },
  // Innkjøring forbudt — sign at the exit side of Rema's parking facing
  // back at the road (decorative — no one should drive into the lot here).
  { kind: 'noentry', x: REMA.x - 60, y: REMA.y + REMA.h / 2, rotation: Math.PI },
  // Innkjøring forbudt — at the south arm exit of RBT B as a tease
  // (decorative, players entering from RBT B going south should ignore it
  // since the sign faces traffic coming the OTHER way).
  { kind: 'noentry', x: RBT_B.cx + 150, y: BENSIN.y + BENSIN.h + 200, rotation: -Math.PI / 2 },
];
