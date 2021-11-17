import create from "zustand";
import { persist, devtools } from "zustand/middleware";

import type { Direction } from "grid-engine";

import type { Maps } from "../constants/assets";

interface IPosition {
  map: Maps;
  x: number;
  y: number;
  facingDirection: Direction;
}

interface IInventoryObject {
  objectId: number;
}

interface IUserDataStore {
  onBicycle: boolean;
  position?: IPosition;
  inventory: IInventoryObject[];

  update: (state: Partial<IUserDataStore>) => void;
  addObjectToInventory: (objectId: number) => void;
}

export const useUserDataStore = create<IUserDataStore>(
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
        name: "inventory",
      }
    )
  )
);
