import axios from "axios";
import { httpApi } from "./http.api";
import { UserModel } from "../models/user.model";

export interface PageResponse {
  success: boolean;
  message: string;
  data: {
    user: UserModel;
    did:{
      pkh: string,
      key: string
    },
    wallet: string
  };
}

export const loginCheck = (): Promise<PageResponse> =>
  httpApi.get<PageResponse>(`auth`).then(({ data }) => data);

export const loginPersonia = (): Promise<PageResponse> =>
  httpApi.get<PageResponse>(`auth/personia`).then(({ data }) => data);

export const registerAcc = (displayName: string): Promise<PageResponse> =>
  httpApi
    .post<PageResponse>(`auth`, {
      displayName: displayName,
    })
    .then(({ data }) => data);
