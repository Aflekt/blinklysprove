// Reusable top-down sprite drawing primitives. All take a 2D canvas context.
import type { GameState } from '../types';

type Ctx = CanvasRenderingContext2D;

export function drawCar(ctx: Ctx, x: number, y: number, angle: number, color = '#3498db') {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-22, -12, 44, 24);
  ctx.fillStyle = 'rgba(150,200,255,0.6)';
  ctx.fillRect(6, -10, 10, 20);
  ctx.fillRect(-16, -10, 8, 20);
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 1;
  ctx.strokeRect(-22, -12, 44, 24);
  ctx.restore();
}

export function drawOtherCar(ctx: Ctx, x: number, y: number, angle: number, color: string) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = color;
  ctx.fillRect(-20, -11, 40, 22);
  ctx.fillStyle = 'rgba(150,200,255,0.5)';
  ctx.fillRect(4, -9, 9, 18);
  ctx.strokeStyle = '#000';
  ctx.strokeRect(-20, -11, 40, 22);
  ctx.restore();
}

export function drawPedestrian(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#f1c27d';
  ctx.beginPath(); ctx.arc(x, y - 8, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#c0392b';
  ctx.fillRect(x - 4, y - 3, 8, 12);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x - 4, y + 9, 3, 6);
  ctx.fillRect(x + 1, y + 9, 3, 6);
  ctx.restore();
}

export function drawCyclist(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(x - 8, y + 5, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 8, y + 5, 6, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x - 8, y + 5); ctx.lineTo(x + 2, y - 3); ctx.lineTo(x + 8, y + 5); ctx.stroke();
  ctx.fillStyle = '#f39c12';
  ctx.fillRect(x - 3, y - 10, 6, 8);
  ctx.fillStyle = '#f1c27d';
  ctx.beginPath(); ctx.arc(x, y - 13, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

export function drawWomanWithBabies(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#f1c27d';
  ctx.beginPath(); ctx.arc(x, y - 10, 5, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#9b59b6';
  ctx.fillRect(x - 5, y - 5, 10, 14);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(x - 4, y + 9, 3, 5);
  ctx.fillRect(x + 1, y + 9, 3, 5);
  for (let i = 0; i < 3; i++) {
    const bx = x + (i - 1) * 8;
    const by = y + 14;
    ctx.fillStyle = '#f1c27d';
    ctx.beginPath(); ctx.arc(bx, by - 3, 3, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#ffd1dc';
    ctx.fillRect(bx - 3, by, 6, 6);
  }
  ctx.restore();
}

export function drawStroller(ctx: Ctx, x: number, y: number) {
  ctx.save();
  ctx.fillStyle = '#e91e63';
  ctx.fillRect(x - 10, y - 8, 20, 14);
  ctx.fillStyle = '#fff';
  ctx.fillRect(x - 8, y - 6, 16, 6);
  ctx.strokeStyle = '#000';
  ctx.beginPath(); ctx.arc(x - 7, y + 8, 4, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.arc(x + 7, y + 8, 4, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + 10, y - 8); ctx.lineTo(x + 18, y - 12); ctx.stroke();
  ctx.restore();
}

export function drawBlinkers(ctx: Ctx, game: GameState) {
  if (!game.blinker || !game.flashOn) return;
  const { x, y, angle } = game.car;
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.fillStyle = '#ffb300';
  if (game.blinker === 'left') {
    ctx.fillRect(18, -14, 6, 4);
    ctx.fillRect(-22, -14, 6, 4);
  } else {
    ctx.fillRect(18, 10, 6, 4);
    ctx.fillRect(-22, 10, 6, 4);
  }
  ctx.restore();
}

export function easeInOut(t: number): number {
  return t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Cubic bezier evaluator
export function cubicBezier(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t;
  return u * u * u * p0 + 3 * u * u * t * p1 + 3 * u * t * t * p2 + t * t * t * p3;
}
export function cubicBezierDeriv(t: number, p0: number, p1: number, p2: number, p3: number): number {
  const u = 1 - t;
  return 3 * u * u * (p1 - p0) + 6 * u * t * (p2 - p1) + 3 * t * t * (p3 - p2);
}
