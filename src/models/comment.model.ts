import { ProfileModel } from './profile.model'

export class CommentModel  {
  creator: {
    id: string
  };
  id: string;
  content: string;
  replyingToID: string;
  createdAt: Date;
  profile: ProfileModel
  isDeleted: boolean;
  profileID: string;
}
