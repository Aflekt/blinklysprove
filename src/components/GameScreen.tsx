import { useRef } from 'react';
import { useGameLoop } from '../canvas/useGameLoop';
import { useStore } from '../state/store';
import { Tally } from './Tally';
import { Dashboard } from './Dashboard';
import { ControlBar } from './ControlBar';
import type { CaseDef, CompletePayload } from '../types';

interface Props {
  caseDef: CaseDef;
  caseIndex: number;
  totalCases: number;
  onComplete(payload: CompletePayload): void;
}

export function GameScreen({ caseDef, caseIndex, totalCases, onComplete }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const playerName = useStore((s) => s.playerName);
  const { pressBlink, pressWheel, blinker } = useGameLoop(canvasRef, caseDef, onComplete);

  return (
    <div className="vv-card overflow-hidden p-0">
      <div className="bg-vv-text text-white px-6 py-4 flex justify-between items-center gap-4 flex-wrap">
        <div>
          <div className="text-xs uppercase tracking-wider opacity-80 mb-1">
            Sak {caseIndex + 1} av {totalCases}
          </div>
          <div className="text-base font-bold">{caseDef.title}</div>
        </div>
        <div className="text-xs uppercase tracking-wider">
          Fører: <b>{playerName}</b>
        </div>
      </div>
      <div className="bg-vv-light px-6 py-3 text-sm text-vv-text-soft border-b border-vv-border">
        <b>Blinklys:</b> piltast <b>←</b> / <b>→</b> eller knappene · <b>Sving:</b> trykk på rattet
        (eller piltast <b>↓</b>)
      </div>
      <Dashboard blinker={blinker} />
      <Tally />
      <div className="relative bg-black w-full aspect-[4/3] border border-vv-border">
        <canvas ref={canvasRef} className="w-full h-full block" />
      </div>
      <ControlBar blinker={blinker} onBlink={pressBlink} onWheel={pressWheel} />
    </div>
  );
}
