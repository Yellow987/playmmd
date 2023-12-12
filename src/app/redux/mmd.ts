import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
  AnimationPresetData,
} from "../mmd-generator/constants";

const mmd = createSlice({
  name: "mmd",
  initialState: {
    mmdIsLoaded: false,
    animationData: ANIMATION_PRESETS_DATA[
      AnimationPreset.LAST_CHRISTMAS
    ] as AnimationPresetData,
  },
  reducers: {
    setMmdIsLoaded: (state, action: PayloadAction<boolean>) => {
      state.mmdIsLoaded = action.payload;
    },
    setAnimationData: (state, action: PayloadAction<AnimationPresetData>) => {
      state.animationData = action.payload;
    },
  },
});

export const { setMmdIsLoaded, setAnimationData } = mmd.actions;
export default mmd.reducer;
