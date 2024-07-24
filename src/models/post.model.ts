import { CommentModel } from "./comment.model";
import { PostLikesModel } from "./post-likes.model";
import { ProfileModel } from "./profile.model";

export class PostModel {
  creator: {
    id: string;
  };
  id: string;
  body: string;
  profileID: string;
  attachment: string;
  externalURL: string;
  isEncrypted: boolean;
  tags: string[];
  createdAt: Date;
  isDeleted: boolean;
  unifiedAccessControlConditions: string;
  encryptedSymmetricKey: string;
  profile: ProfileModel;
  commentsCount: number;
  comments:Array<CommentModel>;
  likesCount: number;
  likes: PostLikesModel[];
}
