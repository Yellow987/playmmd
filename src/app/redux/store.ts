"use client";
import { configureStore } from "@reduxjs/toolkit";
import mmdMotions from "./mmdMotions";
import mmdModels from "./mmdModels";

export const store = configureStore({
  reducer: {
    mmdMotions: mmdMotions,
    mmdModels: mmdModels,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
