// Game-rule logic. Runs each frame, mutates state, emits one-shot events
// the driving loop consumes (violations → life lost, fines → money, info
// → positive feedback).

import type { Player, Vec2 } from "../types";
import {
  BENSIN,
  type Compass,
  exitForAngle,
  exitsPastFirst,
  exitsRequiringLeft,
  lightStateAt,
  ONE_WAY_ZONES,
  PARKING_AREA,
  REMA,
  ROADS,
  ROUNDABOUTS,
  type RoadRect,
  type Roundabout,
  type RoundaboutId,
  TRAFFIC_LIGHTS,
} from "./world";

export type ToastKind = "violation" | "fine" | "info";

export interface PendingEvent {
  kind: ToastKind;
  msg: string;
  amount?: number; // for fines
}

export interface RulesState {
  // Roundabout
  activeRbt: RoundaboutId | null;
  entry: Compass | null;
  passedFirstExit: boolean;
  blinkLeftSeenPastFirst: boolean;
  lastRbtAngle: number | null;
  rbtWrongWayAccum: number;
  rbtBlinkRightPastFirstTimer: number;
  // Parking-exit blink (§ 14)
  wasInParking: boolean;
  // Refuel gate
  refueled: boolean;
  // Win
  reachedShop: boolean;
  // Movement memory
  prevPos: Vec2;
  // Wrong-side-of-road timer (continuous wrong-lane time in seconds)
  wrongSideTimer: number;
  wrongSideCooldown: number;
  // One-way (enveiskjøring) violation timer.
  oneWayTimer: number;
  oneWayCooldown: number;
  // One-shot toast.
  pending: PendingEvent | null;
}

const WRONG_SIDE_THRESHOLD_S = 1.2;
const WRONG_SIDE_COOLDOWN_S = 4.0;
const RBT_WRONG_WAY_THRESHOLD_RAD = 0.55;
const WRONG_SIDE_FINE_KR = 5_000;
const ONE_WAY_THRESHOLD_S = 0.8;
const ONE_WAY_COOLDOWN_S = 4.0;

export function makeRulesState(p: Player): RulesState {
  return {
    activeRbt: null,
    entry: null,
    passedFirstExit: false,
    blinkLeftSeenPastFirst: false,
    lastRbtAngle: null,
    rbtWrongWayAccum: 0,
    rbtBlinkRightPastFirstTimer: 0,
    wasInParking: pointInRect(p.pos, PARKING_AREA),
    refueled: false,
    reachedShop: false,
    prevPos: { x: p.pos.x, y: p.pos.y },
    wrongSideTimer: 0,
    wrongSideCooldown: 0,
    oneWayTimer: 0,
    oneWayCooldown: 0,
    pending: null,
  };
}

export function tickRules(state: RulesState, p: Player, timeSec: number, dt: number) {
  tickRoundabouts(state, p, dt);
  tickTrafficLights(state, p, timeSec);
  tickParkingExit(state, p);
  tickBensin(state, p);
  tickShop(state, p);
  tickWrongSide(state, p, dt);
  tickOneWay(state, p, dt);
  state.prevPos.x = p.pos.x;
  state.prevPos.y = p.pos.y;
}

// --- Roundabout ----------------------------------------------------------

function findActiveRoundabout(p: Player): Roundabout | null {
  for (const rbt of ROUNDABOUTS) {
    const d = Math.hypot(p.pos.x - rbt.cx, p.pos.y - rbt.cy);
    if (d <= rbt.outerR + 4) return rbt;
  }
  return null;
}

