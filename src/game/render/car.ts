import { COLORS } from './colors';
import type { Side } from '../../types';

// Draw the player car at canvas-screen coordinates (already camera-adjusted).
export function drawCar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  heading: number,
  blinkerPhase: boolean,
  blinker: Side | null,
  bodyColor: string = COLORS.carBody,
  roofColor: string = COLORS.carRoof,
) {
  const len = 38;
  const wid = 22;
  ctx.save();
  ctx.translate(cx, cy);
  ctx.rotate(heading);

  // Shadow.
  ctx.fillStyle = 'rgba(0,0,0,0.35)';
  ctx.fillRect(-len / 2 + 3, -wid / 2 + 4, len, wid);

  // Body + roof + windshield.
  ctx.fillStyle = bodyColor;
  ctx.fillRect(-len / 2, -wid / 2, len, wid);
  ctx.fillStyle = roofColor;
  ctx.fillRect(-len / 2 + 8, -wid / 2 + 3, len - 16, wid - 6);
  ctx.fillStyle = COLORS.carWindow;
  ctx.fillRect(len / 2 - 12, -wid / 2 + 4, 4, wid - 8);

  // Blinkers — local +x = forward, -y = driver's left, +y = right.
  const on = blinkerPhase;
  const lights: Array<[number, number, boolean]> = [
    [len / 2 - 1, -wid / 2 + 1, on && blinker === 'left'],
    [len / 2 - 1,  wid / 2 - 4, on && blinker === 'right'],
    [-len / 2 - 2, -wid / 2 + 1, on && blinker === 'left'],
    [-len / 2 - 2,  wid / 2 - 4, on && blinker === 'right'],
  ];
  for (const [x, y, lit] of lights) {
    ctx.fillStyle = lit ? COLORS.blinkerOn : COLORS.blinkerOff;
    ctx.fillRect(x, y, 3, 3);
  }
  ctx.restore();
}
