import { Types, AUTO, Scale, Game as PhaserGame } from "phaser";
import React from "react";
import { createRoot } from "react-dom/client";

import { GridEngine } from "grid-engine";

import BootScene from "./scenes/BootScene";
import TitleScene from "./scenes/TitleScene";
import WorldScene from "./scenes/WorldScene";
import BattleScene from "./scenes/BattleScene";
import { GAME_HEIGHT, GAME_WIDTH } from "./constants/game";
import { UI } from "./ui/UI";

const gameConfig: Types.Core.GameConfig = {
  parent: "game",
  type: AUTO,
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  scale: {
    mode: Scale.FIT,
    autoCenter: Scale.CENTER_BOTH,
  },
  scene: [BootScene, TitleScene, WorldScene, BattleScene],
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
};

export default class Game extends PhaserGame {
  constructor(config: Types.Core.GameConfig) {
    super(config);
  }
}

export const GameComponent = () => {
  const game = new Game(gameConfig);

  return (
    <>
      <UI game={game} />
      <div id="game" />
    </>
  );
};

const rootElement = document.getElementById("root");

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(<GameComponent />);
} else {
  throw new Error("Root element not found");
}
