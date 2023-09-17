import { Scene, GameObjects } from "phaser";
import { PLAYER_SIZE } from "../constants/game";
import { Audios, Maps, Sprites } from "../constants/assets";
import { Tilesets } from "../constants/assets";
import { useUserDataStore } from "../stores/userData";
import { UIEvents } from "../constants/events";
import { dispatch } from "../utils/ui";
import { useUIStore } from "../stores/ui";
import { getAudioConfig } from "../utils/audio";

export default class BootScene extends Scene {
  text: GameObjects.Text;

  constructor() {
    super("Boot");
  }

  launchGame(): void {
    const userSettings = useUserDataStore.getState().settings;

    Object.values(Audios).forEach((audio) => {
      this.sound.add(audio);
    });

    this.sound.pauseOnBlur = false;

    // Mute sound by default:
    this.sound.mute = !userSettings.general.enableSound;

    this.sound.play(Audios.PALLET_TOWN, getAudioConfig());
    this.scene.switch("World");
  }

  preload(): void {
    this.load.on("progress", (value: number) => {
      dispatch<number>(UIEvents.LOADING_PROGRESS, value);
    });

    this.load.on("complete", () => {
      useUIStore.getState().setLoading(false);
      this.launchGame();
    });

    this.loadImages();
    this.loadSpriteSheets();
    this.loadMaps();
  }

  loadImages(): void {
    // UI
    this.load.image("logo", "assets/images/ui/logo.png");
    this.load.image(
      "title_background",
      "assets/images/ui/title_background.png",
    );

    // Battle
    this.load.image("battle_background", "assets/images/ui/bb_background.png");
    this.load.image("battle_grass", "assets/images/ui/bb_grass.png");
    this.load.image("trainer_back", "assets/images/battle/trainer.png");

    Array.from({ length: 151 }, (_, i) => {
      this.load.image(
        `pokemon_${i + 1}_front`,
        `assets/images/pokemons/front/${i + 1}.png`,
      );

      this.load.image(
        `pokemon_${i + 1}_front_shiny`,
        `assets/images/pokemons/front/shiny/${i + 1}.png`,
      );
    });

    Array.from({ length: 151 }, (_, i) => {
      this.load.image(
        `pokemon_${i + 1}_back`,
        `assets/images/pokemons/back/${i + 1}.png`,
      );

      this.load.image(
        `pokemon_${i + 1}_back_shiny`,
        `assets/images/pokemons/back/shiny/${i + 1}.png`,
      );
    });

    // Tilesets
    Object.values(Tilesets).forEach((tileset) => {
      this.load.image(tileset, `assets/images/tilesets/${tileset}.png`);
    });

    // Audios
    Object.values(Audios).forEach((audio) => {
      this.load.audio(audio, `assets/audio/${audio}.ogg`);
    });

    // Objects
    this.load.image("object_pokeball", "assets/images/objects/pokeball.png");
    this.load.image("object_star", "assets/images/objects/star.png");
    this.load.image("object_leaf", "assets/images/objects/leaf.png");
  }

  loadMaps(): void {
    const maps = Object.values(Maps);

    for (const map of maps) {
      this.load.tilemapTiledJSON(map, `assets/maps/${map}.json`);
    }
  }

  loadSpriteSheets(): void {
    const sprites = Object.values(Sprites);

    sprites.forEach((sprite) => {
      this.load.spritesheet(sprite, `assets/images/characters/${sprite}.png`, {
        frameWidth: PLAYER_SIZE,
        frameHeight: PLAYER_SIZE,
      });
    });
  }
}
