/* eslint-disable @typescript-eslint/no-explicit-any */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IQuestionFilter } from 'question-bank-interface';

const initialState: IQuestionFilter = {};

export const questionsFilterSlice = createSlice({
  name: 'questionsFilter',
  initialState,
  reducers: {
    setQuestionFilter: (state, action: PayloadAction<{key: keyof IQuestionFilter, value: any}>) => {
        console.log("questionFilter",{state, payload: action.payload });
        const { key, value } = action.payload;
      state[key] = value;
      console.log("questionFilter",{ state });
    },
    setTopics: (state, action) => {
        state.topicIds = action.payload;
    },
    setDifficultyLevel: (state, action) => {
        state.difficultyLevel = action.payload;
    },
    setMarks: (state, action) => {
        state.minMarks = action.payload[0];
        state.maxMarks = action.payload[1];
    },
    setQuestionType: (state, action) => {
        state.questionType = action.payload;
    }
  },
});

export const { setQuestionFilter, setTopics, setDifficultyLevel, setMarks, setQuestionType } = questionsFilterSlice.actions;
export const questionsFilterState = (state: RootState) => state.questionsFilter;
export default questionsFilterSlice.reducer;