// Parkeringsplass (lay-by) on the side of the south road. The player car
// spawns here so they can practice opening the map and signalling on exit.
//
// Norwegian rule (Trafikkreglene § 14): a driver must signal when leaving
// a parking spot and merging into traffic — that's enforced in rules.ts.

import { ROAD_W } from "./constants";
import { RBT_A } from "./roundabout";

export const PARKING_AREA = {
  x: RBT_A.cx + ROAD_W / 2,
  y: 3680,
  w: 130,
  h: 260,
};
