// Shared type definitions used across cases, the game loop, and React components.

export type Side = 'left' | 'right';
export type CrashType = 'pedestrian' | 'cyclist' | 'stroller' | 'rear';
export type GamePhase = 'approach' | 'maneuver' | 'done';
export type CrashPhase = 'crash' | 'wasted' | 'fade' | 'jail' | null;
export type CrashReason = 'no_blink' | 'wrong_side' | 'too_early' | 'collision' | 'timeout' | null;

export interface PlayerPos {
  x: number;
  y: number;
  angle: number;
}

export interface GameState {
  caseDef: CaseDef;
  t: number;
  phase: GamePhase;
  blinker: Side | null;
  blinkerOnT: number;
  commitT: number;
  crashReason: CrashReason;
  crashPhase: CrashPhase;
  crashTimer: number;
  success: boolean;
  successTimer: number;
  worldScroll: number;
  maneuverProgress: number;
  car: PlayerPos;
  flashOn: boolean;
  flashTimer: number;
  done: boolean;
}

export interface CaseDef {
  id: number;
  title: string;
  expected: Side;
  crashType: CrashType;
  obstacleClearMs: number;
  rule: string;
  absurd: string[];
  darkCase?: boolean;
  blindSpot?: boolean;
  revealText?: string;
  drawScene(ctx: CanvasRenderingContext2D, w: number, h: number, scrollOffset: number): void;
  drawObstacle(ctx: CanvasRenderingContext2D, w: number, h: number, t: number, game: GameState): void;
  getPlayerPos(w: number, h: number, mp: number, phase: GamePhase): PlayerPos;
}

export type Outcome = 'success' | 'failure';

export interface CompletePayload {
  outcome: Outcome;
  crashReason?: CrashReason;
}

export type Screen = 'intro' | 'game' | 'failure' | 'reveal' | 'success' | 'end';

export interface Stats {
  killedPedestrians: number;
  injuredCyclists: number;
  destroyedStrollers: number;
  rearEnded: number;
  failedCases: number;
  totalFailures: number;
  errors: number;
  patternTooEarly: number;
  patternTooLate: number;
  patternNoBlink: number;
  patternWrongSide: number;
}

export interface AppState extends Stats {
  playerName: string;
  screen: Screen;
  caseIndex: number;
  lastFailureCase: CaseDef | null;
  lastFailureMessage: string;
}
