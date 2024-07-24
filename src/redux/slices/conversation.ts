import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import { ChatModel } from '../../models/chatProxy/chatProxy'

const initialState: ChatModel[] = []

export const conversationsSlice = createSlice({
  name: 'conversations',
  initialState,
  reducers: {
    set: (state: any, action: PayloadAction<ChatModel[]>) => {
      return action.payload
    },
    append: (state: any, action: PayloadAction<ChatModel>) => {
      return [...state, action.payload]
    }
  }
})

export const { set, append } = conversationsSlice.actions

export default conversationsSlice.reducer
