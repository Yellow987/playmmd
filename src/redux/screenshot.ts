"use client";
import { PayloadAction, createSlice } from "@reduxjs/toolkit";

interface ScreenshotState {
  capturedScreenshotDataUrl: string | null;
  capturedScreenshotFile: File | null; // We'll store this separately for form submission
  capturedAt: number | null; // timestamp when screenshot was taken
  isCapturing: boolean;
}

const initialState: ScreenshotState = {
  capturedScreenshotDataUrl: null,
  capturedScreenshotFile: null,
  capturedAt: null,
  isCapturing: false,
};

const screenshot = createSlice({
  name: "screenshot",
  initialState,
  reducers: {
    setCapturedScreenshot: (
      state,
      action: PayloadAction<{ file: File; dataUrl: string }>,
    ) => {
      state.capturedScreenshotFile = action.payload.file;
      state.capturedScreenshotDataUrl = action.payload.dataUrl;
      state.capturedAt = Date.now();
      state.isCapturing = false;
    },
    setIsCapturing: (state, action: PayloadAction<boolean>) => {
      state.isCapturing = action.payload;
    },
    clearCapturedScreenshot: (state) => {
      state.capturedScreenshotDataUrl = null;
      state.capturedScreenshotFile = null;
      state.capturedAt = null;
      state.isCapturing = false;
    },
  },
});

export const {
  setCapturedScreenshot,
  setIsCapturing,
  clearCapturedScreenshot,
} = screenshot.actions;

export default screenshot.reducer;
