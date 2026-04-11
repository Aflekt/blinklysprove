// Tiny Web Audio helpers — no external sound files required.

interface WebkitWindow extends Window { webkitAudioContext?: typeof AudioContext; }

let _ctx: AudioContext | null = null;
function ctx(): AudioContext | null {
  if (!_ctx) {
    try {
      const W = window as WebkitWindow;
      const Ctor = window.AudioContext || W.webkitAudioContext;
      if (Ctor) _ctx = new Ctor();
    } catch {
      _ctx = null;
    }
  }
  return _ctx;
}

function tone(freq: number, duration: number, type: OscillatorType = 'sine', gain = 0.06) {
  const c = ctx(); if (!c) return;
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = type;
  osc.frequency.value = freq;
  g.gain.value = gain;
  osc.connect(g); g.connect(c.destination);
  const now = c.currentTime;
  g.gain.setValueAtTime(g.gain.value, now);
  g.gain.exponentialRampToValueAtTime(0.0001, now + duration);
  osc.start(now);
  osc.stop(now + duration);
}

export const sfx = {
  blink() { tone(880, 0.06, 'square', 0.04); },
  crash() {
    const c = ctx(); if (!c) return;
    const buf = c.createBuffer(1, c.sampleRate * 0.6, c.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / data.length);
    const src = c.createBufferSource();
    const g = c.createGain();
    src.buffer = buf;
    g.gain.value = 0.25;
    src.connect(g); g.connect(c.destination);
    src.start();
  },
  jail() {
    tone(120, 0.4, 'sawtooth', 0.15);
    setTimeout(() => tone(80, 0.6, 'sawtooth', 0.12), 150);
  },
  fanfare() {
    tone(523, 0.15, 'triangle', 0.08);
    setTimeout(() => tone(659, 0.15, 'triangle', 0.08), 150);
    setTimeout(() => tone(784, 0.25, 'triangle', 0.08), 300);
  },
};
