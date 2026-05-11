import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { UserProfile } from "../types/user";

/** Firebase auth 資料 */
type AuthState = {
  uid: string;
  email: string | null;
};

/** user slice state */
type UserState = {
  auth: AuthState | null; // Firebase Auth
  profile: UserProfile | null; // Firestore user doc
  isAuthReady: boolean;
};

const initialState: UserState = {
  auth: null,
  profile: null,
  isAuthReady: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 設定 Auth（登入狀態）
    setAuth(state, action: PayloadAction<AuthState>) {
      state.auth = action.payload;
    },

    // 設定 Profile（Firestore 資料）
    setProfile(state, action: PayloadAction<UserProfile>) {
      state.profile = action.payload;
    },

    // Auth 初始化完成
    setAuthReady(state, action: PayloadAction<boolean>) {
      state.isAuthReady = action.payload;
    },

    // 登出 / 清空
    clearUser(state) {
      state.auth = null;
      state.profile = null;
      state.isAuthReady = true;
    },
  },
});

export const userActions = userSlice.actions;

export default userSlice.reducer;
