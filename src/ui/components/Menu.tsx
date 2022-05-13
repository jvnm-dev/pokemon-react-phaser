import React, { useEffect, useState } from "react";

import { UIEvents } from "../../constants/events";
import { openDialog } from "../../utils/ui";
import { useUIStore } from "../../stores/ui";
import { SettingsMenu } from "./menus/SettingsMenu";
import { useEventsListeners } from "../../utils/events";

export enum Options {
  POKEDEX = "Pokedex",
  TEAM = "Team",
  BAG = "Bag",
  YOU = "You",
  SETTINGS = "Settings",
}

export enum Direction {
  UP = "up",
  DOWN = "down",
}

export const Menu = () => {
  const store = useUIStore();
  const options = Object.values(Options);
  const [hovered, setHovered] = useState<Options>(Options.POKEDEX);
  const [selected, setSelected] = useState<Options | undefined>();

  const hoverPreviousOption = () => {
    if (!selected) {
      setHovered(
        (current) =>
          options[options.indexOf(current) - 1] || options[options.length - 1]
      );
    }
  };

  const hoverNextOption = () => {
    if (!selected) {
      setHovered(
        (current) => options[options.indexOf(current) + 1] || options[0]
      );
    }
  };

  const selectOption = () => {
    if (store.menu.isOpen && !selected) {
      if (
        [Options.POKEDEX, Options.BAG, Options.TEAM, Options.YOU].includes(
          hovered
        )
      ) {
        // todo: implement them
        openDialog("This feature is not ready yet.");
        return;
      }

      setSelected(hovered);
    }
  };

  const exit = () => {
    if (store.dialog.isOpen) {
      store.closeDialog();
    } else if (store.menu.isOpen && !selected) {
      store.toggleMenu();
    }
  };

  useEventsListeners(
    [
      {
        name: UIEvents.UP,
        callback: hoverPreviousOption,
      },
      {
        name: UIEvents.DOWN,
        callback: hoverNextOption,
      },
      {
        name: UIEvents.NEXT_STEP,
        callback: selectOption,
      },
      {
        name: UIEvents.EXIT,
        callback: exit,
      },
    ],
    [
      store.closeDialog,
      store.dialog.isOpen,
      store.menu.isOpen,
      hovered,
      selected,
    ]
  );

  useEffect(() => {
    if (store.menu.isOpen === false) {
      setHovered(Options.POKEDEX);
      setSelected(undefined);
    }
  }, [store.menu.isOpen]);

  if (selected === Options.SETTINGS) {
    return <SettingsMenu setSelectedOption={setSelected} />;
  }

  return (
    <div
      className="menu"
      style={{
        display: store.menu.isOpen ? "block" : "none",
      }}
    >
      <ul>
        {options.map((option) => (
          <li key={option} className={option === hovered ? "hovered" : ""}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
