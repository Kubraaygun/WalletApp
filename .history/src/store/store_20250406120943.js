import { configureStore } from "@reduxjs/toolkit";
import walletReducer, { saveWalletData } from "./walletSlice";

const store = configureStore({
  reducer: {
    wallet: walletReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(saveWalletData),
});

export default store;
