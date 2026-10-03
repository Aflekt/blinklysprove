import { Container } from "@/components/layout/container";
import { Footer } from "@/components/navigation/footer";
import { Header } from "@/components/navigation/header";
import { CarSelectScreen } from "@/components/prove/car-select-screen";
import { GameOverScreen } from "@/components/prove/game-over-screen";
import { GameScreen } from "@/components/prove/game-screen";
import { IntroScreen } from "@/components/prove/intro-screen";
import { WonScreen } from "@/components/prove/won-screen";
import { CAR_BY_ID } from "@/game/cars";
import { store, useStore } from "@/state/store";
import type { CarId } from "@/types";

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
      <Container as="main" className="py-8">
        {screen === "intro" && <IntroScreen onStart={handleStart} />}
        {screen === "select" && <CarSelectScreen onPick={handlePickCar} />}
        {screen === "game" && <GameScreen />}
        {screen === "gameOver" && <GameOverScreen onRestart={handleRestart} />}
        {screen === "won" && <WonScreen onRestart={handleRestart} />}
      </Container>
      <Footer />
    </>
  );
}
