// configure store
import { configureStore } from '@reduxjs/toolkit';
import authSlice from './auth.slice';
import chatsSlice from './chats.slice';
import systemSlice from './system.slice';

export const store = configureStore({
  reducer: {
    authSlice,
    chatsSlice,
    systemSlice,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
