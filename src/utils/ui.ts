import { DialogEvents } from "../constants/events";
import { useUIStore } from "../stores/ui";

export const isUIOpen = (): boolean => {
  return isDialogOpen();
};

export const isDialogOpen = (): boolean => {
  return useUIStore.getState().dialog.isOpen;
};

export const openDialog = (content: string): void => {
  return useUIStore.getState().toggleDialog(content);
};

export const triggerDialogNextStep = (): void => {
  window.dispatchEvent(new Event(DialogEvents.NEXT_STEP));
};
