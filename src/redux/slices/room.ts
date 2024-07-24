import { createSlice } from '@reduxjs/toolkit';
import { PayloadAction } from '@reduxjs/toolkit';

const initialState = {
  room: null
};

export const roomSlice = createSlice({
  name: 'room',
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

export const { set } = roomSlice.actions;

export default roomSlice.reducer;
