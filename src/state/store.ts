import { useSyncExternalStore } from 'react';
import type { AppState } from '../types';

const initialState: AppState = {
  playerName: 'Sjåfør',
  selectedCar: 'corolla',
  screen: 'intro',
  lives: 3,
  fines: 0,
  totalErrors: 0,
  gameOverReason: '',
};

let state: AppState = { ...initialState };
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export const store = {
  get(): AppState { return state; },
  set(patch: Partial<AppState>) { state = { ...state, ...patch }; emit(); },
  reset() { state = { ...initialState, playerName: state.playerName }; emit(); },
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); },
};

export function useStore<T = AppState>(selector: (s: AppState) => T = ((s) => s as unknown as T)): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(state),
  );
}

export function loseLife(reason: string) {
  const s = store.get();
  const newLives = Math.max(0, s.lives - 1);
  store.set({
    lives: newLives,
    totalErrors: s.totalErrors + 1,
    ...(newLives === 0 ? { screen: 'gameOver', gameOverReason: reason } : {}),
  });
}

export function loseAllLives(reason: string) {
  const s = store.get();
  store.set({
    lives: 0,
    totalErrors: s.totalErrors + 1,
    screen: 'gameOver',
    gameOverReason: reason,
  });
}

export function addFine(amount: number) {
  const s = store.get();
  store.set({ fines: s.fines + amount });
}
