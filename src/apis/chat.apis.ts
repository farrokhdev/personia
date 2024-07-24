import axios from "axios";
import { httpApi } from "./http.api";
import { ChatModel } from "../models/chatProxy/chatProxy";
import { CommentModel } from "../models/comment.model";
import { ChatMessageModel } from "../models/chatProxy/chatMessageModel";

// RESPONSE TYPES
export interface createChatResponse {
  success: boolean;
  message: string;
  data: {
    chat: ChatModel;
    cursor: string;
  };
}
export interface getChatResponse {
  success: boolean;
  message: string;
  data: {
    chat: {
      chats: ChatModel[];
      cursor: string;
    };
  };
}

export interface ChatReq {
  profileId: string[];
  cursor: string;
}

export interface sendMessageResponse {
  success: boolean;
  message: string;
  data: {
    message: ChatMessageModel;
    cursor: string;
  };
}

export interface sendMessageReq {
  content: string;
  messageType: string;
}

export const createChat = (
  recipientProfileID: string
): Promise<createChatResponse> => {
  return httpApi
    .post<createChatResponse>(`chat/getOrCreate`, {
      recipientProfileID: recipientProfileID,
    })
    .then(({ data }) => data);
};

export const getChat = (req: ChatReq): Promise<getChatResponse> => {
  return httpApi
    .get<getChatResponse>(
      `chat?profileId=${req.profileId}&cursor=${req.cursor}`
    )
    .then(({ data }) => data);
};

export const getSingleChat = (id: string): Promise<createChatResponse> =>
  httpApi.get<createChatResponse>(`chat/${id}`).then(({ data }) => data);

export const sendChatMessage = (
  id: string,
  req: sendMessageReq
): Promise<sendMessageResponse> =>
  httpApi
    .post<sendMessageResponse>(`chat/${id}/message`, req)
    .then(({ data }) => data);
