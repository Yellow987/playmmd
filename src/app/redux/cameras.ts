"use client";
import { AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INITIAL_ACTIVE_CAMERA } from "./initial";

export type ActiveCamera = "mmdCamera" | "arcCamera";

const cameras = createSlice({
  name: "cameras",
  initialState: {
    activeCamera: INITIAL_ACTIVE_CAMERA,
    mmdCameraMotion: "",
  },
  reducers: {
    setActiveCamera: (state, action: PayloadAction<ActiveCamera>) => {
      state.activeCamera = action.payload;
    },
    setMmdCameraMotion: (state, action: PayloadAction<AnimationPreset>) => {
      state.mmdCameraMotion = action.payload;
    },
  },
});

export const { setActiveCamera, setMmdCameraMotion } = cameras.actions;
export default cameras.reducer;
