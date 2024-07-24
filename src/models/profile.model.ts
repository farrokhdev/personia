import { educationModel } from './education.model'
import { experienceModel } from './experience.model'
import { PostModel } from './post.model'
import { FollowModel } from './follow.model'

export class ProfileModel {
  email?: string
  creator?: {
    id: string
  }
  id?: string
  displayName?: string
  avatar?: string
  nakamaID?: string
  bio?: string
  postsCount?: number
  followersCount?: number
  followingsCount?: number
  did?: string
  cover?: string
  accountType?: string
  age?: number
  skills?: string[]
  gender?: string
  phoneNumber?: string
  address?: string
  socialLinks?: string[]
  publicEncryptionDID?: { id: string }
  experiences?: experienceModel[]
  educations?: educationModel[]
  posts?: PostModel[]
  isFollowed?: boolean
  followers?: FollowModel[]
  followings?: FollowModel[]
  profile?: ProfileModel
  targetProfile?: ProfileModel
  wallet?: string
}
