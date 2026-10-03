// Rema 1000 — red building with a stylised logo. The trigger zone is the
// parking lot in front of the entrance.

import { REMA } from "../world";

const REMA_RED = "#d3142e";
const REMA_BLUE = "#0e368e";

export function drawRema(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  const x = REMA.x - camX;
  const y = REMA.y - camY;

  // Walls.
  ctx.fillStyle = "#f0f0f0";
  ctx.fillRect(x, y, REMA.w, REMA.h);

  // Red roof band along the top.
  ctx.fillStyle = REMA_RED;
  ctx.fillRect(x, y, REMA.w, 70);

  // White "REMA 1000" wordmark on the red band.
  ctx.fillStyle = "#fff";
  ctx.font = "bold 32px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("REMA 1000", x + REMA.w / 2, y + 35);

  // Blue accent strip just under the band.
  ctx.fillStyle = REMA_BLUE;
  ctx.fillRect(x, y + 70, REMA.w, 8);

  // Glass entrance: large windowed front, sliding doors in the middle.
  ctx.fillStyle = "#aedaf2";
  ctx.fillRect(x + 20, y + 100, REMA.w - 40, REMA.h - 130);

  ctx.fillStyle = "#fff";
  for (let i = 1; i < 5; i++) {
    ctx.fillRect(x + 20 + (i * (REMA.w - 40)) / 5, y + 100, 4, REMA.h - 130);
  }

  // Sliding doors.
  ctx.fillStyle = "#21364c";
  const doorW = 100;
  ctx.fillRect(x + REMA.w / 2 - doorW / 2, y + REMA.h - 60, doorW, 60);
  ctx.fillStyle = "#3b5878";
  ctx.fillRect(x + REMA.w / 2 - 2, y + REMA.h - 60, 4, 60);

  // Parking lot in front of the building.
  const lotTop = y + REMA.h + 12;
  ctx.fillStyle = "#383838";
  ctx.fillRect(x, lotTop, REMA.w, 70);

  // Painted parking bays.
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 3;
  const slots = 8;
  const slotW = (REMA.w - 20) / slots;
  for (let i = 0; i <= slots; i++) {
    const lx = x + 10 + i * slotW;
    ctx.beginPath();
    ctx.moveTo(lx, lotTop + 6);
    ctx.lineTo(lx, lotTop + 60);
    ctx.stroke();
  }

  // Big REMA 1000 totem sign on a pole at the right corner.
  drawPoleSign(ctx, x + REMA.w + 40, y + 30);
}

function drawPoleSign(ctx: CanvasRenderingContext2D, x: number, y: number) {
  ctx.fillStyle = "#888";
  ctx.fillRect(x - 3, y, 6, 110);
  ctx.fillStyle = REMA_RED;
  ctx.fillRect(x - 38, y - 50, 76, 60);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 13px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("REMA", x, y - 32);
  ctx.font = "bold 16px sans-serif";
  ctx.fillText("1000", x, y - 12);
}
