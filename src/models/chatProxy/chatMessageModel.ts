export interface ChatMessageModel {
  creator?: {
    id: string;
  };
  body?: string;
  createdAt?: string;
  encryptedSymmetricKey?: string;
  id?: string;
  messageType?: string;
  profileID?: string;
  unifiedAccessControlConditions?: string;
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
}
