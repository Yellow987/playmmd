"use client";
import { CharacterModel } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const MmdModels = createSlice({
  name: "mmdModels",
  initialState: {
    characterModels: [] as CharacterModel[],
  },
  reducers: {
    setMmdModels: (state, action: PayloadAction<CharacterModel[]>) => {
      state.characterModels = action.payload;
    },
  },
});

export const { setMmdModels } = MmdModels.actions;
export default MmdModels.reducer;
