import type { Side } from '../types';
import { SteeringWheel } from './SteeringWheel';

interface Props {
  blinker: Side | null;
  onBlink(side: Side): void;
  onWheel(side: Side): void;
}

export function ControlBar({ blinker, onBlink, onWheel }: Props) {
  const btnBase =
    'flex-1 flex flex-col items-center justify-center gap-1 px-3.5 py-4 text-sm font-bold ' +
    'border-2 rounded font-vv cursor-pointer max-w-[200px] tracking-wide transition-colors';
  const inactive = 'bg-[#2f3a40] text-white border-[#6b757a] hover:bg-[#404a4f]';
  const active = 'bg-white text-vv-text border-white';

  return (
    <div className="flex bg-vv-text px-5 py-4 gap-4 items-center justify-center">
      <button
        className={`${btnBase} ${blinker === 'left' ? active : inactive}`}
        onClick={() => onBlink('left')}
      >
        <span className="text-3xl leading-none">←</span>
        <span>BLINKLYS</span>
      </button>
      <SteeringWheel onSteer={onWheel} active={blinker} />
      <button
        className={`${btnBase} ${blinker === 'right' ? active : inactive}`}
        onClick={() => onBlink('right')}
      >
        <span className="text-3xl leading-none">→</span>
        <span>BLINKLYS</span>
      </button>
    </div>
  );
}
