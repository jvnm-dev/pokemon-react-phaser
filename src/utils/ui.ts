import { useUIStore } from "../stores/ui";

export const isUIOpen = (): boolean => {
  return isDialogOpen();
};

export const isDialogOpen = (): boolean => {
  return useUIStore.getState().dialog.isOpen;
};

export const toggleDialog = (content?: string): void => {
  return useUIStore.getState().toggleDialog(content);
};
