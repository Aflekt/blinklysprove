import { useState } from "react";
import { CARS, type CarConfig } from "../game/cars";
import type { CarId } from "../types";

interface Props {
  onPick(id: CarId): void;
}

export function CarSelectScreen({ onPick }: Props) {
  const [hover, setHover] = useState<CarId | null>(null);

  return (
    <div className="vv-card">
      <h2>Velg kjøretøy</h2>
      <p className="vv-lead">
        Hver bil har sine egne kvaliteter. Velg klokt — eller velg det som passer din kjøreatferd.
      </p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
        {CARS.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => onPick(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            className="text-left border-2 border-vv-border rounded p-4 bg-white hover:border-vv-text transition-colors"
            style={{
              boxShadow: hover === c.id ? "0 0 0 3px #444f55" : "none",
            }}
          >
            <CarPreview car={c} />
            <div className="font-bold text-vv-text mt-3">{c.name}</div>
            <div className="text-sm text-vv-text-soft mt-1">{c.blurb}</div>
            <Tags car={c} />
          </button>
        ))}
      </div>
    </div>
  );
}

function CarPreview({ car }: { car: CarConfig }) {
  return (
    <div className="h-20 flex items-center justify-center bg-vv-light rounded">
      <svg width="76" height="46" viewBox="-38 -22 76 44" aria-hidden="true">
        <rect x="-19" y="-11" width="38" height="22" fill={car.body} stroke="#222" strokeWidth="1" />
        <rect x="-11" y="-8" width="22" height="16" fill={car.roof} />
        <rect x="7" y="-7" width="4" height="14" fill="#243038" />
      </svg>
    </div>
  );
}

function Tags({ car }: { car: CarConfig }) {
  const tags: string[] = [];
  if (car.physics?.MAX_FWD && car.physics.MAX_FWD > 280) tags.push("Høy toppfart");
  if (car.physics?.MAX_FWD && car.physics.MAX_FWD < 220) tags.push("Tregere");
  if (car.quirks?.instantTopSpeed) tags.push("Instant fart");
  if (car.quirks?.blinkerFlipped) tags.push("Blinker omvendt");
  if (car.lives && car.lives > 3) tags.push(`+${car.lives - 3} liv`);
  if (!tags.length) tags.push("Standard");
  return (
    <div className="flex flex-wrap gap-1 mt-2">
      {tags.map((t) => (
        <span key={t} className="text-xs px-2 py-0.5 bg-vv-cream border border-vv-border rounded">
          {t}
        </span>
      ))}
    </div>
  );
}
