// Parkeringsplass — visual lay-by on the side of the road.

import { PARKING_AREA } from '../world';

export function drawParkingArea(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  const x = PARKING_AREA.x - camX;
  const y = PARKING_AREA.y - camY;
  const { w, h } = PARKING_AREA;

  // Asphalt pad slightly lighter than the road.
  ctx.fillStyle = '#3a3a3a';
  ctx.fillRect(x, y, w, h);

  // Kerb/edge.
  ctx.strokeStyle = '#cfcfcf';
  ctx.lineWidth = 2;
  ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);

  // Two painted parking bays.
  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(x + w / 2, y + 6);
  ctx.lineTo(x + w / 2, y + h - 6);
  ctx.stroke();

  // Big P painted on the asphalt.
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 28px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('P', x + w / 4, y + h / 2);
  ctx.fillText('P', x + (3 * w) / 4, y + h / 2);

  // Pole sign: blue square with white P (Norwegian "Parkering"-skilt).
  const polex = x + w + 8;
  const poley = y + 30;
  ctx.fillStyle = '#888';
  ctx.fillRect(polex - 2, poley, 4, 60);
  ctx.fillStyle = '#1c4eb8';
  ctx.fillRect(polex - 18, poley - 30, 36, 30);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 22px sans-serif';
  ctx.fillText('P', polex, poley - 15);
}
