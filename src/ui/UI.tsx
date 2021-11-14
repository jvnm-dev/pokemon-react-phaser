import React, { useEffect, useState } from "react";
import { isUIOpen } from "../utils/ui";
import { useUIStore } from "../stores/ui";
import { useWindowSize } from "./hooks/useWindowSize";
import { Dialog } from "./components/Dialog";

export const UI = () => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const windowSize = useWindowSize();

  useUIStore();

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
      <Dialog />
    </div>
  );
};
