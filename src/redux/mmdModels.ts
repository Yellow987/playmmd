"use client";
import {
  CHARACTER_MODELS_DATA,
  CharacterModel,
  CharacterModelData,
} from "@/app/mmd-generator/constants";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

const MmdModels = createSlice({
  name: "mmdModels",
  initialState: {
    models: [
      {
        name: "Miku",
        path: "mmd/models/model.bpmx",
        isLocalModel: true,
      } as CharacterModelData,
    ],
    modelsLoaded: [false],
    numberOfModels: 1,
  },
  reducers: {
    setModels: (state, action: PayloadAction<CharacterModelData[]>) => {
      state.models = action.payload;
    },
    setModelsLoaded: (state, action: PayloadAction<boolean[]>) => {
      state.modelsLoaded = action.payload;
    },
    setNewModel: (
      state,
      action: PayloadAction<{ model: CharacterModelData; i: number }>,
    ) => {
      const models = [...state.models];
      models[action.payload.i] = action.payload.model;
      state.models = models;
      state.modelsLoaded = [false];
    },
  },
});

export const { setModels, setModelsLoaded, setNewModel } = MmdModels.actions;
export default MmdModels.reducer;
