// Bensinstasjon — gas station with canopy and three pumps.

import { BENSIN } from '../world';

export function drawBensin(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  const x = BENSIN.x - camX;
  const y = BENSIN.y - camY;
  const { w, h } = BENSIN;

  // Asphalt under canopy (the trigger zone).
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(x + 20, y + 100, w - 40, h - 100);

  // Canopy roof — yellow band with black trim (generic; not a real brand).
  ctx.fillStyle = '#ffcf2b';
  ctx.fillRect(x, y, w, 70);
  ctx.fillStyle = '#202020';
  ctx.fillRect(x, y + 70, w, 6);

  // Brand text.
  ctx.fillStyle = '#202020';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('BENSIN', x + w / 2, y + 35);

  // Three pumps along the canopy.
  const pumpYs = [y + 110, y + 110, y + 110];
  const pumpXs = [x + 70, x + w / 2 - 20, x + w - 110];
  for (let i = 0; i < 3; i++) {
    drawPump(ctx, pumpXs[i], pumpYs[i]);
  }

  // Painted lane lines on the asphalt.
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.setLineDash([10, 8]);
  ctx.beginPath();
  ctx.moveTo(x + 30,    y + h - 14);
  ctx.lineTo(x + w - 30, y + h - 14);
  ctx.stroke();
  ctx.setLineDash([]);

  // Small pole sign with prices.
  const polex = x + w + 30;
  const poley = y + 50;
  ctx.fillStyle = '#888';
  ctx.fillRect(polex - 3, poley, 6, 130);
  ctx.fillStyle = '#202020';
  ctx.fillRect(polex - 36, poley - 30, 72, 50);
  ctx.fillStyle = '#ffcf2b';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('95 24,90', polex, poley - 16);
  ctx.fillText('98 26,40', polex, poley - 4);
}

function drawPump(ctx: CanvasRenderingContext2D, x: number, y: number) {
  // Body.
  ctx.fillStyle = '#cc1a1a';
  ctx.fillRect(x, y, 40, 80);
  // Top display.
  ctx.fillStyle = '#222';
  ctx.fillRect(x, y - 14, 40, 14);
  // Hose hook.
  ctx.fillStyle = '#101010';
  ctx.fillRect(x + 38, y + 18, 4, 24);
}
