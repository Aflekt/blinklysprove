import { useStore } from '../state/store';

interface Props {
  onRetry(): void;
  onNext(): void;
}

export function FailureScreen({ onRetry, onNext }: Props) {
  const message = useStore((s) => s.lastFailureMessage);
  const c = useStore((s) => s.lastFailureCase);
  return (
    <div className="vv-card border-l-4 border-vv-danger pl-6">
      <h2 className="text-vv-danger">Sak ikke bestått</h2>
      <div className="absurd-block">{message}</div>
      <div className="info-box">
        <b>Offisiell regel:</b> {c?.rule}
      </div>
      <div className="mt-5">
        <button className="vv-btn" onClick={onRetry}>Prøv igjen</button>
        <button className="vv-btn vv-btn-secondary" onClick={onNext}>Neste oppgave</button>
      </div>
    </div>
  );
}
