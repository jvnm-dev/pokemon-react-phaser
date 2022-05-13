import React, { useState, useEffect } from "react";
import capitalize from "lodash/capitalize";

import { useEventsListeners } from "../../../utils/events";
import { UIEvents } from "../../../constants/events";
import { useUIStore } from "../../../stores/ui";
import { useUserDataStore } from "../../../stores/userData";

import type { Options as ParentOptions } from "../Menu";
import { handleDialogObject } from "../../../utils/object";

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
  SKIP_INTRO_SCREEN = "skipIntroScreen",
}

export type SettingsMenuProps = {
  setSelectedOption: React.Dispatch<
    React.SetStateAction<ParentOptions | undefined>
  >;
};

export const SettingsMenu = ({ setSelectedOption }: SettingsMenuProps) => {
  const UIStore = useUIStore();
  const userDataStore = useUserDataStore();

  const [hovered, setHovered] = useState<Options | GeneralOptions>(
    Options.GENERAL
  );

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
      (current: any) =>
        options[options.indexOf(current as never) - 1] ||
        options[options.length - 1]
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
      (current: any) =>
        options[options.indexOf(current as never) + 1] || options[0]
    );
  };

  const exit = () => {
    setSelectedOption(undefined);
    handleDialogObject({
      properties: [
        {
          name: "content",
          value:
            "You must reload the page for you changes to be taken in account!",
        },
      ],
    } as Phaser.Types.Tilemaps.TiledObject);
  };

  const processHoveredOption = () => {
    if (hovered === GeneralOptions.ENABLE_AUDIO) {
      userDataStore.update({
        ...userDataStore,
        settings: {
          ...userDataStore.settings,
          general: {
            ...userDataStore.settings.general,
            enableSound: !userDataStore.settings.general.enableSound,
          },
        },
      });
    }

    if (hovered === GeneralOptions.SKIP_INTRO_SCREEN) {
      userDataStore.update({
        ...userDataStore,
        settings: {
          ...userDataStore.settings,
          general: {
            ...userDataStore.settings.general,
            skipIntroScreen: !userDataStore.settings.general.skipIntroScreen,
          },
        },
      });
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
    [UIStore.menu.isOpen, hovered, hoveringRegion, userDataStore.settings]
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

  return (
    <div className="menu full">
      <div className="submenu">
        <ul>
          {Object.values(Options).map((option) => (
            <li key={option} className={option === hovered ? "hovered" : ""}>
              {capitalize(option)}
            </li>
          ))}
        </ul>
      </div>

      <div className="content">
        {(hovered === Options.GENERAL ||
          hoveringRegion.leftOption === Options.GENERAL) && (
          <>
            <div
              className={
                GeneralOptions.ENABLE_AUDIO === (hovered as GeneralOptions)
                  ? "hovered"
                  : ""
              }
            >
              <label>Enable sounds</label>
              <input
                type="checkbox"
                checked={userDataStore.settings.general.enableSound}
                onChange={() => null}
              />
            </div>

            <div
              className={
                GeneralOptions.SKIP_INTRO_SCREEN === (hovered as GeneralOptions)
                  ? "hovered"
                  : ""
              }
            >
              <label>Skip intro screen</label>
              <input
                type="checkbox"
                checked={userDataStore.settings.general.skipIntroScreen}
                onChange={() => null}
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};
