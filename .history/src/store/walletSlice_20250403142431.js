import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
  name: "user",
  initialState: {
    emailOrPhone: "",
    password: "",
    balance: 1000, // Başlangıç bakiyesi
    transactions: [],
  },
  reducers: {
    setUserDetails: (state, action) => {
      state.emailOrPhone = action.payload.emailOrPhone;
      state.password = action.payload.password;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { setUserDetails, setBalance, addTransaction } = userSlice.actions;

export default userSlice.reducer;
