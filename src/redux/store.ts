"use client";
import { configureStore } from "@reduxjs/toolkit";
import mmdMotions from "./mmdMotions";
import mmdModels from "./mmdModels";
import cameras from "./cameras";
import controls from "./controls";
import audio from "./audio";
import mmd from "./mmd";

export const store = configureStore({
  reducer: {
    mmdMotions: mmdMotions,
    mmdModels: mmdModels,
    cameras: cameras,
    controls: controls,
    audio: audio,
    mmd: mmd,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;