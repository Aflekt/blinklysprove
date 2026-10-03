// Decoy buildings (Skole, Kafé, Park) at dead-ends.

import { DECOYS, type Decoy } from "../world";

export function drawDecoys(ctx: CanvasRenderingContext2D, camX: number, camY: number) {
  for (const d of DECOYS) {
    const x = d.x - camX;
    const y = d.y - camY;
    switch (d.kind) {
      case "skole":
        drawSkole(ctx, x, y, d);
        break;
      case "kafe":
        drawKafe(ctx, x, y, d);
        break;
      case "park":
        drawPark(ctx, x, y, d);
        break;
    }
  }
}

function buildingLabel(ctx: CanvasRenderingContext2D, label: string, x: number, y: number, w: number) {
  ctx.fillStyle = "#fff";
  ctx.font = "bold 22px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(label, x + w / 2, y + 22);
}

function drawSkole(ctx: CanvasRenderingContext2D, x: number, y: number, d: Decoy) {
  ctx.fillStyle = "#c9a35a";
  ctx.fillRect(x, y, d.w, d.h);
  ctx.fillStyle = "#7d4f1c";
  ctx.fillRect(x, y, d.w, 44);
  buildingLabel(ctx, d.label, x, y, d.w);
  ctx.fillStyle = "#bfe9ff";
  for (let i = 0; i < 6; i++) ctx.fillRect(x + 30 + i * 60, y + 100, 40, 60);
}

function drawKafe(ctx: CanvasRenderingContext2D, x: number, y: number, d: Decoy) {
  ctx.fillStyle = "#5b3a1a";
  ctx.fillRect(x, y, d.w, d.h);
  ctx.fillStyle = "#3a230f";
  ctx.fillRect(x, y, d.w, 44);
  buildingLabel(ctx, d.label, x, y, d.w);
  for (let i = 0; i < 4; i++) {
    ctx.fillStyle = i % 2 ? "#c64a3a" : "#fff5e0";
    ctx.fillRect(x + 30 + i * 70, y + 60, 65, 14);
  }
  ctx.fillStyle = "#1a1a1a";
  ctx.fillRect(x + d.w / 2 - 24, y + d.h - 90, 48, 90);
}

function drawPark(ctx: CanvasRenderingContext2D, x: number, y: number, d: Decoy) {
  for (let i = 0; i < 8; i++) {
    const tx = x + 30 + (i % 2) * 80;
    const ty = y + 30 + Math.floor(i / 2) * 90;
    ctx.fillStyle = "#3a5b22";
    ctx.beginPath();
    ctx.arc(tx + 26, ty + 26, 30, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#1f3a12";
    ctx.beginPath();
    ctx.arc(tx + 26, ty + 26, 18, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.fillStyle = "#3a2a1a";
  ctx.fillRect(x + d.w / 2 - 36, y + d.h - 50, 72, 36);
  ctx.fillStyle = "#fff";
  ctx.font = "bold 12px sans-serif";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(d.label, x + d.w / 2, y + d.h - 32);
}
