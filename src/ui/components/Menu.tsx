import React, { useState } from "react";

import { UIEvents } from "../../constants/events";
import { useUIStore } from "../../stores/ui";
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
  const [selected, setSelected] = useState<Options>(Options.POKEDEX);

  const selectPreviousOption = () => {
    setSelected(
      (current) =>
        options[options.indexOf(current) - 1] || options[options.length - 1]
    );
  };

  const selectNextOption = () => {
    setSelected(
      (current) => options[options.indexOf(current) + 1] || options[0]
    );
  };

  useEventsListeners([
    {
      name: UIEvents.UP,
      callback: selectPreviousOption,
    },
    {
      name: UIEvents.DOWN,
      callback: selectNextOption,
    },
  ]);

  return (
    <div
      id="menu"
      style={{
        display: store.menu.isOpen ? "block" : "none",
      }}
    >
      <ul>
        {options.map((option) => (
          <li key={option} className={option === selected ? "selected" : ""}>
            {option}
          </li>
        ))}
      </ul>
    </div>
  );
};
