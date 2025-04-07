import AsyncStorage from "@react-native-async-storage/async-storage";
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 5000,
  transactions: [],
};

// AsyncStorage işlemleri için yardımcı fonksiyon
const saveToStorage = async (data) => {
  try {
    await AsyncStorage.setItem("walletData", JSON.stringify(data));
  } catch (error) {
    console.error("AsyncStorage kayıt hatası:", error);
  }
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    setInitialData: (state, action) => {
      if (action.payload) {
        state.balance =
          action.payload.balance !== undefined
            ? action.payload.balance
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

      // AsyncStorage işlemi reducer dışında yapılacak (middleware olarak)
    },

    setBalance: (state, action) => {
      const newBalance = parseFloat(action.payload);
      if (!isNaN(newBalance)) {
        state.balance = newBalance;
      }
      // AsyncStorage işlemi reducer dışında yapılacak
    },
  },
});

// AsyncStorage middleware fonksiyonu
export const saveWalletData = (store) => (next) => (action) => {
  const result = next(action);

  if (
    action.type === "wallet/addTransaction" ||
    action.type === "wallet/setBalance" ||
    action.type === "wallet/setInitialData"
  ) {
    const walletState = store.getState().wallet;
    saveToStorage(walletState);
  }

  return result;
};

export const { addTransaction, setBalance, setInitialData } =
  walletSlice.actions;
export default walletSlice.reducer;
