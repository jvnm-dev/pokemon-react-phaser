import { Audios, Maps } from "../constants/assets";
import { Tilesets } from "../constants/assets";

export default class BootScene extends Phaser.Scene {
  text: Phaser.GameObjects.Text;

  constructor() {
    super("Boot"); // Name of the scene
  }

  preload(): void {
    this.text = this.add.text(
      this.scale.width / 2,
      this.scale.height / 4,
      "CHARGEMENT...",
      {
        fontSize: "54px",
        color: "white",
      }
    );

    this.text.setOrigin(0.5);

    this.loadImages();
    this.loadSpriteSheets();
    this.loadMaps();
  }

  create(): void {
    this.scene.start("World");
    this.sound.add(Audios.MUSIC);
    this.sound.add(Audios.DOOR);

    const musicConfig = {
      mute: false,
      volume: 0.1,
      rate: 1,
      detune: 0,
      loop: true,
    };
    this.sound.play(Audios.MUSIC, musicConfig);

    // TODO: remove
    this.sound.volume = 0;
  }

  loadImages(): void {
    // UI
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");

    // Tilesets
    this.load.image(Tilesets.GROUNDS, "assets/images/tilesets/grounds.png");
    this.load.image(Tilesets.WORLD, "assets/images/tilesets/structures.png");
    this.load.image(Tilesets.WORLD2, "assets/images/tilesets/structures2.png");
    this.load.image(
      Tilesets.GROUNDS_INSIDE,
      "assets/images/tilesets/grounds_inside.png"
    );

    // Audio
    this.load.audio(Audios.MUSIC, "assets/audio/music.ogg");
    this.load.audio(Audios.DOOR, "assets/audio/door.ogg");
  }

  loadMaps(): void {
    const maps = Object.values(Maps);

    for (const map of maps) {
      this.load.tilemapTiledJSON(map, `assets/maps/${map}.json`);
    }
  }

  loadSpriteSheets(): void {
    this.load.spritesheet("characters", "assets/images/characters/player.png", {
      frameWidth: 64,
      frameHeight: 64,
    });
  }
}
