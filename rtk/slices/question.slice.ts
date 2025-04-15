import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IQuestion } from 'question-bank-interface';

interface QuestionState {
  selectedQuestion: IQuestion | null;
}

const initialState: QuestionState = {
  selectedQuestion: null,
};

export const questionsSlice = createSlice({
  name: 'questions',
  initialState,
  reducers: {
    selectQuestion: (state, action) => {
      state.selectedQuestion = action.payload;
    }
  },
});

export const { selectQuestion } = questionsSlice.actions;
export const questionsState = (state: RootState) => state.questions;
export default questionsSlice.reducer;