import { configureStore } from '@reduxjs/toolkit';

import UserSlice from './UserSlice';

export const store = configureStore({
    reducer: { user: UserSlice }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
