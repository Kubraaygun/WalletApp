import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 1250.59,
  transactions: [],
};
const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
    },
  },
});
