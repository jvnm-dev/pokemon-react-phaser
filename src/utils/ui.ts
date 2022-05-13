import { UIEvents } from "../constants/events";
import { useUIStore } from "../stores/ui";

export const isUIOpen = (): boolean => {
  return isDialogOpen() || isMenuOpen() || isBattleOpen();
};

export const isDialogOpen = (): boolean => {
  return useUIStore.getState().dialog.isOpen;
};

export const isMenuOpen = (): boolean => {
  return useUIStore.getState().menu.isOpen;
};

export const isBattleOpen = (): boolean => {
  return useUIStore.getState().battle.isOpen;
};

export const openDialog = (content: string): void => {
  return useUIStore.getState().toggleDialog(content);
};

export const toggleMenu = (): void => {
  if (!isDialogOpen()) {
    return useUIStore.getState().toggleMenu();
  }
};

export const triggerUIExit = (): void => {
  window.dispatchEvent(new Event(UIEvents.EXIT));
};

export const triggerUINextStep = (): void => {
  window.dispatchEvent(new Event(UIEvents.NEXT_STEP));
};

export const triggerUIDown = (): void => {
  window.dispatchEvent(new Event(UIEvents.DOWN));
};

export const triggerUIUp = (): void => {
  window.dispatchEvent(new Event(UIEvents.UP));
};

export const triggerUILeft = (): void => {
  window.dispatchEvent(new Event(UIEvents.LEFT));
};

export const triggerUIRight = (): void => {
  window.dispatchEvent(new Event(UIEvents.RIGHT));
};
