export default class UIScene extends Phaser.Scene {
  gameScene: Phaser.Scene;
  scoreText: Phaser.GameObjects.Text;
  coinIcon: Phaser.GameObjects.Image;

  constructor() {
    super("UI");
  }

  init(): void {
    this.gameScene = this.scene.get("Game");
  }

  create(): void {
    this.setupUIElements();
    this.setupEvents();
  }

  setupUIElements(): void {
    this.scoreText = this.add.text(35, 8, "Thunes: 0", {
      fontSize: "16px",
      color: "white",
    });
  }

  setupEvents(): void {
    this.gameScene.events.on("updateScore", (score: number = 0) => {
      this.scoreText.setText(`Coins: ${score}`);
    });
  }
}
