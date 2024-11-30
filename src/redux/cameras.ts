"use client";
import { AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum ActiveCamera {
  MMD_CAMERA = "mmdCamera",
  ARC_CAMERA = "arcCamera",
  FREE_CAMERA = "freeCamera",
}
const cameras = createSlice({
  name: "cameras",
  initialState: {
    activeCamera: ActiveCamera.MMD_CAMERA,
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
