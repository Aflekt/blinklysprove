import { drawOtherCar, easeInOut } from '../canvas/primitives';
import type { CaseDef } from '../types';

export const Case01_LaneRight: CaseDef = {
  id: 1,
  title: 'Sak 1: Feltskifte til høyre (motorvei)',
  expected: 'right',
  crashType: 'rear',
  obstacleClearMs: 5500,
  rule: 'Vegtrafikkloven §11: Fører skal gi tegn ved feltskifte. Tegnet skal gis minimum 3 sekunder før manøveren starter, jf. forskrift om kjøretøytegn §4.',
  absurd: [
    'Bilen bak fikk ikke tid til å reagere. Bilen bak finnes ikke lenger.',
    'Du skiftet fil uten varsel. Trafikken bak deg gjorde det samme – inn i deg.',
  ],

  drawScene(ctx, w, h, scrollOffset) {
    ctx.fillStyle = '#4a7a3a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, h * 0.35, w, h * 0.4);
    ctx.strokeStyle = '#fff';
    ctx.setLineDash([15, 12]);
    ctx.lineDashOffset = -scrollOffset;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.5); ctx.lineTo(w, h * 0.5);
    ctx.moveTo(0, h * 0.65); ctx.lineTo(w, h * 0.65);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.35); ctx.lineTo(w, h * 0.35);
    ctx.moveTo(0, h * 0.75); ctx.lineTo(w, h * 0.75);
    ctx.stroke();
  },

  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    const px = w * 0.05 + (t / 1000) * (w * 0.13);
    drawOtherCar(ctx, px, h * 0.65, 0, '#c0392b');
  },

  getPlayerPos(w, h, mp, phase) {
    const e = easeInOut(mp);
    const sy = h * 0.5, ey = h * 0.65;
    return { x: w * 0.35, y: sy + (ey - sy) * e, angle: 0 };
  },
};
