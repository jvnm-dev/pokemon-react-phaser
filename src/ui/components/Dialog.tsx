import React, { useState, useEffect, useRef } from "react";
import { DialogEvents } from "../../constants/events";
import { useUIStore } from "../../stores/ui";

interface IDialogState {
  steps: string[];
  currentStepIndex: number;
}

const defaultState: IDialogState = {
  steps: [],
  currentStepIndex: 0,
};

export const Dialog = () => {
  const store = useUIStore();
  const [state, _setState] = useState<IDialogState>(defaultState);
  const stateRef = useRef(state);

  const setState = (data) => {
    stateRef.current = data;
    _setState(data);
  };

  const triggerNextStep = () => {
    const nextStepIndex = stateRef.current.currentStepIndex + 1;

    if (nextStepIndex <= stateRef.current.steps.length - 1) {
      setState({
        ...stateRef.current,
        currentStepIndex: nextStepIndex,
      });
    } else {
      store.toggleDialog();
    }
  };

  useEffect(() => {
    window.addEventListener(DialogEvents.NEXT_STEP, triggerNextStep);
    () => window.removeEventListener(DialogEvents.NEXT_STEP, triggerNextStep);
  }, []);

  useEffect(() => {
    const { isOpen, content } = store.dialog;

    if (!isOpen) {
      setState(defaultState);
    }

    if (isOpen) {
      setState({
        ...state,
        steps: content.split(";"),
      });
    }
  }, [store.dialog]);

  return (
    <div className="dialog">
      <div className="inner">
        <span
          dangerouslySetInnerHTML={{
            __html: stateRef.current.steps[state.currentStepIndex],
          }}
        ></span>
        <span className="blink">▼</span>
      </div>
    </div>
  );
};
