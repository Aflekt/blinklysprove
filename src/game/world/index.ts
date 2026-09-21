// World layout — re-exports from each submodule plus the player spawn.

export * from './constants';
export * from './roundabout';
export * from './roads';
export * from './rema';
export * from './decoys';
export * from './parking';
export * from './bensin';
export * from './oneWay';
export * from './signs';
export * from './crosswalks';
export * from './trafficLights';

import { PARKING_AREA } from './parking';

// Player spawns inside the parkeringsplass, stopped, facing north so they
// can immediately try opening the map and signalling on exit.
export const PLAYER_START = {
  x: PARKING_AREA.x + PARKING_AREA.w / 2,
  y: PARKING_AREA.y + PARKING_AREA.h - 40,
  heading: -Math.PI / 2,
};
