import { GridEngine } from "grid-engine";

export const moveRandomly = (gridEngine: GridEngine, charId: string) => {
  gridEngine.moveRandomly(charId, 5000, 1);
};
