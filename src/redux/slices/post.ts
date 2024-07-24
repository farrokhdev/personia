import { createSlice } from '@reduxjs/toolkit'
import { PayloadAction } from '@reduxjs/toolkit'
import { PostModel } from '../../models/post.model'

const initialState: PostModel[] = []

export const postsSlice = createSlice({
    name: 'posts',
    initialState,
    reducers: {
        set: (state: any, action: PayloadAction<PostModel[]>) => {
            return action.payload
        },
        update: (state, action: PayloadAction<PostModel>): PostModel[] => {
            if (state.find(x => x.id === action.payload.id) != null) {
                return state.map(post => {
                    if (post.id === action.payload.id) {
                        return action.payload
                    } else {
                        return post
                    }
                })
            } else {
                return [...state, action.payload]
            }
        },
    }
})

export const { set, update } = postsSlice.actions

export default postsSlice.reducer
