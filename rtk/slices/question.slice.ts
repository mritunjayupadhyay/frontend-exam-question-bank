import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  selectedQuestionId: null,
};

export const questionsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {
    selectQuestion: (state, action) => {
      state.selectedQuestionId = action.payload;
    }
  },
});

export const { selectQuestion } = questionsSlice.actions;
export default questionsSlice.reducer;