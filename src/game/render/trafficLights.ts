import { type LightState, lightStateAt, TRAFFIC_LIGHTS, type TrafficLight } from "../world";
import { COLORS } from "./colors";

export function drawTrafficLights(ctx: CanvasRenderingContext2D, camX: number, camY: number, timeSec: number) {
  for (const tl of TRAFFIC_LIGHTS) {
    drawTrafficLight(ctx, camX, camY, lightStateAt(tl, timeSec), tl);
  }
}

function drawTrafficLight(
  ctx: CanvasRenderingContext2D,
  camX: number,
  camY: number,
  state: LightState,
  light: TrafficLight,
) {
  const x = light.pole.x - camX;
  const y = light.pole.y - camY;
  // Pole.
  ctx.fillStyle = COLORS.poleSteel;
  ctx.fillRect(x - 3, y - 4, 6, 30);

  // Box.
  ctx.fillStyle = "#1f1f1f";
  ctx.fillRect(x - 14, y - 60, 28, 60);

  // Three bulbs (red on top, yellow middle, green bottom).
  const radii = 7;
  const positions: Array<[number, LightState]> = [
    [y - 48, "red"],
    [y - 30, "yellow"],
    [y - 12, "green"],
  ];
  for (const [py, s] of positions) {
    ctx.fillStyle = state === s ? COLORS.lightOn[s] : COLORS.lightOff;
    ctx.beginPath();
    ctx.arc(x, py, radii, 0, Math.PI * 2);
    ctx.fill();
    if (state === s) {
      // Soft glow.
      ctx.fillStyle = `${COLORS.lightOn[s]}55`;
      ctx.beginPath();
      ctx.arc(x, py, radii + 4, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // Stop line (white) painted on the road.
  const sl = light.stopLine;
  ctx.fillStyle = "#ffffff";
  if (sl.axis === "x") {
    ctx.fillRect(sl.at - camX - 3, sl.from - camY, 6, sl.to - sl.from);
  } else {
    ctx.fillRect(sl.from - camX, sl.at - camY - 3, sl.to - sl.from, 6);
  }
}
