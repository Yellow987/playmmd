"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  INITIAL_DEPTH_OF_FIELD_ENABLED,
  INITIAL_PLAY_ANIMATION,
  INITIAL_VOLUME,
} from "./initial";

const controls = createSlice({
  name: "controls",
  initialState: {
    depthOfFieldEnabled: INITIAL_DEPTH_OF_FIELD_ENABLED,
    playAnimation: INITIAL_PLAY_ANIMATION,
    volume: INITIAL_VOLUME,
  },
  reducers: {
    setDepthOfFieldEnabled: (state, action: PayloadAction<boolean>) => {
      state.depthOfFieldEnabled = action.payload;
    },
  },
});

export const { setDepthOfFieldEnabled } = controls.actions;
export default controls.reducer;
