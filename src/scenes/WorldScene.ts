import { Direction, GridEngine, GridEngineConfig } from "grid-engine";

import { GAME_HEIGHT, GAME_WIDTH } from "../constants/game";
import { Sprites, Layers, Tilesets, Maps } from "../constants/assets";
import {
  getObjectUnderPlayer,
  handleBicycle,
  handleClickOnObject,
  handleOverlappableObject,
} from "../utils/object";
import { playClick } from "../utils/audio";
import { getStartPosition } from "../utils/map";
import { isUIOpen } from "../utils/ui";

export interface WorldReceivedData {
  facingDirection: Direction;
  startPosition: {
    x: number;
    y: number;
  };
  onBicycle: boolean;
}

export default class WorldScene extends Phaser.Scene {
  gridEngine: GridEngine;

  currentSprite: Phaser.GameObjects.Sprite;
  player: Phaser.GameObjects.Sprite;
  bicycle: Phaser.GameObjects.Sprite;
  speed: number;

  tilemap: Phaser.Tilemaps.Tilemap;

  map: Maps = Maps.MAP;

  receivedData: Partial<WorldReceivedData>;

  constructor() {
    super("World");
  }

  init(data) {
    this.receivedData = data;
  }

  create(): void {
    this.initializeTilemap();
    this.initializePlayer();
    this.initializeCamera();
    this.initializeGrid();
    this.listenKeyboardControl();
  }

  update(): void {
    if (isUIOpen()) {
      return;
    }

    this.listenMoves();
    this.handleObjectsOverlap();
  }

  initializeTilemap(): void {
    this.tilemap = this.make.tilemap({ key: this.map });

    const all_tilesets = Object.values(Tilesets)
      .map((tileset) => {
        if (this.tilemap.tilesets.find(({ name }) => name === tileset)) {
          return this.tilemap.addTilesetImage(tileset);
        }
      })
      .filter(Boolean);

    Object.values(Layers)
      .filter((layer) => layer !== Layers.OBJECTS)
      .forEach((layer) => {
        this.tilemap.createLayer(layer, all_tilesets);
      });
  }

  handleObjectsOverlap(): void {
    const objectUnderPlayer = getObjectUnderPlayer(this);

    if (objectUnderPlayer) {
      handleOverlappableObject(this, objectUnderPlayer);
    }
  }

  initializePlayer(): void {
    const player = this.add.sprite(0, 0, Sprites.PLAYER);
    const bicycle = this.add.sprite(0, 0, Sprites.BICYCLE);

    this.currentSprite = this.receivedData.onBicycle ? bicycle : player;
    this.speed = this.receivedData.onBicycle ? 10 : 5;

    this.currentSprite.setOrigin(0.5, 0.5);
    this.currentSprite.setDepth(1);
    this.currentSprite.setScale(1.25);

    // Removing unused sprite from the world
    [player, bicycle].forEach((sprite) => {
      if (sprite.texture.key !== this.currentSprite.texture.key) {
        sprite.destroy();
      }
    });
  }

  initializeGrid(): void {
    const { startPosition, facingDirection } = getStartPosition(this);

    const gridEngineConfig = {
      collisionTilePropertyName: "collides",
      characters: [
        {
          id: Sprites.PLAYER,
          sprite: this.currentSprite,
          walkingAnimationMapping: 0,
          startPosition,
          charLayer: Layers.WORLD2,
          facingDirection,
          speed: this.speed,
        },
      ],
    } as GridEngineConfig;

    this.gridEngine.create(this.tilemap, gridEngineConfig);
  }

  initializeCamera(): void {
    this.cameras.roundPixels = true;
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.currentSprite, true);
    this.cameras.main.setFollowOffset(
      -this.currentSprite.width,
      -this.currentSprite.height
    );
  }

  listenKeyboardControl(): void {
    this.input.keyboard.on("keyup", (event) => {
      switch (event.key.toUpperCase()) {
        case "M":
          this.sound.mute = !this.sound.mute;
          break;
        case "E":
          handleClickOnObject(this);
          break;
        case "ESCAPE":
          playClick(this);
          break;
        case " ":
          handleBicycle(this);
          break;
      }
    });
  }

  listenMoves(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    const keys: any = this.input.keyboard.addKeys("W,S,A,D");

    if (cursors.left.isDown || keys.A.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.LEFT);
    } else if (cursors.right.isDown || keys.D.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.RIGHT);
    } else if (cursors.up.isDown || keys.W.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.UP);
    } else if (cursors.down.isDown || keys.S.isDown) {
      this.gridEngine.move(Sprites.PLAYER, Direction.DOWN);
    }

    // Timeout to avoid moving the player when switching scenes
    // (e.g. from the title to the game to the world scene by clicking on the start button)
    setTimeout(() => {
      this.input.on(
        "pointerup",
        (pointer) => {
          const getTile = (x: number, y: number, layer: Layers) => {
            return this.tilemap.getTileAtWorldXY(
              x,
              y,
              true,
              this.cameras.main,
              layer
            );
          };

          const tileWorld = getTile(
            pointer.worldX,
            pointer.worldY,
            Layers.WORLD
          );
          const tileWorld2 = getTile(
            pointer.worldX,
            pointer.worldY,
            Layers.WORLD2
          );

          const targetX = tileWorld.x ?? tileWorld2.x ?? 0;
          const targetY = tileWorld.y ?? tileWorld2.y ?? 0;
          const targetCollides =
            tileWorld.properties.collides ?? tileWorld2.properties.collides;

          if (!targetCollides) {
            this.gridEngine.setPosition("player", {
              x: targetX,
              y: targetY,
            });
          }
        },
        this
      );
    }, 500);
  }
}
