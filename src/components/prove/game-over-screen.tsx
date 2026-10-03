import { Button } from "@/components/base/button";
import { Card, Lead } from "@/components/ui/card";
import { useStore } from "@/state/store";

interface Props {
  onRestart(): void;
}

export function GameOverScreen({ onRestart }: Props) {
  const reason = useStore((s) => s.gameOverReason);
  const fines = useStore((s) => s.fines);
  const errors = useStore((s) => s.totalErrors);
  const name = useStore((s) => s.playerName);
  return (
    <Card>
      <h2>Du er ferdig, {name}.</h2>
      <Lead>{reason || "Du har mistet alle dine tre liv."}</Lead>
      <div className="info-box info-box-danger">
        <p>
          <b>Registrerte feil:</b> {errors}
        </p>
        <p>
          <b>Bøter:</b> {fines.toLocaleString("no-NO")} kr
        </p>
      </div>
      <Button onClick={onRestart}>Prøv igjen</Button>
    </Card>
  );
}
