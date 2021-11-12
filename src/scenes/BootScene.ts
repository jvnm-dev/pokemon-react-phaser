import { PLAYER_SIZE } from "../constants/game";
import { Audios, Maps } from "../constants/assets";
import { Tilesets } from "../constants/assets";
import { getAudioConfig } from "../utils/audio";

export default class BootScene extends Phaser.Scene {
  text: Phaser.GameObjects.Text;

  constructor() {
    super("Boot");
  }

  preload(): void {
    this.loadImages();
    this.loadSpriteSheets();
    this.loadMaps();
  }

  create(): void {
    this.scene.start("Title");
    this.sound.add(Audios.MUSIC);
    this.sound.add(Audios.DOOR);
    this.sound.play(Audios.MUSIC, getAudioConfig(0.1));
  }

  loadImages(): void {
    // UI
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");

    Object.values(Tilesets).forEach((tileset) => {
      this.load.image(tileset, `assets/images/tilesets/${tileset}.png`);
    });

    Object.values(Audios).forEach((audio) => {
      this.load.audio(audio, `assets/audio/${audio}.ogg`);
    });
  }

  loadMaps(): void {
    const maps = Object.values(Maps);

    for (const map of maps) {
      this.load.tilemapTiledJSON(map, `assets/maps/${map}.json`);
    }
  }

  loadSpriteSheets(): void {
    this.load.spritesheet("characters", "assets/images/characters/player.png", {
      frameWidth: PLAYER_SIZE,
      frameHeight: PLAYER_SIZE,
    });
  }
}
