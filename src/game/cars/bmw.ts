import type { CarConfig } from "./types";

// BMW = kjører i 300 km/t. Sjåføren mener fartsgrenser er veiledende.
export const BMW: CarConfig = {
  id: "bmw",
  name: "BMW 320d",
  blurb: "Sølvgrå metallic. Topphastighet 380 km/t. Fartsgrenser er veiledende.",
  body: "#7f8a90",
  roof: "#4d555a",
  physics: { MAX_FWD: 460, ACCEL: 360 },
};
