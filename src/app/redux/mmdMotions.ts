"use client";
import { AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const mmdMotions = createSlice({
  name: "mmdMotions",
  initialState: {
    motions: [] as AnimationPreset[],
  },
  reducers: {
    setMmdMotions: (state, action: PayloadAction<AnimationPreset[]>) => {
      state.motions = action.payload;
    },
  },
});

export const { setMmdMotions } = mmdMotions.actions;
export default mmdMotions.reducer;