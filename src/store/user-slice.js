import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  auth: null, // Firebase Auth
  profile: null, // Firestore user doc
  isAuthReady: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // 設定 Auth（登入狀態）
    setAuth(state, action) {
      state.auth = action.payload;
    },
    // 設定 Profile（Firestore 資料）
    setProfile(state, action) {
      state.profile = action.payload;
    },
    // Auth 初始化完成
    setAuthReady(state, action) {
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
