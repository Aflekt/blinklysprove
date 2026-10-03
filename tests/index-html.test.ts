import { existsSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

const html = readFileSync(join(process.cwd(), "index.html"), "utf8");
const skript = [...html.matchAll(/<script[^>]*src="([^"]+)"/g)].map((m) => m[1]);

describe("index.html", () => {
  it("laster ingen skript fra andre domener (html2canvas lå på CDN uten å brukes)", () => {
    expect(skript.filter((src) => /^(https?:)?\/\//.test(src))).toEqual([]);
  });

  it("peker på inngangsfila som finnes (main.jsx ble main.tsx)", () => {
    const lokale = skript.filter((src) => src.startsWith("/"));
    expect(lokale).toEqual(["/src/main.tsx"]);
    for (const src of lokale) expect(existsSync(join(process.cwd(), src))).toBe(true);
  });
});
