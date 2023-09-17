import { useEffect, useState } from "react";
import ReactDOM from "react-dom/client";

import { GridEngine } from "grid-engine";
import { AUTO, Scale, Game as PhaserGame } from "phaser";

import { UI } from "./ui/UI";
import BootScene from "./scenes/BootScene";
import WorldScene from "./scenes/WorldScene";
import BattleScene from "./scenes/BattleScene";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants/game";

import "./styles.css";
import { Loading } from "./ui/components/Loading";
import { useUIStore } from "./stores/ui";

export const GameComponent = () => {
  const [game, setGame] = useState<PhaserGame>(null);
  const { loading } = useUIStore();

  useEffect(() => {
    setGame(
      new PhaserGame({
        parent: "game",
        type: AUTO,
        width: GAME_WIDTH,
        height: GAME_HEIGHT,
        scale: {
          mode: Scale.FIT,
          autoCenter: Scale.CENTER_BOTH,
        },
        scene: [BootScene, WorldScene, BattleScene],
        physics: {
          default: "arcade",
          arcade: {
            gravity: { y: 0 },
            debug: true,
          },
        },
        plugins: {
          scene: [
            {
              key: "gridEngine",
              plugin: GridEngine,
              mapping: "gridEngine",
            },
          ],
        },
        pixelArt: true,
      }),
    );
  }, []);

  if (!game) {
    return null;
  }

  return (
    <>
      {loading && <Loading />}
      <UI game={game} />
      <div id="game" />
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")!).render(<GameComponent />);
