import WorldScene from "../scenes/WorldScene";
import { useUserDataStore } from "../stores/userData";
import { moveRandomly } from "../utils/npc";
import { getTiledObjectProperty } from "../utils/object";
import { openDialog } from "../utils/ui";

export default ([npc], scene: WorldScene) => {
  const name = getTiledObjectProperty("name", npc);
  scene.gridEngine.stopMovement(name);

  const hasPokemon = !!useUserDataStore.getState().pokemons?.length;

  if (!hasPokemon) {
    // Scientist tells you to go see Oak if you don't have a Pokemon
    openDialog({
      content: `
        You don't have any Pokemon yet, right?;
        This is a great opportunity to get one!;
        Go see Prof. Oak! He is giving away Pokemon to new trainers today!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  } else {
    // Scientist congratulates you for having a Pokemon and tells wishes you good luck
    openDialog({
      content: `
        Oh, I like your Pokemon!;
        I hope you become a great Pokemon trainer!
      `,
      callback: () => moveRandomly(scene.gridEngine, name),
    });
  }
};
