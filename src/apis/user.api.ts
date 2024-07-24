import { httpApi } from "./http.api";
import { ProfileModel } from "../models/profile.model";

export interface SearchRequests {
  numberPerPage?: number;
  cursor?: string;
  search?: {
    q?: string;
    profileIDs?: string[];
  };
}

export interface usersResponse {
  success: boolean;
  message: string;
  data: {
    users: Array<ProfileModel>;
    cursor: string;
  };
}

export interface singleUserResponse {
  success: boolean;
  message: string;
  data: {
    user: ProfileModel;
  };
}
export interface usersUpdateReq {
  email: string;
  displayName: string;
  avatar: string;
  nakamaID: string;
  bio: string;
  cover: string;
  skills: string[];
}

export interface userSearchReq {
  q?: string;
  cursor?: string;
  perPage?: number;
}

export interface followResponse {
  success: boolean;
  message: string;
  data: {
    follow: boolean;
    followed: boolean;
  };
}

export const searchUsers = (req: SearchRequests): Promise<usersResponse> =>
  httpApi.post<usersResponse>(`users`, req).then(({ data }) => data);

export const UpdateUser = (req: usersUpdateReq): Promise<usersResponse> =>
  httpApi.patch<usersResponse>(`users/update`, req).then(({ data }) => data);

export const GetAllUsers = (): Promise<usersResponse> =>
  httpApi.get<usersResponse>(`users`).then(({ data }) => data);

export const SearchAllUsers = (req: userSearchReq): Promise<usersResponse> =>
  httpApi
    .get<usersResponse>(
      `users?q=${req.q}&cursor=${req.cursor}&perPage=${req.perPage}`
    )
    .then(({ data }) => data);

export const GetSingleUser = (
  id: string,
  targetId: string,
  isCheck: boolean = false
): Promise<singleUserResponse> =>
  httpApi
    .get<singleUserResponse>(
      `users/detail/${id}?targetId=${targetId}&isCheck=${isCheck}`
    )
    .then(({ data }) => data);

export const CheckUserFollow = (
  id: string,
  targetId: string,
): Promise<followResponse> =>
  httpApi
    .get<followResponse>(
      `users/check-follow/${id}?targetId=${targetId}`
    )
    .then(({ data }) => data);

export const FollowUnfollow = (id: string): Promise<followResponse> =>
  httpApi.get<followResponse>(`users/follow/${id}`).then(({ data }) => data);
