import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const les = (sti: string) => readFileSync(join(process.cwd(), sti), "utf8");

// Tailwind 4 setter `translate` som egen CSS-egenskap. Får popupen både -translate-x-1/2 og
// risteanimasjonen (som setter transform), blir den forskjøvet dobbelt og havner utenfor midten.
describe("popupen med «1 ulest melding»", () => {
  it("sentreres bare av animasjonen, ikke i tillegg av en translate-klasse", () => {
    const linje = les("src/components/prove/game-screen.tsx")
      .split("\n")
      .find((l) => l.includes("popup-shake"));
    expect(linje).toBeDefined();
    expect(linje).toContain("left-1/2");
    expect(linje).not.toMatch(/translate/);
  });

  it("starter og slutter risten midt på (translate(-50%, 0))", () => {
    const css = les("src/styles/globals.css");
    const keyframes = css.slice(css.indexOf("@keyframes popup-shake"), css.indexOf(".popup-shake"));
    expect(keyframes).toMatch(/0%,\s*100% \{\s*transform: translate\(-50%, 0\)/);
  });
});