function tickRoundabouts(state: RulesState, p: Player, dt: number) {
  const active = findActiveRoundabout(p);

  if (active) {
    const angle = Math.atan2(p.pos.y - active.cy, p.pos.x - active.cx);
    const here = exitForAngle(angle);

    if (state.activeRbt !== active.id) {
      state.activeRbt = active.id;
      state.entry = here;
      state.passedFirstExit = false;
      state.blinkLeftSeenPastFirst = false;
      state.lastRbtAngle = angle;
      state.rbtWrongWayAccum = 0;
      state.rbtBlinkRightPastFirstTimer = 0;
    } else if (state.entry) {
      const past = exitsPastFirst(state.entry);
      if (!state.passedFirstExit && past.includes(here) && here !== state.entry) {
        state.passedFirstExit = true;
      }
      if (state.passedFirstExit && p.blinker === "left") {
        state.blinkLeftSeenPastFirst = true;
      }
      // Wrong-blinker detection: right blinker on while we're still going
      // around (past first exit, not at our exit yet) is the wrong signal.
      if (state.passedFirstExit && p.blinker === "right") {
        state.rbtBlinkRightPastFirstTimer += dt;
        if (state.rbtBlinkRightPastFirstTimer > 0.6 && !state.pending) {
          emit(state, "violation", "Feil blinklys i rundkjøring — du blinket høyre da du skulle blinket venstre.");
          state.rbtBlinkRightPastFirstTimer = 0;
        }
      } else {
        state.rbtBlinkRightPastFirstTimer = 0;
      }
      // Wrong-way detection. CCW (correct) = angle decreasing.
      if (state.lastRbtAngle != null) {
        let delta = angle - state.lastRbtAngle;
        if (delta > Math.PI) delta -= 2 * Math.PI;
        if (delta < -Math.PI) delta += 2 * Math.PI;
        if (delta > 0) {
          state.rbtWrongWayAccum += delta;
        } else if (delta < 0) {
          state.rbtWrongWayAccum = Math.max(0, state.rbtWrongWayAccum + delta);
        }
        if (state.rbtWrongWayAccum > RBT_WRONG_WAY_THRESHOLD_RAD && !state.pending) {
          emit(state, "violation", "Kjørte feil vei i rundkjøring (skal være mot urviseren).");
          state.rbtWrongWayAccum = 0;
        }
      }
      state.lastRbtAngle = angle;
    }
  } else if (state.activeRbt && state.entry) {
    const last = ROUNDABOUTS.find((r) => r.id === state.activeRbt)!;
    const exit = exitForAngle(Math.atan2(p.pos.y - last.cy, p.pos.x - last.cx));
    const requireLeft = exitsRequiringLeft(state.entry).includes(exit) && exit !== state.entry;

    if (requireLeft && !state.blinkLeftSeenPastFirst && !state.pending) {
      emit(state, "violation", `Manglende venstreblink i rundkjøring (mot ${dirName(exit)}).`);
    }
    state.activeRbt = null;
    state.entry = null;
    state.passedFirstExit = false;
    state.blinkLeftSeenPastFirst = false;
    state.lastRbtAngle = null;
    state.rbtWrongWayAccum = 0;
    state.rbtBlinkRightPastFirstTimer = 0;
  }
}

// --- Traffic lights ------------------------------------------------------

function tickTrafficLights(state: RulesState, p: Player, timeSec: number) {
  if (state.pending) return;
  for (const light of TRAFFIC_LIGHTS) {
    if (lightStateAt(light, timeSec) !== "red") continue;
    const sl = light.stopLine;
    let crossed = false;
    if (sl.axis === "x") {
      // Crossed the vertical line, in either direction.
      if ((state.prevPos.x - sl.at) * (p.pos.x - sl.at) < 0) {
        if (p.pos.y >= sl.from && p.pos.y <= sl.to) crossed = true;
      }
    } else {
      if ((state.prevPos.y - sl.at) * (p.pos.y - sl.at) < 0) {
        if (p.pos.x >= sl.from && p.pos.x <= sl.to) crossed = true;
      }
    }
    if (crossed) {
      emit(state, "violation", "Kjørte på rødt lys.");
      return;
    }
  }
}

// --- Parking-exit blink (§ 14) ------------------------------------------

function tickParkingExit(state: RulesState, p: Player) {
  const inside = pointInRect(p.pos, PARKING_AREA);
  if (state.pending) {
    state.wasInParking = inside;
    return;
  }
  if (state.wasInParking && !inside && p.blinker !== "left") {
    emit(state, "violation", "Du forlot parkeringen uten å blinke (Trafikkreglene § 14).");
  }
  state.wasInParking = inside;
}

// --- Refuel gate --------------------------------------------------------

function tickBensin(state: RulesState, p: Player) {
  if (state.refueled) return;
  if (pointInRect(p.pos, BENSIN.trigger)) {
    state.refueled = true;
    emit(state, "info", "Tanket fullt. Kjør videre til Rema 1000.");
  }
}

function tickShop(state: RulesState, p: Player) {
  if (state.reachedShop) return;
  if (!pointInRect(p.pos, REMA.trigger)) return;
  if (!state.refueled) {
    if (!state.pending) emit(state, "info", "Du må tanke på bensinstasjonen først.");
    return;
  }
  state.reachedShop = true;
}

// --- Wrong side of road --------------------------------------------------

