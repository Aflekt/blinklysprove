import { ROUNDABOUTS, type Roundabout } from "../world";
import { COLORS } from "./colors";

export function drawRoundabouts(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  for (const rbt of ROUNDABOUTS) drawRoundabout(ctx, rbt, camX, camY);
}

function drawRoundabout(ctx: CanvasRenderingContext2D, rbt: Roundabout, camX: number, camY: number) {
  const cx = rbt.cx - camX;
  const cy = rbt.cy - camY;

  ctx.fillStyle = COLORS.road;
  ctx.beginPath();
  ctx.arc(cx, cy, rbt.outerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.roadEdge;
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy, rbt.outerR - 2, 0, Math.PI * 2);
  ctx.stroke();

  ctx.fillStyle = COLORS.grass;
  ctx.beginPath();
  ctx.arc(cx, cy, rbt.innerR, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = COLORS.roadEdge;
  ctx.lineWidth = 2;
  ctx.setLineDash([8, 8]);
  ctx.beginPath();
  ctx.arc(cx, cy, rbt.innerR + 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.setLineDash([]);

  ctx.fillStyle = "#2a5a2a";
  ctx.beginPath();
  ctx.arc(cx, cy, rbt.innerR - 30, 0, Math.PI * 2);
  ctx.fill();
}
