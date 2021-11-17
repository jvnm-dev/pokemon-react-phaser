import type WorldScene from "../scenes/WorldScene";

import { useUserDataStore } from "../stores/userData";
import { Layers, Sprites } from "../constants/assets";
import { getSpawn } from "./object";

export const getCurrentPlayerTile = (scene: WorldScene) => {
  const { cameras, tilemap } = scene;
  const { x, y } = scene.gridEngine.getSprite(Sprites.PLAYER);
  const tile = tilemap.getTileAtWorldXY(x, y, true, cameras.main, Layers.WORLD);

  return {
    ...tile,
    x: tile.x + 1,
    y: tile.y + 1,
  } as Phaser.Tilemaps.Tile;
};

export const getStartPosition = (scene: WorldScene) => {
  const receivedData = scene.receivedData;
  const { startPosition: spawnPosition, facingDirection: spawnDirection } =
    getSpawn(scene);

  const facingDirection = receivedData.facingDirection ?? spawnDirection;

  const position = useUserDataStore.getState().position;

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
  return {
    startPosition: {
      x: spawnPosition.x,
      y: spawnPosition.y,
    },
    facingDirection,
  };
};
