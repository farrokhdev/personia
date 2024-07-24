import { StartupProfileModel } from './startup-profile.model'

export class StartupCommentMode {
  creator?: {
    id: string;
  };
  id?: string;
  content?: string;
  createdAt?: any;
  postID?: string;
  isDeleted?: boolean;
  parentID?: string;
  profileID?: string;
  profile?: StartupProfileModel;
}