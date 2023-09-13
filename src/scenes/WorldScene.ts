import { Scene, GameObjects, Tilemaps } from "phaser";
import { Direction, GridEngine, GridEngineConfig } from "grid-engine";

import { GAME_HEIGHT, GAME_WIDTH } from "../constants/game";
import { Sprites, Layers, Tilesets, Maps } from "../constants/assets";
import {
  convertObjectPositionToTilePosition,
  getObjectUnderPlayer,
  handleBicycle,
  handleClickOnObjectIfAny,
  handleOverlappableObject,
  removeObject,
  spawnNPC,
} from "../utils/object";
import { playClick } from "../utils/audio";
import { getStartPosition, savePlayerPosition } from "../utils/map";
import {
  isMenuOpen,
  isUIOpen,
  toggleMenu,
  triggerUIDown,
  triggerUIExit,
  triggerUILeft,
  triggerUINextStep,
  triggerUIRight,
  triggerUIUp,
} from "../utils/ui";
import { useUserDataStore } from "../stores/userData";
import { useUIStore } from "../stores/ui";

export interface WorldReceivedData {
  facingDirection: Direction;
  startPosition: {
    x: number;
    y: number;
  };
}

export default class WorldScene extends Scene {
  gridEngine: GridEngine;

  currentSprite: GameObjects.Sprite;
  player: GameObjects.Sprite;
  bicycle: GameObjects.Sprite;
  speed: number;

  tilemap: Tilemaps.Tilemap;

  map: Maps = Maps.MAP;

  receivedData: Partial<WorldReceivedData>;

  constructor() {
    super("World");
  }

  init(data: Partial<WorldReceivedData>) {
    this.receivedData = data;
  }

  create(): void {
    this.applyUserDataBeforeRender();
    this.initializeTilemap();
    this.initializePlayer();
    this.initializeCamera();
    this.initializeGrid();
    this.initializeNPCs();
    this.listenKeyboardControl();
    this.applyUserDataAfterRender();
    this.gridEngine.positionChangeFinished().subscribe((observer) => {
      if (observer.charId === Sprites.PLAYER) {
        savePlayerPosition(this);
        this.handleObjectsOverlap();
      }
    });
  }

  update(): void {
    if (isUIOpen()) {
      return;
    }

    this.listenMoves();
  }

  initializeTilemap(): void {
    this.tilemap = this.make.tilemap({ key: this.map });

    const all_tilesets = Object.values(Tilesets).reduce(
      (acc: Tilemaps.Tileset[], value: Tilesets) => {
        if (this.tilemap.tilesets.find(({ name }) => name === value)) {
          const tileset = this.tilemap.addTilesetImage(value);

          if (tileset) {
            acc = [...acc, tileset];
          }
        }

        return acc;
      },
      [],
    );

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
    const onBicycle = useUserDataStore.getState().onBicycle;

    this.currentSprite = onBicycle ? bicycle : player;
    this.speed = onBicycle ? 10 : 5;

    this.currentSprite.setOrigin(0.5, 0.5);
    this.currentSprite.setDepth(1);
    this.currentSprite.setScale(1.1);

    // Removing unused sprite from the world
    [player, bicycle].forEach((sprite) => {
      if (sprite.texture.key !== this.currentSprite.texture.key) {
        sprite.destroy();
      }
    });

    this.player = player;
    this.bicycle = bicycle;
  }

  initializeGrid(): void {
    const { startPosition, facingDirection } = getStartPosition(this) ?? {};

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

  initializeNPCs() {
    spawnNPC(this);
  }

  initializeCamera(): void {
    this.cameras.roundPixels = true;
    this.cameras.main.setBounds(0, 0, GAME_WIDTH, GAME_HEIGHT);
    this.cameras.main.setZoom(1);
    this.cameras.main.startFollow(this.currentSprite, true);
    this.cameras.main.setFollowOffset(
      -this.currentSprite.width,
      -this.currentSprite.height,
    );
  }

  listenKeyboardControl(): void {
    this.input.keyboard?.on("keyup", (event: KeyboardEvent) => {
      const uiStore = useUIStore.getState();
      const isUIOpen = uiStore.menu.isOpen || uiStore.dialog.isOpen;

      if (this.data.get("battleStarted")) {
        return;
      }

      switch (event.key.toUpperCase()) {
        case "M":
          this.sound.mute = !this.sound.mute;
          break;
        case "E":
        case "ENTER":
          if (isUIOpen) {
            playClick(this);
            triggerUINextStep();
          } else {
            handleClickOnObjectIfAny(this);
          }
          break;
        case "ESCAPE":
          playClick(this);
          if (!isMenuOpen()) {
            toggleMenu();
          } else {
            triggerUIExit();
          }
          break;
        case " ":
          handleBicycle(this);
          break;
        case "ARROWDOWN":
          if (isUIOpen) {
            playClick(this);
            triggerUIDown();
          }
          break;
        case "ARROWUP":
          if (isUIOpen) {
            playClick(this);
            triggerUIUp();
          }
          break;
        case "ARROWLEFT":
          if (isUIOpen) {
            playClick(this);
            triggerUILeft();
          }
          break;
        case "ARROWRIGHT":
          if (isUIOpen) {
            playClick(this);
            triggerUIRight();
          }
          break;
      }
    });
  }

  listenMoves(): void {
    if (
      this.input.keyboard &&
      !isUIOpen() &&
      !this.gridEngine.isMoving(Sprites.PLAYER)
    ) {
      const cursors = this.input.keyboard.createCursorKeys();
      const keys = this.input.keyboard.addKeys("W,S,A,D") as Record<
        string,
        { isDown: boolean }
      >;

      if (cursors.left.isDown || keys.A.isDown) {
        this.gridEngine.move(Sprites.PLAYER, Direction.LEFT);
      } else if (cursors.right.isDown || keys.D.isDown) {
        this.gridEngine.move(Sprites.PLAYER, Direction.RIGHT);
      } else if (cursors.up.isDown || keys.W.isDown) {
        this.gridEngine.move(Sprites.PLAYER, Direction.UP);
      } else if (cursors.down.isDown || keys.S.isDown) {
        this.gridEngine.move(Sprites.PLAYER, Direction.DOWN);
      }
    }
  }

  applyUserDataBeforeRender(): void {
    const position = useUserDataStore.getState().position;

    if (position?.map) {
      this.map = position.map;
    }
  }

  applyUserDataAfterRender(): void {
    const inventory = useUserDataStore.getState().inventory;
    const userItemIds = inventory.map(({ objectId }) => objectId);

    // Remove objects that has been already taken
    this.tilemap.objects?.[0].objects.forEach((object) => {
      if (userItemIds.includes(object.id)) {
        removeObject(this, convertObjectPositionToTilePosition(object));
      }
    });
  }
}
