"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const mmd = createSlice({
  name: "mmd",
  initialState: {
    second: 0,
    animationDuration: 0,
    isPlaying: true,
    fps: 30,
  },
  reducers: {
    setSecond: (state, action: PayloadAction<number>) => {
      state.second = action.payload;
    },
    setAnimationDuration: (state, action: PayloadAction<number>) => {
      state.animationDuration = action.payload;
    },
    setIsPlaying: (state, action: PayloadAction<boolean>) => {
      state.isPlaying = action.payload;
    },
    setFps: (state, action: PayloadAction<number>) => {
      state.fps = action.payload;
    },
  },
});

export const { setSecond, setAnimationDuration, setIsPlaying, setFps } =
  mmd.actions;
export default mmd.reducer;
