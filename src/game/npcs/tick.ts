// NPC movement + collision detection.

import type { Player } from '../../types';
import type { Npc, NpcDef } from './types';
import { NPC_DEFS } from './data';

const RESPAWN_MS = 6000;
const HIT_RADIUS = 24;
const HIT_MIN_SPEED = 30;

export function makeNpcs(): Npc[] {
  return NPC_DEFS.map(spawn);
}

function spawn(def: NpcDef): Npc {
  return {
    def,
    pos: { ...def.start },
    vel: { ...def.velocity },
    dead: false,
    deadAt: 0,
    bobPhase: Math.random() * 6.28,
  };
}

export interface NpcHit {
  npc: Npc;
  label: string;
}

export function tickNpcs(npcs: Npc[], player: Player, dt: number, nowMs: number): NpcHit | null {
  for (const n of npcs) {
    if (n.dead) {
      if (nowMs - n.deadAt > RESPAWN_MS) {
        const fresh = spawn(n.def);
        n.pos = fresh.pos; n.vel = fresh.vel;
        n.dead = false;
        n.bobPhase = fresh.bobPhase;
      }
      continue;
    }
    move(n, dt, nowMs);
  }
  for (const n of npcs) {
    if (n.dead) continue;
    const d = Math.hypot(n.pos.x - player.pos.x, n.pos.y - player.pos.y);
    if (d < HIT_RADIUS && Math.abs(player.speed) > HIT_MIN_SPEED) {
      n.dead = true;
      n.deadAt = nowMs;
      return { npc: n, label: labelFor(n) };
    }
  }
  return null;
}

function move(n: Npc, dt: number, nowMs: number) {
  n.pos.x += n.vel.x * dt;
  n.pos.y += n.vel.y * dt;
  n.bobPhase += dt * 9;

  const b = n.def.bounds;
  if (n.pos.x < b.x)         { n.pos.x = b.x;         n.vel.x = Math.abs(n.vel.x); }
  if (n.pos.x > b.x + b.w)   { n.pos.x = b.x + b.w;   n.vel.x = -Math.abs(n.vel.x); }
  if (n.pos.y < b.y)         { n.pos.y = b.y;         n.vel.y = Math.abs(n.vel.y); }
  if (n.pos.y > b.y + b.h)   { n.pos.y = b.y + b.h;   n.vel.y = -Math.abs(n.vel.y); }

  // Wandering NPCs randomly change direction every couple of seconds.
  if (n.def.wandering && Math.random() < dt * 0.6) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.hypot(n.vel.x, n.vel.y);
    n.vel.x = Math.cos(angle) * speed;
    n.vel.y = Math.sin(angle) * speed;
  }
  // (Silence unused warning.)
  void nowMs;
}

function labelFor(n: Npc): string {
  switch (n.def.kind) {
    case 'pedestrian': return 'fotgjenger';
    case 'cyclist':    return 'syklist';
    case 'dog':        return 'hund';
  }
}
