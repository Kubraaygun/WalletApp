import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 1000, // Başlangıç bakiyesi
  transactions: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    updateBalance: (state, action) => {
      state.balance = action.payload;
    },
    addTransaction: (state, action) => {
      state.transactions.push(action.payload);
    },
  },
});

export const { updateBalance, addTransaction } = walletSlice.actions;

export default walletSlice.reducer;
