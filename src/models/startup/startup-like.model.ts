import { StartupProfileModel } from './startup-profile.model'

export class StartupLikeModel {
  creator?: {
    id: string;
  };
  id?: string;
  postID?: string;
  isDeleted?: boolean;
  profileID?: string;
  profile?: StartupProfileModel;
}