import { promises } from "dns";
import { ArticleModel } from "../models/article.model";
import { CommentModel } from "../models/comment.model";
import { httpApi } from "./http.api";

export interface PageResponse {
  success: boolean;
  message: string;
  data: {
    articles: ArticleModel[];
    cursor: string;
  };
}
export interface PageResponseSingle {
  success: boolean;
  message: string;
  data: {
    article: ArticleModel;
  };
}
export interface ArticleRequests {
  numberPerPage: number;
  cursor: string;
  search?: {
    q?: string;
    profileIDs?: string[];
  };
}
export interface commentResponse {
  success: boolean;
  message: string;
  data: {
    comment: CommentModel;
  };
}
export interface CommentSendRequest {
  content: string;
  replyingTo?: string;
}
export interface ArticleCreateRequest {
  visualAbstract: string;
  abstract: string;
  body: string;
  attachment?: string;
  tags?: string[];
  externalURL: string;
  isEncrypted: boolean;
  price: string;
  isDeleted: boolean;
}
export interface DolikeArticle {
  message: string;
  statusCode: number;
  data: {
    like: boolean;
  };
  errors: string[];
}

export const findAllArticles = (req: ArticleRequests): Promise<PageResponse> =>
  httpApi
    .get<PageResponse>(
      `articles?profiles=${req.search.profileIDs}&q=${req.search.q}&cursor=${req.cursor}&perPage=${req.numberPerPage}`
    )
    .then(({ data }) => data);

export const findSingleArticle = (id: string): Promise<PageResponseSingle> =>
  httpApi.get<PageResponseSingle>(`articles/${id}`).then(({ data }) => data);

export const createArticle = (
  req: ArticleCreateRequest
): Promise<PageResponseSingle> =>
  httpApi
    .post<PageResponseSingle>(`articles/create`, req)
    .then(({ data }) => data);

export const editArticle = (
  id: string,
  req: ArticleCreateRequest
): Promise<PageResponseSingle> =>
  httpApi
    .patch<PageResponseSingle>(`articles/${id}/update`, req)
    .then(({ data }) => data);

export const sendArticleComment = (
  id: string,
  req: CommentSendRequest
): Promise<commentResponse> =>
  httpApi
    .post<commentResponse>(`articles/${id}/send-comment`, req)
    .then(({ data }) => data);

export const doArticleLike = (id: string): Promise<DolikeArticle> =>
  httpApi.get<DolikeArticle>(`articles/${id}/like`).then(({ data }) => data);
