"use client";
import { configureStore } from "@reduxjs/toolkit";
import mmd from "./mmd";

export const store = configureStore({
  reducer: {
    mmd: mmd,
  },
});

export type MmdState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
