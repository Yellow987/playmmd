"use client";
import { AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

export type MotionData = {
  motions: string[];
  isLocalMotion: boolean;
};

const mmdMotions = createSlice({
  name: "mmdMotions",
  initialState: {
    motions: [
      {
        motions: ["/mmd/Animations/FightingMyWay/Motion.vmd"],
        isLocalMotion: true,
      } as MotionData,
    ],
  },
  reducers: {
    setMmdMotions: (state, action: PayloadAction<MotionData[]>) => {
      state.motions = action.payload;
    },
  },
});

export const { setMmdMotions } = mmdMotions.actions;
export default mmdMotions.reducer;
