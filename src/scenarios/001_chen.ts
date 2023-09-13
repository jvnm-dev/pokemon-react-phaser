import { Types } from "phaser";

import { getTiledObjectProperty } from "../utils/object";
import { openDialog, isDialogOpen } from "../utils/ui";
import WorldScene from "../scenes/WorldScene";

export default (objects: Types.Tilemaps.TiledObject[], scene: WorldScene) => {
  const npc = objects[0];
  const name = getTiledObjectProperty("name", npc);
  const basePosition = {
    x: Number(getTiledObjectProperty("x", npc)),
    y: Number(getTiledObjectProperty("y", npc)),
  };

  const currentPosition = scene.gridEngine.getPosition(name);

  if (
    !isDialogOpen() &&
    basePosition.x === currentPosition.x &&
    basePosition.y === currentPosition.y
  ) {
    openDialog(`Hello, I'm ${name}!;What do you want?`, () => {
      scene.gridEngine.moveTo(name, {
        x: 10,
        y: 6,
      });
    });
  }
};
