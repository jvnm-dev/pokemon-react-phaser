import { Audios } from "../constants/assets";
import { getAudioConfig, playClick } from "../utils/audio";
import UIButton from "../prefabs/UIButton";

export default class TitleScene extends Phaser.Scene {
  titleText: Phaser.GameObjects.Text;
  startGameButton: UIButton;

  constructor() {
    super("Title");
  }

  create(): void {
    const background = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2,
      "title_background"
    );

    const logo = this.add.image(
      this.scale.width / 2,
      this.scale.height / 2.5,
      "logo"
    );

    logo.setScale(0.8);

    this.add.existing(background);
    this.add.existing(logo);

    this.startGameButton = new UIButton(
      this,
      this.scale.width / 2,
      this.scale.height / 1.5,
      "button1",
      "button2",
      "Play",
      () => {
        this.sound.stopAll();
        playClick(this);
        this.sound.play(Audios.MUSIC, getAudioConfig());
        this.scene.start("World");
      }
    );

    this.sound.play(Audios.OPENING, getAudioConfig(0.3));
  }
}
