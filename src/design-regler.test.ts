// Håndhever design-system-skillen: designverdier bor i src/styles/tokens.css, og komponenter
// styler med tokens og 4px-skalaen. Unntak skal bare krympe.
import { readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative } from "node:path";
import { describe, expect, it } from "vitest";

const SRC = join(process.cwd(), "src");

const UNNTAK: string[] = [
  // Selve kjøringen tegnes på canvas. Fargene der er ikke CSS og kan ikke bruke tokens.
  "game/cars/bmw.ts",
  "game/cars/caddy.ts",
  "game/cars/corolla.ts",
  "game/cars/focus.ts",
  "game/cars/tesla.ts",
  "game/cars/volvo.ts",
  "game/npcs/data.ts",
  "game/render/bensin.ts",
  "game/render/car.ts",
  "game/render/colors.ts",
  "game/render/crashOverlay.ts",
  "game/render/decoys.ts",
  "game/render/mapOverlay.ts",
  "game/render/npcs.ts",
  "game/render/parking.ts",
  "game/render/rema.ts",
  "game/render/roundabout.ts",
  "game/render/signs.ts",
  "game/render/trafficLights.ts",
];

const filer = (dir: string): string[] =>
  readdirSync(dir).flatMap((navn) => {
    const sti = join(dir, navn);
    if (statSync(sti).isDirectory()) return navn === "generated" ? [] : filer(sti);
    return /\.(tsx|ts|css)$/.test(navn) && !/\.(test|stories)\.tsx?$/.test(navn) && !navn.endsWith(".gen.ts")
      ? [sti]
      : [];
  });

const kandidater = filer(SRC)
  .map((sti) => relative(SRC, sti))
  .filter((sti) => !sti.startsWith("styles/") && !UNNTAK.includes(sti));

const brudd = (mønster: RegExp) => kandidater.filter((sti) => mønster.test(readFileSync(join(SRC, sti), "utf8")));

describe("design-regler", () => {
  it("har ingen hex- eller rgb-farger utenfor tokens", () => {
    expect(brudd(/["'\s:(]#(?:[0-9a-fA-F]{3}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|\brgba?\(/)).toEqual([]);
  });

  it("bruker ingen vilkårlige Tailwind-verdier", () => {
    expect(brudd(/\b[\w:-]+-\[(?:#|\d)[^\]]*\]/)).toEqual([]);
  });

  it("styrer mørk modus bare via tokens, ikke dark:-klasser", () => {
    expect(brudd(/["'\s`]dark:/)).toEqual([]);
  });
});
