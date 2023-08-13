import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { executeTransaction } from '../services/SQLClient';

export interface QuestionState {
    question: {
        id: number | null,
        text: string,
    },
    questionCount: number,
    questionStatus: 'idle' | 'loading' | 'done' | 'failed'
}

const INITIAL_STATE: QuestionState = {
    question: {
        id  : null,
        text: ''
    },
    questionCount : 0,
    questionStatus: 'idle'
};

type questionResponse = {
    question: {
        id: number,
        text: string
    }
}

export const questionSlice = createSlice({
    name        : 'question',
    initialState: INITIAL_STATE,
    reducers    : {},
    extraReducers(builder) {
        builder
            .addCase(getQuestion.pending, (state, action) => {
                state.questionStatus = 'loading';
            })
            .addCase(getQuestion.fulfilled, (state, action) => {
                state.questionStatus = 'done';
                state.question = action.payload.question;
            })
            .addCase(getQuestion.rejected, (state, action) => {
                state.questionStatus = 'failed';
                state.question = INITIAL_STATE.question;
            });

        builder
            .addCase(getQuestionCount.fulfilled, (state, action) => {
                state.questionCount = action.payload;
            })
            .addCase(getQuestionCount.rejected, (state, action) => {
                state.questionCount = 0;
            });
    }
});

export default questionSlice.reducer;

export const getQuestion = createAsyncThunk<questionResponse, number>('question/get', async questionId => {
    const data = await executeTransaction('SELECT * FROM questions WHERE id = ?', [questionId]);
    return { question: data.rows.item(0) };
});

export const getQuestionCount = createAsyncThunk<number>('questions/count', async () => {
    const data = await executeTransaction('SELECT COUNT(*) FROM questions', []);
    return data.rows.item(0)['COUNT(*)'];
});
