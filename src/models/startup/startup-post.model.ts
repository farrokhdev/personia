import { StartupCommentMode } from './startup-comment.mode'
import { StartupLikeModel } from './startup-like.model'
import { StartupProfileModel } from './startup-profile.model'

export class StartupPostModel {
  id?: string;
  creator?: {
    id: string;
  };
  content?: string;
  createdAt?: any;
  isDeleted?: boolean;
  profileID?: string;
  profile?: StartupProfileModel;
  tags?: string[];
  attachment?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: StartupCommentMode[];
  likes?: StartupLikeModel[];
}