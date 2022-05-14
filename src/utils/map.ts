import type WorldScene from "../scenes/WorldScene";

import { useUserDataStore } from "../stores/userData";
import { Layers, Sprites } from "../constants/assets";
import { getSpawn } from "./object";

export const getCurrentPlayerTile = (scene: WorldScene) => {
  const { cameras, tilemap } = scene;
  const { x, y } = scene.gridEngine.getSprite(Sprites.PLAYER);
  const tile = tilemap.getTileAtWorldXY(x, y, true, cameras.main, Layers.WORLD);

  if (!tile) {
    return;
  }

  return {
    ...tile,
    x: tile.x + 1,
    y: tile.y + 1,
  } as Phaser.Tilemaps.Tile;
};

export const getStartPosition = (scene: WorldScene) => {
  const receivedData = scene.receivedData;

  const { startPosition: spawnPosition, facingDirection: spawnDirection } =
    getSpawn(scene) ?? {};

  const position = useUserDataStore.getState().position;
  const facingDirection =
    receivedData?.facingDirection ??
    position?.facingDirection ??
    spawnDirection;

  // First, received position
  if (receivedData?.startPosition?.x && receivedData?.startPosition?.y) {
    return {
      startPosition: {
        x: receivedData.startPosition.x,
        y: receivedData.startPosition.y,
      },
      facingDirection,
    };
  }

  // If no received position, use saved position
  if (position?.x && position?.y) {
    return {
      startPosition: {
        x: position.x,
        y: position.y,
      },
      facingDirection,
    };
  }

  // If no saved position, use spawn position
  if (spawnPosition) {
    return {
      startPosition: {
        x: spawnPosition.x,
        y: spawnPosition.y,
      },
      facingDirection,
    };
  } else {
    console.error("No spawn position found");
  }
};

export const savePlayerPosition = (scene: WorldScene) => {
  const userData = useUserDataStore.getState();

  const currentTile = getCurrentPlayerTile(scene);
  const lastTilePosition = userData.position;

  if (
    lastTilePosition?.x !== currentTile?.x ||
    lastTilePosition?.y !== currentTile?.y
  ) {
    if (
      currentTile &&
      (userData.position?.x !== currentTile.x ||
        userData.position?.y !== currentTile.y ||
        userData.position?.map !== scene.map)
    ) {
      userData.update({
        position: {
          x: currentTile.x,
          y: currentTile.y,
          map: scene.map,
          facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER),
        },
      });
    }
  }
};
