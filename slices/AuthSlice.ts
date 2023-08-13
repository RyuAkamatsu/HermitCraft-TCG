import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

type Nullable<T> = T | null;

export interface AuthState {
    username : string,
    password : string,
    accessToken : Nullable<string>,
    expires : Nullable<Date>,
    loginMessage: string | undefined,
    loginStatus: 'idle' | 'loading' | 'done' | 'failed',
    resetMessage: string | undefined,
    resetStatus: 'idle' | 'loading' | 'done' | 'failed'
}

type loginResponse = {
    accessToken: Nullable<string>,
    expires: Nullable<Date>
}

type resetResponse = {
    success: boolean,
    message: string | undefined
}

const INITIAL_STATE: AuthState = {
    username: '',
    password: '',

    accessToken: null,
    expires    : null,

    loginMessage: undefined,
    loginStatus : 'idle',

    resetMessage: undefined,
    resetStatus : 'idle'
};

export const authSlice = createSlice({
    name        : 'auth',
    initialState: INITIAL_STATE,
    reducers    : {
        usernameChanged: (state, action: PayloadAction<string>) => {
            state.username = action.payload;
        },
        passwordChanged: (state, action: PayloadAction<string>) => {
            state.password = action.payload;
        },
        signOut: () => INITIAL_STATE
    },
    extraReducers(builder) {
        builder
            .addCase(loginUser.pending, (state, action) => {
                state.loginStatus = 'loading';
                state.loginMessage = undefined;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginStatus = 'done';
                state.accessToken = action.payload.accessToken;
                state.expires = action.payload.expires;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginStatus = 'failed';
                state.loginMessage = action.error.message;
                state.accessToken = null;
                state.expires = null;
            });

        builder
            .addCase(resetPassword.pending, state => {
                state.resetStatus = 'loading';
            })
            .addCase(resetPassword.fulfilled, (state, action) => {
                state.resetStatus = 'done';
                state.resetMessage = action.payload.message;
            })
            .addCase(resetPassword.rejected, (state, action) => {
                state.resetStatus = 'failed';
                state.resetMessage = action.error.message;
            });
    }
});

export const { usernameChanged, passwordChanged, signOut } = authSlice.actions;
export default authSlice.reducer;

export const loginUser = createAsyncThunk<loginResponse, void, { state: any }>('auth/login', async (_, { getState }) => {
    try {
        const { auth: { username, password } } = getState();

        const date = new Date();

        const userProfile = Number.isNaN(parseInt(username)) || parseInt(username) < 1 || parseInt(username) > 5 ? '1' : username;
        console.log('userProfile:', userProfile);

        return new Promise(resolve => {
            setTimeout(
                resolve,
                3000, // 3 second delay
                { accessToken: userProfile, expires: date.setDate(date.getDate() + 1) } // expires a day later
            );
        });

    } catch (e) {
        console.log('There was an error logging in');
        throw new Error('There was an error');
    }
});

export const resetPassword = createAsyncThunk<resetResponse, string>('auth/reset-password', async username => {
    try {
        return { success: true, message: undefined }; // response.Success
    } catch (e) {
        console.log('There was an error');
        return { success: false, message: 'Something went wrong' };
    }
});
