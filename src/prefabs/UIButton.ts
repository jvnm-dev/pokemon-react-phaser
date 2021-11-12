export default class UIButton extends Phaser.GameObjects.Container {
	key: string;
	hoverkey: string;
	text: string;
	targetCallBack: Function;

	button: Phaser.GameObjects.Image;
	buttonText: Phaser.GameObjects.Text;

	constructor(
		scene: Phaser.Scene,
		x: number,
		y: number,
		key: string,
		hoverkey: string,
		text: string,
		targetCallBack: Function
	) {
		super(scene, x, y);
		this.scene = scene;
		this.key = key;
		this.hoverkey = hoverkey;
		this.text = text;
		this.targetCallBack = targetCallBack;

		this.createButton();
		this.scene.add.existing(this);
	}

	createButton() {
		this.button = this.scene.add.image(0, 0, this.key);
		this.button.setScale(1.4);
		this.button.setInteractive();

		this.buttonText = this.scene.add.text(0, 0, this.text, {
			fontSize: "26px",
			color: "white",
		});
		Phaser.Display.Align.In.Center(this.buttonText, this.button);

		this.add(this.button);
		this.add(this.buttonText);

		this.button.on("pointerdown", () => {
			this.targetCallBack();
		});
		this.button.on("pointerover", () => {
			this.button.setTexture(this.hoverkey);
		});
		this.button.on("pointerout", () => {
			this.button.setTexture(this.key);
		});
	}
}
