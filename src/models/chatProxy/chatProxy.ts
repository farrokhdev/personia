import { ChatMessageModel } from "./chatMessageModel";

export interface ChatModel {
  creator?: {
    id: string;
  };
  channelID?: string;
  createdAt?: string;
  id?: string;
  isDeleted?: boolean;
  messagesCount?: number;
  profile?: {
    creator?: {
      id: string;
    };
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
    publicEncryptionDID?: {
      id: string;
    };
  };
  recipientProfile?: {
    creator?: {
      id: string;
    };
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
    publicEncryptionDID?: {
      id: string;
    };
  };
  messages?: ChatMessageModel[];
}
