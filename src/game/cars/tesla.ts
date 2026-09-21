import type { CarConfig } from './types';

// Tesla = full fart fra første sekund. Ingen ramp-up, du peges til topp.
export const TESLA: CarConfig = {
  id: 'tesla',
  name: 'Tesla Model 3',
  blurb: 'Full fart i samme sekund du trykker på gassen. Bremsene er saksøkt.',
  body: '#ffffff',
  roof: '#eaeaea',
  physics: { MAX_FWD: 300 },
  quirks: { instantTopSpeed: true },
};
