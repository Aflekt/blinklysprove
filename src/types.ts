export type Side = "left" | "right";
export type Screen = "intro" | "select" | "game" | "gameOver" | "won";
export type CarId = "corolla" | "tesla" | "bmw" | "volvo" | "caddy" | "focus";

export interface Vec2 {
  x: number;
  y: number;
}

export interface Player {
  pos: Vec2;
  heading: number;
  speed: number;
  blinker: Side | null;
  blinkerSetAt: number;
}

export interface AppState {
  playerName: string;
  selectedCar: CarId;
  screen: Screen;
  lives: number;
  fines: number;
  totalErrors: number;
  gameOverReason: string;
}
