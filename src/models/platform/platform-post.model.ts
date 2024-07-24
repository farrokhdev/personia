import { PlatformProfileModel } from './platform-profile.model.'
import { PlatformLikeModel } from './platform-like.model'
import { PlatformCommentModel } from './platform-comment.model'

export class PlatformPostModel{
  id?: string;
  creator?: {
    id: string;
  };
  body?: string;
  createdAt?: any;
  isDeleted?: boolean;
  profileID?: string;
  profile?: PlatformProfileModel;
  tags?: string[];
  attachment?: string;
  commentsCount?: number;
  likesCount?: number;
  comments?: PlatformCommentModel[];
  likes?: PlatformLikeModel[];
}