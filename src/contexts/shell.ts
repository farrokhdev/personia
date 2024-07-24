import { createContext, Dispatch, SetStateAction } from 'react'

import {
  AlertOptions,
  AudioState,
  ScreenShareState,
  VideoState,
  Peer,
} from '../models'
import { PeerConnectionType, TrackerConnection } from '../services'
import { ConnectionTestResults } from '../hook'

interface ShellContextProps {
  isEmbedded: boolean
  tabHasFocus: boolean
  showRoomControls: boolean
  setShowRoomControls: Dispatch<SetStateAction<boolean>>
  setTitle: Dispatch<SetStateAction<string>>
  showAlert: (message: string, options?: AlertOptions) => void
  roomId?: string
  setRoomId: Dispatch<SetStateAction<string | undefined>>
  password?: string
  setPassword: Dispatch<SetStateAction<string | undefined>>
  peerList: Peer[]
  setPeerList: Dispatch<SetStateAction<Peer[]>>
  isServerConnectionFailureDialogOpen: boolean
  setIsServerConnectionFailureDialogOpen: Dispatch<SetStateAction<boolean>>
  peerConnectionTypes: Record<string, PeerConnectionType>
  setPeerConnectionTypes: Dispatch<
    SetStateAction<Record<string, PeerConnectionType>>
  >
  audioState: AudioState
  setAudioState: Dispatch<SetStateAction<AudioState>>
  videoState: VideoState
  setVideoState: Dispatch<SetStateAction<VideoState>>
  screenState: ScreenShareState
  setScreenState: Dispatch<SetStateAction<ScreenShareState>>
  peerAudios: Record<string, HTMLAudioElement>
  setPeerAudios: Dispatch<SetStateAction<Record<string, HTMLAudioElement>>>
  avatar: string
  setAvatar: Dispatch<SetStateAction<string>>
  displayName: string
  setdisplayName: Dispatch<SetStateAction<string>>
  connectionTestResults: ConnectionTestResults
  updatePeer: (peerId: string, updatedProperties: Partial<Peer>) => void
}

export const ShellContext = createContext<ShellContextProps>({
  isEmbedded: false,
  tabHasFocus: true,
  showRoomControls: false,
  setShowRoomControls: () => {
    //null
  },
  setTitle: () => {
    //null
  },
  showAlert: () => {
    //null
  },
  roomId: undefined,
  setRoomId: () => {
    //null
  },
  password: undefined,
  setPassword: () => {
    //null
  },
  peerList: [],
  setPeerList: () => {
    //null
  },
  isServerConnectionFailureDialogOpen: false,
  setIsServerConnectionFailureDialogOpen: () => {
    //null
  },
  peerConnectionTypes: {
    //null
  },
  setPeerConnectionTypes: () => {
    //null
  },
  audioState: AudioState.STOPPED,
  setAudioState: () => {
    //null
  },
  videoState: VideoState.STOPPED,
  setVideoState: () => {
    //null
  },
  screenState: ScreenShareState.NOT_SHARING,
  setScreenState: () => {
    //null
  },
  peerAudios: {},
  setPeerAudios: () => {
    //null
  },
  displayName: '',
  setdisplayName: () => {
    //null
  },
  connectionTestResults: {
    hasHost: false,
    hasRelay: false,
    trackerConnection: TrackerConnection.SEARCHING,
  },
  updatePeer: () => {
    //null
  },
  avatar: '',
  setAvatar: () => {
    //null
  },
})
