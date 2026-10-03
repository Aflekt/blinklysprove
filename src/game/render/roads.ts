import { ROADS } from "../world";
import { COLORS } from "./colors";

export function drawRoads(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  for (const r of ROADS) {
    drawRoad(ctx, r.x - camX, r.y - camY, r.w, r.h, r.orient);
  }
}

function drawRoad(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, orient: "h" | "v") {
  ctx.fillStyle = COLORS.road;
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = COLORS.roadEdge;
  if (orient === "h") {
    ctx.fillRect(x, y + 2, w, 3);
    ctx.fillRect(x, y + h - 5, w, 3);
  } else {
    ctx.fillRect(x + 2, y, 3, h);
    ctx.fillRect(x + w - 5, y, 3, h);
  }
  ctx.fillStyle = COLORS.roadLine;
  if (orient === "h") {
    const cy = y + h / 2 - 2;
    for (let dx = 0; dx < w; dx += 60) ctx.fillRect(x + dx, cy, 30, 4);
  } else {
    const cx = x + w / 2 - 2;
    for (let dy = 0; dy < h; dy += 60) ctx.fillRect(cx, y + dy, 4, 30);
  }
}
