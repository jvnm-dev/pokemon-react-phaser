import { Direction, GridEngine, GridEngineConfig } from "grid-engine";

import { useUIStore } from "../stores/ui";
import { GAME_HEIGHT, GAME_WIDTH } from "../constants/game";
import {
  Sprites,
  Layers,
  Objects,
  Tilesets,
  Maps,
  Audios,
} from "../constants/assets";
import {
  getObjectLookedAt,
  getObjectUnderPlayer,
  getSpawn,
  handleDoor,
} from "../utils/object";
import { getAudioConfig } from "../utils/audio";

export default class WorldScene extends Phaser.Scene {
  gridEngine: GridEngine;
  player: Phaser.GameObjects.Sprite;
  tilemap: Phaser.Tilemaps.Tilemap;
  map: Maps = Maps.MAP;
  receivedData: any;

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
      switch (objectUnderPlayer.name) {
        case Objects.DOOR:
          handleDoor(this, objectUnderPlayer);
          break;
      }
    }
  }

  initializePlayer(): void {
    this.player = this.add.sprite(0, 0, "characters");
    this.player.setOrigin(0.5, 0.5);
    this.player.setDepth(1);
    this.player.setScale(1.25);
  }

  initializeGrid(): void {
    const { startPosition, facingDirection } = getSpawn(this);

    const finalStartPosition = this.receivedData?.startPosition?.x
      ? this.receivedData?.startPosition
      : startPosition;

    const gridEngineConfig = {
      collisionTilePropertyName: "collides",
      characters: [
        {
          id: Sprites.PLAYER,
          sprite: this.player,
          walkingAnimationMapping: 0,
          startPosition: finalStartPosition,
          charLayer: Layers.WORLD2,
          facingDirection,
        },
      ],
    } as GridEngineConfig;

    this.gridEngine.create(this.tilemap, gridEngineConfig);
  }

  initializeCamera(): void {
    this.cameras.roundPixels = true;
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.player, true);
    this.cameras.main.setFollowOffset(-this.player.width, -this.player.height);
  }

  listenKeyboardControl(): void {
    this.input.keyboard.on("keyup", (event) => {
      switch (event.key.toUpperCase()) {
        case "M":
          this.sound.mute = !this.sound.mute;
          break;
        case "E":
          // "Use" button
          const object = getObjectLookedAt(this);

          if (object) {
            this.sound.play(Audios.CLICK, getAudioConfig(0.1, false));
          }

          break;
        case "ESCAPE":
          this.sound.play(Audios.CLICK, getAudioConfig(0.1, false));
          useUIStore.getState().toggleMenu();
        default:
          console.log(event.key.toUpperCase() + " has not handler");
          break;
      }
    });
  }

  listenMoves(): void {
    const cursors = this.input.keyboard.createCursorKeys();
    const keys: any = this.input.keyboard.addKeys("W,S,A,D");

    if (cursors.space.isDown) {
      this.gridEngine.setSpeed("player", 10);
    } else {
      this.gridEngine.setSpeed("player", 5);
    }

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
