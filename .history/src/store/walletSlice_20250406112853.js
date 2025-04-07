import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Initial State
const initialState = {
  balance: 5000,
  transactions: [],
  status: "idle", // İşlem durumunu takip edebiliriz (loading, success, error)
  error: null, // Hata mesajını saklamak için
};

// AsyncThunk to load data from AsyncStorage
export const loadWalletData = createAsyncThunk(
  "wallet/loadWalletData",
  async () => {
    const storedData = await AsyncStorage.getItem("walletData");
    console.log(storedData);
    if (storedData) {
      return JSON.parse(storedData);
    }
    return { balance: 5000, transactions: [] }; // Varsayılan veriler
  }
);

// AsyncThunk to save data to AsyncStorage
export const saveWalletData = createAsyncThunk(
  "wallet/saveWalletData",
  async ({ balance, transactions }) => {
    await AsyncStorage.setItem(
      "walletData",
      JSON.stringify({ balance, transactions })
    );
    return { balance, transactions }; // Save success response
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    addTransaction: (state, action) => {
      const { receiver, amount } = action.payload;
      const newTransaction = {
        receiver,
        amount: amount.toFixed(2),
        date: new Date().toISOString(),
      };
      state.transactions.push(newTransaction);
      state.balance -= amount;
    },
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loadWalletData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(loadWalletData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(loadWalletData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      })
      .addCase(saveWalletData.pending, (state) => {
        state.status = "loading";
      })
      .addCase(saveWalletData.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.balance = action.payload.balance;
        state.transactions = action.payload.transactions;
      })
      .addCase(saveWalletData.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.error.message;
      });
  },
});

export const { addTransaction, setBalance } = walletSlice.actions;
export default walletSlice.reducer;
