import { Layers } from "../constants/assets";
import type WorldScene from "../scenes/WorldScene";

export const getCurrentPlayerTile = (scene: WorldScene) => {
  const { player, cameras, tilemap } = scene;
  const { x, y } = player;

  return tilemap.getTileAtWorldXY(x, y, true, cameras.main, Layers.WORLD);
};
