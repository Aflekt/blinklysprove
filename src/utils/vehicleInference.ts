// Infers a "vehicle personality" from the player's failure pattern.
// Some inferred vehicles (BMW, Tesla) trigger a doubled error penalty in grading.
import type { Stats } from '../types';

export type VehicleId = 'corolla' | 'bmw' | 'tesla' | 'caddy' | 'volvo' | 'focus';

export function inferVehicle(stats: Stats): VehicleId {
  const { totalFailures, patternNoBlink, patternTooLate, patternWrongSide,
          rearEnded, injuredCyclists } = stats;
  if (totalFailures === 0) return 'corolla';
  if (patternNoBlink >= 3) return 'tesla';
  if (patternNoBlink >= 2 && patternTooLate >= 1) return 'bmw';
  if (patternWrongSide >= 2) return 'caddy';
  if (rearEnded >= 1 && injuredCyclists >= 1) return 'volvo';
  return 'focus';
}

export function isPremiumInferred(vehicle: VehicleId): boolean {
  return vehicle === 'bmw' || vehicle === 'tesla';
}

interface ReportFn {
  (s: Stats): { label: string; paragraphs: (name: string) => string[] };
}

const REPORTS: Record<VehicleId, ReportFn> = {
  corolla: (s) => ({
    label: 'Toyota Corolla 1.6, mest sannsynlig hvit eller sølvgrå, årsmodell 2013',
    paragraphs: (name) => [
      `Sjåfør <b>${name}</b> har gjennomført prøven uten registrerte avvik. Dette er statistisk sett svært uvanlig og systemet er usikkert på om dette er en feil i datagrunnlaget eller et faktisk tilfelle av kompetanse.`,
      `Kjøremønsteret er konsistent med eierskap av en <b>Toyota Corolla 1.6, mest sannsynlig hvit eller sølvgrå, årsmodell 2013</b>. Vedkommende har sannsynligvis en tykk velkomstmatte, bruker fartsholder under 75 km/t og holder seg til høyre felt uten unntak.`,
      `Det antas at ${name} har en handleliste i bagasjerommet og alltid vet hvor de har parkeringskvitteringen. Dette er beundringsverdig, men kjedelig.`,
      `Konklusjon: Ingen tiltak anbefales. Vedkommende bør imidlertid oppfordres til å slappe av av og til.`,
    ],
  }),
  bmw: (s) => ({
    label: 'BMW 320d, sølvgrå metallic, årsmodell 2017–2019',
    paragraphs: (name) => [
      `Basert på <b>${s.totalFailures}</b> registrerte hendelser og <b>${s.killedPedestrians}</b> drepte fotgjengere har systemet konkludert med følgende om sjåfør <b>${name}</b>:`,
      `Sjåføren viser et kjøremønster konsistent med eierskap av en <b>BMW 320d, sølvgrå metallic, årsmodell 2017–2019</b>. Vedkommende har antagelig "senior", "lead" eller "head of" i stillingstittelen sin, og mener fartsgrenser er veiledende anbefalinger for andre.`,
      `Det er registrert <b>${s.patternNoBlink}</b> tilfeller av manglende blinklysbruk, noe som er imponerende selv etter norsk standard. Vedkommende skifter fil som om de har forkjørsrett på en flyplassrullebane.`,
      `§ Konklusjon: Tilbakekall av førerrett anbefales. Vennligst lever inn lappen på nærmeste lensmannskontor. ${name}, vi vet hvor du bor.`,
    ],
  }),
  tesla: (s) => ({
    label: 'Tesla Model 3 Long Range, hvit, med ripete nummerskilt',
    paragraphs: (name) => [
      `Sjåfør <b>${name}</b> har under prøven vist et kjøremønster konsistent med eierskap av en <b>Tesla Model 3 Long Range, hvit, med ripete nummerskilt</b>.`,
      `Vedkommende tror at autopiloten tar seg av blinklys. Den gjør ikke det. Vedkommende tror også at autopiloten ser fotgjengere. Den gjør ikke alltid det heller.`,
      `Det er registrert <b>${s.patternNoBlink}</b> manøvere uten blinklys, og <b>${s.killedPedestrians + s.injuredCyclists}</b> menneskelige skjebner som kunne vært unngått med en enkel fingerbevegelse. Dette er en ny norsk rekord.`,
      `§ Konklusjon: Kjøretøyet beholdes, men Elon Musk er personlig varslet. ${name} oppfordres til å selge bilen og kjøpe et elsykkel. Med hjelm.`,
    ],
  }),
  caddy: (s) => ({
    label: 'Volkswagen Caddy varebil, hvit, med firmalogo på siden',
    paragraphs: (name) => [
      `Sjåfør <b>${name}</b> blinket konsekvent i feil retning (<b>${s.patternWrongSide}</b> tilfeller). Dette tyder på en grunnleggende forvirring om hva som er høyre og hva som er venstre.`,
      `Kjøremønsteret er konsistent med eierskap av en <b>Volkswagen Caddy varebil, hvit, med firmalogo på siden</b>. Vedkommende har sannsynligvis yrkesfagutdanning, bruker Red Bull som frokost, og kaller alle andre trafikanter for "idioter" mens de selv blinker i feil retning.`,
      `Bagasjerommet inneholder etter all sannsynlighet en halvtom pose med chips, to skrutrekkere, og en kaffekopp fra Circle K fra tirsdag forrige uke.`,
      `§ Konklusjon: ${name} bør vurdere å ta et kurs i grunnleggende romforståelse. Eller bytte yrke.`,
    ],
  }),
  volvo: (s) => ({
    label: 'Volvo V70, mørkeblå, årsmodell 2004, med ripe i venstre bakdør',
    paragraphs: (name) => [
      `Sjåfør <b>${name}</b> har et kjøremønster konsistent med eierskap av en <b>Volvo V70, mørkeblå, årsmodell 2004, med ripe i venstre bakdør</b>. Bilen lukter av våt hund og gamle kvitteringer fra Rema 1000.`,
      `Det henger en vernet trebeskytter på speilet og bagasjerommet inneholder en sammenrullet skigard og et par turstøvler som ikke har vært ute av bilen siden 2017.`,
      `Med <b>${s.totalFailures}</b> feil, <b>${s.killedPedestrians}</b> drepte fotgjengere og <b>${s.injuredCyclists}</b> skadde syklister, har sjåføren bekreftet det klassiske Volvo-paradokset: utrolig trygg bil, forferdelig fører.`,
      `§ Konklusjon: ${name} bør fortsette å kjøre Volvo. Bilen vil fortsette å overleve uansett hva ${name} gjør med den.`,
    ],
  }),
  focus: (s) => ({
    label: 'Ford Focus, mørkegrønn, årsmodell 2011, med aux-kabel i hanskerommet',
    paragraphs: (name) => [
      `Sjåfør <b>${name}</b> har produsert <b>${s.totalFailures}</b> feil, <b>${s.killedPedestrians}</b> drepte fotgjengere, <b>${s.injuredCyclists}</b> skadde syklister og <b>${s.destroyedStrollers}</b> ødelagte barnevogner.`,
      `Dette kjøremønsteret er konsistent med eierskap av en <b>Ford Focus, mørkegrønn, årsmodell 2011, med aux-kabel i hanskerommet</b>. Vedkommende har spillelister med navn som "Tur ☀️" og bruker begrepet "koselig" ukritisk.`,
      `Rattet er bare holdt med én hånd. Den andre holder en kaffekopp som aldri blir drukket opp.`,
      `§ Konklusjon: ${name} bør ta bussen oftere. Samfunnet vil takke deg.`,
    ],
  }),
};

export function getReport(vehicle: VehicleId, stats: Stats, name: string) {
  const fn = REPORTS[vehicle] || REPORTS.focus;
  const r = fn(stats);
  return { vehicleLabel: r.label, paragraphs: r.paragraphs(name) };
}
