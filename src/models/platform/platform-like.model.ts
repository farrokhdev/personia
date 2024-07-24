import { PlatformProfileModel } from './platform-profile.model.'

export class PlatformLikeModel{
  creator?: {
    id: string;
  };
  id?: string;
  postID?: string;
  isDeleted?: boolean;
  profileID?: string;
  profile?: PlatformProfileModel;
}