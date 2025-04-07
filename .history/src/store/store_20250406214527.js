import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import walletReducer from "./walletSlice";
import loadingReducer from "./loadingSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    wallet: walletReducer,
    loading: loadingReducer,
  },
});

export default store;