function findRoadForPoint(pos: Vec2): RoadRect | null {
  for (const r of ROADS) {
    if (pos.x >= r.x && pos.x <= r.x + r.w && pos.y >= r.y && pos.y <= r.y + r.h) return r;
  }
  return null;
}

function classifyLane(road: RoadRect, p: Player): "correct" | "wrong" | "unknown" {
  if (road.orient === "v") {
    const cx = road.x + road.w / 2;
    const dy = Math.sin(p.heading);
    if (Math.abs(dy) < 0.4) return "unknown"; // mostly turning
    const goingNorth = dy < 0;
    const onEast = p.pos.x > cx;
    if (goingNorth) return onEast ? "correct" : "wrong";
    return onEast ? "wrong" : "correct";
  }
  const cy = road.y + road.h / 2;
  const dx = Math.cos(p.heading);
  if (Math.abs(dx) < 0.4) return "unknown";
  const goingEast = dx > 0;
  const onSouth = p.pos.y > cy;
  if (goingEast) return onSouth ? "correct" : "wrong";
  return onSouth ? "wrong" : "correct";
}

function tickWrongSide(state: RulesState, p: Player, dt: number) {
  if (state.wrongSideCooldown > 0) state.wrongSideCooldown = Math.max(0, state.wrongSideCooldown - dt);
  if (state.pending) return;
  if (state.activeRbt) {
    state.wrongSideTimer = 0;
    return;
  }
  if (Math.abs(p.speed) < 8) {
    state.wrongSideTimer = 0;
    return;
  }

  const road = findRoadForPoint(p.pos);
  if (!road) {
    state.wrongSideTimer = 0;
    return;
  }
  const lane = classifyLane(road, p);
  if (lane === "correct" || lane === "unknown") {
    state.wrongSideTimer = 0;
    return;
  }
  // lane === 'wrong'
  state.wrongSideTimer += dt;
  if (state.wrongSideTimer > WRONG_SIDE_THRESHOLD_S && state.wrongSideCooldown === 0) {
    emit(
      state,
      "fine",
      `Kjørte på feil side av veien. Bot: ${WRONG_SIDE_FINE_KR.toLocaleString("no-NO")} kr.`,
      WRONG_SIDE_FINE_KR,
    );
    state.wrongSideTimer = 0;
    state.wrongSideCooldown = WRONG_SIDE_COOLDOWN_S;
  }
}

// --- One-way (enveiskjøring) --------------------------------------------

function tickOneWay(state: RulesState, p: Player, dt: number) {
  if (state.oneWayCooldown > 0) state.oneWayCooldown = Math.max(0, state.oneWayCooldown - dt);
  if (state.pending) return;
  if (Math.abs(p.speed) < 8) {
    state.oneWayTimer = 0;
    return;
  }

  const fx = Math.cos(p.heading);
  const fy = Math.sin(p.heading);
  const fwdSign = Math.sign(p.speed); // -1 if reversing

  for (const z of ONE_WAY_ZONES) {
    if (!pointInRect(p.pos, z)) continue;
    const dot = {
      east: fx * fwdSign,
      west: -fx * fwdSign,
      south: fy * fwdSign,
      north: -fy * fwdSign,
    }[z.allowed];
    if (dot < -0.5) {
      state.oneWayTimer += dt;
      if (state.oneWayTimer > ONE_WAY_THRESHOLD_S && state.oneWayCooldown === 0) {
        emit(state, "violation", "Kjørte mot enveiskjøring (skiltforskriften § 5).");
        state.oneWayTimer = 0;
        state.oneWayCooldown = ONE_WAY_COOLDOWN_S;
      }
      return;
    }
    state.oneWayTimer = 0;
    return;
  }
  state.oneWayTimer = 0;
}

// --- Map-key gate -------------------------------------------------------

export type MapAction = "open" | "fineMoving" | "close";

export function evaluateMapKey(p: Player, mapOpen: boolean): MapAction {
  if (mapOpen) return "close";
  if (Math.abs(p.speed) > 5) return "fineMoving";
  return "open";
}

// --- helpers ------------------------------------------------------------

interface Rect {
  x: number;
  y: number;
  w: number;
  h: number;
}

function pointInRect(p: Vec2, r: Rect) {
  return p.x >= r.x && p.x <= r.x + r.w && p.y >= r.y && p.y <= r.y + r.h;
}

function emit(state: RulesState, kind: ToastKind, msg: string, amount?: number) {
  state.pending = { kind, msg, amount };
}

function dirName(c: Compass) {
  return c === "N" ? "nord" : c === "S" ? "sør" : c === "E" ? "øst" : "vest";
}
