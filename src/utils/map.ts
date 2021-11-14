import { Layers, Sprites } from "../constants/assets";
import type WorldScene from "../scenes/WorldScene";
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
  const { startPosition: spawnPosition, facingDirection: spawnDirection } =
    getSpawn(scene);

  const startPosition = scene.receivedData?.startPosition?.x
    ? scene.receivedData?.startPosition
    : spawnPosition;

  const facingDirection = scene.receivedData.facingDirection ?? spawnDirection;

  return { startPosition, facingDirection };
};
