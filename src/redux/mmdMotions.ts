import { createSlice } from "@reduxjs/toolkit";

const mmdMotions = createSlice({
  name: "mmdMotions",
  initialState: {
    mmdMotions: [],
  },
  reducers: {},
});

export const { actions } = mmdMotions;
export default mmdMotions.reducer;
