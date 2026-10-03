import { SIGNS, type Sign, type SignKind } from "../world";
import { COLORS } from "./colors";

export function drawSigns(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  for (const s of SIGNS) {
    drawSign(ctx, s.x - camX, s.y - camY, s);
  }
}

const DRAWERS: Record<SignKind, (ctx: CanvasRenderingContext2D) => void> = {
  yield: drawYield,
  roundabout: drawRoundaboutSign,
  speed50: drawSpeed50,
  crosswalk: drawCrosswalkSign,
  oneway: drawOneway,
  deadend: drawDeadend,
  bikepath: drawBikepath,
  noentry: drawNoentry,
};

function drawSign(ctx: CanvasRenderingContext2D, x: number, y: number, s: Sign) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(s.rotation);
  ctx.fillStyle = COLORS.poleSteel;
  ctx.fillRect(-2, 0, 4, 26);
  DRAWERS[s.kind](ctx);
  ctx.restore();
}

function drawYield(ctx: CanvasRenderingContext2D) {
  const r = 18;
  ctx.fillStyle = COLORS.signRedBg;
  triangle(ctx, 0, -10, r, true);
  ctx.fillStyle = COLORS.signWhite;
  triangle(ctx, 0, -10, r - 4, true);
}

function drawRoundaboutSign(ctx: CanvasRenderingContext2D) {
  const r = 18;
  ctx.fillStyle = COLORS.signRedBg;
  triangle(ctx, 0, -10, r, false);
  ctx.fillStyle = COLORS.signWhite;
  triangle(ctx, 0, -10, r - 4, false);

  ctx.strokeStyle = "#222";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(0, -10, 5, 0, Math.PI * 1.5);
  ctx.stroke();
  const arrows = [
    { a: 0, ax: 5, ay: 0 },
    { a: Math.PI / 2, ax: 0, ay: 5 },
    { a: Math.PI, ax: -5, ay: 0 },
  ];
  ctx.fillStyle = "#222";
  for (const ar of arrows) {
    ctx.save();
    ctx.translate(ar.ax, -10 + ar.ay);
    ctx.rotate(ar.a);
    ctx.beginPath();
    ctx.moveTo(0, 0);
    ctx.lineTo(-3, -2);
    ctx.lineTo(-3, 2);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
  }
}

function drawSpeed50(ctx: CanvasRenderingContext2D) {
  const r = 14;
  ctx.fillStyle = COLORS.signRedBg;
  ctx.beginPath();
  ctx.arc(0, -10, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.signWhite;
  ctx.beginPath();
  ctx.arc(0, -10, r - 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#222";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("50", 0, -10);
}

function drawCrosswalkSign(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.signBlue;
  ctx.fillRect(-12, -22, 24, 24);
  ctx.fillStyle = COLORS.signWhite;
  triangle(ctx, 0, -10, 9, false);
  ctx.fillStyle = "#000";
  ctx.fillRect(-1, -12, 2, 6);
  ctx.fillRect(-3, -7, 2, 4);
  ctx.fillRect(1, -7, 2, 4);
}

// Enveiskjøring — blue horizontal rectangle with a white arrow pointing right.
function drawOneway(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.signBlue;
  ctx.fillRect(-22, -20, 44, 20);
  ctx.fillStyle = COLORS.signWhite;
  // Arrow shaft.
  ctx.fillRect(-14, -11, 22, 2);
  // Arrow head.
  ctx.beginPath();
  ctx.moveTo(14, -10);
  ctx.lineTo(8, -14);
  ctx.lineTo(8, -6);
  ctx.closePath();
  ctx.fill();
}

// Blindvei — blue square with white T (perpendicular stub).
function drawDeadend(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.signBlue;
  ctx.fillRect(-14, -24, 28, 24);
  ctx.fillStyle = COLORS.signWhite;
  // Vertical line.
  ctx.fillRect(-1, -22, 2, 16);
  // Top horizontal cap.
  ctx.fillRect(-8, -22, 16, 2);
  // Closed bottom indicating the dead end.
  ctx.fillRect(-6, -6, 12, 2);
}

// Sykkelsti — blue square with white bicycle.
function drawBikepath(ctx: CanvasRenderingContext2D) {
  ctx.fillStyle = COLORS.signBlue;
  ctx.fillRect(-14, -24, 28, 24);
  ctx.strokeStyle = COLORS.signWhite;
  ctx.lineWidth = 1.5;
  // Wheels.
  ctx.beginPath();
  ctx.arc(-7, -8, 4, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(7, -8, 4, 0, Math.PI * 2);
  ctx.stroke();
  // Frame.
  ctx.beginPath();
  ctx.moveTo(-7, -8);
  ctx.lineTo(0, -8);
  ctx.lineTo(-3, -16);
  ctx.lineTo(5, -16);
  ctx.moveTo(0, -8);
  ctx.lineTo(7, -8);
  ctx.stroke();
}

// Innkjøring forbudt — red circle with white horizontal bar.
function drawNoentry(ctx: CanvasRenderingContext2D) {
  const r = 14;
  ctx.fillStyle = COLORS.signRedBg;
  ctx.beginPath();
  ctx.arc(0, -10, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = COLORS.signWhite;
  ctx.fillRect(-r + 2, -12, (r - 2) * 2, 4);
}

function triangle(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, inverted: boolean) {
  ctx.beginPath();
  if (inverted) {
    ctx.moveTo(cx, cy + r);
    ctx.lineTo(cx - r, cy - r * 0.7);
    ctx.lineTo(cx + r, cy - r * 0.7);
  } else {
    ctx.moveTo(cx, cy - r);
    ctx.lineTo(cx - r, cy + r * 0.7);
    ctx.lineTo(cx + r, cy + r * 0.7);
  }
  ctx.closePath();
  ctx.fill();
}
