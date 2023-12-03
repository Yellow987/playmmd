"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { INITIAL_AUDIO_PATH } from "./initial";

const audio = createSlice({
  name: "audio",
  initialState: {
    audioPath: INITIAL_AUDIO_PATH,
  },
  reducers: {
    setActiveCamera: (state, action: PayloadAction<string>) => {
      state.audioPath = action.payload;
    },
  },
});

export const {} = audio.actions;
export default audio.reducer;
