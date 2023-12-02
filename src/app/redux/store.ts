"use client";
import { configureStore } from "@reduxjs/toolkit";
import mmdMotions from "./mmdMotions";
import mmdModels from "./mmdModels";
import cameras from "./cameras";
import controls from "./controls";

export const store = configureStore({
  reducer: {
    mmdMotions: mmdMotions,
    mmdModels: mmdModels,
    cameras: cameras,
    controls: controls,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
