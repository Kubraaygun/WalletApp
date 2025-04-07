import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 1000,
  transactions: [], //islemler
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const { amount, recipient, description } = action.payload;
      if (state.balance >= amount) {
        state.balance -= amount;
        state.transactions.unshift({
          id: Date.now(),
          amount,
          recipient,
          description,

          timestamp: new Date().toString(),
        });
      }
    },
  },
});

export const { addTransaction } = walletSlice.actions;
export default walletSlice.reducer;
