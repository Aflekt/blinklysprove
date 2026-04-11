// Failure tone escalation — the bureaucrat narrator progressively loses composure.
import type { CaseDef } from '../types';

export function toneTier(totalFailures: number): 0 | 1 | 2 | 3 {
  if (totalFailures <= 1) return 0;
  if (totalFailures === 2) return 1;
  if (totalFailures === 3) return 2;
  return 3;
}

export function escalatedAbsurd(c: CaseDef, name: string, totalFailures: number): string {
  const baseLine = c.absurd[Math.floor(Math.random() * c.absurd.length)];
  const tier = toneTier(totalFailures);
  if (tier === 0) {
    return 'Vi beklager. ' + baseLine;
  }
  if (tier === 1) {
    return 'Hva faen holder du på med, ' + name + '. ' + baseLine;
  }
  if (tier === 2) {
    return 'ER DU HELT IDIOT?? ' + baseLine.toUpperCase() + ' DET ER ET BARN I DEN BARNEVOGNA, ' + name.toUpperCase() + '.';
  }
  return 'JEG ORKER IKKE MER, ' + name.toUpperCase() + '. ' +
    baseLine.toUpperCase() + ' ' +
    'DU ER ET LEVENDE ARGUMENT FOR Å FJERNE FØRERKORTORDNINGEN. JEG MELDER DEG PERSONLIG TIL POLITIET ETTER JOBB. JEG HÅPER DU FORSTÅR HVA DU HAR GJORT.';
}
