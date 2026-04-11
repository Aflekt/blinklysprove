import type { CaseDef, GamePhase } from '../types';
import { drawPedestrian, drawWomanWithBabies } from '../canvas/primitives';

type Ctx = CanvasRenderingContext2D;

function drawIntersection(ctx: Ctx, w: number, h: number, isRight: boolean) {
  ctx.fillStyle = '#4a7a3a';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(w * 0.4, 0, w * 0.2, h);
  ctx.fillRect(0, h * 0.35, w, h * 0.2);
  // Crosswalk on the exit side
  const cwX = isRight ? w * 0.61 : w * 0.39 - 28;
  ctx.fillStyle = '#fff';
  const stripeCount = 5, stripeW = 5, stripeGap = 6;
  const cwTop = h * 0.36, cwBot = h * 0.54;
  for (let i = 0; i < stripeCount; i++) {
    const sx2 = cwX + i * (stripeW + stripeGap);
    ctx.fillRect(sx2, cwTop, stripeW, cwBot - cwTop);
  }
}

function drawTwoPedestrians(ctx: Ctx, w: number, h: number, t: number, isRight: boolean) {
  const cwX = isRight ? w * 0.66 : w * 0.34;
  const yTop = h * 0.34, yBot = h * 0.56;
  // First pedestrian — clears around t=4500ms
  const ped1Dur = 4500;
  if (t <= ped1Dur + 300) {
    const p1 = Math.min(1, t / ped1Dur);
    drawPedestrian(ctx, cwX, yBot + (yTop - yBot) * p1);
  }
  // Surprise: a woman with three babies enters at t=4800ms
  const ped2Start = 4800, ped2Dur = 4000;
  if (t >= ped2Start) {
    const p2 = Math.min(1, (t - ped2Start) / ped2Dur);
    drawWomanWithBabies(ctx, cwX, yTop + (yBot - yTop) * p2);
  }
}

function rightTurnArc(w: number, h: number, mp: number, phase: GamePhase) {
  const cx = w * 0.5, cy = h * 0.45;
  const laneOff = h * 0.04;
  const sx = cx + laneOff;
  const sy = cy + h * 0.18;
  const r = sy - (cy + laneOff);
  if (phase === 'approach') return { x: sx, y: sy, angle: -Math.PI / 2 };
  const theta = Math.PI + mp * Math.PI / 2;
  return {
    x: sx + r + Math.cos(theta) * r,
    y: sy + Math.sin(theta) * r,
    angle: theta + Math.PI / 2,
  };
}

export const Case05_TurnRight: CaseDef = {
  id: 5,
  title: 'Sak 5: Høyresving i kryss',
  expected: 'right',
  crashType: 'pedestrian',
  obstacleClearMs: 9000,
  rule: 'Trafikkreglene §13: Fører som skal svinge i kryss, skal gi tegn i god tid før manøveren og avvente til fotgjengerfeltet er fritt. Det er ikke tilstrekkelig at den første fotgjengeren har passert.',
  absurd: [
    'Du var for utålmodig. Du kjørte over en dame og tre babyer.',
    'Den første fotgjengeren rakk over. Damen med tre babyer rakk det ikke.',
    'Du svingte rett etter at fortauet så tomt ut. Det var det ikke.',
  ],
  drawScene(ctx, w, h) { drawIntersection(ctx, w, h, true); },
  drawObstacle(ctx, w, h, t, game) {
    if (game.phase === 'done') return;
    if (game.phase === 'maneuver' && game.maneuverProgress > 0.6) return;
    drawTwoPedestrians(ctx, w, h, t, true);
  },
  getPlayerPos(w, h, mp, phase) { return rightTurnArc(w, h, mp, phase); },
};
