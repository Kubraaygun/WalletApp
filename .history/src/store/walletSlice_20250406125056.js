import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 53.123,
  transactions: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.balance = parseFloat(action.payload.balance).toFixed(2);
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
      state.balance = (parseFloat(state.balance) - parseFloat(amount)).toFixed(
        2
      ); // Bakiyeyi 2 ondalıklı yap

      // AsyncStorage'e kaydet
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
        })
      );
    },
    setBalance: (state, action) => {
      state.balance = parseFloat(action.payload).toFixed(2); // 2 onda
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
        })
      );
    },

    resetBalance: (state) => {
      state.balance = 530000.0;
      state.transactions = [];
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
        })
      );
    },
  },
});

export const { addTransaction, setBalance, setInitialData, resetBalance } =
  walletSlice.actions;
export default walletSlice.reducer;
