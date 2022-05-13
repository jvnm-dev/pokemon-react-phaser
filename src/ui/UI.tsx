import React, { useEffect, useState } from "react";

import { isUIOpen } from "../utils/ui";
import { useUIStore } from "../stores/ui";
import { useWindowSize } from "./hooks/useWindowSize";
import { Menu } from "./components/Menu";
import { Dialog } from "./components/Dialog";
import { Battle } from "./components/Battle";

export type UIBase = {
  game: Phaser.Game;
};

export const UI = ({ game }: UIBase) => {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const windowSize = useWindowSize();

  useUIStore();

  useEffect(() => {
    const canvas = document.getElementsByTagName("canvas")?.[0];
    setSize({
      width: Number(canvas.style?.width.replace("px", "")) ?? canvas.width,
      height: Number(canvas.style?.height.replace("px", "")) ?? canvas.height,
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
      <Menu />
      <Dialog />
      <Battle game={game} />
    </div>
  );
};
