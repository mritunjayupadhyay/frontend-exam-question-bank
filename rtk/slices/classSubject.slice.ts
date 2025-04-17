import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';
import { IName } from 'question-bank-interface';

interface ClassSubjectState {
  subject: IName | null;
  className: IName | null;
}

const initialState: ClassSubjectState = {
    subject: null,
    className: null,
};

export const classSubjectSlice = createSlice({
  name: 'classSubject',
  initialState,
  reducers: {
    setClass: (state, action) => {
      state.className = action.payload;
    },
    setSubject: (state, action) => {
      state.subject = action.payload;
    }
  },
});

export const { setClass, setSubject } = classSubjectSlice.actions;
export const classSubjectState = (state: RootState) => state.classSubject;
export default classSubjectSlice.reducer;