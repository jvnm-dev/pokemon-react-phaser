import { Direction, GridEngine } from "grid-engine";

export const getCharacterDirectionDependingOnAnotherCharacter = (
  gridEngine: GridEngine,
  firstId: string,
  secondId: string,
) => {
  const playerPosition = gridEngine.getPosition(firstId);
  const charPosition = gridEngine.getPosition(secondId);

  if (playerPosition.x === charPosition.x) {
    if (playerPosition.y > charPosition.y) {
      return Direction.DOWN;
    } else {
      return Direction.UP;
    }
  }

  if (playerPosition.y === charPosition.y) {
    if (playerPosition.x > charPosition.x) {
      return Direction.RIGHT;
    } else {
      return Direction.LEFT;
    }
  }

  console.error("Unable to determine direction");
};
