// Default driving physics. Phase 5 will let cars override these per model.

export const PHYSICS = {
  ACCEL: 240,        // px/s² when holding gas
  REVERSE_ACCEL: 160,
  BRAKE: 420,
  FRICTION: 90,
  MAX_FWD: 260,      // px/s
  MAX_REV: -100,
  TURN_RATE: 2.6,    // rad/s at high speed
  TURN_MIN_SPEED: 10,
};

export type Physics = typeof PHYSICS;

// Speed → "km/t" displayed in the HUD. Pixels are abstract.
export const SPEED_TO_KMH = 0.3;
