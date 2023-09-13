import { useEffect, useState } from "react";

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

  const [selectedChoice, setSelectedChoice] = useState<string>();

  const isLastStep = dialog.currentStepIndex === dialog.steps.length - 1;
  const shouldShowChoices = isLastStep && !!dialog.choices.length;

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
      dialog.callback?.(selectedChoice);
      closeDialog();
    }
  };

  useEventsListeners(
    [
      {
        name: UIEvents.NEXT_STEP,
        callback: triggerNextStep,
      },
      {
        name: UIEvents.UP,
        callback: () => {
          setSelectedChoice((current) => 
            dialog.choices[dialog.choices.indexOf(current) - 1] ||
            dialog.choices[dialog.choices.length - 1]
          )
        },
      },
      {
        name: UIEvents.DOWN,
        callback: () => {
          setSelectedChoice((current) => 
            dialog.choices[dialog.choices.indexOf(current) + 1] ||
            dialog.choices[0]
          )
        }
      },
    ],
    [dialog, selectedChoice],
  );

  useEffect(() => {
    setSelectedChoice(dialog.choices[0]);
  }, [dialog.choices]);

  return (
    <div className="dialogContainer">
      {shouldShowChoices && (
        <div
          className="dialog choice"
          style={{
            display: dialog.isOpen ? "block" : "none",
          }}
        >
          <div className="inner">
            {dialog.choices.map((choice) => (
              <span
                style={{
                  display: "block",
                  color: selectedChoice === choice ? "red" : "black",
                }}
              >
                {choice}
              </span>
            ))}
          </div>
        </div>
      )}
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
          {!shouldShowChoices && <span className="blink">▼</span>}
        </div>
      </div>
    </div>
  );
};
