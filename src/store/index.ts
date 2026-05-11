import { configureStore } from "@reduxjs/toolkit";

import uiReducer from "./ui-slice";
import postsReducer from "./posts-slice";
import userReducer from "./user-slice";

const store = configureStore({
  reducer: { ui: uiReducer, posts: postsReducer, user: userReducer },
});

export type AppStore = typeof store;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];

export default store;
