import { Types } from "phaser";
import type WorldScene from "../scenes/WorldScene";
import { Audios, Layers, Objects, Sprites } from "../constants/assets";
import { TILE_SIZE } from "../constants/game";
import { getCurrentPlayerTile } from "./map";
import { getAudioConfig, playClick } from "./audio";
import { Direction } from "grid-engine";
import { isDialogOpen, isUIOpen, openDialog, triggerUINextStep } from "./ui";
import { useUserDataStore } from "../stores/userData";
import { getRandomNumber } from "./number";

import pokemons from "../constants/pokemons.json";
import { getRandomPokemonFromZone } from "./pokemon";
import { scenarios } from "../scenarios";
import { ObjectProperties } from "../constants/types";
import { moveRandomly } from "./npc";
import { getCharacterDirectionDependingOnAnotherCharacter } from "./direction";
import { getLookingAtPosition } from "./position";
import oakNoPokemonScenario from "../scenarios/codeDriven/oakGrassNoPokemon";
import { getFirstPossibleScenario } from "./scenario";

export const convertObjectPositionToTilePosition = (
  object: Types.Tilemaps.TiledObject,
) => ({
  ...object,
  x: ~~((object?.x ?? 0) / TILE_SIZE),
  y: ~~((object?.y ?? 0) / TILE_SIZE),
});

export const findObjectByPosition = (
  scene: WorldScene,
  position: { x: number; y: number },
) => {
  const { tilemap } = scene;

  const objects = tilemap
    .getObjectLayer(Layers.OBJECTS)
    ?.objects.map((object) => convertObjectPositionToTilePosition(object));

  return objects?.find(
    (object) => object.x === position.x && object.y === position.y,
  );
};

export const findObjectByName = (scene: WorldScene, name: string) => {
  const { tilemap } = scene;

  const objects = tilemap
    .getObjectLayer(Layers.OBJECTS)
    ?.objects.map((object) => convertObjectPositionToTilePosition(object));

  return objects?.find(
    (object) => getTiledObjectProperty("name", object) === name,
  );
};

export const getObjectUnderPlayer = (scene: WorldScene) => {
  const currentTile = getCurrentPlayerTile(scene);

  if (!currentTile) {
    return;
  }

  const playerPosition = {
    x: currentTile?.x,
    y: currentTile?.y,
  };

  return findObjectByPosition(scene, playerPosition);
};

export const getObjectLookedAt = (scene: WorldScene) => {
  const lookingPosition = getLookingAtPosition(scene);
  return findObjectByPosition(scene, lookingPosition);
};

export const getTiledObjectProperty = (
  name: string,
  object: Types.Tilemaps.TiledObject,
) => {
  return object?.properties?.find(
    (property: ObjectProperties) => property.name === name,
  )?.value;
};

export const removeObject = (
  scene: WorldScene,
  object: Types.Tilemaps.TiledObject,
) => {
  const removeTile = (layer: Layers) => {
    if (object.x && object.y) {
      return scene.tilemap.removeTileAt(
        object.x,
        object.y,
        false,
        false,
        layer,
      );
    }
  };

  let removedTile = removeTile(Layers.WORLD2);

  if (removedTile?.index === -1) {
    removedTile = removeTile(Layers.WORLD);
  }

  const objectLayer = scene.tilemap.objects[0];
  const objects = objectLayer.objects;

  const filteredObjects = objects.filter(({ id }) => id !== object.id);
  objectLayer.objects = filteredObjects;

  scene.tilemap.objects = [objectLayer];
};

export const getSpawn = (scene: WorldScene) => {
  const spawnPoint = scene.tilemap.findObject(
    Layers.OBJECTS,
    (obj) => obj.name === Objects.SPAWN,
  );

  if (spawnPoint?.x && spawnPoint?.y) {
    const facingDirection = spawnPoint.properties?.find(
      (property: ObjectProperties) => property.name === "spriteDirection",
    )?.value;

    return {
      startPosition: {
        x: Math.floor(spawnPoint.x / TILE_SIZE),
        y: Math.floor(spawnPoint.y / TILE_SIZE),
      },
      facingDirection,
    };
  } else {
    console.error("No spawn point set or no position detected");
  }
};

export const handleClickOnObjectIfAny = (scene: WorldScene) => {
  const object = getObjectLookedAt(scene);

  if (object) {
    // Check if object has a scenario, if yes, play it and ignore the rest
    const firstPossibleScenario = getFirstPossibleScenario(object);

    if (
      object.name !== Objects.NPC &&
      !Number.isNaN(firstPossibleScenario) &&
      firstPossibleScenario !== 0
    ) {
      playClick(scene);
      return scenarios[firstPossibleScenario - 1]([object], scene);
    }

    switch (object.name) {
      case Objects.DIALOG:
        playClick(scene);
        handleDialogObject(object);
        break;
      case Objects.POKEBALL:
        playClick(scene);
        handlePokeball(scene, object);
        break;
      case Objects.NPC:
        const staticNPC = !getTiledObjectProperty("move", object);
        if (staticNPC) {
          playClick(scene);
          handleNPC(scene, object);
        }
        break;
    }
  }
};

