// @vitest-environment jsdom
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it } from "vitest";
import { App } from "@/App";
import { CARS } from "@/game/cars";
import { loseLife, store } from "@/state/store";

beforeEach(() => {
  store.reset();
  store.set({ screen: "intro", playerName: "Sjåfør" });
});

describe("starten av prøven", () => {
  it("tar vare på navnet og går videre til bilvalget med alle bilene", async () => {
    const bruker = userEvent.setup();
    render(<App />);

    await bruker.type(screen.getByLabelText("Fullt navn"), "  Kari Testesen  ");
    await bruker.click(screen.getByRole("button", { name: "Start blinklysprøven" }));

    expect(screen.getByRole("heading", { name: "Velg kjøretøy" })).toBeTruthy();
    expect(store.get().playerName).toBe("Kari Testesen");
    for (const bil of CARS) expect(screen.getByText(bil.name)).toBeTruthy();
  });

  it("beholder standardnavnet når feltet er tomt", async () => {
    const bruker = userEvent.setup();
    render(<App />);

    await bruker.click(screen.getByRole("button", { name: "Start blinklysprøven" }));

    expect(store.get().playerName).toBe("Sjåfør");
  });
});

describe("liv og game over", () => {
  it("går til game over med grunnen når siste liv er brukt", () => {
    store.set({ lives: 2, screen: "game" });

    loseLife("Kjørte på rødt lys.");
    expect(store.get()).toMatchObject({ lives: 1, totalErrors: 1, screen: "game" });

    loseLife("Kjørte på rødt lys.");
    expect(store.get()).toMatchObject({
      lives: 0,
      totalErrors: 2,
      screen: "gameOver",
      gameOverReason: "Kjørte på rødt lys.",
    });
  });
});
