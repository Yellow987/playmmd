"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
} from "../mmd-generator/constants";

const audio = createSlice({
  name: "audio",
  initialState: {
    audioPath: ANIMATION_PRESETS_DATA[AnimationPreset.LAST_CHRISTMAS].audioPath,
  },
  reducers: {
    setActiveCamera: (state, action: PayloadAction<string>) => {
      state.audioPath = action.payload;
    },
  },
});

export const {} = audio.actions;
export default audio.reducer;
