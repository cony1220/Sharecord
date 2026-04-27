import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
  name: "ui",
  initialState: { isCategoryMenuOpen: false },
  reducers: {
    toggleCategoryMenu(state) {
      state.isCategoryMenuOpen = !state.isCategoryMenuOpen;
    },
    closeCategoryMenu(state) {
      state.isCategoryMenuOpen = false;
    },
  },
});

export const uiActions = uiSlice.actions;

export default uiSlice.reducer;
