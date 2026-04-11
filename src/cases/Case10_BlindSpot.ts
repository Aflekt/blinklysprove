// Case 10: looks like a normal lane change. Cyclist is in the blind spot, invisible.
import { Case01_LaneRight } from './Case01_LaneRight';
import type { CaseDef } from '../types';

export const Case10_BlindSpot: CaseDef = {
  ...Case01_LaneRight,
  id: 10,
  title: 'Sak 10: Feltskifte i tettbebygd strøk',
  obstacleClearMs: 0,
  crashType: 'cyclist',
  rule: 'Trafikkreglene §12: Før kjøretøyet flyttes sideveis, skal fører forvisse seg om at det kan skje uten fare eller unødig hinder for andre. Sjekking av blindsone er obligatorisk.',
  absurd: [
    'Du sjekket ikke blindsonen. Det var en grunn til at den kalles det.',
    'Bilen din traff noe mykt. Det var ikke en pute.',
  ],
  blindSpot: true,
  revealText: 'En syklist befant seg i kjøretøyets blindsone på tidspunktet for manøveren. Sykkel: Trek FX 3 Disc. Hjelm: ja. Refleksvest: ja. Blinklys fra kjøretøy: nei.',
  drawObstacle() {},
};
