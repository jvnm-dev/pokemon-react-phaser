import { Tilesets, Layers, Maps } from "../constants/assets";
import DefaultScene from "./DefaultScene";

export default class BigHouseScene extends DefaultScene {
  constructor() {
    super("BigHouse"); // Name of the scene
  }

  initializeTilemap(): void {
    this.tilemap = this.make.tilemap({ key: Maps.BIG_HOUSE });
    const tileset = this.tilemap.addTilesetImage(
      Tilesets.GROUNDS_INSIDE,
      Tilesets.GROUNDS_INSIDE
    );

    const belowLayer = this.tilemap.createLayer(
      Layers.BELOW_PLAYER,
      tileset,
      0,
      0
    );
    const worldLayer = this.tilemap.createLayer(Layers.WORLD, tileset, 0, 0);
    const aboveLayer = this.tilemap.createLayer(
      Layers.ABOVE_PLAYER,
      tileset,
      0,
      0
    );

    worldLayer.setCollisionByProperty({ collides: true });
    aboveLayer.setDepth(10);

    belowLayer.scale = 1;
    worldLayer.scale = 1;
    aboveLayer.scale = 1;
  }
}
