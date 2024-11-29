"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const controls = createSlice({
  name: "controls",
  initialState: {
    isDepthOfFieldEnabled: true,
    volume: 1,
    isMuted: true,
  },
  reducers: {
    setIsDepthOfFieldEnabled: (state, action: PayloadAction<boolean>) => {
      state.isDepthOfFieldEnabled = action.payload;
    },
    setVolume: (state, action: PayloadAction<number>) => {
      state.volume = action.payload;
    },
    setIsMuted: (state, action: PayloadAction<boolean>) => {
      state.isMuted = action.payload;
    },
  },
});

export const { setIsDepthOfFieldEnabled: setIsDepthOfFieldEnabled, setVolume, setIsMuted } =
  controls.actions;
export default controls.reducer;
