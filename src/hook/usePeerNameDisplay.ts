import { useContext } from 'react'

import { SettingsContext } from '../contexts/setting'
import { ShellContext } from '../contexts/shell'

export const usePeerNameDisplay = () => {
  const { getUserSettings } = useContext(SettingsContext)
  const { peerList, displayName: selfdisplayName } =
    useContext(ShellContext)

  const { userId: selfUserId } = getUserSettings()

  const isPeerSelf = (userId: string) => selfUserId === userId

  const getPeer = (userId: string) =>{
    return peerList.find(peer => peer.userId === userId)
}

  const getdisplayName = (userId: string) =>
    isPeerSelf(userId)
      ? selfdisplayName
      : getPeer(userId)?.displayName || 'New Face'

  const getAvatar = (userId: string) =>
    isPeerSelf(userId)
      ? selfdisplayName
      : getPeer(userId)?.avatar || ''

  const getDisplayUsername = (userId: string) => {
    return getdisplayName(userId)
  }

  return {
    getdisplayName,
    getAvatar,
    isPeerSelf,
    getDisplayUsername,
  }
}
