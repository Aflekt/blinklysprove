import { useState } from 'react';

interface Props {
  onStart(name: string): void;
}

export function IntroScreen({ onStart }: Props) {
  const [name, setName] = useState('');
  return (
    <div className="vv-card">
      <h2>Obligatorisk blinklysprøve</h2>
      <p className="vv-lead">
        Alle førere av motorvogn er pålagt å gjennomføre en sertifisert blinklysprøve i henhold til
        forskrift om førerkompetanse §3-1.
      </p>
      <p>
        Prøven består av ti (10) standardiserte kjøresituasjoner. Kandidaten skal demonstrere
        korrekt bruk av retningsangivere i henhold til vegtrafikkloven §11. Manglende beståelse kan
        medføre revurdering av førerkortets gyldighet.
      </p>

      <h3>Personalia</h3>
      <label className="vv-form-label" htmlFor="playerName">Fullt navn</label>
      <input
        id="playerName"
        className="vv-input"
        placeholder="Skriv inn fullt navn"
        maxLength={40}
        value={name}
        onChange={(e) => setName(e.target.value)}
      />

      <div className="mt-6">
        <button className="vv-btn" onClick={() => onStart(name.trim())}>
          Start blinklysprøven
        </button>
      </div>
    </div>
  );
}
