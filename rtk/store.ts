import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from './slices/question.slice';
import classSubjectReducer from './slices/classSubject.slice';
import questionsFilterReducer from './slices/question.filter.slice';

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    classSubject: classSubjectReducer,
    questionsFilter: questionsFilterReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch