import { PlatformProfileModel } from './platform-profile.model.'
import { PlatformCommentModel } from './platform-comment.model'
import { PlatformLikeModel } from './platform-like.model'

export class PlatformArticleModel {
  createdAt?: any;
  id?: string;
  creator?: {
    id: string;
  };
  abstract?: string;
  visualAbstract?: string;
  body?: string;
  price?: number;
  unifiedAccessControlConditions?: string;
  encryptedSymmetricKey?: string;
  isDeleted?: boolean;
  isEncrypted?: boolean;
  profileID?: string;
  profile?: PlatformProfileModel;
  tags?: string[];
  attachment?: string;
  externalURL?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: PlatformCommentModel[];
  likes?: PlatformLikeModel[];
}