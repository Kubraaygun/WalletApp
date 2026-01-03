import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";
import authReducer from "./authSlice";
import walletReducer from "./walletSlice";
import loadingReducer from "./loadingSlice";

// Redux Persist yapılandırması
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["auth", "wallet"], // Loading state'ini persist etmeye gerek yok
};

// Tüm reducer'ları birleştir
const rootReducer = combineReducers({
  auth: authReducer,
  wallet: walletReducer,
  loading: loadingReducer,
});

// Persist edilmiş reducer
const persistedReducer = persistReducer(persistConfig, rootReducer);

// Store oluştur
const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        // Redux Persist action'larını serializability check'ten muaf tut
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

// Persistor oluştur (App.jsx'de kullanılacak)
export const persistor = persistStore(store);

export default store;
