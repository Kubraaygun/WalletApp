import { createSlice } from "@reduxjs/toolkit";

const walletSlice = createSlice({
  name: "wallet",
  initialState: {
    balance: 1000,
    transactions: [], //islemler
  },
});
