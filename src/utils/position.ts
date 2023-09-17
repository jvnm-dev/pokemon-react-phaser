import { Direction } from "grid-engine";

import WorldScene from "../scenes/WorldScene";
import { Sprites } from "../constants/assets";
import { getCurrentPlayerTile } from "./map";

export const getLookingAtPosition = (scene: WorldScene) => {
  const currentTile = getCurrentPlayerTile(scene);

  const facingDirection = scene.gridEngine.getFacingDirection(Sprites.PLAYER);

  const lookingPosition = {
    x: currentTile?.x ?? 0,
    y: currentTile?.y ?? 0,
  };

  if (facingDirection === Direction.DOWN) {
    lookingPosition.y += 1;
  } else if (facingDirection === Direction.UP) {
    lookingPosition.y -= 1;
  } else if (facingDirection === Direction.LEFT) {
    lookingPosition.x -= 1;
  } else if (facingDirection === Direction.RIGHT) {
    lookingPosition.x += 1;
  }

  return lookingPosition;
};
