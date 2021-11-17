import create from "zustand";
import { persist, devtools } from "zustand/middleware";

import type { Maps } from "../constants/assets";

interface IPosition {
  map: Maps;
  x: number;
  y: number;
}

interface IInventoryObject {
  objectId: number;
}

interface IUserDataStore {
  position?: IPosition;
  setPosition: (position: IPosition) => void;

  inventory: IInventoryObject[];
  addObjectToInventory: (objectId: number) => void;
}

export const useUserDataStore = create<IUserDataStore>(
  devtools(
    persist(
      (set) => ({
        setPosition: (position: IPosition) => {
          set((state) => ({ ...state, position }));
        },

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
