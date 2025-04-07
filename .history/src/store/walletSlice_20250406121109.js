import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";

const initialState = {
  balance: 5000,
  transactions: [],
};

// AsyncStorage işlemleri için asenkron thunk
export const saveToAsyncStorage = createAsyncThunk(
  "wallet/saveToAsyncStorage",
  async (_, { getState }) => {
    try {
      const state = getState().wallet;
      await AsyncStorage.setItem("walletData", JSON.stringify(state));
      console.log("Veriler AsyncStorage'e kaydedildi:", state);
      return true;
    } catch (error) {
      console.error("AsyncStorage kayıt hatası:", error);
      throw error;
    }
  }
);

export const loadFromAsyncStorage = createAsyncThunk(
  "wallet/loadFromAsyncStorage",
  async () => {
    try {
      const data = await AsyncStorage.getItem("walletData");
      console.log("AsyncStorage'dan yüklenen veriler:", data);
      return data ? JSON.parse(data) : null;
    } catch (error) {
      console.error("AsyncStorage okuma hatası:", error);
      throw error;
    }
  }
);

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      if (action.payload) {
        state.balance =
          action.payload.balance !== undefined
            ? parseFloat(action.payload.balance)
            : initialState.balance;
        state.transactions = action.payload.transactions || [];
      }
    },

    addTransaction: (state, action) => {
      const { receiver, amount } = action.payload;
      const numericAmount = parseFloat(amount);

      if (isNaN(numericAmount)) return;

      const newTransaction = {
        receiver,
        amount: numericAmount.toFixed(2),
        date: new Date().toISOString(),
      };

      state.transactions.push(newTransaction);
      state.balance = parseFloat((state.balance - numericAmount).toFixed(2));
    },

    setBalance: (state, action) => {
      const newBalance = parseFloat(action.payload);
      if (!isNaN(newBalance)) {
        state.balance = newBalance;
      }
    },
  },
  extraReducers: (builder) => {
    builder.addCase(loadFromAsyncStorage.fulfilled, (state, action) => {
      if (action.payload) {
        state.balance = parseFloat(action.payload.balance);
        state.transactions = action.payload.transactions;
      }
    });
    // Diğer durumlar için gerekirse buraya eklenebilir
  },
});

export const { addTransaction, setBalance, setInitialData } =
  walletSlice.actions;
export default walletSlice.reducer;
