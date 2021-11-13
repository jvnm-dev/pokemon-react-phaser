import type WorldScene from "../scenes/WorldScene";
import { TILE_SIZE } from "../constants/game";
import { getAudioConfig } from "./audio";
import { Audios, Layers, Objects, Sprites } from "../constants/assets";
import { getCurrentPlayerTile } from "./map";
import { Direction } from "grid-engine";

export const findObjectByPosition = (
  scene: WorldScene,
  position: { x: number; y: number }
) => {
  const { tilemap } = scene;

  const objects = tilemap
    .getObjectLayer(Layers.OBJECTS)
    .objects.map((object) => ({
      ...object,
      x: ~~(object.x / TILE_SIZE),
      y: ~~(object.y / TILE_SIZE),
    })) as Phaser.Types.Tilemaps.TiledObject[];

  return objects.find(
    (object) => object.x === position.x && object.y === position.y
  );
};

export const getObjectUnderPlayer = (scene: WorldScene) => {
  const currentTile = getCurrentPlayerTile(scene);

  const playerPosition = {
    x: currentTile?.x + 1,
    y: currentTile?.y + 1,
  };

  return findObjectByPosition(scene, playerPosition);
};

export const getObjectLookedAt = (scene: WorldScene) => {
  const { tilemap } = scene;

  const currentTile = getCurrentPlayerTile(scene);
  const facingDirection = scene.gridEngine.getFacingDirection(Sprites.PLAYER);

  const lookingPosition = {
    x: (currentTile?.x ?? 0) + 1,
    y: (currentTile?.y ?? 0) + 1,
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

  return findObjectByPosition(scene, lookingPosition);
};

export const getTiledObjectProperty = (
  name: string,
  object: Phaser.Types.Tilemaps.TiledObject
) => {
  return object.properties?.find((property) => property.name === name)?.value;
};

// Spawn
export const getSpawn = (scene: WorldScene) => {
  const spawnPoint = scene.tilemap.findObject(
    Layers.OBJECTS,
    (obj) => obj.name === Objects.SPAWN
  );

  const facingDirection = spawnPoint.properties?.find(
    ({ name }) => name === "spriteDirection"
  )?.value;

  return {
    startPosition: {
      x: Math.floor(spawnPoint.x / TILE_SIZE),
      y: Math.floor(spawnPoint.y / TILE_SIZE),
    },
    facingDirection,
  };
};

// Door
export const handleDoor = (
  scene: WorldScene,
  door: Phaser.Types.Tilemaps.TiledObject
) => {
  const nextMap = getTiledObjectProperty("nextMap", door);
  const x = getTiledObjectProperty("x", door);
  const y = getTiledObjectProperty("y", door);

  scene.map = nextMap;
  scene.sound.play(Audios.DOOR, getAudioConfig(0.5, false));
  scene.scene.restart({ startPosition: { x, y } });
};
