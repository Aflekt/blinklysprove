// Random in-game events. Currently just the tempting "popup notification"
// that — if opened while driving — sends the player to hell.

export const POPUP_TIMING = {
  initialDelayMin: 25,      // seconds after game start
  initialDelayMax: 45,
  retriggerDelayMin: 30,    // seconds after the previous popup was dismissed
  retriggerDelayMax: 55,
};

export const POPUP_HEADER = '📱 1 ulest melding';
export const POPUP_BODY = 'VIKTIG! Trykk L for å lese.';

// Stupid, low-stakes messages shown if the player opens the popup while
// actually parked. The point is to make ignoring it feel costly even
// though doing it safely is harmless.
export const HARMLESS_MESSAGES: string[] = [
  'Hei kjære! Husker du å ta med melk fra Rema? — Mamma',
  'Telenor: Datakvoten din er snart oppbrukt. Trykk for å kjøpe mer.',
  'VIPPS: Du mottok 250,00 kr fra Pappa. Bra jobba 👍',
  'Værvarsel: Sol og 18° i ettermiddag.',
  'Statens vegvesen: EU-kontroll forfaller om 14 dager.',
  'NRK: Breaking — Ny rundkjøring åpnet i Tønsberg.',
  'Tinder: Du har 3 nye matchar! 😍',
];

export function pickHarmless(): string {
  return HARMLESS_MESSAGES[Math.floor(Math.random() * HARMLESS_MESSAGES.length)];
}

export const CRASH_ANIM = {
  devilMs: 1500,    // 0 → devilMs
  crashMs: 2000,    // devilMs → devilMs + crashMs
  fadeMs:  1000,    // last 1s
};
export const CRASH_TOTAL_MS = CRASH_ANIM.devilMs + CRASH_ANIM.crashMs + CRASH_ANIM.fadeMs;
