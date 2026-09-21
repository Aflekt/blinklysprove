// Big-map overlay shown when the player presses M while parked + blinking.

import { COLORS } from './colors';
import { WORLD, ROADS, ROUNDABOUTS, REMA, DECOYS, BENSIN, SIGNS, type SignKind } from '../world';
import type { Player } from '../../types';

export function drawMapOverlay(
  ctx: CanvasRenderingContext2D,
  viewW: number,
  viewH: number,
  player: Player,
) {
  ctx.fillStyle = 'rgba(0,0,0,0.7)';
  ctx.fillRect(0, 0, viewW, viewH);

  const pad = 40;
  const maxW = viewW - pad * 2;
  const maxH = viewH - pad * 2 - 60;
  const scale = Math.min(maxW / WORLD.width, maxH / WORLD.height);
  const mapW = WORLD.width * scale;
  const mapH = WORLD.height * scale;
  const ox = (viewW - mapW) / 2;
  const oy = (viewH - mapH) / 2 + 20;

  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 22px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('KART — Statens vegvesen', viewW / 2, oy - 36);
  ctx.font = '13px sans-serif';
  ctx.fillStyle = '#bbb';
  ctx.fillText('Trykk M for å lukke', viewW / 2, oy - 14);

  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(ox, oy, mapW, mapH);

  ctx.fillStyle = COLORS.road;
  for (const r of ROADS) {
    ctx.fillRect(ox + r.x * scale, oy + r.y * scale, r.w * scale, r.h * scale);
  }

  for (const rbt of ROUNDABOUTS) {
    ctx.fillStyle = COLORS.road;
    ctx.beginPath();
    ctx.arc(ox + rbt.cx * scale, oy + rbt.cy * scale, rbt.outerR * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = COLORS.grass;
    ctx.beginPath();
    ctx.arc(ox + rbt.cx * scale, oy + rbt.cy * scale, rbt.innerR * scale, 0, Math.PI * 2);
    ctx.fill();
  }

  // Decoy buildings shown as faint grey blocks (no labels — players have to
  // explore to find Rema 1000).
  ctx.fillStyle = '#777';
  for (const d of DECOYS) {
    ctx.fillRect(ox + d.x * scale, oy + d.y * scale, d.w * scale, d.h * scale);
  }

  // Bensinstasjon marker — labelled.
  ctx.fillStyle = '#ffcf2b';
  ctx.fillRect(ox + BENSIN.x * scale, oy + BENSIN.y * scale, BENSIN.w * scale, BENSIN.h * scale);
  ctx.fillStyle = '#fff';
  ctx.font = 'bold 11px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'top';
  ctx.fillText('Bensin', ox + (BENSIN.x + BENSIN.w / 2) * scale, oy + (BENSIN.y + BENSIN.h + 6) * scale);

  // Rema 1000 marker — labelled.
  ctx.fillStyle = '#d3142e';
  ctx.fillRect(ox + REMA.x * scale, oy + REMA.y * scale, REMA.w * scale, REMA.h * scale);
  ctx.fillStyle = '#fff';
  ctx.fillText('Rema 1000', ox + (REMA.x + REMA.w / 2) * scale, oy + (REMA.y + REMA.h + 6) * scale);

  // Player dot, pulsing.
  const pulse = 0.5 + 0.5 * Math.sin(performance.now() / 200);
  const px = ox + player.pos.x * scale;
  const py = oy + player.pos.y * scale;
  ctx.fillStyle = `rgba(232, 36, 64, ${0.4 + 0.4 * pulse})`;
  ctx.beginPath(); ctx.arc(px, py, 12, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = '#e82440';
  ctx.beginPath(); ctx.arc(px, py, 5, 0, Math.PI * 2); ctx.fill();

  // Signs — coloured dots at world position.
  for (const s of SIGNS) {
    ctx.fillStyle = SIGN_COLOR[s.kind];
    ctx.beginPath();
    ctx.arc(ox + s.x * scale, oy + s.y * scale, 3, 0, Math.PI * 2);
    ctx.fill();
  }

  // Legend.
  drawLegend(ctx, ox, oy + mapH + 18, scale);

  ctx.strokeStyle = '#fff';
  ctx.lineWidth = 2;
  ctx.strokeRect(ox, oy, mapW, mapH);
}

const SIGN_COLOR: Record<SignKind, string> = {
  yield:      '#ff5050',
  roundabout: '#ff5050',
  speed50:    '#ff5050',
  crosswalk:  '#7fb6ff',
  oneway:     '#7fb6ff',
  deadend:    '#7fb6ff',
  bikepath:   '#7fb6ff',
  noentry:    '#ff2030',
};

function drawLegend(ctx: CanvasRenderingContext2D, x: number, y: number, _scale: number) {
  ctx.font = '11px sans-serif';
  ctx.textAlign = 'left';
  ctx.textBaseline = 'middle';
  const items: Array<[string, string]> = [
    ['#7fb6ff', 'Påbudsskilt (blå)'],
    ['#ff5050', 'Vikeplikt / fart'],
    ['#ff2030', 'Innkjøring forbudt'],
  ];
  let dx = 0;
  for (const [col, label] of items) {
    ctx.fillStyle = col;
    ctx.beginPath(); ctx.arc(x + dx + 5, y, 4, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = '#fff';
    ctx.fillText(label, x + dx + 14, y);
    dx += ctx.measureText(label).width + 30;
  }
}
