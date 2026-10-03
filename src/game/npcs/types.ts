import type { Vec2 } from "../../types";

export type NpcKind = "pedestrian" | "cyclist" | "dog";

export interface NpcDef {
  id: string;
  kind: NpcKind;
  start: Vec2;
  velocity: Vec2;
  bounds: { x: number; y: number; w: number; h: number };
  wandering?: boolean; // dogs occasionally change direction inside bounds
  color?: string;
}

export interface Npc {
  def: NpcDef;
  pos: Vec2;
  vel: Vec2;
  dead: boolean;
  deadAt: number;
  bobPhase: number;
}
