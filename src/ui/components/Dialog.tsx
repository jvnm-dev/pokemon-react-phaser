import { UIEvents } from "../../constants/events";
import { useUIStore } from "../../stores/ui";
import { useEventsListeners } from "../../utils/events";

export const Dialog = () => {
  const { dialog, closeDialog, set } = useUIStore(
    ({ dialog, closeDialog, set }) => ({
      dialog,
      closeDialog,
      set,
    }),
  );

  const triggerNextStep = () => {
    const nextStepIndex = dialog.currentStepIndex + 1;

    if (dialog.steps[nextStepIndex]) {
      set((current) => ({
        ...current,
        dialog: {
          ...current.dialog,
          currentStepIndex: nextStepIndex,
        },
      }));
    } else {
      dialog.callback?.();
      closeDialog();
    }
  };

  useEventsListeners(
    [
      {
        name: UIEvents.NEXT_STEP,
        callback: triggerNextStep,
      },
    ],
    [dialog],
  );

  return (
    <div
      className="dialog"
      style={{
        display: dialog.isOpen ? "block" : "none",
      }}
    >
      <div className="inner">
        <span
          dangerouslySetInnerHTML={{
            __html: dialog.steps[dialog.currentStepIndex],
          }}
        ></span>
        <span className="blink">▼</span>
      </div>
    </div>
  );
};
