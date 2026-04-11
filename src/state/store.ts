// Tiny vanilla store with React-friendly subscribe (works with useSyncExternalStore).
import { useSyncExternalStore } from 'react';
import type { AppState, CaseDef, CrashReason } from '../types';

const initialState: AppState = {
  playerName: 'Sjåfør',
  screen: 'intro',
  caseIndex: 0,

  killedPedestrians: 0,
  injuredCyclists: 0,
  destroyedStrollers: 0,
  rearEnded: 0,

  failedCases: 0,
  totalFailures: 0,
  errors: 0,

  patternTooEarly: 0,
  patternTooLate: 0,
  patternNoBlink: 0,
  patternWrongSide: 0,

  lastFailureCase: null,
  lastFailureMessage: '',
};

let state: AppState = { ...initialState };
const listeners = new Set<() => void>();

function emit() { listeners.forEach((l) => l()); }

export const store = {
  get(): AppState { return state; },
  set(patch: Partial<AppState>) { state = { ...state, ...patch }; emit(); },
  reset() { state = { ...initialState }; emit(); },
  subscribe(fn: () => void) { listeners.add(fn); return () => listeners.delete(fn); },
};

export function useStore<T = AppState>(selector: (s: AppState) => T = ((s) => s as unknown as T)): T {
  return useSyncExternalStore(
    store.subscribe,
    () => selector(store.get()),
    () => selector(state),
  );
}

export function recordFailure(caseDef: CaseDef, crashReason: CrashReason) {
  const s = store.get();
  const patch: Partial<AppState> = {
    failedCases: s.failedCases + 1,
    totalFailures: s.totalFailures + 1,
    errors: s.errors + 1,
  };
  if (caseDef.crashType === 'pedestrian') patch.killedPedestrians = s.killedPedestrians + 1;
  if (caseDef.crashType === 'cyclist')    patch.injuredCyclists  = s.injuredCyclists + 1;
  if (caseDef.crashType === 'stroller')   patch.destroyedStrollers = s.destroyedStrollers + 1;
  if (caseDef.crashType === 'rear')       patch.rearEnded         = s.rearEnded + 1;
  if (crashReason === 'too_early') patch.patternTooEarly = s.patternTooEarly + 1;
  if (crashReason === 'collision') patch.patternTooLate  = s.patternTooLate + 1;
  if (crashReason === 'no_blink')  patch.patternNoBlink  = s.patternNoBlink + 1;
  if (crashReason === 'wrong_side')patch.patternWrongSide = s.patternWrongSide + 1;
  store.set(patch);
}
