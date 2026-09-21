import { useRef } from 'react';
import { useStore } from '../state/store';
import { useDriving } from '../game/useDriving';
import type { ToastKind } from '../game/rules';
import { POPUP_HEADER, POPUP_BODY } from '../game/events';
import { TouchControls } from './TouchControls';

export function GameScreen() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const lives = useStore((s) => s.lives);
  const fines = useStore((s) => s.fines);
  const playerName = useStore((s) => s.playerName);
  const { blinker, speed, toast, showMap, refueled, popup, harmlessMsg, crashActive } = useDriving(canvasRef);

  return (
    <div className="vv-card overflow-hidden p-0">
      <div className="bg-vv-text text-white px-6 py-3 flex justify-between items-center gap-4 flex-wrap text-sm">
        <div>Fører: <b>{playerName}</b></div>
        <div className="opacity-80">
          Piltaster · <b>Q</b>/<b>W</b> blink · <b>M</b> kart · <b>L</b> les melding
        </div>
      </div>
      <div className="relative bg-black w-full h-[640px] border border-vv-border">
        <canvas ref={canvasRef} className="w-full h-full block" tabIndex={0} />
        {!crashActive && (
          <Hud lives={lives} fines={fines} blinker={blinker} speed={speed} mapOpen={showMap} refueled={refueled} />
        )}
        {toast && !crashActive && <Toast kind={toast.kind}>{toast.msg}</Toast>}
        {popup && !crashActive && <PopupNotification />}
        {harmlessMsg && <HarmlessSheet msg={harmlessMsg} />}
        {!crashActive && <TouchControls />}
      </div>
    </div>
  );
}

const TOAST_BG: Record<ToastKind, string> = {
  violation: '#c8102e',
  fine: '#444f55',
  info: '#2d6a4f',
};

function Toast({ kind, children }: { kind: ToastKind; children: React.ReactNode }) {
  return (
    <div
      className="absolute top-16 left-1/2 -translate-x-1/2 text-white font-bold px-5 py-2 rounded shadow-lg text-sm max-w-[80%] text-center"
      style={{ background: TOAST_BG[kind] }}
    >
      {children}
    </div>
  );
}

function PopupNotification() {
  return (
    <div className="absolute top-4 left-1/2 -translate-x-1/2 popup-shake">
      <div
        className="rounded-lg shadow-xl px-5 py-3 text-white border-2 popup-pulse"
        style={{ background: '#c8102e', borderColor: '#7a0a1c', minWidth: 260, textAlign: 'center' }}
      >
        <div className="font-bold">{POPUP_HEADER}</div>
        <div className="text-sm opacity-95">{POPUP_BODY}</div>
      </div>
    </div>
  );
}

function HarmlessSheet({ msg }: { msg: string }) {
  return (
    <div
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white text-vv-text border-2 border-vv-text rounded-lg shadow-2xl px-6 py-5 max-w-md"
      style={{ zIndex: 20 }}
    >
      <div className="text-xs uppercase tracking-wider text-vv-text-soft mb-2">📱 Innboks</div>
      <div className="text-base">{msg}</div>
      <div className="text-xs text-vv-text-soft mt-3">Lukk: vent et øyeblikk…</div>
    </div>
  );
}

function Hud({
  lives, fines, blinker, speed, mapOpen, refueled,
}: {
  lives: number; fines: number; blinker: 'left' | 'right' | null;
  speed: number; mapOpen: boolean; refueled: boolean;
}) {
  return (
    <>
      <div className="absolute top-3 left-3 flex flex-col gap-1 select-none">
        <div className="flex gap-1 text-2xl">
          {[0, 1, 2].map((i) => (
            <span key={i} style={{ color: i < lives ? '#ff3344' : '#444' }}>♥</span>
          ))}
        </div>
        <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs font-mono flex items-center gap-1">
          <span style={{ color: refueled ? '#22d04a' : '#ffd23a' }}>⛽</span>
          {refueled ? 'Tanken full' : 'Trenger tank'}
        </div>
        {fines > 0 && (
          <div className="bg-black/60 text-white px-2 py-0.5 rounded text-xs font-mono">
            Bøter: {fines.toLocaleString('no-NO')} kr
          </div>
        )}
      </div>
      <div className="absolute top-3 right-3 flex gap-2 select-none font-mono">
        <span className="px-2 py-1 rounded text-sm" style={{
          background: blinker === 'left' ? '#ffd23a' : '#222',
          color: blinker === 'left' ? '#000' : '#888',
        }}>← Q</span>
        <span className="px-2 py-1 rounded text-sm" style={{
          background: blinker === 'right' ? '#ffd23a' : '#222',
          color: blinker === 'right' ? '#000' : '#888',
        }}>W →</span>
      </div>
      <div className="absolute bottom-3 right-3 text-white font-mono text-sm bg-black/60 px-2 py-1 rounded">
        {speed} km/t
      </div>
      {!mapOpen && (
        <div className="absolute bottom-3 left-3 text-white/70 font-mono text-xs">
          M for kart
        </div>
      )}
    </>
  );
}
