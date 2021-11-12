import Phaser from "phaser";
import { GridEngine } from "grid-engine";

import BootScene from "./scenes/BootScene";
import GameScene from "./scenes/GameScene";
import TitleScene from "./scenes/TitleScene";
import UIScene from "./scenes/UIScene";
import BigHouseScene from "./scenes/BigHouseScene";
import MediumHouseScene from "./scenes/MediumHouseScene";
import SmallHouseScene from "./scenes/SmallHouseScene";

declare global {
  interface Window {
    game: Phaser.Game;
  }
}

const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  width: 1280,
  height: 720,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [
    BootScene,
    TitleScene,
    GameScene,
    UIScene,
    BigHouseScene,
    MediumHouseScene,
    SmallHouseScene,
  ],
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

export default class Game extends Phaser.Game {
  constructor(config: Phaser.Types.Core.GameConfig) {
    super(config);
  }
}

window.onload = (): void => {
  window.game = new Game(gameConfig);
};
