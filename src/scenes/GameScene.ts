import { Tilesets, Layers, Maps } from "../constants/assets";
import DefaultScene from "./DefaultScene";

export default class GameScene extends DefaultScene {
  constructor() {
    super("Game");
  }

  initializeTilemap(): void {
    this.tilemap = this.make.tilemap({ key: Maps.MAP });
    const grounds = this.tilemap.addTilesetImage(
      Tilesets.GROUNDS,
      Tilesets.GROUNDS
    );

    const world = this.tilemap.addTilesetImage(Tilesets.WORLD, Tilesets.WORLD);
    const world2 = this.tilemap.addTilesetImage(
      Tilesets.WORLD2,
      Tilesets.WORLD2
    );

    const belowLayer = this.tilemap.createLayer(
      Layers.BELOW_PLAYER,
      grounds,
      0,
      0
    );
    const worldLayer = this.tilemap.createLayer(
      Layers.WORLD,
      [world, world2],
      0,
      0
    );
    const aboveLayer = this.tilemap.createLayer(
      Layers.ABOVE_PLAYER,
      [world, world2],
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
