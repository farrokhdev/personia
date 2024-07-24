import { ProfileModel } from './profile.model'

export class FollowModel {
  id?: string
  isDeleted?: boolean
  profileID?: string
  targetProfileID?: string
  creator?: {
    id: string
  }
  profile?: ProfileModel
  targetProfile?: ProfileModel
}
