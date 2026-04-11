import { useStore } from '../state/store';

export function Tally() {
  const ped = useStore((s) => s.killedPedestrians);
  const cyc = useStore((s) => s.injuredCyclists);
  const stroll = useStore((s) => s.destroyedStrollers);
  const rear = useStore((s) => s.rearEnded);
  return (
    <div className="flex flex-wrap gap-x-6 gap-y-3 px-6 py-3 text-xs uppercase tracking-wide text-vv-text-soft border-b border-vv-border bg-gray-50">
      <span>Drepte fotgjengere: <b className="text-vv-text font-bold text-sm">{ped}</b></span>
      <span>Skadede syklister: <b className="text-vv-text font-bold text-sm">{cyc}</b></span>
      <span>Ødelagte barnevogner: <b className="text-vv-text font-bold text-sm">{stroll}</b></span>
      <span>Påkjørsler bakfra: <b className="text-vv-text font-bold text-sm">{rear}</b></span>
    </div>
  );
}
