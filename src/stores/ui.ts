import create, { SetState } from "zustand";

interface UIStore {
  isMenuOpen: boolean;
  toggleMenu: () => void;
}

export const useUIStore = create<UIStore>((set) => ({
  isMenuOpen: false,
  toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),
}));
