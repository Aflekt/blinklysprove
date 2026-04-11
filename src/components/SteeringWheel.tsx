import type { Side } from '../types';

interface Props {
  onSteer(side: Side): void;
  active?: Side | null;
}

export function SteeringWheel({ onSteer, active }: Props) {
  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    onSteer(x < rect.width / 2 ? 'left' : 'right');
  };
  const rotation = active === 'left' ? '-rotate-[32deg]' : active === 'right' ? 'rotate-[32deg]' : 'rotate-0';
  return (
    <div className="flex flex-col items-center justify-center shrink-0 gap-1.5">
      <div className="text-white text-[11px] font-bold tracking-widest uppercase">RATT</div>
      <div
        className={`relative w-24 h-24 rounded-full border-[9px] border-white bg-[#2f3a40] cursor-pointer select-none transition-transform duration-300 ${rotation}`}
        onClick={handleClick}
      >
        <div className="absolute top-1/2 left-[10%] w-[80%] h-[7px] bg-white rounded-sm -translate-y-1/2"></div>
        <div className="absolute bottom-[10%] left-1/2 w-[7px] h-[38%] bg-white rounded-sm -translate-x-1/2"></div>
        <div className="absolute top-1/2 left-1/2 w-6 h-6 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      </div>
    </div>
  );
}
