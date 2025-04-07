import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  isLoggedIn: false,
  emailOrPhone: "",
  token: "",
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    login: (state, action) => {
      state.isLoggedIn = true;
      state.emailOrPhone = action.payload.emailOrPhone;
      state.token = action.payload.token;
    },
    logout: (state) => {
      state.isLoggedIn = false;
      state.emailOrPhone = "";
      state.token = "";
    },
  },
});

export const { login, logout } = userSlice.actions;
export default userSlice.reducer;
