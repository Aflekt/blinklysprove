// Renders the crash → WASTED → fade → jail sequence on top of the canvas.
import type { GameState, CaseDef } from '../types';

type Ctx = CanvasRenderingContext2D;

export function drawCrashOverlay(ctx: Ctx, w: number, h: number, game: GameState, caseDef: CaseDef) {
  if (game.crashPhase === 'crash') {
    const shakeX = (Math.random() - 0.5) * 10;
    const shakeY = (Math.random() - 0.5) * 10;
    ctx.save();
    ctx.translate(shakeX, shakeY);
    if (caseDef.crashType === 'pedestrian' || caseDef.crashType === 'stroller') {
      drawGore(ctx, game.car.x, game.car.y);
    }
    // Yellow impact rays
    for (let i = 0; i < 8; i++) {
      ctx.beginPath();
      const a = i * Math.PI / 4;
      ctx.moveTo(game.car.x, game.car.y);
      ctx.lineTo(game.car.x + Math.cos(a) * 40, game.car.y + Math.sin(a) * 40);
      ctx.lineWidth = 5;
      ctx.strokeStyle = 'rgba(255,200,0,0.8)';
      ctx.stroke();
    }
    ctx.fillStyle = '#fff';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 4;
    ctx.font = 'bold 50px Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.strokeText('KRASJ!', game.car.x, game.car.y - 40);
    ctx.fillText('KRASJ!', game.car.x, game.car.y - 40);
    ctx.restore();
  }
  if (game.crashPhase === 'wasted') {
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, w, h);
    const t = Math.min(1, game.crashTimer / 500);
    const scale = 0.5 + t * 0.8;
    ctx.save();
    ctx.translate(w / 2, h / 2);
    ctx.scale(scale, scale);
    ctx.font = 'bold 90px Impact, sans-serif';
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c0392b';
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.strokeText('WASTED', 0, 20);
    ctx.fillText('WASTED', 0, 20);
    ctx.restore();
  }
  if (game.crashPhase === 'fade') {
    const a = Math.min(1, game.crashTimer / 700);
    ctx.fillStyle = `rgba(0,0,0,${a})`;
    ctx.fillRect(0, 0, w, h);
  }
  if (game.crashPhase === 'jail') {
    drawJail(ctx, w, h);
  }
}

function drawGore(ctx: Ctx, cx: number, cy: number) {
  ctx.fillStyle = '#8b0000';
  ctx.beginPath();
  ctx.ellipse(cx, cy + 18, 38, 14, 0, 0, Math.PI * 2);
  ctx.fill();
  for (let i = 0; i < 22; i++) {
    const a = i * Math.PI / 11 + Math.random() * 0.5;
    const dist = 20 + Math.random() * 45;
    ctx.beginPath();
    ctx.arc(cx + Math.cos(a) * dist, cy + Math.sin(a) * dist, 2 + Math.random() * 5, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = '#9b59b6';
  ctx.fillRect(cx - 18, cy + 8, 4, 14);
  ctx.fillRect(cx - 11, cy + 8, 4, 14);
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(cx - 18, cy + 22, 4, 4);
  ctx.fillRect(cx - 11, cy + 22, 4, 4);
  ctx.fillStyle = '#fff';
  ctx.fillRect(cx + 22, cy + 14, 8, 4);
}

function drawJail(ctx: Ctx, w: number, h: number) {
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(w * 0.15, h * 0.7, w * 0.7, h * 0.2);
  ctx.fillStyle = '#5a5a5a';
  ctx.fillRect(w * 0.15, h * 0.25, w * 0.7, h * 0.45);
  ctx.fillStyle = '#888';
  for (let i = 0; i < 8; i++) {
    const x = w * 0.18 + i * (w * 0.65 / 8);
    ctx.fillRect(x, h * 0.2, 8, h * 0.55);
  }
  ctx.fillRect(w * 0.15, h * 0.18, w * 0.7, 8);
  ctx.fillRect(w * 0.15, h * 0.73, w * 0.7, 8);
  const px = w * 0.5, py = h * 0.55;
  ctx.fillStyle = '#f1c27d';
  ctx.beginPath(); ctx.arc(px, py - 20, 10, 0, Math.PI * 2); ctx.fill();
  ctx.strokeStyle = '#000';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.arc(px, py - 15, 4, Math.PI, 0); ctx.stroke();
  ctx.fillStyle = '#000';
  ctx.fillRect(px - 4, py - 22, 2, 2);
  ctx.fillRect(px + 2, py - 22, 2, 2);
  for (let i = 0; i < 5; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#fff' : '#1a1a1a';
    ctx.fillRect(px - 12, py - 10 + i * 5, 24, 5);
  }
  ctx.fillStyle = '#f1c27d';
  ctx.fillRect(px - 16, py - 8, 4, 14);
  ctx.fillRect(px + 12, py - 8, 4, 14);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 16px Georgia';
  ctx.textAlign = 'center';
  ctx.fillText('FENGSEL · §22', w / 2, h * 0.92);
}
