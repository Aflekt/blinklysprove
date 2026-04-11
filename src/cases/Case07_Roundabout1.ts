import type { CaseDef } from '../types';
import { drawOtherCar } from '../canvas/primitives';

type Ctx = CanvasRenderingContext2D;

function drawRoundaboutScene(ctx: Ctx, w: number, h: number) {
  ctx.fillStyle = '#4a7a3a';
  ctx.fillRect(0, 0, w, h);
  const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.20;
  ctx.fillStyle = '#3a3a3a';
  ctx.beginPath(); ctx.arc(cx, cy, R + 25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#4a7a3a';
  ctx.beginPath(); ctx.arc(cx, cy, R - 25, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(cx - 25, cy + R - 5, 50, h * 0.5);
  ctx.fillRect(cx - 25, 0, 50, cy - R + 5);
  ctx.fillRect(cx + R - 5, cy - 25, w * 0.5, 50);
  ctx.fillRect(0, cy - 25, cx - R + 5, 50);
}

function drawCirculatingCar(ctx: Ctx, w: number, h: number, t: number) {
  const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.20;
  const startTheta = Math.PI + 0.4;
  const rate = 0.00055;
  const ang = startTheta - rate * t;
  drawOtherCar(ctx, cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, ang - Math.PI / 2, '#c0392b');
}

export const Case07_Roundabout1: CaseDef = {
  id: 7,
  title: 'Sak 7: Rundkjøring – første avkjørsel',
  expected: 'right',
  crashType: 'stroller',
  obstacleClearMs: 5500,
  rule: 'Trafikkreglene §14a: Ved utkjøring fra rundkjøring skal høyre retningsviser være aktivert. Ved første avkjørsel skal tegnet gis så snart kjøretøyet har passert innkjøringen.',
  absurd: [
    'Du har truffet en barnevogn. Vi kommer ikke til å gå nærmere inn på detaljene.',
    'En forelder regnet med at du skulle kjøre videre rundt. Forelderen er nå alene.',
  ],
  drawScene(ctx, w, h) { drawRoundaboutScene(ctx, w, h); },
  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    drawCirculatingCar(ctx, w, h, t);
  },
  getPlayerPos(w, h, mp, phase) {
    const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.20;
    if (phase === 'approach') return { x: cx, y: cy + R + 35, angle: -Math.PI / 2 };
    if (mp < 0.6) {
      const t = mp / 0.6;
      const ang = Math.PI / 2 - t * Math.PI / 2;
      return { x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, angle: ang - Math.PI / 2 };
    }
    const t = (mp - 0.6) / 0.4;
    return { x: cx + R + t * w * 0.3, y: cy, angle: 0 };
  },
};
