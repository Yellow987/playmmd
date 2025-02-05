"use client";
import { AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export enum ActiveCamera {
  MMD_CAMERA = "mmdCamera",
  ARC_CAMERA = "arcCamera",
  FREE_CAMERA = "freeCamera",
}

export type CameraData = {
  cameraPath: string;
  isLocalMotion: boolean;
};

const cameras = createSlice({
  name: "cameras",
  initialState: {
    activeCamera: ActiveCamera.MMD_CAMERA,
    mmdCameraData: {
      cameraPath: "/mmd/Animations/TameLieOneStep/Camera.vmd",
      isLocalMotion: true,
    } as CameraData,
  },
  reducers: {
    setActiveCamera: (state, action: PayloadAction<ActiveCamera>) => {
      state.activeCamera = action.payload;
    },
    setMmdCameraData: (state, action: PayloadAction<CameraData>) => {
      state.mmdCameraData = action.payload;
    },
  },
});

export const { setActiveCamera, setMmdCameraData } = cameras.actions;
export default cameras.reducer;
