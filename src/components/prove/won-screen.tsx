import { Button } from "@/components/base/button";
import { Card, Lead } from "@/components/ui/card";
import { useStore } from "@/state/store";

interface Props {
  onRestart(): void;
}

export function WonScreen({ onRestart }: Props) {
  const name = useStore((s) => s.playerName);
  const errors = useStore((s) => s.totalErrors);
  const fines = useStore((s) => s.fines);
  const lives = useStore((s) => s.lives);

  return (
    <Card>
      <h2>Du nådde matbutikken, {name}!</h2>
      <Lead>
        Statens blinklysdirektorat gratulerer. Du har bevist at du kan navigere norsk infrastruktur uten å (helt) drepe
        noen.
      </Lead>
      <div className="info-box">
        <p>
          <b>Liv igjen:</b> {lives} av 3
        </p>
        <p>
          <b>Registrerte feil:</b> {errors}
        </p>
        <p>
          <b>Bøter:</b> {fines.toLocaleString("no-NO")} kr
        </p>
      </div>
      <Button onClick={onRestart}>Ny runde</Button>
    </Card>
  );
}
