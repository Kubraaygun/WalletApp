import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authSlice,
    wallet: walletReducer,
  },
});

export default store;
