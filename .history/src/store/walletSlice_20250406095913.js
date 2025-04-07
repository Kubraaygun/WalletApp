import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 1250.59,
  transactions: [],
  success: null, // Başarı durumu
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
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    setSuccess: (state, action) => {
      state.success = action.payload;
    },
  },
});

export const saveToAsyncStorage = (state) => async (dispatch) => {
  try {
    await AsyncStorage.setItem(
      "walletData",
      JSON.stringify({
        balance: state.balance,
        transactions: state.transactions,
        success: state.wallet.success,
      })
    );
  } catch (error) {
    console.log("AsyncStorage error: ", error.message);
  }
};

export const { addTransaction, setBalance, setSuccess, setInitialData } =
  walletSlice.actions;
export default walletSlice.reducer;
