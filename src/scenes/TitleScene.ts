import UIButton from "../prefabs/UIButton";

export default class TitleScene extends Phaser.Scene {
  titleText: Phaser.GameObjects.Text;
  startGameButton;

  constructor() {
    super("Title");
  }

  create(): void {
    this.startGameButton = new UIButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      "button1",
      "button2",
      "Play",
      () => {
        this.scene.start("World");
      }
    );
  }
}
