import { CarSelectScreen } from "./components/CarSelectScreen";
import { Footer } from "./components/Footer";
import { GameOverScreen } from "./components/GameOverScreen";
import { GameScreen } from "./components/GameScreen";
import { Header } from "./components/Header";
import { IntroScreen } from "./components/IntroScreen";
import { WonScreen } from "./components/WonScreen";
import { CAR_BY_ID } from "./game/cars";
import { store, useStore } from "./state/store";
import type { CarId } from "./types";

export function App() {
  const screen = useStore((s) => s.screen);

  const handleStart = (name: string) => {
    if (name) store.set({ playerName: name });
    store.set({ screen: "select" });
  };

  const handlePickCar = (id: CarId) => {
    const car = CAR_BY_ID[id];
    store.set({
      selectedCar: id,
      screen: "game",
      lives: car.lives ?? 3,
      fines: 0,
      totalErrors: 0,
      gameOverReason: "",
    });
  };

  const handleRestart = () => {
    const name = store.get().playerName;
    store.reset();
    store.set({ screen: "intro", playerName: name });
  };

  return (
    <>
      <Header />
      <main className="max-w-5xl mx-auto px-8 py-8">
        {screen === "intro" && <IntroScreen onStart={handleStart} />}
        {screen === "select" && <CarSelectScreen onPick={handlePickCar} />}
        {screen === "game" && <GameScreen />}
        {screen === "gameOver" && <GameOverScreen onRestart={handleRestart} />}
        {screen === "won" && <WonScreen onRestart={handleRestart} />}
      </main>
      <Footer />
    </>
  );
}
