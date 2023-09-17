import { GridEngine } from "grid-engine";
import { wait } from "./time";

export const hopUp = async (gridEngine: GridEngine, charId: string) => {
  gridEngine.setOffsetY(charId, -12);
  await wait(80);
  gridEngine.setOffsetY(charId, 0);
};
