// "Djevelen henter deg" sequence — a three-phase canvas overlay drawn on
// top of the frozen world when the player opens the popup while moving.

import { CRASH_ANIM, CRASH_TOTAL_MS } from '../events';

export function drawCrashOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  elapsedMs: number,
  heading: number,
) {
  if (elapsedMs <= CRASH_ANIM.devilMs) {
    const t = elapsedMs / CRASH_ANIM.devilMs;
    drawDevilPhase(ctx, viewW, viewH, t);
    return;
  }
  if (elapsedMs <= CRASH_ANIM.devilMs + CRASH_ANIM.crashMs) {
    const t = (elapsedMs - CRASH_ANIM.devilMs) / CRASH_ANIM.crashMs;
    drawBloodPhase(ctx, viewW, viewH, t, heading);
    return;
  }
  const t = (elapsedMs - CRASH_ANIM.devilMs - CRASH_ANIM.crashMs) / CRASH_ANIM.fadeMs;
  drawFadePhase(ctx, viewW, viewH, Math.min(1, t));
}

function drawDevilPhase(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  // Black background fades in.
  ctx.fillStyle = `rgba(0,0,0,${Math.min(1, t * 1.4)})`;
  ctx.fillRect(0, 0, w, h);

  // Pulsing red vignette.
  const pulse = 0.4 + 0.6 * Math.abs(Math.sin(t * 12));
  const grd = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, Math.max(w, h) / 1.4);
  grd.addColorStop(0, `rgba(160,0,0,${0.25 * pulse})`);
  grd.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grd;
  ctx.fillRect(0, 0, w, h);

  // Devil silhouette, growing as the phase progresses.
  const cx = w / 2;
  const cy = h / 2 + 30;
  const scale = 1 + t * 0.4;
  drawDevil(ctx, cx, cy, scale);

  // Title text appears in the second half.
  if (t > 0.4) {
    const alpha = Math.min(1, (t - 0.4) * 2.5);
    ctx.fillStyle = `rgba(255,40,40,${alpha})`;
    ctx.font = 'bold 56px serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('DJEVELEN HENTET DEG', cx, 80);
  }
}

function drawDevil(ctx: CanvasRenderingContext2D, cx: number, cy: number, scale: number) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);

  // Body — black silhouette.
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(0, -120);          // top of head
  ctx.bezierCurveTo(60, -120, 80, -60, 60, 0);
  ctx.bezierCurveTo(80, 60, 40, 120, 0, 140);
  ctx.bezierCurveTo(-40, 120, -80, 60, -60, 0);
  ctx.bezierCurveTo(-80, -60, -60, -120, 0, -120);
  ctx.fill();

  // Horns.
  ctx.fillStyle = '#111';
  ctx.beginPath();
  ctx.moveTo(-30, -110); ctx.lineTo(-55, -160); ctx.lineTo(-20, -120);
  ctx.closePath(); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(30, -110); ctx.lineTo(55, -160); ctx.lineTo(20, -120);
  ctx.closePath(); ctx.fill();

  // Eyes — glowing red.
  ctx.fillStyle = '#ff2030';
  ctx.beginPath(); ctx.arc(-18, -80, 6, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 18, -80, 6, 0, Math.PI * 2); ctx.fill();
  // Eye glow.
  ctx.fillStyle = 'rgba(255,40,40,0.5)';
  ctx.beginPath(); ctx.arc(-18, -80, 12, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc( 18, -80, 12, 0, Math.PI * 2); ctx.fill();

  // Mouth — jagged.
  ctx.strokeStyle = '#ff2030';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(-22, -55); ctx.lineTo(-12, -45); ctx.lineTo(-4, -55);
  ctx.lineTo(4, -45); ctx.lineTo(12, -55); ctx.lineTo(22, -45);
  ctx.stroke();

  // Pitchfork on the right.
  ctx.strokeStyle = '#3a1a0a';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.moveTo(70, -20); ctx.lineTo(120, 120);
  ctx.stroke();
  ctx.fillStyle = '#3a1a0a';
  ctx.beginPath();
  ctx.moveTo(60, -50); ctx.lineTo(60, -10);
  ctx.moveTo(70, -50); ctx.lineTo(70, -10);
  ctx.moveTo(80, -50); ctx.lineTo(80, -10);
  ctx.lineWidth = 3; ctx.stroke();

  ctx.restore();
}

