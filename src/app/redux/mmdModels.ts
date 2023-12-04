"use client";
import { CharacterModel } from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const MmdModels = createSlice({
  name: "mmdModels",
  initialState: {
    models: [CharacterModel.HATSUNE_MIKU_YYB_10TH],
    modelsLoaded: [false],
    numberOfModels: 1,
  },
  reducers: {
    setModels: (state, action: PayloadAction<CharacterModel[]>) => {
      state.models = action.payload;
    },
    setModelsLoaded: (state, action: PayloadAction<boolean[]>) => {
      state.modelsLoaded = action.payload;
    },
  },
});

export const { setModels, setModelsLoaded } = MmdModels.actions;
export default MmdModels.reducer;
