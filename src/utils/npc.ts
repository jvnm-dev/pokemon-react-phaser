import { GridEngine } from "grid-engine";

export const moveRandomly = (gridEngine: GridEngine, charId: string) => {
  const delay = Math.random() * 7000 + 3000;
  gridEngine.moveRandomly(charId, delay, 1);
};
