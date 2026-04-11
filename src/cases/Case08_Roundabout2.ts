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

export const Case08_Roundabout2: CaseDef = {
  id: 8,
  title: 'Sak 8: Rundkjøring – andre avkjørsel',
  expected: 'right',
  crashType: 'cyclist',
  obstacleClearMs: 5500,
  rule: 'Trafikkreglene §14a: I rundkjøringer med flere avkjørsler skal høyre retningsviser aktiveres FØR ønsket avkjørsel, og ikke før. Tegn ved første avkjørsel når man skal videre, regnes som villedende tegn.',
  absurd: [
    'Du blinket på feil avkjørsel. En syklist trodde deg. Syklisten finnes ikke lenger.',
    'En blinker som lyver er verre enn en blinker som tier. Det vet man.',
  ],
  drawScene(ctx, w, h) { drawRoundaboutScene(ctx, w, h); },
  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.20;
    const ang = Math.PI + 0.4 - 0.00055 * t;
    drawOtherCar(ctx, cx + Math.cos(ang) * R, cy + Math.sin(ang) * R, ang - Math.PI / 2, '#c0392b');
  },
  getPlayerPos(w, h, mp, phase) {
    const cx = w * 0.5, cy = h * 0.5, R = Math.min(w, h) * 0.20;
    if (phase === 'approach') return { x: cx, y: cy + R + 35, angle: -Math.PI / 2 };
    if (mp < 0.7) {
      const t = mp / 0.7;
      const ang = Math.PI / 2 - t * Math.PI; // south to north (CCW)
      return { x: cx + Math.cos(ang) * R, y: cy + Math.sin(ang) * R, angle: ang - Math.PI / 2 };
    }
    const t = (mp - 0.7) / 0.3;
    return { x: cx, y: cy - R - t * h * 0.3, angle: -Math.PI / 2 };
  },
};
