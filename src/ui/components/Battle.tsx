import React from "react";
import { useEventsListeners } from "../../utils/events";

import { useUIStore } from "../../stores/ui";
import { UIEvents } from "../../constants/events";
import { UIBase } from "../UI";

export const Battle = ({ game }: UIBase) => {
  const UIStore = useUIStore();

  useEventsListeners(
    [
      {
        name: UIEvents.EXIT,
        callback: () => {
          if (UIStore.battle.isOpen) {
            game.scene.stop("Battle").start("World");
            useUIStore.getState().toggleBattle();
          }
        },
      },
    ],
    [UIStore.battle.isOpen]
  );

  return (
    <div
      className="battle_menu"
      style={{
        display: UIStore.battle.isOpen ? "block" : "none",
      }}
    >
      <h1>Test</h1>
    </div>
  );
};
