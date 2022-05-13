import { playClick } from "../utils/audio";
import { useUIStore } from "../stores/ui";
import {
  triggerUINextStep,
  triggerUIExit,
  triggerUIDown,
  triggerUIUp,
  triggerUILeft,
  triggerUIRight,
} from "../utils/ui";

export default class BattleScene extends Phaser.Scene {
  constructor() {
    super("Battle");
  }

  create(): void {
    const background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "battle_background"
    );

    background.displayHeight = Number(this.game.config.height);
    background.scaleX = this.game.scale.canvas.width;
    background.y = Number(this.game.config.height) / 2;
    background.x = Number(this.game.config.width) / 2;

    const grass = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "battle_grass"
    );

    grass.displayHeight = Number(this.game.config.height);
    grass.scaleX = grass.scaleY;
    grass.y = Number(this.game.config.height) / 2;
    grass.x = Number(this.game.config.width) / 2;

    this.add.existing(background);
    this.add.existing(grass);

    useUIStore.getState().toggleBattle();
    this.listenKeyboardControl();
  }

  listenKeyboardControl(): void {
    this.input.keyboard.on("keyup", (event: KeyboardEvent) => {
      const uiStore = useUIStore.getState();
      const isOpen = uiStore.battle.isOpen;

      switch (event.key.toUpperCase()) {
        case "ENTER":
          if (isOpen) {
            playClick(this);
            triggerUINextStep();
          }

          break;
        case "ESCAPE":
          if (isOpen) {
            playClick(this);
            triggerUIExit();
          }

          break;
        case "ARROWDOWN":
          if (isOpen) {
            playClick(this);
            triggerUIDown();
          }
          break;
        case "ARROWUP":
          if (isOpen) {
            playClick(this);
            triggerUIUp();
          }
          break;
        case "ARROWLEFT":
          if (isOpen) {
            playClick(this);
            triggerUILeft();
          }
          break;
        case "ARROWRIGHT":
          if (isOpen) {
            playClick(this);
            triggerUIRight();
          }
          break;
      }
    });
  }
}