export const handleClickOnNpcIfAny = (scene: WorldScene) => {
  const lookingPosition = getLookingAtPosition(scene);
  const character = scene.gridEngine.getCharactersAt(
    lookingPosition,
    Layers.WORLD2,
  )[0];

  if (character) {
    const object = findObjectByName(scene, character);
    const staticNPC = !getTiledObjectProperty("move", object);

    // Do not handle a static NPC a second time (alreay handled in `handleClickOnObjectIfAny`)
    if (!staticNPC) {
      playClick(scene);
      handleNPC(scene, object);
    }
  }
};

export const handleOverlappableObject = (
  scene: WorldScene,
  object: Types.Tilemaps.TiledObject,
) => {
  switch (object.name) {
    case Objects.DOOR:
      handleDoor(scene, object);
      break;
    case Objects.GRASS:
      handleMoveOnGrass(scene, object);
      break;
  }
};

export const handleDoor = (
  scene: WorldScene,
  door: Types.Tilemaps.TiledObject,
) => {
  const userData = useUserDataStore.getState();

  const nextMap = getTiledObjectProperty("nextMap", door);
  const x = getTiledObjectProperty("x", door);
  const y = getTiledObjectProperty("y", door);

  userData.update({
    position: {
      x,
      y,
      map: nextMap,
      facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER),
    },
    onBicycle: false,
  });
  scene.map = nextMap;
  scene.sound.play(Audios.DOOR, getAudioConfig(0.5, false));
  scene.scene.restart({ startPosition: { x, y } });
};

export const handleMoveOnGrass = (
  scene: WorldScene,
  grass: Types.Tilemaps.TiledObject,
) => {
  const min = 0;
  const max = 10;
  const userData = useUserDataStore.getState();

  const randomNumber = getRandomNumber(min, max);

  if (grass.x && grass.y) {
    const realX = grass.x * 48;
    const realY = grass.y * 48;

    const tile = scene.tilemap.getTileAtWorldXY(
      realX,
      realY,
      false,
      scene.cameras.main,
      "below_player",
    );

    if (tile) {
      const leafEmitter = scene.add.particles(
        realX + 24,
        realY + 24,
        "object_leaf",
        {
          lifespan: 150,
          scale: { start: 0.02, end: 0.02 },
          duration: 100,
          tintFill: true,
          tint: [0xa0e0c0, 0x389030, 0x385810, 0x70c8a0],
          maxParticles: 8,
          gravityY: 500,
          speed: 100,
        },
      );

      leafEmitter.setDepth(99);
      leafEmitter.start();

      if (!userData.pokemons?.length) {
        scene.gridEngine.stopMovement(Sprites.PLAYER);

        const newPosition = {
          x: userData.position?.x ?? 0,
          y: userData.position?.y ?? 0,
        };

        if (userData.position?.facingDirection === Direction.UP) {
          newPosition.y += 1;
        }
        if (userData.position?.facingDirection === Direction.DOWN) {
          newPosition.y -= 1;
        }
        if (userData.position?.facingDirection === Direction.LEFT) {
          newPosition.x += 1;
        }
        if (userData.position?.facingDirection === Direction.RIGHT) {
          newPosition.x -= 1;
        }

        scene.gridEngine.moveTo(Sprites.PLAYER, newPosition);

        oakNoPokemonScenario(scene);

        return;
      }

      if (randomNumber === max / 2) {
        scene.gridEngine.stopMovement(Sprites.PLAYER);
        scene.gridEngine.setSpeed(Sprites.PLAYER, 0);
        const battleStarted = scene.data.get("battleStarted");

        if (!battleStarted) {
          const pokemon = getRandomPokemonFromZone(
            Number(
              grass.properties.find(
                (property: ObjectProperties) => property.name === "id",
              )?.value,
            ),
          );

          scene.sound.stopAll();
          scene.sound.play(Audios.BATTLE, getAudioConfig());

          scene.data.set("battleStarted", true);

          scene.cameras.main.shake(1500, 0.01);

          scene.time.delayedCall(1500, () => {
            scene.cameras.main.fadeOut(200);
          });

          scene.time.delayedCall(2000, () => {
            scene.data.reset();
            scene.receivedData = {};
            scene.scene.stop("World").start("Battle", {
              pokemon,
            });
          });
        }
      }
    }
  }
};

