import type WorldScene from "../scenes/WorldScene";
import type { WorldReceivedData } from "../scenes/WorldScene";
import { Audios, Layers, Objects, Sprites } from "../constants/assets";
import { TILE_SIZE } from "../constants/game";
import { getCurrentPlayerTile } from "./map";
import { getAudioConfig, playClick } from "./audio";
import { Direction } from "grid-engine";
import {
  isDialogOpen,
  isUIOpen,
  openDialog,
  triggerDialogNextStep,
} from "./ui";
import { useUserDataStore } from "../stores/userData";

export const convertObjectPositionToTilePosition = (
  object: Phaser.Types.Tilemaps.TiledObject
) => ({
  ...object,
  x: ~~(object.x / TILE_SIZE),
  y: ~~(object.y / TILE_SIZE),
});

export const findObjectByPosition = (
  scene: WorldScene,
  position: { x: number; y: number }
) => {
  const { tilemap } = scene;

  const objects = tilemap
    .getObjectLayer(Layers.OBJECTS)
    .objects.map((object) => convertObjectPositionToTilePosition(object));

  return objects.find(
    (object) => object.x === position.x && object.y === position.y
  );
};

export const getObjectUnderPlayer = (scene: WorldScene) => {
  const currentTile = getCurrentPlayerTile(scene);

  const playerPosition = {
    x: currentTile?.x,
    y: currentTile?.y,
  };

  return findObjectByPosition(scene, playerPosition);
};

export const getObjectLookedAt = (scene: WorldScene) => {
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

  return findObjectByPosition(scene, lookingPosition);
};

export const getTiledObjectProperty = (
  name: string,
  object: Phaser.Types.Tilemaps.TiledObject
) => {
  return object.properties?.find((property) => property.name === name)?.value;
};

export const removeObject = (
  scene: WorldScene,
  object: Phaser.Types.Tilemaps.TiledObject
) => {
  const removeTile = (layer: Layers) =>
    scene.tilemap.removeTileAt(object.x, object.y, false, false, layer);

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

export const handleClickOnObject = (scene: WorldScene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerDialogNextStep();
  }

  const object = getObjectLookedAt(scene);

  if (object) {
    playClick(scene);

    switch (object.name) {
      case Objects.DIALOG:
        handleDialogObject(object);
        break;
      case Objects.POKEBALL:
        handlePokeball(scene, object);
    }
  }
};

export const handleOverlappableObject = (
  scene: WorldScene,
  object: Phaser.Types.Tilemaps.TiledObject
) => {
  switch (object.name) {
    case Objects.DOOR:
      handleDoor(scene, object);
      break;
  }
};

export const handleDoor = (
  scene: WorldScene,
  door: Phaser.Types.Tilemaps.TiledObject
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

export const handleDialogObject = (
  dialog: Phaser.Types.Tilemaps.TiledObject
) => {
  const content = dialog.properties.find(
    ({ name }) => name === "content"
  )?.value;

  if (content) {
    openDialog(content);
  }
};

export const handlePokeball = (
  scene: WorldScene,
  pokeball: Phaser.Types.Tilemaps.TiledObject
) => {
  const pokemonInside = pokeball.properties.find(
    ({ name }) => name === "pokemon_inside"
  )?.value;

  removeObject(scene, pokeball);

  useUserDataStore.getState().addObjectToInventory(pokeball.id);

  if (pokemonInside) {
    scene.sound.play(Audios.GAIN, getAudioConfig(0.1, false));
    openDialog(
      `You found a <span class="gain">${pokemonInside}</span> inside this pokeball!`
    );
  }
};

export const handleBicycle = (scene: WorldScene) => {
  if (isDialogOpen()) {
    playClick(scene);
    return triggerDialogNextStep();
  }

  const userData = useUserDataStore.getState();
  const mapProperties = scene.tilemap.properties as any;
  const isIndoor =
    mapProperties.find && mapProperties.find(({ name }) => name === "indoor");

  if (isUIOpen()) {
    return;
  }

  if (isIndoor) {
    playClick(scene);
    openDialog("No bicycle inside!");
    return;
  }

  const onBicycle = userData.onBicycle;

  if (!onBicycle) {
    scene.sound.play(Audios.BICYCLE, getAudioConfig(0.5, false));
  }

  const tile = getCurrentPlayerTile(scene);

  userData.update({
    onBicycle: !onBicycle,
  });

  scene.scene.restart({
    startPosition: {
      x: tile.x,
      y: tile.y,
    },
    facingDirection: scene.gridEngine.getFacingDirection(Sprites.PLAYER),
  } as WorldReceivedData);
};
