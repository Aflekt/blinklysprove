import { useStore } from '../state/store';

interface Props {
  onRetry(): void;
  onNext(): void;
}

export function RevealScreen({ onRetry, onNext }: Props) {
  const c = useStore((s) => s.lastFailureCase);
  const playerName = useStore((s) => s.playerName);
  const totalFailures = useStore((s) => s.totalFailures);
  const message = useStore((s) => s.lastFailureMessage);

  const caseNumber = 'BD-' + (10000 + totalFailures * 131).toString().slice(0, 6);
  const date = new Date().toLocaleDateString('nb-NO');

  return (
    <div className="vv-card bg-[#0d0d0d] text-gray-300 font-mono border-2 border-[#3a3a3a] p-8">
      <div className="text-2xl font-bold text-white tracking-[0.2em] border-b border-gray-600 pb-3 mb-5">
        HENDELSESREKONSTRUKSJON
      </div>
      <div className="text-xs text-gray-500 mb-6 leading-relaxed">
        Saksnummer: {caseNumber}<br />
        Dato: {date}<br />
        Saksbehandler: pol.bet. R. Thoresen, Trafikkseksjonen
      </div>
      <Section title="1. Hendelsesbeskrivelse">
        <p>
          Kjøretøy registrert i manøver uten tilstrekkelig tegn eller varsling. Etterfølgende
          etterforskning avdekket følgende objekt i manøverområdet:
        </p>
        <p className="bg-[#1a1a1a] border-l-2 border-vv-danger px-4 py-3 text-white italic mt-2">
          {c?.revealText}
        </p>
      </Section>
      <Section title="2. Identifikasjon av fører">
        <p>Navn: <b className="text-white">{playerName}</b></p>
      </Section>
      <Section title="3. Saksbehandlers kommentar">
        <p className="text-red-400 font-bold">{message}</p>
      </Section>
      <Section title="4. Lovanvendelse">
        <p className="text-blue-300 text-xs">{c?.rule}</p>
      </Section>
      <div className="mt-6 flex gap-3 flex-wrap">
        <button className="vv-btn bg-vv-danger border-vv-danger" onClick={onRetry}>Prøv igjen</button>
        <button className="vv-btn bg-[#0d0d0d] text-white border-gray-600" onClick={onNext}>Neste oppgave</button>
      </div>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="my-5">
      <h3 className="text-xs font-bold text-white uppercase tracking-wider mb-2">{title}</h3>
      {children}
    </div>
  );
}
