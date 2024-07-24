import { StartupPostModel } from './startup-post.model'
import { StartupArticleModel } from './startup-article.model'

export class StartupProfileModel{
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
  posts?: StartupPostModel[];
  postsCount?: number;
  articles?: StartupArticleModel[];
  articlesCount?: number;
  nakamaID?: string;
  platformID?: string;
  publicEncryptionDID?: {
    id: string;
  };
}