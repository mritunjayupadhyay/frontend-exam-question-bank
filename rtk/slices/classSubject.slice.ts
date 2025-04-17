import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../store';

interface ClassSubjectState {
  subjectId: string | null;
  classId: string | null;
}

const initialState: ClassSubjectState = {
  subjectId: null,
    classId: null,
};

export const classSubjectSlice = createSlice({
  name: 'classSubject',
  initialState,
  reducers: {
    setClass: (state, action) => {
      state.classId = action.payload;
    },
    setSubject: (state, action) => {
      state.subjectId = action.payload;
    }
  },
});

export const { setClass, setSubject } = classSubjectSlice.actions;
export const classSubjectState = (state: RootState) => state.classSubject;
export default classSubjectSlice.reducer;