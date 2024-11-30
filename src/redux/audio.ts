"use client";
import { ANIMATION_PRESETS_DATA, AnimationPreset } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";


const audio = createSlice({
  name: "audio",
  initialState: {
    audioPath: ANIMATION_PRESETS_DATA[AnimationPreset.TAME_LIE_ONE_STEP].audioPath,
  },
  reducers: {
    setActiveCamera: (state, action: PayloadAction<string>) => {
      state.audioPath = action.payload;
    },
  },
});

export const {} = audio.actions;
export default audio.reducer;
