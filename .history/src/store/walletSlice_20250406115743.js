import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 5000,
  transactions: [],
};

// Helper function to save wallet data to AsyncStorage
const saveWalletDataToAsyncStorage = async (balance, transactions) => {
  try {
    await AsyncStorage.setItem(
      "walletData",
      JSON.stringify({ balance, transactions })
    );
  } catch (error) {
    console.error("AsyncStorage error: ", error);
  }
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

      // Save updated wallet data to AsyncStorage
      saveWalletDataToAsyncStorage(state.balance, state.transactions);
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
  },
});

export const { addTransaction, setBalance, setInitialData } =
  walletSlice.actions;
export default walletSlice.reducer;
