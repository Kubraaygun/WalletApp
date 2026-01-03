import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  balance: 53000,
  transactions: [],
  isLoading: false,
  error: null,
};

const walletSlice = createSlice({
  name: "wallet",
  initialState,
  reducers: {
    // Wallet verisi yüklenirken
    walletStart: (state) => {
      state.isLoading = true;
      state.error = null;
    },
    // Wallet verisi başarıyla yüklendi (API'den)
    walletSuccess: (state, action) => {
      state.balance = action.payload.balance;
      state.transactions = action.payload.transactions;
      state.isLoading = false;
      state.error = null;
    },
    // Wallet hatası
    walletFailure: (state, action) => {
      state.isLoading = false;
      state.error = action.payload;
    },
    // Yeni işlem ekle
    addTransaction: (state, action) => {
      const { receiver, amount, description, type = "outgoing" } = action.payload;
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
        id: Date.now().toString(),
        receiver,
        amount: parseFloat(amount).toFixed(2),
        description: description || "",
        date: formattedDate,
        type, // "incoming" veya "outgoing"
      };

      state.transactions.unshift(newTransaction);

      // Bakiyeyi güncelle
      if (type === "outgoing") {
        state.balance -= parseFloat(amount);
      } else {
        state.balance += parseFloat(amount);
      }
    },
    // Bakiyeyi güncelle (API sync için)
    setBalance: (state, action) => {
      state.balance = action.payload;
    },
    // Wallet'ı sıfırla (logout için)
    resetWallet: (state) => {
      state.balance = 0;
      state.transactions = [];
      state.error = null;
    },
    // Hata mesajını temizle
    clearWalletError: (state) => {
      state.error = null;
    },
  },
});

export const {
  walletStart,
  walletSuccess,
  walletFailure,
  addTransaction,
  setBalance,
  resetWallet,
  clearWalletError,
} = walletSlice.actions;

export default walletSlice.reducer;
