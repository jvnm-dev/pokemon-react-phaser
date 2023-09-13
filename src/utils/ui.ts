import { UIEvents } from "../constants/events";
import { useUIStore } from "../stores/ui";

export const isUIOpen = () => {
  return isDialogOpen() || isMenuOpen() || isBattleOpen();
};

export const isDialogOpen = () => {
  return useUIStore.getState().dialog.isOpen;
};

export const isMenuOpen = () => {
  return useUIStore.getState().menu.isOpen;
};

export const isBattleOpen = () => {
  return useUIStore.getState().battle.isOpen;
};

export const openDialog = (content: string, callback?: () => void) => {
  return useUIStore.getState().toggleDialog(content, callback);
};

export const toggleMenu = () => {
  if (!isDialogOpen()) {
    return useUIStore.getState().toggleMenu();
  }
};

export const dispatch = <T>(eventType: string, detail?: T) => {
  window.dispatchEvent(new CustomEvent(eventType, { detail }));
};

export const triggerUIExit = () => dispatch(UIEvents.EXIT);

export const triggerUINextStep = () => dispatch(UIEvents.NEXT_STEP);

export const triggerUIDown = () => dispatch(UIEvents.DOWN);

export const triggerUIUp = () => dispatch(UIEvents.UP);

export const triggerUILeft = () => dispatch(UIEvents.LEFT);

export const triggerUIRight = () => dispatch(UIEvents.RIGHT);
