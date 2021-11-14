import type Phaser from "phaser";

import { Audios } from "../constants/assets";

export const getAudioConfig = (
  volume: number = 0.1,
  loop: boolean = true
): Phaser.Types.Sound.SoundConfig => ({
  mute: false,
  volume,
  rate: 1,
  detune: 0,
  loop,
});

export const playClick = (scene: Phaser.Scene) => {
  scene.sound.play(Audios.CLICK, getAudioConfig(0.2, false));
};
