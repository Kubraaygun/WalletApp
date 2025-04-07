import { configureStore } from "@reduxjs/toolkit";
import userReducer from "./reducers";
import walletReducer from "./slices/walletSlice";

const store = configureStore({
  reducer: {
    user: userReducer,
    wallet: walletReducer,
  },
});

export default store;
