import create from "zustand";

interface UIStore {
  dialog: {
    isOpen: boolean;
    content: string;
  };
  menu: {
    isOpen: boolean;
  };
  toggleDialog: (content?: string) => void;
  toggleMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dialog: {
    isOpen: false,
    content: "",
  },
  menu: {
    isOpen: false,
  },
  toggleDialog: (content) =>
    set((state) => ({
      dialog: {
        isOpen: !state.dialog.isOpen,
        content,
      },
    })),
  toggleMenu: () =>
    set((state) => ({
      menu: {
        isOpen: !state.menu.isOpen,
      },
    })),
}));
