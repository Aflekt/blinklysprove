import { describe, expect, it } from "vitest";
import { evaluateMapKey, makeRulesState, tickRules } from "@/game/rules";
import { BENSIN, PARKING_AREA, REMA, ROADS } from "@/game/world";
import type { Player } from "@/types";

const spiller = (over: Partial<Player> = {}): Player => ({
  pos: { x: 0, y: 0 },
  heading: 0,
  speed: 0,
  blinker: null,
  blinkerSetAt: 0,
  ...over,
});

const midtI = (r: { x: number; y: number; w: number; h: number }) => ({ x: r.x + r.w / 2, y: r.y + r.h / 2 });

describe("parkeringen (§ 14)", () => {
  it("gir avvik når du kjører ut uten å blinke", () => {
    const p = spiller({ pos: midtI(PARKING_AREA) });
    const state = makeRulesState(p);
    p.pos = { x: PARKING_AREA.x - 50, y: PARKING_AREA.y + PARKING_AREA.h / 2 };
    tickRules(state, p, 0, 1 / 60);
    expect(state.pending?.kind).toBe("violation");
    expect(state.pending?.msg).toMatch(/§ 14/);
  });

  it("godtar utkjøring med venstreblink", () => {
    const p = spiller({ pos: midtI(PARKING_AREA) });
    const state = makeRulesState(p);
    p.blinker = "left";
    p.pos = { x: PARKING_AREA.x - 50, y: PARKING_AREA.y + PARKING_AREA.h / 2 };
    tickRules(state, p, 0, 1 / 60);
    expect(state.pending).toBeNull();
  });
});

describe("tanking og butikken", () => {
  it("sender deg til bensinstasjonen hvis du kommer til Rema uten å ha tanket", () => {
    const p = spiller({ pos: midtI(REMA.trigger) });
    const state = makeRulesState(spiller({ pos: { x: -1000, y: -1000 } }));
    tickRules(state, p, 0, 1 / 60);
    expect(state.reachedShop).toBe(false);
    expect(state.pending?.msg).toMatch(/tanke/);
  });

  it("lar deg vinne når du har tanket først", () => {
    const state = makeRulesState(spiller({ pos: { x: -1000, y: -1000 } }));
    tickRules(state, spiller({ pos: midtI(BENSIN.trigger) }), 0, 1 / 60);
    expect(state.refueled).toBe(true);
    state.pending = null;

    tickRules(state, spiller({ pos: midtI(REMA.trigger) }), 1, 1 / 60);
    expect(state.reachedShop).toBe(true);
  });
});

describe("feil side av veien", () => {
  // Første vei er den nord-sør-gående veien fra startpunktet. Høyrekjøring: nordover skal du ligge i østre felt.
  const vei = ROADS[0];
  const y = vei.y + vei.h - 300;
  const nordover = -Math.PI / 2;

  const kjør = (x: number, sekunder: number) => {
    const p = spiller({ pos: { x, y }, heading: nordover, speed: 100 });
    const state = makeRulesState(p);
    for (let t = 0; t < sekunder; t += 0.1) tickRules(state, p, t, 0.1);
    return state;
  };

  it("gir bot når du ligger i venstre felt lenger enn et øyeblikk", () => {
    const state = kjør(vei.x + vei.w * 0.25, 1.5);
    expect(state.pending?.kind).toBe("fine");
    expect(state.pending?.amount).toBe(5000);
  });

  it("gir ikke bot for et kort øyeblikk i feil felt", () => {
    expect(kjør(vei.x + vei.w * 0.25, 0.5).pending).toBeNull();
  });

  it("gir ikke bot i riktig felt", () => {
    expect(kjør(vei.x + vei.w * 0.75, 3).pending).toBeNull();
  });
});

describe("kartet", () => {
  it("åpner når bilen står stille, gir bot i fart, og lukker når det er åpent", () => {
    expect(evaluateMapKey(spiller({ speed: 0 }), false)).toBe("open");
    expect(evaluateMapKey(spiller({ speed: 40 }), false)).toBe("fineMoving");
    expect(evaluateMapKey(spiller({ speed: 40 }), true)).toBe("close");
  });
});
