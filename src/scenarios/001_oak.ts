import { Types } from "phaser";
import { Direction } from "grid-engine";

import { findObjectByPosition, getTiledObjectProperty } from "../utils/object";
import { openDialog, isDialogOpen } from "../utils/ui";
import WorldScene from "../scenes/WorldScene";
import { hopUp } from "../utils/character";
import { wait } from "../utils/time";
import { Audios, Layers } from "../constants/assets";
import { useUserDataStore } from "../stores/userData";
import { getAudioConfig } from "../utils/audio";

export const getPokeballPositionBasedOnChoice = (choice: string) => {
  switch (choice) {
    case "Bulbasaur":
      return { x: 10, y: 6 };
    case "Charmander":
      return { x: 14, y: 6 };
    case "Squirtle":
      return { x: 18, y: 6 };
  }
};

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
    // Prof. Oak is giving you a Pokemon. You must choose between Bulbasaur, Charmander and Squirtle.
    openDialog({
      content: `Hello! I'm Prof. Oak, the Pokemon professor.;I guess you are here to get your first Pokemon, right?`,
      choices: ["Yes", "No"],
      callback: async (choice) => {
        switch (choice) {
          case "Yes":
            openDialog({
              content: `
                Great!;
                I have three Pokemon for you to choose from.;
                Bulbasaur, Charmander and Squirtle.;Bulbasaur is a grass type Pokemon. It's strong against water and ground type Pokemon.;
                Charmander is a fire type Pokemon. It's strong against grass and ice type Pokemon.;
                Squirtle is a water type Pokemon. It's strong against fire and rock type Pokemon.;
                Which one do you want?
              `,
              choices: ["Bulbasaur", "Charmander", "Squirtle"],
              callback: async (choice) => {
                const position = getPokeballPositionBasedOnChoice(choice);
                scene.gridEngine.moveTo(name, position).subscribe({
                  complete: async () => {
                    await wait(500);
                    scene.tilemap.removeTileAt(
                      position.x,
                      position.y - 2,
                      false,
                      false,
                      Layers.WORLD2,
                    );
                    await wait(500);

                    scene.gridEngine.moveTo(name, basePosition).subscribe({
                      complete: async () => {
                        await wait(200);
                        scene.gridEngine.turnTowards(name, Direction.DOWN);
                        await wait(500);

                        openDialog({
                          content: `Here is your ${choice}!`,
                          callback: () => {
                            const pokeball = findObjectByPosition(scene, {
                              x: position.x,
                              y: position.y - 2,
                            });
                            const pokemonId = getTiledObjectProperty(
                              "pokemon_inside",
                              pokeball,
                            );
                            useUserDataStore
                              .getState()
                              .addObjectToInventory(pokeball.id);
                            useUserDataStore.getState().addPokemon(pokemonId);
                            useUserDataStore.getState().completeScenario(1);

                            scene.sound.play(
                              Audios.GAIN,
                              getAudioConfig(0.1, false),
                            );
                            openDialog({
                              content: `You obtained a <span class="gain">${choice}</span>!`,
                            });
                          },
                        });
                      },
                    });
                  },
                });
              },
            });
            break;
          case "No":
            scene.gridEngine.setOffsetY(name, -12);
            await hopUp(scene.gridEngine, name);
            await wait(1000);
            openDialog({
              content: `Oh, I see. Well, I'm here if you change your mind.`,
            });
            break;
        }
      },
    });
  }
};
