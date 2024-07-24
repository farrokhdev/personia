import { PlatformProfileModel } from './platform-profile.model.'

export class PlatformCommentModel{
  creator?: {
    id: string;
  };
  id?: string;
  content?: string;
  createdAt?: any;
  postID?: string;
  isDeleted?: boolean;
  replyingToID?: string;
  profileID?: string;
  profile?: PlatformProfileModel;
}