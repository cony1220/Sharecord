import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui-slice";
import postsReducer from "./posts-slice";
import userReducer from "./user-slice";

const store = configureStore({
  reducer: { ui: uiReducer, posts: postsReducer, user: userReducer },
});

export default store;
