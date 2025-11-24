import type { Action, Middleware, ThunkAction } from "@reduxjs/toolkit";
import { configureStore } from "@reduxjs/toolkit";
import {
  FLUSH,
  PAUSE,
  PERSIST,
  persistReducer,
  persistStore,
  PURGE,
  REGISTER,
  REHYDRATE,
} from "redux-persist";
import storage from "redux-persist/lib/storage";
import logsReducer from "./logs-slice";
import uiReducer from "./ui-slice";
import triggerReducer from "@/api/trigger";
import reportReducer from "@/api/report";

import { createLogger } from "redux-logger";

const persistConfig = {
  key: "root",
  storage,
};

// Add redux-logger only in non-production mode.
const middlewares: Array<Middleware> = [];
if (import.meta.env.MODE !== "production") {
  const logger = createLogger({
    collapsed: true,
    diff: true,
    duration: true,
  });

  middlewares.push(logger);
}

export const store = configureStore({
  reducer: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    logs: persistReducer(persistConfig, logsReducer) as any,
    ui: uiReducer,
    trigger: triggerReducer,
    report: reportReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(...middlewares),
});

export const persistor = persistStore(store);

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>;
