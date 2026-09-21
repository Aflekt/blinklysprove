import type { CarConfig } from './types';

// Caddy = blinker i feil retning. Yrkesfag, Red Bull, alle andre er idioter.
export const CADDY: CarConfig = {
  id: 'caddy',
  name: 'Volkswagen Caddy',
  blurb: 'Hvit varebil med firmalogo. Blinklysene er byttet om — Q gir høyre.',
  body: '#f0f0f0',
  roof: '#b0b0b0',
  quirks: { blinkerFlipped: true },
};