export const handleDialogObject = (dialog: Types.Tilemaps.TiledObject) => {
  const content = dialog.properties.find(
    (property: ObjectProperties) => property.name === "content",
  )?.value;

  if (content) {
    openDialog({ content });
  }
};

export const handlePokeball = (
  scene: WorldScene,
  pokeball: Types.Tilemaps.TiledObject,
  callback?: () => void,
) => {
  const pokemonInside = pokeball.properties.find(
    (property: ObjectProperties) => property.name === "pokemon_inside",
  )?.value;

  removeObject(scene, pokeball);

  useUserDataStore.getState().addObjectToInventory(pokeball.id);

  if (pokemonInside) {
    const pokemon = pokemons[pokemonInside - 1];
    useUserDataStore.getState().addPokemon(pokemon.id);

    scene.sound.play(Audios.GAIN, getAudioConfig(0.1, false));
    openDialog({
      content: `You got a <span class="gain">${pokemon.name}</span>!`,
      callback,
    });
  }
};

export const handleBicycle = (scene: WorldScene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerUINextStep();
  }

  const userData = useUserDataStore.getState();
  const mapProperties = scene.tilemap.properties as ObjectProperties[];
  const isIndoor =
    mapProperties.find &&
    mapProperties.find(
      (property: ObjectProperties) => property.name === "indoor",
    );

  if (isUIOpen()) {
    return;
  }

  if (isIndoor) {
    playClick(scene);
    openDialog({ content: "No bicycle inside!" });
    return;
  }

  const onBicycle = userData.onBicycle;

  if (!onBicycle) {
    scene.sound.play(Audios.BICYCLE, getAudioConfig(0.5, false));
  }

  const tile = getCurrentPlayerTile(scene);

  if (!tile) {
    return;
  }

  userData.update({
    onBicycle: !onBicycle,
  });

  scene.player.visible = onBicycle;
  scene.bicycle.visible = !onBicycle;

  scene.gridEngine.setSprite(
    Sprites.PLAYER,
    onBicycle ? scene.player : scene.bicycle,
  );
  scene.gridEngine.setSpeed(Sprites.PLAYER, onBicycle ? 5 : 10);
  scene.cameras.main.startFollow(onBicycle ? scene.player : scene.bicycle);
  scene.followWithCamera(onBicycle ? scene.player : scene.bicycle);
};

export const getNPCs = (scene: WorldScene) => {
  const objects = scene.tilemap
    .getObjectLayer(Layers.OBJECTS)
    ?.objects.map((object) => convertObjectPositionToTilePosition(object));

  return objects?.filter((object) => object.name === "npc") ?? [];
};

export const spawnNPCs = (scene: WorldScene) => {
  const NPCs = getNPCs(scene);
  const { hasCompletedScenario } = useUserDataStore.getState();

  if (NPCs.length) {
    NPCs.forEach((npc) => {
      const hideAfter = getTiledObjectProperty("hide_after", npc);
      const name = getTiledObjectProperty("name", npc);
      const sprite = getTiledObjectProperty("sprite", npc);
      const x = getTiledObjectProperty("x", npc);
      const y = getTiledObjectProperty("y", npc);
      const move = getTiledObjectProperty("move", npc);
      const facingDirection = getTiledObjectProperty(
        "facing_direction",
        npc,
      ) as Direction;

      if (hideAfter && hasCompletedScenario(Number(hideAfter))) {
        return removeObject(scene, npc);
      }

      const phaserSprite = scene.add.sprite(0, 0, sprite);
      phaserSprite.setOrigin(0.5, 0.5);
      phaserSprite.setDepth(1);

      scene.gridEngine.addCharacter({
        id: name,
        sprite: phaserSprite,
        walkingAnimationMapping: 0,
        startPosition: { x, y },
        speed: 5,
        facingDirection,
      });

      if (!!move) {
        moveRandomly(scene.gridEngine, name);
      }
    });
  }
};

export const handleNPC = (
  scene: WorldScene,
  npc: Types.Tilemaps.TiledObject,
) => {
  const firstPossibleScenario = getFirstPossibleScenario(npc);

  if (!Number.isNaN(firstPossibleScenario)) {
    const npcName = getTiledObjectProperty("name", npc);
    const playerDirection = getCharacterDirectionDependingOnAnotherCharacter(
      scene.gridEngine,
      Sprites.PLAYER,
      npcName,
    );

    scene.gridEngine.turnTowards(npcName, playerDirection);

    if (firstPossibleScenario !== 0) {
      return scenarios[firstPossibleScenario - 1]([npc], scene);
    }
  }
};
