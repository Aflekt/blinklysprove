import type { CaseDef } from '../types';
import { drawOtherCar, easeInOut, cubicBezier, cubicBezierDeriv } from '../canvas/primitives';

// Shared bezier for the exit ramp — visual ramp + player path use the same curve.
function exitBezier(t: number, w: number, h: number) {
  const p0x = w * 0.30, p0y = h * 0.55;
  const p1x = w * 0.50, p1y = h * 0.55;
  const p2x = w * 0.65, p2y = h * 1.00;
  const p3x = w * 0.78, p3y = h * 1.18;
  const x = cubicBezier(t, p0x, p1x, p2x, p3x);
  const y = cubicBezier(t, p0y, p1y, p2y, p3y);
  const dx = cubicBezierDeriv(t, p0x, p1x, p2x, p3x);
  const dy = cubicBezierDeriv(t, p0y, p1y, p2y, p3y);
  return { x, y, angle: Math.atan2(dy, dx), p0x, p0y, p1x, p1y, p2x, p2y, p3x, p3y };
}

export const Case03_Exit: CaseDef = {
  id: 3,
  title: 'Sak 3: Avkjøring fra motorvei',
  expected: 'right',
  crashType: 'pedestrian',
  obstacleClearMs: 5500,
  rule: 'Forskrift om kjøretøytegn §5: Ved avkjøring fra motorvei skal høyre retningsviser være aktivert i god tid før avkjøringsfeltet.',
  absurd: [
    'Du har drept 1 fotgjenger. Dette er ikke optimalt.',
    'Fotgjengeren krysset lovlig. Du gjorde ikke.',
  ],

  drawScene(ctx, w, h, scrollOffset) {
    ctx.fillStyle = '#4a7a3a';
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = '#3a3a3a';
    ctx.fillRect(0, h * 0.35, w, h * 0.30);
    // Exit ramp as thick stroked bezier
    const b = exitBezier(0, w, h);
    ctx.strokeStyle = '#3a3a3a';
    ctx.lineWidth = h * 0.13;
    ctx.lineCap = 'butt';
    ctx.beginPath();
    ctx.moveTo(b.p0x, b.p0y);
    ctx.bezierCurveTo(b.p1x, b.p1y, b.p2x, b.p2y, b.p3x, b.p3y);
    ctx.stroke();
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.35); ctx.lineTo(w, h * 0.35);
    ctx.stroke();
    ctx.setLineDash([15, 12]);
    ctx.lineDashOffset = -scrollOffset;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.50); ctx.lineTo(w, h * 0.50);
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.lineDashOffset = 0;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, h * 0.65); ctx.lineTo(w * 0.55, h * 0.65);
    ctx.stroke();
  },

  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    const px = w * 0.50 + (t / 1000) * (w * 0.12);
    drawOtherCar(ctx, px, h * 0.55, 0, '#c0392b');
  },

  getPlayerPos(w, h, mp) {
    return exitBezier(easeInOut(mp), w, h);
  },
};
