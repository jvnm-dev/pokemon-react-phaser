import create from "zustand";

interface UIStore {
  dialog: {
    isOpen: boolean;
    content: string;
  };
  toggleDialog: (content?: string) => void;
}

export const useUIStore = create<UIStore>((set) => ({
  dialog: {
    isOpen: false,
    content: "",
  },
  toggleDialog: (content) =>
    set((state) => ({
      dialog: {
        isOpen: !state.dialog.isOpen,
        content,
      },
    })),
}));
