# Blinklysprøven

Satirisk nettspill fra «Statens Blinklysdirektorat»: du kjører en åpen verden, blinker riktig, tanker og kommer deg til Rema 1000. Ren Vite + React-app uten backend, på Vercel (blinklysprove.vercel.app).

Følger felles prosjektstandard (`prosjektstandard`, `design-system`, `test`, `sikkerhet`). Her står bare det som er spesielt for dette repoet.

## Kommandoer

pnpm dev | lint | typecheck | test | build

## Miljøer

| Miljø | URL | Gren |
|---|---|---|
| Produksjon | https://blinklysprove.vercel.app (Vercel-prosjektet `blinklysprove`) | `main` |
| Forhåndsvisning | Vercel preview per gren | alle andre |

## Avvik fra standarden

- Spillogikken ligger i `src/game/` (verden, regler, fysikk, canvas-tegning) og ikke i `src/lib/`. Den har `index.ts`-filer som samler eksporter per område (`game/cars`, `game/world`, `game/render`, `game/npcs`).
- Fargene i selve kjøringen tegnes på canvas og ligger i `src/game/render/colors.ts` og i bildataene. De kan ikke bruke CSS-tokens, og står i unntakslista i `src/design-regler.test.ts`. HUD-en og popupen oppå spillet bruker tokens (`--hud-*`).
- Utseendet på skjemadelen ligger fortsatt i CSS-klassene `vv-card`, `vv-btn` og `vv-input` i `globals.css`. Komponentene `Button`, `Input` og `Label` (`base/`) og `Card` og `Lead` (`ui/`) bruker dem.
- Ingen miljøvariabler, derfor ingen `src/env.ts` eller `.env.example`.
- Ingen mørk modus.

## Domene

- Dette er satire. Statens Blinklysdirektorat finnes ikke, og spillet har ingen tilknytning til Statens vegvesen. Det skal stå i README.
- Reglene i `src/game/rules.ts` kjører hver frame og legger én hendelse om gangen i `pending` (avvik, bot eller info). Kjøreløkka i `useDriving.ts` tar den og trekker liv eller penger.
- Blinklyset må ha stått på i minst tre sekunder før du svinger, og veien må være klar.
- Biler med egne særtrekk (omvendt blinklys, ekstra liv, øyeblikkelig toppfart) står i `src/game/cars/`.
- Tailwind 4 setter `translate` som egen CSS-egenskap. Ikke kombiner `-translate-x-1/2` med `style={{ transform: ... }}` eller en animasjon som setter `transform`, da forskyves elementet dobbelt.

## Skills i dette repoet

Ingen.
