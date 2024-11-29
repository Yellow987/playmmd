"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const controls = createSlice({
  name: "controls",
  initialState: {
    isDepthOfFieldEnabled: true,
    volume: 1,
    isMuted: true,
    isFullscreen: false,
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
    setIsFullscreen: (state, action: PayloadAction<boolean>) => {
      state.isFullscreen = action.payload;
    },
  },
});

export const { setIsDepthOfFieldEnabled, setVolume, setIsMuted, setIsFullscreen } =
  controls.actions;
export default controls.reducer;
