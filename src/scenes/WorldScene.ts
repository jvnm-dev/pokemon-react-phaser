import upperFirst from "lodash/upperFirst";
import camelCase from "lodash/camelCase";
import { Direction, GridEngine, GridEngineConfig } from "grid-engine";

import { GAME_HEIGHT, GAME_WIDTH } from "../constants/game";
import {
  Sprites,
  Layers,
  Objects,
  Tilesets,
  Audios,
  Maps,
} from "../constants/assets";

export default class WorldScene extends Phaser.Scene {
  gridEngine: GridEngine;
  player: Phaser.GameObjects.Sprite;
  tilemap: Phaser.Tilemaps.Tilemap;
  receivedData: any;
  map: Maps = Maps.MAP;

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
  }

  update(): void {
    this.listenMoves();
    this.handleObjectsOverlap();
  }

  initializeTilemap(): void {
    this.tilemap = this.make.tilemap({ key: this.map });

    const all_tilesets = Object.values(Tilesets).map((tileset) =>
      this.tilemap.addTilesetImage(tileset)
    );

    Object.values(Layers).forEach((layer) => {
      this.tilemap.createLayer(layer, all_tilesets);
    });
  }

  handleObjectsOverlap(): void {
    const objects = this.tilemap
      .getObjectLayer(Layers.OBJECTS)
      .objects.map((object) => ({
        ...object,
        x: ~~(object.x / 48),
        y: ~~(object.y / 48),
      }));

    const currentTile = this.tilemap.getTileAtWorldXY(
      this.player.x,
      this.player.y,
      true,
      this.cameras.main,
      Layers.WORLD
    );

    const playerPosition = {
      x: currentTile?.x + 1,
      y: currentTile?.y + 1,
    };

    const objectBelowPlayer = objects.find(
      ({ x, y }) => x === playerPosition.x && y === playerPosition.y
    );

    if (objectBelowPlayer) {
      switch (objectBelowPlayer.name) {
        case Objects.DOOR:
          const nextMap = objectBelowPlayer.properties.find(
            ({ name }) => name === "nextMap"
          ).value;

          const x = objectBelowPlayer.properties.find(
            ({ name }) => name === "x"
          )?.value;

          const y = objectBelowPlayer.properties.find(
            ({ name }) => name === "y"
          )?.value;

          const soundConfig: Phaser.Types.Sound.SoundConfig = {
            mute: false,
            volume: 0.5,
            rate: 1,
            detune: 0,
            loop: false,
          };
          this.sound.play(Audios.DOOR, soundConfig);

          this.map = nextMap;
          this.scene.restart({ startPosition: { x, y } });
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
    const spawnPoint = this.tilemap.findObject(
      Layers.OBJECTS,
      (obj) => obj.name === Objects.SPAWN
    );

    const facingDirection = spawnPoint.properties?.find(
      ({ name }) => name === "spriteDirection"
    )?.value;

    const gridEngineConfig = {
      collisionTilePropertyName: "collides",
      characters: [
        {
          id: Sprites.PLAYER,
          sprite: this.player,
          walkingAnimationMapping: 0,
          startPosition: {
            x:
              this.receivedData?.startPosition?.x ??
              Math.floor(spawnPoint.x / 48),
            y:
              this.receivedData?.startPosition?.y ??
              Math.floor(spawnPoint.y / 48),
          },
          charLayer: "world",
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

    this.input.on(
      "pointerup",
      (pointer) => {
        const tile = this.tilemap.getTileAtWorldXY(
          pointer.worldX,
          pointer.worldY,
          true,
          this.cameras.main,
          Layers.WORLD
        );

        if (!tile.properties.collides) {
          this.gridEngine.setPosition("player", {
            x: tile.x,
            y: tile.y,
          });
        }
      },
      this
    );
  }
}
