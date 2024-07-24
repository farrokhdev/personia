import { StartupProfileModel } from './startup-profile.model'
import { StartupCommentMode } from './startup-comment.mode'
import { StartupLikeModel } from './startup-like.model'

export class StartupArticleModel{
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
  profile?: StartupProfileModel;
  tags?: string[];
  attachment?: string;
  externalURL?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: StartupCommentMode[];
  likes?: StartupLikeModel[];
}