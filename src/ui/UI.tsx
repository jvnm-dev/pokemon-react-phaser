import React, { useEffect, useState } from "react";
import { isUIOpen } from "../utils/ui";
import { useUIStore } from "../stores/ui";
import { useWindowSize } from "./hooks/useWindowSize";

export const UI = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const windowSize = useWindowSize();
  const store = useUIStore();

  useEffect(() => {
    const canvas = document.getElementsByTagName("canvas")?.[0];
    setSize({
      width: canvas.style?.width ?? canvas.width,
      height: canvas.style?.height ?? canvas.height,
    });
  }, [windowSize]);

  return (
    <div
      id="ui"
      style={{
        display: isUIOpen() ? "block" : "none",
        width: size.width,
        height: size.height,
      }}
    >
      <div
        className="dialog"
        style={{
          opacity: store.dialog.isOpen ? 1 : 0,
        }}
      >
        <div className="inner">
          {store.dialog.content}
          <span>▼</span>
        </div>
      </div>
    </div>
  );
};
