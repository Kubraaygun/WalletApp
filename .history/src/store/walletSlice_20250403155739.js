import { createSlice } from "@reduxjs/toolkit";

const walletReducer = createSlice({
  name: "wallet",
  initialState: {
    balance: 1000,
    transactions: [], //islemler
  },
  reducers: {
    addTransaction: (state, action) => {
      state.transactions.unshift(action.payload);
      state.balance += action.payload.amount;
    },
    deductBalance: (state, action) => {
      state.balance -= action.payload.amount;
      state.transactions.unshift(action.payload);
    },
  },
});
export const { addTransaction, deductBalance } = walletReducer.actions;
export default walletReducer.reducer;
