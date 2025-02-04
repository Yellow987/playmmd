"use client";
import {
  ANIMATION_PRESETS_DATA,
  AnimationPreset,
} from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const audio = createSlice({
  name: "audio",
  initialState: {
    audioPath: "/mmd/Animations/FightingMyWay/Audio.wav",
    isLocalAudio: true,
  },
  reducers: {
    setAudioPath: (
      state,
      action: PayloadAction<{
        audioPath: string;
        isLocalAudio: boolean;
      }>,
    ) => {
      state.audioPath = action.payload.audioPath;
      state.isLocalAudio = action.payload.isLocalAudio;
    },
  },
});

export const { setAudioPath } = audio.actions;
export default audio.reducer;
