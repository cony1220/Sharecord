import { createSlice } from "@reduxjs/toolkit";

type UIState = {
  isCategoryMenuOpen: boolean;
};

const initialState: UIState = {
  isCategoryMenuOpen: false,
};

const uiSlice = createSlice({
  name: "ui",
  initialState,
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
