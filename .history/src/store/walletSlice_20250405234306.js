import AsyncStorage from "@react-native-async-storage/async-storage";
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
    addTransaction: (state, action) => {
      const { receiver, amount } = action.payload;
      const newTransaction = {
        receiver,
        amount: amount.toFixed(2),
        date: new Date().toISOString(),
      };
      state.transactions.push(newTransaction);
      state.balance -= amount;
      state.success = true;
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
          success: state.success,
        })
      );
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
        })
      );
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
});

export const { addTransaction, setBalance, setInitialData } =
  walletSlice.actions;
export default walletSlice.reducer;
