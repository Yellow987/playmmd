"use client";
import { configureStore } from "@reduxjs/toolkit";
import mmdMotions from "./mmdMotions";

export const store = configureStore({
  reducer: {
    mmdMotions: mmdMotions,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
