
import { configureStore, ThunkAction, Action } from "@reduxjs/toolkit"
import { mobBurger } from '../modules/desktop/header/Header.slice';
import { RedeSlice } from "./slices/Rede.slice";


export const store = configureStore({
  reducer: {
    mobBurger: mobBurger.reducer,
    RedeSlice: RedeSlice.reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(
    ),
})

export type AppDispatch = typeof store.dispatch
export type RootState = ReturnType<typeof store.getState>
export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  RootState,
  unknown,
  Action<string>
>
