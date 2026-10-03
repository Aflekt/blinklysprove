// World renderer — orchestrates the per-element drawers.

import type { Player } from "../../types";
import type { Npc } from "../npcs";
import { WORLD } from "../world";
import { drawBensin } from "./bensin";
import { drawCar } from "./car";
import { COLORS } from "./colors";
import { drawCrosswalks } from "./crosswalks";
import { drawDecoys } from "./decoys";
import { drawMapOverlay } from "./mapOverlay";
import { drawNpcs } from "./npcs";
import { drawParkingArea } from "./parking";
import { drawRema } from "./rema";
import { drawRoads } from "./roads";
import { drawRoundabouts } from "./roundabout";
import { drawSigns } from "./signs";
import { drawTrafficLights } from "./trafficLights";

export interface RenderInput {
  player: Player;
  blinkerPhase: boolean;
  timeSec: number;
  showMap: boolean;
  carColors?: { body?: string; roof?: string };
  npcs?: Npc[];
}

export function drawWorld(ctx: CanvasRenderingContext2D, viewW: number, viewH: number, input: RenderInput) {
  const { player, blinkerPhase, timeSec, showMap, carColors, npcs } = input;
  const camX = player.pos.x - viewW / 2;
  const camY = player.pos.y - viewH / 2;

  ctx.fillStyle = COLORS.grass;
  ctx.fillRect(0, 0, viewW, viewH);

  ctx.fillStyle = COLORS.grassDark;
  ctx.fillRect(-camX - 4000, -camY - 4000, 4000, 4000 + WORLD.height + 8000);
  ctx.fillRect(-camX + WORLD.width, -camY - 4000, 4000, 4000 + WORLD.height + 8000);
  ctx.fillRect(-camX, -camY - 4000, WORLD.width, 4000);
  ctx.fillRect(-camX, -camY + WORLD.height, WORLD.width, 4000);

  drawRoads(ctx, camX, camY);
  drawParkingArea(ctx, camX, camY);
  drawRoundabouts(ctx, camX, camY);
  drawCrosswalks(ctx, camX, camY);
  drawTrafficLights(ctx, camX, camY, timeSec);
  drawDecoys(ctx, camX, camY);
  drawBensin(ctx, camX, camY);
  drawRema(ctx, camX, camY);
  if (npcs) drawNpcs(ctx, npcs, camX, camY);
  drawSigns(ctx, camX, camY);
  drawCar(ctx, viewW / 2, viewH / 2, player.heading, blinkerPhase, player.blinker, carColors?.body, carColors?.roof);

  if (showMap) drawMapOverlay(ctx, viewW, viewH, player);
}

export { drawMapOverlay };
