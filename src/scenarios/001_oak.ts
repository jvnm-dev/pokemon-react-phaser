import { openDialog, isDialogOpen } from "../utils/ui";
import WorldScene from "../scenes/WorldScene";
import { getCurrentPlayerTile } from "../utils/map";
import { Sprites } from "../constants/assets";

export default (scene: WorldScene) => {
  if (
    !isDialogOpen()
  ) {
    openDialog({
      content: `OAK: Hey! Wait!\nDon't go out!`,
      callback: () => {
        const oakPhaserSprite = scene.add.sprite(0, 0, 'oak');
        oakPhaserSprite.setOrigin(0.5, 0.5);
        oakPhaserSprite.setDepth(1);

        scene.gridEngine.addCharacter({
          id: 'oak',
          sprite: oakPhaserSprite,
          walkingAnimationMapping: 0,
          startPosition: { x: 12, y: 16 },
          speed: 5,
          collides: {
            collisionGroups: ['npc_no_collision']
          }
        });

        const playerPosition = getCurrentPlayerTile(scene);

        scene.gridEngine.moveTo('oak', { x: playerPosition.x, y: playerPosition.y + 1 }).subscribe({
          complete: () => {
            openDialog({
              content: `
              It's unsafe!\nWild Pokémon live in tall grass!;
              You need your own Pokémon for your protection.;
              I know! Here, come with me!`,
              callback: () => {
                scene.gridEngine.setSpeed(Sprites.PLAYER, 5);
                scene.gridEngine.follow(Sprites.PLAYER, 'oak', { algorithm: "BFS" });
                scene.gridEngine.moveTo('oak', { x: 16, y: 18 });
              }
            });
          }
        });
      }
    });
  }
};
