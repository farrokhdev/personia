import axios from "axios";
import { httpApi } from "./http.api";
import { PostModel } from "../models/post.model";
import { CommentModel } from "../models/comment.model";

// RESPONSE TYPES
export interface PageResponse {
  success: boolean;
  message: string;
  data: {
    posts: PostModel[];
    cursor: string;
  };
}
export interface PageResponseSingle {
  success: boolean;
  message: string;
  data: {
    post: PostModel;
  };
}
// REQUEST TYPES
export interface PostRequests {
  numberPerPage: number;
  cursor: string;
  search?: {
    q?: string;
    profileIDs?: string[];
  };
}

export interface PostCreateRequest {
  body: string;
  attachment?: string;
  tags?: string[];
}
export interface CommentSendRequest {
  content: string;
  replyingTo?: string;
}

export interface commentResponse {
  success: boolean;
  message: string;
  data: {
    comment: CommentModel;
  };
}

export interface likeResponse {
  success: boolean;
  message: string;
  data: {
    like: boolean;
  };
}

export const findAllPosts = (req: PostRequests): Promise<PageResponse> =>
  httpApi
    .get<PageResponse>(
      `posts?profiles=${req.search.profileIDs}&q=${req.search.q}&cursor=${req.cursor}&perPage=${req.numberPerPage}`
    )
    .then(({ data }) => data);

export const findSinglePost = (id: string): Promise<PageResponseSingle> =>
  httpApi.get<PageResponseSingle>(`posts/${id}`).then(({ data }) => data);

export const createPost = (
  req: PostCreateRequest
): Promise<PageResponseSingle> =>
  httpApi
    .post<PageResponseSingle>(`posts/create`, req)
    .then(({ data }) => data);

export const editPost = (
  id: string,
  req: PostCreateRequest
): Promise<PageResponseSingle> =>
  httpApi
    .patch<PageResponseSingle>(`posts/${id}/update`, req)
    .then(({ data }) => data);

export const sendPostComment = (
  id: string,
  req: CommentSendRequest
): Promise<commentResponse> =>
  httpApi
    .post<commentResponse>(`posts/${id}/send-comment`, req)
    .then(({ data }) => data);

export const doPostLike = (id: string): Promise<likeResponse> =>
  httpApi.get<likeResponse>(`posts/${id}/like`).then(({ data }) => data);
