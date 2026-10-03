import { useState } from "react";
import { Grid } from "@/components/layout/grid";
import { Inline } from "@/components/layout/stack";
import { Card, Lead } from "@/components/ui/card";
import { CARS, type CarConfig } from "@/game/cars";
import { COLORS } from "@/game/render/colors";
import { cn } from "@/lib/cn";
import type { CarId } from "@/types";

interface Props {
  onPick(id: CarId): void;
}

export function CarSelectScreen({ onPick }: Props) {
  const [hover, setHover] = useState<CarId | null>(null);

  return (
    <Card>
      <h2>Velg kjøretøy</h2>
      <Lead>Hver bil har sine egne kvaliteter. Velg klokt — eller velg det som passer din kjøreatferd.</Lead>

      <Grid cols={3} gap="s" className="mt-4">
        {CARS.map((c) => (
          <button
            type="button"
            key={c.id}
            onClick={() => onPick(c.id)}
            onMouseEnter={() => setHover(c.id)}
            onMouseLeave={() => setHover(null)}
            className={cn(
              "text-left border-2 border-border rounded-sm p-4 bg-white hover:border-primary transition-colors",
              hover === c.id && "ring-3 ring-primary",
            )}
          >
            <CarPreview car={c} />
            <div className="font-bold text-foreground mt-3">{c.name}</div>
            <div className="text-sm text-muted-foreground mt-1">{c.blurb}</div>
            <Tags car={c} />
          </button>
        ))}
      </Grid>
    </Card>
  );
}

function CarPreview({ car }: { car: CarConfig }) {
  return (
    <div className="h-20 flex items-center justify-center bg-muted rounded-sm">
      <svg width="76" height="46" viewBox="-38 -22 76 44" aria-hidden="true">
        <rect x="-19" y="-11" width="38" height="22" fill={car.body} stroke={COLORS.carOutline} strokeWidth="1" />
        <rect x="-11" y="-8" width="22" height="16" fill={car.roof} />
        <rect x="7" y="-7" width="4" height="14" fill={COLORS.carWindow} />
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
    <Inline gap="xxs" align="stretch" className="mt-2">
      {tags.map((t) => (
        <span key={t} className="text-xs px-2 py-0.5 bg-accent border border-border rounded-sm">
          {t}
        </span>
      ))}
    </Inline>
  );
}
