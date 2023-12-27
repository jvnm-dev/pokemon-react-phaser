import { create } from "zustand";
import { devtools } from "zustand/middleware";

interface UIStore {
  loading: boolean;
  dialog: {
    isOpen: boolean;
    callback?: (selectedChoice?: string) => void;
    steps: string[];
    currentStepIndex: number;
    choices?: string[];
    image?: string;
  };
  menu: {
    isOpen: boolean;
  };
  battle: {
    isOpen: boolean;
  };
  setLoading: (loading: boolean) => void;
  toggleDialog: (
    content?: string,
    image?: string,
    choices?: string[],
    callback?: (selectedChoice?: string) => void,
  ) => void;
  closeDialog: () => void;
  toggleMenu: () => void;
  toggleBattle: () => void;
  set: (fn: (state: UIStore) => UIStore) => void;
}

export const useUIStore = create<UIStore>()(
  devtools((set) => ({
    loading: true,
    dialog: {
      isOpen: false,
      callback: undefined,
      steps: [],
      currentStepIndex: 0,
      choices: [],
      image: undefined,
    },
    menu: {
      isOpen: false,
    },
    battle: {
      isOpen: false,
    },
    setLoading: (loading) => set(() => ({ loading })),
    toggleDialog: (content, image, choices, callback) => 
      set((state) => ({
        dialog: {
          isOpen: !state.dialog.isOpen,
          callback,
          steps: content?.split(";") ?? [],
          currentStepIndex: 0,
          choices,
          image,
        },
      }))
    ,
    closeDialog: () =>
      set(() => ({
        dialog: {
          isOpen: false,
          callback: undefined,
          steps: [],
          currentStepIndex: 0,
          choices: [],
          image: undefined,
        },
      })),
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
    set,
  })),
);
