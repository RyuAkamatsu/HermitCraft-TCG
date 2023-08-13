import { configureStore } from '@reduxjs/toolkit';

import AuthSlice from './AuthSlice';
import UserSlice from './UserSlice';
import QuestionSlice from './QuestionSlice';

export const store = configureStore({
    reducer: {
        auth    : AuthSlice,
        question: QuestionSlice,
        user    : UserSlice
    }
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
