import create from "zustand";
import { persist, devtools } from "zustand/middleware";

interface IInventoryObject {
  objectId: number;
}

interface IUserDataStore {
  inventory: IInventoryObject[];
  addObjectToInventory: (objectId: number) => void;
}

export const useUserDataStore = create<IUserDataStore>(
  devtools(
    persist(
      (set) => ({
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
