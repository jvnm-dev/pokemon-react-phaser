import React, { useState, useEffect } from "react";
import capitalize from "lodash/capitalize";

import { useEventsListeners } from "../../../utils/events";
import { UIEvents } from "../../../constants/events";
import { useUIStore } from "../../../stores/ui";

import type { Options as ParentOptions } from "../Menu";
import { useUserDataStore } from "../../../stores/userData";
import { pokemons } from "../../../constants/pokemons";
import { IPokemon } from "../../../constants/types";
import { Gender } from "../Gender";

export enum Options {
  GENERAL = "general",
}

export enum HoveringRegionDirection {
  LEFT = "left",
  RIGHT = "right",
}

export type HoveringRegion = {
  leftOption?: Options;
  direction: HoveringRegionDirection;
};

export enum GeneralOptions {
  ENABLE_AUDIO = "enableAudio",
}

export type TeamMenuProps = {
  setSelectedOption: React.Dispatch<
    React.SetStateAction<ParentOptions | undefined>
  >;
};

type AllOptions = Options | GeneralOptions;

export const TeamMenu = ({ setSelectedOption }: TeamMenuProps) => {
  const UIStore = useUIStore();
  const userDataStore = useUserDataStore();
  const team = userDataStore.pokemons;

  const [hovered, setHovered] = useState<AllOptions>(Options.GENERAL);

  const [hoveringRegion, setHoveringRegion] = useState<HoveringRegion>({
    direction: HoveringRegionDirection.LEFT,
  });

  const hoverPreviousOption = () => {
    let options: Options[] | GeneralOptions[];

    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      options = Object.values(Options);
    }

    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      options = Object.values(GeneralOptions);
    }

    setHovered(
      (current: AllOptions) =>
        options[options.indexOf(current as never) - 1] ||
        options[options.length - 1],
    );
  };

  const hoverNextOption = () => {
    let options: Options[] | GeneralOptions[];

    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      options = Object.values(Options);
    }

    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      if (hoveringRegion.leftOption === Options.GENERAL) {
        options = Object.values(GeneralOptions);
      }
    }

    setHovered(
      (current: string) =>
        options[options.indexOf(current as never) + 1] || options[0],
    );
  };

  const exit = () => {
    setSelectedOption(undefined);
  };

  const processHoveredOption = () => {};

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
        callback: processHoveredOption,
      },
      {
        name: UIEvents.LEFT,
        callback: () =>
          setHoveringRegion({
            direction: HoveringRegionDirection.LEFT,
          }),
      },
      {
        name: UIEvents.RIGHT,
        callback: () =>
          hoveringRegion.direction !== HoveringRegionDirection.RIGHT &&
          setHoveringRegion({
            direction: HoveringRegionDirection.RIGHT,
            leftOption: hovered as Options,
          }),
      },
      {
        name: UIEvents.EXIT,
        callback: exit,
      },
    ],
    [UIStore.menu.isOpen, hovered, hoveringRegion],
  );

  useEffect(() => {
    // Reset hovered options
    if (hoveringRegion.direction === HoveringRegionDirection.LEFT) {
      setHovered(Options.GENERAL);
    }

    if (hoveringRegion.direction === HoveringRegionDirection.RIGHT) {
      if (hoveringRegion.leftOption === Options.GENERAL) {
        setHovered(GeneralOptions.ENABLE_AUDIO);
      }
    }
  }, [hoveringRegion]);

  const teamChunks = team?.reduce((result: IPokemon[][], _, index, array) => {
    if (index < 2) {
      result.push(array.slice(index * 3, index * 3 + 3));
    }

    return result;
  }, []);

  return (
    <div className="menu full">
      <div className="content team">
        {team?.length === 0 && (
          <div className="empty">
            <div className="text">You don't have any pokemons yet.</div>
            <div className="text">Go catch some!</div>
          </div>
        )}

        {teamChunks?.map((chunk) => (
          <div className="column">
            {chunk?.map(({ id, hp, gender }) => {
              const pokemon = pokemons.find((p) => p.id === id);

              return (
                <div key={pokemon.id} className="entry">
                  <img
                    src={`/assets/images/pokemons/front/${pokemon.id}.png`}
                    alt={pokemon.name}
                    height={192}
                  />
                  <div>
                    <div className="title">
                      {capitalize(pokemon.name)} <Gender gender={gender} />
                    </div>
                    <div className="hp-bar">
                      <div className="hp">
                        <div className="label">HP</div>
                        <div className="value">
                          {hp}/{pokemon.stats.hp}
                        </div>
                      </div>
                      <progress
                        value={pokemon.stats.hp}
                        max={pokemon.stats.hp}
                      />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};
