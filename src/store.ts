import { configureStore } from '@reduxjs/toolkit';
import userSlice from './redux/slices/user';
import postsSlice from './redux/slices/post';
import conversationsSlice from './redux/slices/conversation';
import socketSlice from './redux/slices/socket';
import roomSlice from './redux/slices/room';

export const store = configureStore({
  reducer: {
    user: userSlice,
    posts: postsSlice,
    conversations: conversationsSlice,
    socket: socketSlice,
    room: roomSlice
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

