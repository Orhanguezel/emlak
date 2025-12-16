// src/store/index.ts
import { configureStore } from "@reduxjs/toolkit";
import { baseApi } from "@/integrations/rtk/baseApi";
import { publicApi } from "@/integrations/rtk/publicApi";


export const store = configureStore({
  reducer: {
    [baseApi.reducerPath]: baseApi.reducer,
    [publicApi.reducerPath]: publicApi.reducer,
  },
  middleware: (gDM) => gDM().concat(baseApi.middleware, publicApi.middleware),
  devTools: import.meta.env.DEV ?? false,
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
