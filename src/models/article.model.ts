import { CommentModel } from "./comment.model";
import { PostLikesModel } from "./post-likes.model";
import { ProfileModel } from "./profile.model";
export class ArticleModel{
    creator: {
        id: string
    };
    id: string;
    abstract: string;
    visualAbstract: string;
    body: string;
    price: number;
    profileID: string;
    attachment: string;
    externalURL: string;
    isEncrypted: boolean;
    createdAt: Date
    isDeleted:boolean
    unifiedAccessControlConditions: string
    encryptedSymmetricKey: string;
    commentsCount: number;
    likesCount: number;
    tags: string[];
    profile: ProfileModel;
    comments:Array<CommentModel>;
    likes: PostLikesModel[];
}