import { PLAYER_SIZE } from "../constants/game";
import { Audios, Maps, Sprites } from "../constants/assets";
import { Tilesets } from "../constants/assets";
import { useUserDataStore } from "../stores/userData";

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
    const userSettings = useUserDataStore.getState().settings;
    const startScene = userSettings.general.skipIntroScreen ? "World" : "Title";
    this.scene.start(startScene);

    Object.values(Audios).forEach((audio) => {
      this.sound.add(audio);
    });

    this.sound.pauseOnBlur = false;

    // Mute sound by default:
    this.sound.mute = !userSettings.general.enableSound;
  }

  loadImages(): void {
    // UI
    this.load.image("logo", "assets/images/ui/logo.png");
    this.load.image(
      "title_background",
      "assets/images/ui/title_background.png"
    );
    this.load.image("button1", "assets/images/ui/blue_button01.png");
    this.load.image("button2", "assets/images/ui/blue_button02.png");

    // Battle
    this.load.image("battle_background", "assets/images/ui/bb_background.png");
    this.load.image("battle_grass", "assets/images/ui/bb_grass.png");

    // Tilesets
    Object.values(Tilesets).forEach((tileset) => {
      this.load.image(tileset, `assets/images/tilesets/${tileset}.png`);
    });

    // Audios
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
    this.load.spritesheet(
      Sprites.PLAYER,
      "assets/images/characters/player.png",
      {
        frameWidth: PLAYER_SIZE,
        frameHeight: PLAYER_SIZE,
      }
    );

    this.load.spritesheet(
      Sprites.BICYCLE,
      "assets/images/characters/bicycle.png",
      {
        frameWidth: PLAYER_SIZE,
        frameHeight: PLAYER_SIZE,
      }
    );
  }
}
