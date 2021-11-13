import React, { useEffect, useState } from "react";
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
        display: store.isMenuOpen ? "block" : "none",
        width: size.width,
        height: size.height,
      }}
    >
      <div className="test">Hello, React!</div>
    </div>
  );
};
