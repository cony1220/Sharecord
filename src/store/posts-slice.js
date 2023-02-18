import { createSlice } from "@reduxjs/toolkit";

const postsSlice = createSlice({
  name: "posts",
  initialState: { status: "loading", items: [], error: null },
  reducers: {
    replacePosts(state, action) {
      state.status = action.payload.status;
      state.items = action.payload.items;
      state.error = action.payload.error;
    },
  },
});

export const postsActions = postsSlice.actions;

export default postsSlice.reducer;
