import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState: any = {
  socket: null
};

export const socketSlice = createSlice({
  name: 'socket',
  initialState,
  reducers: {
    set: (
      state: any,
      action: PayloadAction<any>
    ) => {
      return { ...action.payload };
    }
  }
});

export const { set } = socketSlice.actions;

export default socketSlice.reducer;
