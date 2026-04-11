import { useEffect, useRef } from 'react';
import { useStore } from '../state/store';
import { inferVehicle, isPremiumInferred, getReport } from '../utils/vehicleInference';
import { sfx } from '../audio/sounds';

declare global {
  interface Window { html2canvas?: (el: HTMLElement, opts?: object) => Promise<HTMLCanvasElement>; }
}

interface Props {
  onRestart(): void;
}

export function CertificateScreen({ onRestart }: Props) {
  const certRef = useRef<HTMLDivElement | null>(null);
  const playerName = useStore((s) => s.playerName);
  const failedCases = useStore((s) => s.failedCases);
  const ped = useStore((s) => s.killedPedestrians);
  const cyc = useStore((s) => s.injuredCyclists);
  const stroll = useStore((s) => s.destroyedStrollers);
  const rear = useStore((s) => s.rearEnded);
  const stats = useStore((s) => ({
    killedPedestrians: s.killedPedestrians,
    injuredCyclists: s.injuredCyclists,
    destroyedStrollers: s.destroyedStrollers,
    rearEnded: s.rearEnded,
    failedCases: s.failedCases,
    totalFailures: s.totalFailures,
    errors: s.errors,
    patternTooEarly: s.patternTooEarly,
    patternTooLate: s.patternTooLate,
    patternNoBlink: s.patternNoBlink,
    patternWrongSide: s.patternWrongSide,
  }));

  const vehicle = inferVehicle(stats);
  const premium = isPremiumInferred(vehicle);
  const adjustedErrors = stats.errors * (premium ? 2 : 1);

  let grade: string;
  if (adjustedErrors === 0) grade = 'A';
  else if (adjustedErrors <= 1) grade = 'B';
  else if (adjustedErrors <= 2) grade = 'C';
  else if (adjustedErrors <= 4) grade = 'D';
  else if (adjustedErrors <= 6) grade = 'E';
  else grade = 'F';

  const report = getReport(vehicle, stats, playerName);

  useEffect(() => {
    if (['A', 'B', 'C'].includes(grade)) {
      sfx.fanfare();
      launchConfetti();
    }
  }, [grade]);

  const handleDownload = () => {
    if (window.html2canvas && certRef.current) {
      window.html2canvas(certRef.current, { backgroundColor: '#fffdf5', scale: 2 }).then((canvas) => {
        const link = document.createElement('a');
        link.download = 'blinklysbevis.png';
        link.href = canvas.toDataURL('image/png');
        link.click();
      });
    }
  };

  return (
    <div className="vv-card">
      <h2>Prøven er fullført</h2>
      <p className="vv-lead">
        Du har gjennomført den obligatoriske blinklysprøven. Ditt offisielle kompetansebevis er
        utstedt nedenfor.
      </p>
      <div ref={certRef} className="bg-vv-cream border-2 border-vv-text p-12 text-center relative">
        <div className="text-5xl">🦁</div>
        <h2 className="text-2xl my-2 font-normal">Blinklysdirektoratets offisielle kompetansebevis</h2>
        <div className="text-xs text-vv-text-soft italic mb-6">
          Utstedt i henhold til forskrift om førerkompetanse §3-1
        </div>
        <div className="text-sm text-vv-text-soft">Tildeles herved</div>
        <div className="text-3xl my-4 border-b-2 border-vv-text inline-block px-8 pb-2">{playerName}</div>
        <div className="text-sm text-vv-text-soft">for gjennomført obligatorisk blinklysprøve med karakteren</div>
        <div className="inline-block my-6 px-8 py-4 border-4 border-vv-text text-6xl font-bold text-vv-text bg-white">
          {grade}
        </div>
        <div className="flex flex-wrap justify-around my-6 gap-3 text-xs text-vv-text-soft">
          <Stat n={failedCases} label="saker ikke bestått" />
          <Stat n={ped} label="drepte fotgjengere" />
          <Stat n={cyc} label="skadde syklister" />
          <Stat n={stroll} label="ødelagte barnevogner" />
          <Stat n={rear} label="påkjørsler bakfra" />
        </div>
        <div className="mt-8 flex justify-between items-end flex-wrap gap-5">
          <div className="font-[Brush_Script_MT] text-2xl border-t border-vv-text pt-1 min-w-[220px] text-vv-text">
            H. Blinklys
            <div className="font-vv text-[11px] text-vv-text-soft">Direktør, Statens Blinklysdirektorat</div>
          </div>
          <div className="border-[3px] border-vv-danger text-vv-danger font-bold p-3 rounded-full -rotate-12 text-[10px] w-28 h-28 flex items-center justify-center text-center leading-tight uppercase tracking-wide">
            Statens<br />Blinklys-<br />direktorat<br />OFFISIELT
          </div>
        </div>
      </div>
      <div className="text-center mt-5">
        <button className="vv-btn" onClick={handleDownload}>Last ned bevis som bilde</button>
        <button className="vv-btn vv-btn-secondary" onClick={onRestart}>Ta prøven på nytt</button>
      </div>

      {/* Vehicle Analysis Report */}
      <div className="mt-9 p-8 bg-gray-50 border border-vv-border font-mono">
        <h3 className="text-base text-vv-text border-b-2 border-vv-text pb-2 mb-4">
          § Kjøreanalyse – automatisk generert av Statens blinklysdirektorat
        </h3>
        <div className="text-sm leading-relaxed text-gray-800">
          {report.paragraphs.map((p, i) => (
            <p key={i} className="mb-3">
              <b className="text-vv-text">§{i + 1}.</b>{' '}
              <span dangerouslySetInnerHTML={{ __html: p }} />
            </p>
          ))}
          {premium && (
            <p className="mt-4 px-4 py-3 bg-white border-l-4 border-vv-danger font-bold">
              Merknad: Eierskap av {vehicle === 'bmw' ? 'BMW' : 'Tesla'} har medført at alle feil
              ble talt dobbelt i karakterberegningen, jf. forskrift §14-2b.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

function Stat({ n, label }: { n: number; label: string }) {
  return (
    <div className="px-3">
      <b className="block text-xl text-vv-text font-bold">{n}</b>
      {label}
    </div>
  );
}

function launchConfetti() {
  const colors = ['#0062ba', '#ffd520', '#c8102e', '#047857', '#1a1a1a'];
  for (let i = 0; i < 80; i++) {
    const el = document.createElement('div');
    el.className = 'confetti-piece';
    el.style.left = (Math.random() * 100) + 'vw';
    el.style.background = colors[Math.floor(Math.random() * colors.length)];
    el.style.transform = `rotate(${Math.random() * 360}deg)`;
    document.body.appendChild(el);
    const dur = 2500 + Math.random() * 2000;
    el.animate(
      [
        { transform: `translateY(0) rotate(0deg)` },
        { transform: `translateY(110vh) rotate(${720 + Math.random() * 360}deg)` },
      ],
      { duration: dur, easing: 'cubic-bezier(.2,.6,.4,1)' },
    );
    setTimeout(() => el.remove(), dur);
  }
}
