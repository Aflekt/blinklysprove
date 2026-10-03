// Main per-frame loop. Reads input, integrates physics, runs rules, draws.

import { type RefObject, useEffect, useRef, useState } from "react";
import { addFine, loseAllLives, loseLife, store, useStore } from "../state/store";
import type { Player, Side } from "../types";
import { CAR_BY_ID, type CarConfig } from "./cars";
import { CRASH_TOTAL_MS, POPUP_TIMING, pickHarmless } from "./events";
import { makeNpcs, tickNpcs } from "./npcs";
import { PHYSICS, type Physics, SPEED_TO_KMH } from "./physics";
import { drawWorld } from "./render";
import { drawCrashOverlay } from "./render/crashOverlay";
import { evaluateMapKey, makeRulesState, type ToastKind, tickRules } from "./rules";
import { BENSIN, PARKING_AREA, PLAYER_START, REMA, WORLD } from "./world";

const BLINK_HZ = 2.4;
const MAP_FINE_KR = 1_000_000;

export interface DrivingHud {
  blinker: Side | null;
  speed: number;
  toast: { kind: ToastKind; msg: string } | null;
  showMap: boolean;
  refueled: boolean;
  popup: boolean;
  harmlessMsg: string | null;
  crashActive: boolean;
}

export function useDriving(canvasRef: RefObject<HTMLCanvasElement | null>): DrivingHud {
  const [hudBlinker, setHudBlinker] = useState<Side | null>(null);
  const [hudSpeed, setHudSpeed] = useState(0);
  const [toast, setToast] = useState<DrivingHud["toast"]>(null);
  const [showMap, setShowMap] = useState(false);
  const [refueled, setRefueled] = useState(false);
  const [popup, setPopup] = useState(false);
  const [harmlessMsg, setHarmlessMsg] = useState<string | null>(null);
  const [crashActive, setCrashActive] = useState(false);

  const showMapRef = useRef(showMap);
  showMapRef.current = showMap;
  const popupRef = useRef(popup);
  popupRef.current = popup;
  const crashStartRef = useRef<number | null>(null);
  const nextPopupAtRef = useRef<number>(0);

  const playerRef = useRef<Player>({
    pos: { x: PLAYER_START.x, y: PLAYER_START.y },
    heading: PLAYER_START.heading,
    speed: 0,
    blinker: null,
    blinkerSetAt: 0,
  });
  const rulesRef = useRef(makeRulesState(playerRef.current));
  const npcsRef = useRef(makeNpcs());
  const keys = useRef<Record<string, boolean>>({});
  const toastTmoRef = useRef<number | null>(null);
  const harmlessTmoRef = useRef<number | null>(null);

  const carId = useStore((s) => s.selectedCar);
  const car: CarConfig = CAR_BY_ID[carId];
  const physics: Physics = { ...PHYSICS, ...(car.physics ?? {}) };

  // Schedule the first popup once the game starts.
  useEffect(() => {
    nextPopupAtRef.current =
      performance.now() +
      (POPUP_TIMING.initialDelayMin + Math.random() * (POPUP_TIMING.initialDelayMax - POPUP_TIMING.initialDelayMin)) *
        1000;
  }, []);

  useEffect(() => {
    const onDown = (e: KeyboardEvent) => {
      const k = e.key.toLowerCase();
      keys.current[k] = true;

      if (crashStartRef.current != null) return; // ignore input during animation

      if (k === "q") toggleBlink("left");
      else if (k === "w") toggleBlink("right");
      else if (k === "m") handleMapKey();
      else if (k === "l") handleReadKey();
      else if (k === "escape" && showMapRef.current) setShowMap(false);

      if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) {
        e.preventDefault();
      }
    };
    const onUp = (e: KeyboardEvent) => {
      keys.current[e.key.toLowerCase()] = false;
    };

    function toggleBlink(side: Side) {
      const p = playerRef.current;
      const effective: Side = car.quirks?.blinkerFlipped ? (side === "left" ? "right" : "left") : side;
      p.blinker = p.blinker === effective ? null : effective;
      p.blinkerSetAt = performance.now();
      setHudBlinker(p.blinker);
    }

    function handleMapKey() {
      const action = evaluateMapKey(playerRef.current, showMapRef.current);
      if (action === "open") setShowMap(true);
      else if (action === "close") setShowMap(false);
      else if (action === "fineMoving") {
        addFine(MAP_FINE_KR);
        flashToast("fine", `Du åpnet kartet i bevegelse. Bot: ${MAP_FINE_KR.toLocaleString("no-NO")} kr.`);
      }
    }

    function handleReadKey() {
      if (!popupRef.current) return;
      const p = playerRef.current;
      // Safe = legally parked in a real parking area. Just braking on a
      // road is *not* parking — opening the message there still kills you.
      const safe =
        pointInRect(p.pos, PARKING_AREA) || pointInRect(p.pos, BENSIN.trigger) || pointInRect(p.pos, REMA.trigger);
      if (!safe) {
        setPopup(false);
        crashStartRef.current = performance.now();
        setCrashActive(true);
        keys.current = {};
      } else {
        setPopup(false);
        setHarmlessMsg(pickHarmless());
        if (harmlessTmoRef.current != null) window.clearTimeout(harmlessTmoRef.current);
        harmlessTmoRef.current = window.setTimeout(() => setHarmlessMsg(null), 4500);
        scheduleNextPopup();
      }
    }

    function pointInRect(v: { x: number; y: number }, r: { x: number; y: number; w: number; h: number }) {
      return v.x >= r.x && v.x <= r.x + r.w && v.y >= r.y && v.y <= r.y + r.h;
    }

    window.addEventListener("keydown", onDown);
    window.addEventListener("keyup", onUp);
    return () => {
      window.removeEventListener("keydown", onDown);
      window.removeEventListener("keyup", onUp);
    };
  }, []);

  function flashToast(kind: ToastKind, msg: string) {
    setToast({ kind, msg });
    if (toastTmoRef.current != null) window.clearTimeout(toastTmoRef.current);
    toastTmoRef.current = window.setTimeout(() => setToast(null), 3500);
  }

  function scheduleNextPopup() {
    const span = POPUP_TIMING.retriggerDelayMax - POPUP_TIMING.retriggerDelayMin;
    nextPopupAtRef.current = performance.now() + (POPUP_TIMING.retriggerDelayMin + Math.random() * span) * 1000;
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let lastTs = performance.now();

    const fitCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      canvas.width = Math.floor(rect.width * dpr);
      canvas.height = Math.floor(rect.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    fitCanvas();
    const ro = new ResizeObserver(fitCanvas);
    ro.observe(canvas);

    const tick = (ts: number) => {
      const dt = Math.min(0.05, (ts - lastTs) / 1000);
      lastTs = ts;
      const p = playerRef.current;
      const rect = canvas.getBoundingClientRect();
      const blinkerPhase = ((ts / 1000) * BLINK_HZ) % 1 < 0.55;

      const inCrash = crashStartRef.current != null;

      if (!inCrash) {
        if (showMapRef.current) {
          p.speed = 0;
        } else {
          applyInput(p, dt);
          clampToWorld(p);
          tickRules(rulesRef.current, p, ts / 1000, dt);
          consumePending();
          const hit = tickNpcs(npcsRef.current, p, dt, ts);
          if (hit) {
            const msg = `Du kjørte på en ${hit.label}!`;
            loseLife(msg);
            flashToast("violation", msg);
          }
          consumeWin();
          maybeTriggerPopup(ts);
        }
      }

      drawWorld(ctx, rect.width, rect.height, {
        player: p,
        blinkerPhase,
        timeSec: ts / 1000,
        showMap: showMapRef.current && !inCrash,
        carColors: { body: car.body, roof: car.roof },
        npcs: npcsRef.current,
      });

      if (inCrash) {
        const elapsed = ts - crashStartRef.current!;
        drawCrashOverlay(ctx, rect.width, rect.height, elapsed, p.heading);
        if (elapsed >= CRASH_TOTAL_MS) {
          crashStartRef.current = null;
          setCrashActive(false);
          loseAllLives("Du leste meldingen i bevegelse. Djevelen hentet deg ned til helvete.");
        }
      }

      setHudSpeed(Math.round(Math.abs(p.speed) * SPEED_TO_KMH));
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      ro.disconnect();
      if (toastTmoRef.current != null) window.clearTimeout(toastTmoRef.current);
      if (harmlessTmoRef.current != null) window.clearTimeout(harmlessTmoRef.current);
    };
  }, [canvasRef, car.body, car.roof]);

  function applyInput(p: Player, dt: number) {
    const up = keys.current.arrowup;
    const down = keys.current.arrowdown;
    const left = keys.current.arrowleft;
    const right = keys.current.arrowright;

    if (up) {
      if (car.quirks?.instantTopSpeed) p.speed = physics.MAX_FWD;
      else p.speed += physics.ACCEL * dt;
    } else if (down) {
      if (p.speed > 0) p.speed -= physics.BRAKE * dt;
      else p.speed -= physics.REVERSE_ACCEL * dt;
    } else {
      if (p.speed > 0) p.speed = Math.max(0, p.speed - physics.FRICTION * dt);
      else if (p.speed < 0) p.speed = Math.min(0, p.speed + physics.FRICTION * dt);
    }
    p.speed = Math.max(physics.MAX_REV, Math.min(physics.MAX_FWD, p.speed));

    const speedFactor = Math.min(1, Math.abs(p.speed) / 80);
    if (Math.abs(p.speed) > physics.TURN_MIN_SPEED) {
      const dir = Math.sign(p.speed);
      if (left) p.heading -= physics.TURN_RATE * speedFactor * dir * dt;
      if (right) p.heading += physics.TURN_RATE * speedFactor * dir * dt;
    }

    p.pos.x += Math.cos(p.heading) * p.speed * dt;
    p.pos.y += Math.sin(p.heading) * p.speed * dt;
  }

  function clampToWorld(p: Player) {
    const m = 30;
    if (p.pos.x < m) {
      p.pos.x = m;
      p.speed *= 0.4;
    }
    if (p.pos.x > WORLD.width - m) {
      p.pos.x = WORLD.width - m;
      p.speed *= 0.4;
    }
    if (p.pos.y < m) {
      p.pos.y = m;
      p.speed *= 0.4;
    }
    if (p.pos.y > WORLD.height - m) {
      p.pos.y = WORLD.height - m;
      p.speed *= 0.4;
    }
  }

  function consumePending() {
    const r = rulesRef.current;
    if (!r.pending) return;
    const { kind, msg, amount } = r.pending;
    r.pending = null;

    if (kind === "violation") loseLife(msg);
    if (kind === "fine" && amount) addFine(amount);
    if (kind === "info" && r.refueled) setRefueled(true);

    flashToast(kind, msg);
  }

  function consumeWin() {
    if (rulesRef.current.reachedShop && store.get().screen === "game") {
      store.set({ screen: "won" });
    }
  }

  function maybeTriggerPopup(ts: number) {
    if (popupRef.current) return;
    if (crashStartRef.current != null) return;
    if (ts >= nextPopupAtRef.current) setPopup(true);
  }

  return { blinker: hudBlinker, speed: hudSpeed, toast, showMap, refueled, popup, harmlessMsg, crashActive };
}
