import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Post } from "../types/post";

export type PostsStatus = "idle" | "loading" | "succeed" | "failed";

type PostsState = {
  status: PostsStatus;
  items: Post[];
  error: string | null;
};

const initialState: PostsState = {
  status: "idle",
  items: [],
  error: null,
};

const postsSlice = createSlice({
  name: "posts",
  initialState,
  reducers: {
    replacePosts(state, action: PayloadAction<PostsState>) {
      state.status = action.payload.status;
      state.items = action.payload.items;
      state.error = action.payload.error;
    },
  },
});

export const postsActions = postsSlice.actions;

export default postsSlice.reducer;
