import { Audios } from "../constants/assets";
import { getAudioConfig } from "../utils/audio";
import UIButton from "../prefabs/UIButton";

export default class TitleScene extends Phaser.Scene {
  titleText: Phaser.GameObjects.Text;
  startGameButton;

  constructor() {
    super("Title");
  }

  create(): void {
    const background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "title_background"
    );

    this.add.existing(background);

    this.startGameButton = new UIButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      "button1",
      "button2",
      "Play",
      () => {
        this.sound.stopAll();
        this.sound.play(Audios.MUSIC, getAudioConfig(0.1));
        this.scene.start("World");
      }
    );

    this.sound.play(Audios.OPENING, getAudioConfig(0.3));
  }
}
