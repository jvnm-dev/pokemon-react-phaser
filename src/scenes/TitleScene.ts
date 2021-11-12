import UIButton from "../prefabs/UIButton";

export default class TitleScene extends Phaser.Scene {
  titleText: Phaser.GameObjects.Text;
  startGameButton;

  constructor() {
    super("Title"); // Name of the scene
  }

  create(): void {
    this.titleText = this.add.text(
      this.scale.width / 2,
      this.scale.height / 4,
      "LE SUPER JEU",
      {
        fontSize: "54px",
        color: "white",
      }
    );

    this.titleText.setOrigin(0.5);

    this.startGameButton = new UIButton(
      this,
      this.scale.width / 2,
      this.scale.height / 2,
      "button1",
      "button2",
      "Jouer",
      () => {
        this.scene.start("Game");
      }
    );
  }
}
