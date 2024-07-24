import React, {
  PropsWithChildren,
  SyntheticEvent,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'
import { AlertColor } from '@mui/material/Alert'
import { ShellContext, SettingsContext } from '../../../contexts'
import {
  AlertOptions,
  QueryParamKeys,
  AudioState,
  ScreenShareState,
  VideoState,
  Peer,
  Message,
  InlineMedia,
} from '../../../models'
import { PeerConnectionType } from '../../../services'
import { useConnectionTest } from './useConnectionTest'
import { NotificationArea } from '../notification'

export interface ShellProps extends PropsWithChildren {
  userPeerId: string
  appNeedsUpdate: boolean
  messageLog?: Array<Message | InlineMedia>
  isMessageSending?: boolean
  handleMessageChange?: () => void
  sendMessage?: (message: string) => void
}

const queryParams = new URLSearchParams(window.location.search)

export const Shell = ({
  children,
}: ShellProps) => {
  const { getUserSettings, updateUserSettings } = useContext(SettingsContext)
  const isEmbedded = queryParams.get(QueryParamKeys.IS_EMBEDDED) !== null

  const [isAlertShowing, setIsAlertShowing] = useState(false)
  const [alertSeverity, setAlertSeverity] = useState<AlertColor>('info')
  const [showRoomControls, setShowRoomControls] = useState(!isEmbedded)
  const [title, setTitle] = useState('')
  const [alertText, setAlertText] = useState('')
  const [roomId, setRoomId] = useState<string | undefined>(undefined)
  const [password, setPassword] = useState<string | undefined>(undefined)
  const [peerList, setPeerList] = useState<Peer[]>([]) // except self
  const [
    isServerConnectionFailureDialogOpen,
    setIsServerConnectionFailureDialogOpen,
  ] = useState(false)
  const [peerConnectionTypes, setPeerConnectionTypes] = useState<
    Record<string, PeerConnectionType>
  >({})
  const [tabHasFocus, setTabHasFocus] = useState(true)
  const [audioState, setAudioState] = useState<AudioState>(AudioState.STOPPED)
  const [videoState, setVideoState] = useState<VideoState>(VideoState.STOPPED)
  const [screenState, setScreenState] = useState<ScreenShareState>(
    ScreenShareState.NOT_SHARING
  )
  const [displayName, setdisplayName] = useState(getUserSettings().displayName)
  const [avatar, setAvatar] = useState(getUserSettings().avatar)
  const [peerAudios, setPeerAudios] = useState<
    Record<string, HTMLAudioElement>
  >({})

  const showAlert = useCallback((message: string, options?: AlertOptions) => {
    setAlertText(message)
    setAlertSeverity(options?.severity ?? 'info')
    setIsAlertShowing(true)
  }, [])

  const { connectionTestResults } = useConnectionTest()

  const updatePeer = useCallback(
    (peerId: string, updatedProperties: Partial<Peer>) => {
      setPeerList(peerList => {
        const peerIndex = peerList.findIndex(peer => peer.peerId === peerId)
        const doesPeerExist = peerIndex !== -1

        if (!doesPeerExist) return peerList

        const peerListClone = [...peerList]
        const peer = peerList[peerIndex]
        peerListClone[peerIndex] = { ...peer, ...updatedProperties }
        return peerListClone
      })
    },
    []
  )

  const shellContextValue = useMemo(
    () => ({
      isEmbedded,
      tabHasFocus,
      showRoomControls,
      setShowRoomControls,
      setTitle,
      showAlert,
      roomId,
      setRoomId,
      password,
      setPassword,
      peerList,
      setPeerList,
      isServerConnectionFailureDialogOpen,
      setIsServerConnectionFailureDialogOpen,
      peerConnectionTypes,
      setPeerConnectionTypes,
      audioState,
      setAudioState,
      videoState,
      setVideoState,
      screenState,
      setScreenState,
      peerAudios,
      setPeerAudios,
      displayName,
      setdisplayName,
      connectionTestResults,
      updatePeer,
      avatar,
      setAvatar
    }),
    [
      isEmbedded,
      roomId,
      setRoomId,
      password,
      setPassword,
      peerList,
      isServerConnectionFailureDialogOpen,
      setIsServerConnectionFailureDialogOpen,
      peerConnectionTypes,
      tabHasFocus,
      showRoomControls,
      setShowRoomControls,
      setTitle,
      showAlert,
      audioState,
      setAudioState,
      videoState,
      setVideoState,
      screenState,
      setScreenState,
      peerAudios,
      setPeerAudios,
      displayName,
      setdisplayName,
      connectionTestResults,
      updatePeer,
      avatar,
      setAvatar
    ]
  )

  const handleAlertClose = (
    _event?: SyntheticEvent | Event,
    reason?: string
  ) => {
    if (reason === 'clickaway') {
      return
    }

    setIsAlertShowing(false)
  }

  useEffect(() => {
    if (displayName === getUserSettings().userId) return
  }, [displayName, getUserSettings, updateUserSettings])

  useEffect(() => {
    document.title = title
  }, [title])


  useEffect(() => {
    const handleFocus = () => {
      setTabHasFocus(true)
    }
    const handleBlur = () => {
      setTabHasFocus(false)
    }

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)
    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
    }
  }, [])

  return (
    <ShellContext.Provider value={shellContextValue}>
      {children}

      <NotificationArea
        alertSeverity={alertSeverity}
        alertText={alertText}
        isAlertShowing={isAlertShowing}
        onAlertClose={handleAlertClose}
      />
    </ShellContext.Provider>
  )
}
