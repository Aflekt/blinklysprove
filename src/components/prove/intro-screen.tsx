import { useState } from "react";
import { Button } from "@/components/base/button";
import { Input, Label } from "@/components/base/input";
import { Card, Lead } from "@/components/ui/card";

interface Props {
  onStart(name: string): void;
}

export function IntroScreen({ onStart }: Props) {
  const [name, setName] = useState("");
  return (
    <Card>
      <h2>Obligatorisk blinklysprøve</h2>
      <Lead>
        Alle førere av motorvogn er pålagt å gjennomføre en sertifisert blinklysprøve i henhold til forskrift om
        førerkompetanse §3-1.
      </Lead>
      <p>
        Prøven består av ti (10) standardiserte kjøresituasjoner. Kandidaten skal demonstrere korrekt bruk av
        retningsangivere i henhold til vegtrafikkloven §11. Manglende beståelse kan medføre revurdering av førerkortets
        gyldighet.
      </p>

      <h3>Personalia</h3>
      <Label htmlFor="playerName">Fullt navn</Label>
      <Input
        id="playerName"
        placeholder="Skriv inn fullt navn"
        maxLength={40}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mt-6">
        <Button onClick={() => onStart(name.trim())}>Start blinklysprøven</Button>
      </div>
    </Card>
  );
}
