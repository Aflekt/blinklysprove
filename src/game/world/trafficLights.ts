// Traffic lights. Each light has a stop line; crossing it on red is a
// violation handled in rules.ts.

import { RBT_A, RBT_B } from './roundabout';

export type LightState = 'red' | 'yellow' | 'green';

export interface TrafficLight {
  id: string;
  pole: { x: number; y: number };
  stopLine: {
    axis: 'x' | 'y';
    at: number;
    from: number;
    to: number;
    approach: 'east' | 'west' | 'north' | 'south';
  };
  cycle: { red: number; green: number; yellow: number };
  offsetSec: number;
}

export const TRAFFIC_LIGHTS: TrafficLight[] = [
  // On the connector road, just east of RBT_B. Player coming from RBT_A
  // (going west) must stop here on red.
  {
    id: 'connectorEast',
    pole: { x: RBT_B.cx + RBT_B.outerR + 100, y: RBT_B.cy + 130 },
    stopLine: {
      axis: 'x',
      at: RBT_B.cx + RBT_B.outerR + 130,
      from: RBT_B.cy - 110,
      to: RBT_B.cy + 110,
      approach: 'east',
    },
    cycle: { red: 6, green: 6, yellow: 1.5 },
    offsetSec: 0,
  },
  // On the south arm of RBT_B, just north of Rema 1000.
  {
    id: 'remaApproach',
    pole: { x: RBT_B.cx + 130, y: 3700 },
    stopLine: {
      axis: 'y',
      at: 3700,
      from: RBT_B.cx - 110,
      to: RBT_B.cx + 110,
      approach: 'north',
    },
    cycle: { red: 5, green: 7, yellow: 1.5 },
    offsetSec: 3,
  },
  // On RBT_A's north arm — testing players who explore the school decoy.
  {
    id: 'skoleApproach',
    pole: { x: RBT_A.cx + 130, y: 1300 },
    stopLine: {
      axis: 'y',
      at: 1300,
      from: RBT_A.cx - 110,
      to: RBT_A.cx + 110,
      approach: 'south',
    },
    cycle: { red: 5, green: 5, yellow: 1.5 },
    offsetSec: 1,
  },
];

export function lightStateAt(light: TrafficLight, timeSec: number): LightState {
  const total = light.cycle.red + light.cycle.green + light.cycle.yellow;
  const t = ((timeSec + light.offsetSec) % total + total) % total;
  if (t < light.cycle.red) return 'red';
  if (t < light.cycle.red + light.cycle.green) return 'green';
  return 'yellow';
}
