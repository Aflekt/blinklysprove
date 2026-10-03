import { BMW } from "./bmw";
import { CADDY } from "./caddy";
import { COROLLA } from "./corolla";
import { FOCUS } from "./focus";
import { TESLA } from "./tesla";
import type { CarConfig, CarId } from "./types";
import { VOLVO } from "./volvo";

export const CARS: CarConfig[] = [COROLLA, TESLA, BMW, VOLVO, CADDY, FOCUS];

export const CAR_BY_ID: Record<CarId, CarConfig> = {
  corolla: COROLLA,
  tesla: TESLA,
  bmw: BMW,
  volvo: VOLVO,
  caddy: CADDY,
  focus: FOCUS,
};

export const DEFAULT_CAR: CarConfig = COROLLA;

export type { CarConfig, CarId } from "./types";
