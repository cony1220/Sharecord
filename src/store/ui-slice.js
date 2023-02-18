import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { categoryIsVisible: false },
  reducers: {
    toggle(state) {
      state.categoryIsVisible = !state.categoryIsVisible;
    },
    close(state) {
      state.categoryIsVisible = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
