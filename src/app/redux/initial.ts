import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
} from "../mmd-generator/constants";
import { ActiveCamera } from "./cameras";

export const INITIAL_DEPTH_OF_FIELD_ENABLED = true;
export const INITIAL_ACTIVE_CAMERA = "mmdCamera" as ActiveCamera;
export const INITIAL_PLAY_ANIMATION = true;
export const INITIAL_IS_MUTED = true;
export const INITIAL_VOLUME = 1;
export const INITIAL_AUDIO_PATH =
  ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS].audioPath;
