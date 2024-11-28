"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const controls = createSlice({
  name: "controls",
  initialState: {
    depthOfFieldEnabled: false,
    volume: 1,
    isMuted: true,
  },
  reducers: {
    setDepthOfFieldEnabled: (state, action: PayloadAction<boolean>) => {
      state.depthOfFieldEnabled = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
  },
});

export const { setDepthOfFieldEnabled, setVolume, setIsMuted } =
  controls.actions;
export default controls.reducer;
