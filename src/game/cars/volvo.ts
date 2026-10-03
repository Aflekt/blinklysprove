import type { CarConfig } from "./types";

// Volvo = ekstra trygg. Du får 4 liv, men bilen er treg.
export const VOLVO: CarConfig = {
  id: "volvo",
  name: "Volvo V70",
  blurb: "Mørkeblå, 2004. Lukter våt hund. Tregere, men du får 4 liv.",
  body: "#27384d",
  roof: "#152233",
  physics: { MAX_FWD: 180, ACCEL: 180, BRAKE: 480 },
  lives: 4,
};
