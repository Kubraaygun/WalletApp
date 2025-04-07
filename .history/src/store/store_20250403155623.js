import { configureStore } from "@reduxjs/toolkit";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
  },
});

export default store;