function drawBloodPhase(
  ctx: CanvasRenderingContext2D,
  w: number, h: number,
  t: number,
  heading: number,
) {
  // Keep the world visible underneath, but dim it.
  ctx.fillStyle = `rgba(0,0,0,${0.35 + 0.2 * t})`;
  ctx.fillRect(0, 0, w, h);

  // The player car always renders at canvas centre — place victims forward
  // along its heading vector.
  const cx = w / 2;
  const cy = h / 2;
  const fwdX = Math.cos(heading);
  const fwdY = Math.sin(heading);
  const ahead = (d: number) => ({ x: cx + fwdX * d, y: cy + fwdY * d });

  drawKid(ctx, ahead(36));
  drawKid(ctx, ahead(54));
  drawDog(ctx, ahead(72));

  const splatterScale = 1 + t * 2.5;
  drawSplatter(ctx, cx + fwdX * 40, cy + fwdY * 40, splatterScale);
  drawSplatter(ctx, cx + fwdX * 58, cy + fwdY * 58, splatterScale * 0.8);
  drawSplatter(ctx, cx + fwdX * 76, cy + fwdY * 76, splatterScale * 0.9);

  ctx.fillStyle = `rgba(255,255,255,${Math.min(1, t * 1.6)})`;
  ctx.font = 'bold 32px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('Du har drept 2 barn og 1 hund.', w / 2, 60);
  ctx.font = 'bold 18px sans-serif';
  ctx.fillText('Telefonen kan vente.', w / 2, 92);
}

function drawKid(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
  // Tiny stick figure, on its back.
  ctx.fillStyle = '#fff5e0';
  ctx.beginPath(); ctx.arc(pos.x, pos.y - 4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#3457a1';
  ctx.fillRect(pos.x - 5, pos.y, 10, 14);
  ctx.fillStyle = '#1c2c50';
  ctx.fillRect(pos.x - 3, pos.y + 14, 3, 8);
  ctx.fillRect(pos.x + 0, pos.y + 14, 3, 8);
}

function drawDog(ctx: CanvasRenderingContext2D, pos: { x: number; y: number }) {
  ctx.fillStyle = '#8c5a2c';
  ctx.fillRect(pos.x - 8, pos.y - 4, 16, 8);
  ctx.beginPath(); ctx.arc(pos.x + 9, pos.y - 4, 4, 0, Math.PI * 2); ctx.fill();
  ctx.fillRect(pos.x - 6, pos.y + 4, 2, 4);
  ctx.fillRect(pos.x + 4, pos.y + 4, 2, 4);
  // Tail.
  ctx.fillRect(pos.x - 12, pos.y - 2, 4, 2);
}

function drawSplatter(ctx: CanvasRenderingContext2D, x: number, y: number, scale: number) {
  ctx.fillStyle = 'rgba(180,10,10,0.85)';
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  ctx.beginPath();
  for (let i = 0; i < 18; i++) {
    const a = (i / 18) * Math.PI * 2;
    const r = 4 + ((i * 7) % 6);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  // A few outer droplets.
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2 + 0.3;
    const r = 9 + (i % 3) * 2;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function drawFadePhase(ctx: CanvasRenderingContext2D, w: number, h: number, t: number) {
  ctx.fillStyle = `rgba(0,0,0,${0.55 + 0.45 * t})`;
  ctx.fillRect(0, 0, w, h);
}

export const CRASH_OVERLAY_TOTAL_MS = CRASH_TOTAL_MS;
