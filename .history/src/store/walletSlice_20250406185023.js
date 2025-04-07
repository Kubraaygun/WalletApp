import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 53123,
  transactions: [],
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.description = action.payload.description || "";
    },

    addTransaction: (state, action) => {
      const { receiver, amount, description } = action.payload;
      const currentDate = new Date();
      const formattedDate = currentDate.toLocaleDateString("tr-TR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      const newTransaction = {
        receiver,
        amount: amount.toFixed(2),
        date: formattedDate, // Formatlı tarih burada
      };
      state.transactions.push(newTransaction);
      state.balance -= amount;
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
      state.balance = action.payload;
      AsyncStorage.setItem(
        "walletData",
        JSON.stringify({
          balance: state.balance,
          transactions: state.transactions,
        })
      );
    },

    resetBalance: (state) => {
      state.balance = 530000;
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

export const {
  addTransaction,
  setBalance,
  setInitialData,
  resetBalance,
  setDescription,
} = walletSlice.actions;
export default walletSlice.reducer;
