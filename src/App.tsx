import { useEffect } from 'react';
import { useStore, store, recordFailure } from './state/store';
import { CASES } from './cases';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { IntroScreen } from './components/IntroScreen';
import { GameScreen } from './components/GameScreen';
import { FailureScreen } from './components/FailureScreen';
import { RevealScreen } from './components/RevealScreen';
import { CertificateScreen } from './components/CertificateScreen';
import type { CompletePayload } from './types';
import { escalatedAbsurd } from './utils/tone';

export function App() {
  const screen = useStore((s) => s.screen);
  const caseIndex = useStore((s) => s.caseIndex);
  const totalFailures = useStore((s) => s.totalFailures);

  // Toggle the breakdown class on body once the bureaucrat has lost composure (4+ failures)
  useEffect(() => {
    if (totalFailures >= 4) document.body.classList.add('breakdown');
    else document.body.classList.remove('breakdown');
  }, [totalFailures]);

  const handleStart = (name: string) => {
    if (name) store.set({ playerName: name });
    store.set({ screen: 'game', caseIndex: 0 });
  };

  const handleCaseComplete = (payload: CompletePayload) => {
    const c = CASES[caseIndex];
    if (payload.outcome === 'success') {
      // Auto-advance straight to next case (no per-case success screen for now)
      goToNext();
      return;
    }
    // Failure: record the failure stats and route to either reveal or failure screen
    recordFailure(c, payload.crashReason ?? null);
    const message = escalatedAbsurd(c, store.get().playerName, store.get().totalFailures);
    store.set({
      lastFailureCase: c,
      lastFailureMessage: message,
      screen: c.darkCase || c.blindSpot ? 'reveal' : 'failure',
    });
  };

  const handleRetry = () => {
    store.set({ screen: 'game' });
  };

  const goToNext = () => {
    if (caseIndex + 1 >= CASES.length) {
      store.set({ screen: 'end' });
    } else {
      store.set({ caseIndex: caseIndex + 1, screen: 'game' });
    }
  };

  const handleRestart = () => {
    store.reset();
  };

  return (
    <>
      <Header />
      <main className="max-w-3xl mx-auto px-8 py-12">
        {screen === 'intro' && <IntroScreen onStart={handleStart} />}
        {screen === 'game' && (
          <GameScreen caseDef={CASES[caseIndex]} caseIndex={caseIndex} totalCases={CASES.length} onComplete={handleCaseComplete} />
        )}
        {screen === 'failure' && <FailureScreen onRetry={handleRetry} onNext={goToNext} />}
        {screen === 'reveal' && <RevealScreen onRetry={handleRetry} onNext={goToNext} />}
        {screen === 'end' && <CertificateScreen onRestart={handleRestart} />}
      </main>
      <Footer />
    </>
  );
}
