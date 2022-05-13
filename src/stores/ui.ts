import create from "zustand";
import { devtools } from "zustand/middleware";

interface UIStore {
  dialog: {
    isOpen: boolean;
    content?: string;
  };
  menu: {
    isOpen: boolean;
  };
  battle: {
    isOpen: boolean;
  };
  toggleDialog: (content?: string) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleBattle: () => void;
}

export const useUIStore = create<UIStore>()(
  devtools((set) => ({
    dialog: {
      isOpen: false,
      content: "",
    },
    menu: {
      isOpen: false,
    },
    battle: {
      isOpen: false,
    },
    toggleDialog: (content) =>
      set((state) => ({
        dialog: {
          isOpen: !state.dialog.isOpen,
          content,
        },
      })),
    closeDialog: () =>
      set(() => ({ dialog: { isOpen: false, content: undefined } })),
    toggleMenu: () =>
      set((state) => ({
        menu: {
          isOpen: !state.menu.isOpen,
        },
      })),
    toggleBattle: () =>
      set((state) => ({
        battle: {
          isOpen: !state.battle.isOpen,
        },
      })),
  }))
);
