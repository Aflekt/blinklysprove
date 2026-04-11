// Case 9: looks like a normal right turn but with NO visible pedestrian.
// If the player fails, the police-report screen reveals what was hidden.
import { Case05_TurnRight } from './Case05_TurnRight';
import type { CaseDef } from '../types';

export const Case09_DarkCase: CaseDef = {
  ...Case05_TurnRight,
  id: 9,
  title: 'Sak 9: Sving til høyre i tettbebygd strøk',
  obstacleClearMs: 0,
  crashType: 'pedestrian',
  rule: 'Trafikkreglene §13 og §3: Fører skal opptre hensynsfullt og være aktsom og varsom så det ikke kan oppstå fare eller voldes skade, og slik at annen trafikk ikke unødig blir hindret eller forstyrret.',
  absurd: [
    'Det så tomt ut. Det var ikke tomt.',
    'Du så ingenting. Det var det som var problemet.',
  ],
  darkCase: true,
  revealText: 'På dette tidspunktet befant det seg ett (1) barn på fortauet ved fotgjengerfeltet. Barnet hadde rød jakke. Barnet er nå registrert som hendelsesavhengig.',
  // Override obstacle drawing to show NOTHING — the victim is hidden during gameplay.
  drawObstacle() {},
};
