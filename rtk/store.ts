import { configureStore } from '@reduxjs/toolkit';
import questionsReducer from './slices/question.slice';
import classSubjectReducer from './slices/classSubject.slice';

export const store = configureStore({
  reducer: {
    questions: questionsReducer,
    classSubject: classSubjectReducer,
  },
})

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch