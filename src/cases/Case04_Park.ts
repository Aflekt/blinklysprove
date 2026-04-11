import type { CaseDef } from '../types';
import { drawOtherCar, drawCyclist, easeInOut } from '../canvas/primitives';

export const Case04_Park: CaseDef = {
  id: 4,
  title: 'Sak 4: Parkering langs fortau',
  expected: 'right',
  crashType: 'cyclist',
  obstacleClearMs: 5500,
  rule: 'Trafikkreglene §14: Ved parkering langs vegkant skal fører gi tegn til høyre i god tid før kjøretøyet stanser.',
  absurd: [
    'Sykkelen hadde forkjørsrett. Sykkelen er nå ødelagt. Du har ødelagt sykkelen.',
    'En syklist trodde du skulle fortsette rett frem. Det gjorde syklisten også – inn i bagasjeromsdøren din.',
  ],

  drawScene(ctx, w, h) {
    ctx.fillStyle = '#4a7a3a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, h * 0.35, w, h * 0.3);
    ctx.fillStyle = '#bdbdbd';
    ctx.fillRect(0, h * 0.65, w, h * 0.1);
    drawOtherCar(ctx, w * 0.15, h * 0.6, 0, '#666');
    drawOtherCar(ctx, w * 0.85, h * 0.6, 0, '#666');
  },

  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    const px = -40 + (t / 1000) * (w * 0.18);
    drawCyclist(ctx, px, h * 0.55);
  },

  getPlayerPos(w, h, mp) {
    const e = easeInOut(mp);
    const sy = h * 0.45, ey = h * 0.62;
    return { x: w * 0.5, y: sy + (ey - sy) * e, angle: e * 0.3 };
  },
};
