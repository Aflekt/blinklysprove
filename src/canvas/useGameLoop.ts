import { useEffect, useRef, useState, type RefObject } from 'react';
import { drawCar, drawBlinkers } from './primitives';
import { drawCrashOverlay } from './crashOverlay';
import { sfx } from '../audio/sounds';
import type { CaseDef, GameState, Side, CompletePayload } from '../types';

const TIMEOUT_LIMIT = 30000;
const MANEUVER_DURATION = 1800;

function isObstacleClear(t: number, caseDef: CaseDef): boolean {
  return t >= (caseDef.obstacleClearMs ?? 5500);
}

function makeGame(caseDef: CaseDef): GameState {
  return {
    caseDef,
    t: 0,
    phase: 'approach',
    blinker: null,
    blinkerOnT: 0,
    commitT: 0,
    crashReason: null,
    crashPhase: null,
    crashTimer: 0,
    success: false,
    successTimer: 0,
    worldScroll: 0,
    maneuverProgress: 0,
    car: { x: 0, y: 0, angle: 0 },
    flashOn: true,
    flashTimer: 0,
    done: false,
  };
}

export interface GameLoopHandle {
  pressBlink(side: Side): void;
  pressWheel(side: Side): void;
  blinker: Side | null;
}

/**
 * useGameLoop — runs the game for the given case.
 * Calls onComplete({ outcome }) when done.
 */
export function useGameLoop(
  canvasRef: RefObject<HTMLCanvasElement | null>,
  caseDef: CaseDef,
  onComplete: (p: CompletePayload) => void,
): GameLoopHandle {
  const gameRef = useRef<GameState>(makeGame(caseDef));
  const rafRef = useRef<number>(0);
  const lastTimeRef = useRef<number>(0);
  const onCompleteRef = useRef(onComplete);
  const [blinker, setBlinker] = useState<Side | null>(null);

  useEffect(() => { onCompleteRef.current = onComplete; }, [onComplete]);

  // Reset on case change
  useEffect(() => {
    gameRef.current = makeGame(caseDef);
    setBlinker(null);
    lastTimeRef.current = performance.now();
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caseDef]);

  // Resize observer keeps canvas crisp
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, [canvasRef]);

  // Keyboard
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft')  { pressBlink('left');  e.preventDefault(); }
      if (e.key === 'ArrowRight') { pressBlink('right'); e.preventDefault(); }
      if (e.key === 'ArrowDown' || e.key === ' ') {
        const g = gameRef.current;
        if (g && g.blinker) pressWheel(g.blinker);
        e.preventDefault();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function pressBlink(side: Side): void {
    const g = gameRef.current;
    if (!g || g.crashPhase || g.success) return;
    if (g.phase !== 'approach') return;
    g.blinker = side;
    g.blinkerOnT = g.t;
    setBlinker(side);
    sfx.blink();
  }

  function pressWheel(side: Side): void {
    const g = gameRef.current;
    if (!g || g.crashPhase || g.success) return;
    if (g.phase !== 'approach') return;
    const c = g.caseDef;
    if (g.blinker === null) { g.crashReason = 'no_blink'; triggerCrash(); return; }
    if (side !== g.blinker) { g.crashReason = 'wrong_side'; triggerCrash(); return; }
    const lead = g.t - g.blinkerOnT;
    const okSide = side === c.expected;
    const okLead = lead >= 3000;
    const okClear = isObstacleClear(g.t, c);
    if (okSide && okLead && okClear) {
      g.phase = 'maneuver';
      g.commitT = g.t;
      return;
    }
    if (!okSide) g.crashReason = 'wrong_side';
    else if (!okLead) g.crashReason = 'too_early';
    else g.crashReason = 'collision';
    triggerCrash();
  }

  function triggerCrash() {
    const g = gameRef.current;
    g.crashPhase = 'crash';
    g.crashTimer = 0;
    sfx.crash();
  }

  function advanceCrashPhase() {
    const g = gameRef.current;
    if (g.crashPhase === 'crash' && g.crashTimer > 1400) { g.crashPhase = 'wasted'; g.crashTimer = 0; }
    else if (g.crashPhase === 'wasted' && g.crashTimer > 1800) { g.crashPhase = 'fade'; g.crashTimer = 0; }
    else if (g.crashPhase === 'fade' && g.crashTimer > 700) { g.crashPhase = 'jail'; g.crashTimer = 0; sfx.jail(); }
    else if (g.crashPhase === 'jail' && g.crashTimer > 2400) {
      g.crashPhase = null;
      g.done = true;
      onCompleteRef.current({ outcome: 'failure', crashReason: g.crashReason });
    }
  }

  function update(dt: number) {
    const g = gameRef.current;
    g.t += dt;
    g.flashTimer += dt;
    if (g.flashTimer > 250) { g.flashOn = !g.flashOn; g.flashTimer = 0; }

    if (g.crashPhase) { g.crashTimer += dt; advanceCrashPhase(); return; }

    if (g.successTimer > 0) {
      g.successTimer -= dt;
      if (g.successTimer <= 0) { g.done = true; onCompleteRef.current({ outcome: 'success' }); }
      return;
    }

    if (g.phase === 'approach') {
      g.worldScroll += 0.10 * dt;
      if (g.t >= TIMEOUT_LIMIT) { g.crashReason = 'timeout'; triggerCrash(); }
    } else if (g.phase === 'maneuver') {
      g.worldScroll += 0.10 * dt;
      const elapsed = g.t - g.commitT;
      g.maneuverProgress = Math.min(1, elapsed / MANEUVER_DURATION);
      if (g.maneuverProgress >= 1) {
        g.phase = 'done';
        g.success = true;
        g.successTimer = 600;
      }
    }
  }

  function draw() {
    const canvas = canvasRef.current; if (!canvas) return;
    const ctx = canvas.getContext('2d'); if (!ctx) return;
    const rect = canvas.getBoundingClientRect();
    const w = rect.width, h = rect.height;
    const g = gameRef.current;
    const c = g.caseDef;
    g.car = c.getPlayerPos(w, h, g.maneuverProgress, g.phase);
    ctx.clearRect(0, 0, w, h);
    c.drawScene(ctx, w, h, g.worldScroll);
    c.drawObstacle(ctx, w, h, g.t, g);
    drawCar(ctx, g.car.x, g.car.y, g.car.angle);
    drawBlinkers(ctx, g);
    if (g.crashPhase) drawCrashOverlay(ctx, w, h, g, c);
  }

  function loop(now: number) {
    const g = gameRef.current;
    if (!g || g.done) return;
    const dt = Math.min(50, now - lastTimeRef.current);
    lastTimeRef.current = now;
    update(dt);
    draw();
    if (!g.done) rafRef.current = requestAnimationFrame(loop);
  }

  return { pressBlink, pressWheel, blinker };
}
