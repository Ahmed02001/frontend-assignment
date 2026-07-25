import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import * as reduxStorage from "redux-persist/lib/storage";
import cartReducer from "./cartSlice";

// Vite's dev bundler sometimes fails to unwrap the default export of this
// CJS module correctly, leaving `storage` as the whole module namespace
// instead of the actual adapter (causing "storage.setItem is not a
// function"). Pulling `.default` off explicitly works around it.
// Vite's esbuild sometimes double-wraps this CJS module's default export.
// Unwrap however many levels deep are needed to reach the real engine —
// this handles both the single- and double-wrapped cases safely.
const resolveStorage = (mod) => {
  let s = mod.default ?? mod;
  while (s && typeof s.setItem !== "function" && s.default) {
    s = s.default;
  }
  return s;
};

const storage = resolveStorage(reduxStorage);

// TEMPORARY — verify the storage engine resolved correctly.
// Should log an object with getItem/setItem/removeItem functions directly
// (no nested __esModule/default wrapper this time).
// Remove this line once confirmed working.
console.log("Storage Engine:", storage);

const rootReducer = combineReducers({
  cart: cartReducer,
});

const persistConfig = {
  key: "wyze-security-builder",
  storage,
  whitelist: ["cart"], // only persist the cart slice
};

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ["persist/PERSIST", "persist/REHYDRATE"],
      },
    }),
});

export const persistor = persistStore(store);
