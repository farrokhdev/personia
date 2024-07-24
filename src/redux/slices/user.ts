import { createSlice } from "@reduxjs/toolkit";
import { PayloadAction } from "@reduxjs/toolkit";
import { ProfileModel } from "../../models/profile.model";

const initialState: ProfileModel = {
  did: "",
  id: "",
  displayName: "",
  email: "",
  cover: "",
  bio: "",
  skills: [],
  educations: [],
  experiences: [],
  posts: [],
  postsCount: 0,
  followers: [],
  followingsCount: 0,
  followings: [],
  followersCount: 0,
  creator: {
    id: "",
  },
  avatar: "",
  nakamaID: "",
  accountType: "",
  age: 0,
  gender: "",
  phoneNumber: "",
  address: "",
  socialLinks: [],
  publicEncryptionDID: {id: ''},
  isFollowed: false,
  profile: undefined,
  targetProfile: undefined,
};

export const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    set: (state: any, action: PayloadAction<ProfileModel>) => {
      return { ...action.payload };
    },
    update: (state: any, action: PayloadAction<Partial<ProfileModel>>) => {
      return { ...state, ...action.payload };
    },
    logout: (state: any) => {
      return { ...state, ...initialState };
    },
  },
});

export const { set, update, logout } = userSlice.actions;

export default userSlice.reducer;
