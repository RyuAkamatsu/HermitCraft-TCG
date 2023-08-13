import { createSlice } from '@reduxjs/toolkit';
// import { SQLError } from 'expo-sqlite';
import moment from 'moment';
// import { executeTransaction } from '../services/SQLClient';

export interface UserState {
    /* user: {
        userId: number | null,
        firstname: string,
        lastname: string,
        username: string,
        profilePicture: string
    }, */
    lastAnswered: number | null,

    /* userMessage: string | undefined,
    userStatus: 'idle' | 'loading' | 'done' | 'failed' */
}

const INITIAL_STATE: UserState = {
    /* user: {
        userId         : null,
        firstname      : '',
        lastname       : '',
        username       : '',
        profilePicture: ''
    }, */
    lastAnswered: null,

    /* userStatus : 'idle',
    userMessage: undefined, */
};

/* type loginResponse = {
    userId: number | null
    data: any,
    error: SQLError | null
} */

export const userSlice = createSlice({
    name        : 'user',
    initialState: INITIAL_STATE,
    reducers    : {
        lastAnsweredChanged: state => {
            state.lastAnswered = moment().startOf('d').unix();
        },
        clearLastAnswered: state => {
            state.lastAnswered = null;
        }
    }
});

export const { lastAnsweredChanged, clearLastAnswered } = userSlice.actions;

export default userSlice.reducer;

/* export const getUser = createAsyncThunk<loginResponse, number>('user/get', async userId => {
    const data = await executeTransaction('SELECT * FROM users WHERE id = ?', [userId]);
    return { userId, data: data.rows._array, error: null };
}); */
