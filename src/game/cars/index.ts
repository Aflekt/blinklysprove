import type { CarConfig, CarId } from './types';
import { COROLLA } from './corolla';
import { TESLA } from './tesla';
import { BMW } from './bmw';
import { VOLVO } from './volvo';
import { CADDY } from './caddy';
import { FOCUS } from './focus';

export const CARS: CarConfig[] = [COROLLA, TESLA, BMW, VOLVO, CADDY, FOCUS];

export const CAR_BY_ID: Record<CarId, CarConfig> = {
  corolla: COROLLA,
  tesla:   TESLA,
  bmw:     BMW,
  volvo:   VOLVO,
  caddy:   CADDY,
  focus:   FOCUS,
};

export const DEFAULT_CAR: CarConfig = COROLLA;

export type { CarConfig, CarId } from './types';
