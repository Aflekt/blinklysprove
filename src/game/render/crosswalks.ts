import { CROSSWALKS, type Crosswalk } from "../world";
import { COLORS } from "./colors";

export function drawCrosswalks(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  for (const cw of CROSSWALKS) {
    drawCrosswalk(ctx, cw.x - camX, cw.y - camY, cw);
  }
}

function drawCrosswalk(ctx: CanvasRenderingContext2D, x: number, y: number, cw: Crosswalk) {
  // Stripes are perpendicular to the road. orient='v' = horizontal road
  // (player drives east-west, stripes lay east-west). Wait, our convention:
  // 'v' here means the crosswalk spans across a vertical road — i.e. stripes
  // are horizontal bars stacked along the road. We just paint stripes inside
  // the crosswalk rect.
  ctx.fillStyle = COLORS.zebra;
  const stripe = 14;
  const gap = 10;
  if (cw.orient === "v") {
    // Stripes run vertically, repeating along x.
    for (let dx = 4; dx < cw.w - 4; dx += stripe + gap) {
      ctx.fillRect(x + dx, y + 4, stripe, cw.h - 8);
    }
  } else {
    // Stripes repeat along y.
    for (let dy = 4; dy < cw.h - 4; dy += stripe + gap) {
      ctx.fillRect(x + 4, y + dy, cw.w - 8, stripe);
    }
  }
}
