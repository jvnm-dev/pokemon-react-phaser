import create from "zustand";
import { persist, devtools } from "zustand/middleware";

import type { Direction } from "grid-engine";

import type { Maps } from "../constants/assets";

interface IPosition {
  map: Maps;
  x?: number;
  y?: number;
  facingDirection: Direction;
}

interface IInventoryObject {
  objectId: number;
}

interface IPokemon {
  id: number;
  uniqId: number;
}

interface ISettings {
  general: {
    enableSound: boolean;
    skipIntroScreen: boolean;
  };
}

interface IUserDataStore {
  onBicycle: boolean;
  position?: IPosition;
  inventory: IInventoryObject[];
  pokemons: IPokemon[];
  settings: ISettings;

  update: (state: Partial<IUserDataStore>) => void;
  addObjectToInventory: (objectId: number) => void;
  addPokemon: (id: number) => void;
}

export const useUserDataStore = create<IUserDataStore>()(
  devtools(
    persist(
      (set) => ({
        update: (updates: Partial<IUserDataStore>) => {
          set((state) => ({
            ...state,
            ...updates,
          }));
        },

        onBicycle: Boolean(false),
        inventory: [],
        pokemons: [],
        settings: {
          general: {
            enableSound: Boolean(true),
            skipIntroScreen: Boolean(false),
          },
        },

        addPokemon: (id: number) => {
          const uniqId = Date.now();

          set((state) => ({
            ...state,
            pokemons: [
              ...state.pokemons,
              {
                id,
                uniqId,
              },
            ],
          }));
        },

        addObjectToInventory: (objectId: number) => {
          set((state) => ({
            ...state,
            inventory: [
              ...state.inventory,
              {
                objectId,
              },
            ],
          }));
        },
      }),
      {
        name: "userData",
      },
    ),
  ),
);
