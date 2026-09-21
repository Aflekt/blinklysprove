// NPC rendering — alive figures with a tiny bob/wheel animation, dead
// figures replaced with a blood splatter on the asphalt.

import type { Npc } from '../npcs';

export function drawNpcs(ctx: CanvasRenderingContext2D, npcs: Npc[], camX: number, camY: number) {
  for (const n of npcs) {
    const sx = n.pos.x - camX;
    const sy = n.pos.y - camY;
    if (n.dead) { drawSplat(ctx, sx, sy); continue; }
    switch (n.def.kind) {
      case 'pedestrian': drawPedestrian(ctx, sx, sy, n.bobPhase); break;
      case 'cyclist':    drawCyclist(ctx, sx, sy, n.bobPhase, n.vel); break;
      case 'dog':        drawDog(ctx, sx, sy, n.def.color ?? '#8c5a2c', n.vel); break;
    }
  }
}

function drawPedestrian(ctx: CanvasRenderingContext2D, x: number, y: number, bob: number) {
  // Head.
  ctx.fillStyle = '#f0c89a';
  ctx.beginPath(); ctx.arc(x, y - 8, 4, 0, Math.PI * 2); ctx.fill();
  // Body — jacket.
  ctx.fillStyle = '#3457a1';
  ctx.fillRect(x - 5, y - 4, 10, 12);
  // Legs — swing slightly with bob.
  const legSwing = Math.sin(bob) * 2;
  ctx.fillStyle = '#1c2c50';
  ctx.fillRect(x - 4, y + 8, 3, 8);
  ctx.fillRect(x + 1, y + 8, 3, 8);
  // Shoe shift.
  ctx.fillStyle = '#000';
  ctx.fillRect(x - 4 + legSwing, y + 15, 3, 2);
  ctx.fillRect(x + 1 - legSwing, y + 15, 3, 2);
}

function drawCyclist(ctx: CanvasRenderingContext2D, x: number, y: number, bob: number, vel: { x: number; y: number }) {
  const heading = Math.atan2(vel.y, vel.x);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading + Math.PI / 2);    // turn so body faces direction of travel

  // Wheels.
  ctx.fillStyle = '#222';
  ctx.beginPath(); ctx.arc(0, -8, 5, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(0,  8, 5, 0, Math.PI * 2); ctx.fill();
  // Spokes — rotate with bob.
  ctx.strokeStyle = '#888';
  ctx.lineWidth = 1;
  for (const cy of [-8, 8]) {
    for (let i = 0; i < 4; i++) {
      const a = bob + i * Math.PI / 2;
      ctx.beginPath();
      ctx.moveTo(0, cy);
      ctx.lineTo(Math.cos(a) * 5, cy + Math.sin(a) * 5);
      ctx.stroke();
    }
  }
  // Frame.
  ctx.strokeStyle = '#c8102e';
  ctx.lineWidth = 2;
  ctx.beginPath(); ctx.moveTo(0, -8); ctx.lineTo(0, 8); ctx.stroke();
  // Rider body.
  ctx.fillStyle = '#2d6a4f';
  ctx.fillRect(-3, -4, 6, 8);
  ctx.fillStyle = '#f0c89a';
  ctx.beginPath(); ctx.arc(0, -7, 3, 0, Math.PI * 2); ctx.fill();
  ctx.restore();
}

function drawDog(ctx: CanvasRenderingContext2D, x: number, y: number, color: string, vel: { x: number; y: number }) {
  const heading = Math.atan2(vel.y, vel.x);
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(heading);
  // Body.
  ctx.fillStyle = color;
  ctx.fillRect(-9, -4, 18, 8);
  // Head.
  ctx.beginPath(); ctx.arc(10, -2, 4, 0, Math.PI * 2); ctx.fill();
  // Legs.
  ctx.fillRect(-7, 4, 2, 4);
  ctx.fillRect(-1, 4, 2, 4);
  ctx.fillRect(5, 4, 2, 4);
  // Tail.
  ctx.fillRect(-12, -2, 4, 2);
  // Ear hint.
  ctx.fillStyle = '#5a3618';
  ctx.fillRect(8, -6, 2, 3);
  ctx.restore();
}

function drawSplat(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = 'rgba(170,15,15,0.85)';
  ctx.save();
  ctx.translate(x, y);
  ctx.beginPath();
  for (let i = 0; i < 14; i++) {
    const a = (i / 14) * Math.PI * 2;
    const r = 6 + ((i * 5) % 5);
    ctx.lineTo(Math.cos(a) * r, Math.sin(a) * r);
  }
  ctx.closePath();
  ctx.fill();
  for (let i = 0; i < 5; i++) {
    const a = (i / 5) * Math.PI * 2 + 0.3;
    const r = 10 + (i % 2) * 3;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * r, Math.sin(a) * r, 1.6, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}
