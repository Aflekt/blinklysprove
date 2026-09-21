import { useStore } from '../state/store';

interface Props {
  onRestart(): void;
}

export function GameOverScreen({ onRestart }: Props) {
  const reason = useStore((s) => s.gameOverReason);
  const fines = useStore((s) => s.fines);
  const errors = useStore((s) => s.totalErrors);
  const name = useStore((s) => s.playerName);
  return (
    <div className="vv-card">
      <h2>Du er ferdig, {name}.</h2>
      <p className="vv-lead">{reason || 'Du har mistet alle dine tre liv.'}</p>
      <div className="info-box info-box-danger">
        <p><b>Registrerte feil:</b> {errors}</p>
        <p><b>Bøter:</b> {fines.toLocaleString('no-NO')} kr</p>
      </div>
      <button className="vv-btn" onClick={onRestart}>Prøv igjen</button>
    </div>
  );
}
