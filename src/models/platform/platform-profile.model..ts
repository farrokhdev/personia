import { PlatformPostModel } from './platform-post.model'
import { PlatformArticleModel } from './platform-article.model'

export class PlatformProfileModel{
  creator?: {
    id: string;
  };
  id?: string;
  name?: string;
  slogan?: string;
  cover?: string;
  logo?: string;
  projectHistory?: string;
  projectCompellingVideo?: string;
  projectVision?: string;
  projectMission?: string;
  requestedFund?: number;
  fundingStartDate?: Date;
  email?: string;
  phoneNumber?: string;
  address?: string;
  socialLinks?: string[];
  did?: string;
  walletAddress?: string;
  posts?: PlatformPostModel[];
  postsCount?: number;
  articles?: PlatformArticleModel[];
  articlesCount?: number;
  nakamaID?: string;
  publicEncryptionDID?: {
    id: string;
  };
}