import type { Side } from '../types';

interface Props {
  blinker: Side | null;
}

/** Dashboard "blinker indicator" — green arrows that light up when the blinker is on. */
export function Dashboard({ blinker }: Props) {
  return (
    <div className="flex items-center justify-center gap-6 bg-[#1a1a1a] py-2 px-6 border-b border-vv-border">
      <div
        className={
          'w-10 h-7 border-2 rounded flex items-center justify-center text-lg transition-all ' +
          (blinker === 'left'
            ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_#22c55e]'
            : 'border-gray-600 text-gray-600')
        }
      >
        ◄
      </div>
      <div className="text-gray-500 text-xs font-bold tracking-widest">BLINKLYS</div>
      <div
        className={
          'w-10 h-7 border-2 rounded flex items-center justify-center text-lg transition-all ' +
          (blinker === 'right'
            ? 'bg-green-500 border-green-500 text-white shadow-[0_0_12px_#22c55e]'
            : 'border-gray-600 text-gray-600')
        }
      >
        ►
      </div>
    </div>
  );
}
