import { useContext, useEffect, useMemo, useState } from 'react'
import { BaseRoomConfig } from 'trystero'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TorrentRoomConfig } from 'trystero/torrent'
import { v4 as uuid } from 'uuid'

import { ShellContext , SettingsContext} from '../contexts'
import {
  AudioState,
  Message,
  ReceivedMessage,
  UnsentMessage,
  InlineMedia,
  ReceivedInlineMedia,
  UnsentInlineMedia,
  VideoState,
  ScreenShareState,
  isMessageReceived,
  isInlineMedia,
  FileOfferMetadata,
  TypingStatus,
  Peer,
  PeerVerificationState,
  PeerActions,
} from '../models'
import {
  NotificationService,
  Audio as AudioService,
  PeerRoom,
  PeerHookType,
  fileTransfer,
  AllowedKeyType,
  encryptionService as encryptionServiceInstance,
} from '../services'
import { messageTranscriptSizeLimit } from '../config'
import { usePeerVerification } from './usePeerVerification'
import { usePeerNameDisplay } from './usePeerNameDisplay'

interface UseRoomConfig {
  roomId: string
  userId: string
  publicKey: CryptoKey
  getUuid?: typeof uuid
  encryptionService?: typeof encryptionServiceInstance
}

interface UserMetadata {
  userId: string
  displayName: string
  avatar: string
  publicKeyString: string
}

export function useRoom(
  { password, ...roomConfig }: BaseRoomConfig & TorrentRoomConfig,
  {
    roomId,
    userId,
    publicKey,
    getUuid = uuid,
    encryptionService = encryptionServiceInstance,
  }: UseRoomConfig
) {
  const isPrivate = password !== undefined

  const [peerRoom] = useState(
    () => new PeerRoom({ password: password ?? roomId, ...roomConfig }, roomId)
  )

  const { getUserSettings } = useContext(SettingsContext)

  const {
    peerList,
    setPeerList,
    setPeerConnectionTypes,
    tabHasFocus,
    showAlert,
    setRoomId,
    setPassword,
    displayName,
    avatar,
    updatePeer,
  } = useContext(ShellContext)

  const settingsContext = useContext(SettingsContext)
  const { showActiveTypingStatus } = settingsContext.getUserSettings()
  const [isMessageSending, setIsMessageSending] = useState(false)
  const [messageLog, _setMessageLog] = useState<Array<Message | InlineMedia>>(
    []
  )
  const [recordingAlertLog, _setRecordingAlertLog] = useState<Array<Message>>(
    []
  )
  const [newMessageAudio] = useState(
    () => new AudioService(process.env.PUBLIC_URL + '/sounds/new-message.aac')
  )

  const { getDisplayUsername } = usePeerNameDisplay()

  const setMessageLog = (messages: Array<Message | InlineMedia>) => {
    if (messages.length > messageTranscriptSizeLimit) {
      const evictedMessages = messages.slice(
        0,
        messages.length - messageTranscriptSizeLimit
      )

      for (const message of evictedMessages) {
        if (
          isInlineMedia(message) &&
          fileTransfer.isOffering(message.magnetURI)
        ) {
          fileTransfer.rescind(message.magnetURI)
        }
      }
    }

    _setMessageLog(messages.slice(-messageTranscriptSizeLimit))
  }

  const setRecordingAlertLog = (messages: Array<Message>) => {
    if (messages.length > messageTranscriptSizeLimit) {
      const evictedMessages = messages.slice(
        0,
        messages.length - messageTranscriptSizeLimit
      )
    }

    _setRecordingAlertLog(messages.slice(-messageTranscriptSizeLimit))
  }

  const [isShowingMessages, setIsShowingMessages] = useState(true)
  const [unreadMessages, setUnreadMessages] = useState(0)

  const [selfVideoStream, setSelfVideoStream] = useState<MediaStream | null>(
    null
  )
  const [peerVideoStreams, setPeerVideoStreams] = useState<
    Record<string, MediaStream>
  >({})

  const [selfScreenStream, setSelfScreenStream] = useState<MediaStream | null>(
    null
  )
  const [peerScreenStreams, setPeerScreenStreams] = useState<
    Record<string, MediaStream>
  >({})

  const [peerOfferedFileMetadata, setPeerOfferedFileMetadata] = useState<
    Record<string, FileOfferMetadata>
  >({})

  const roomContextValue = useMemo(
    () => ({
      isPrivate,
      isMessageSending,
      isShowingMessages,
      setIsShowingMessages,
      unreadMessages,
      selfVideoStream,
      setSelfVideoStream,
      peerVideoStreams,
      setPeerVideoStreams,
      selfScreenStream,
      setSelfScreenStream,
      peerScreenStreams,
      setPeerScreenStreams,
      peerOfferedFileMetadata,
      setPeerOfferedFileMetadata,
    }),
    [
      isPrivate,
      isMessageSending,
      isShowingMessages,
      setIsShowingMessages,
      unreadMessages,
      selfVideoStream,
      setSelfVideoStream,
      peerVideoStreams,
      setPeerVideoStreams,
      selfScreenStream,
      setSelfScreenStream,
      peerScreenStreams,
      setPeerScreenStreams,
      peerOfferedFileMetadata,
      setPeerOfferedFileMetadata,
    ]
  )

  const [sendTypingStatusChange, receiveTypingStatusChange] =
    peerRoom.makeAction<TypingStatus>(PeerActions.TYPING_STATUS_CHANGE)

  useEffect(() => {
    return () => {
      sendTypingStatusChange({ isTyping: false })
      peerRoom.leaveRoom()
      setPeerList([])
    }
  }, [peerRoom, setPeerList, sendTypingStatusChange])

  useEffect(() => {
    setPassword(password)

    return () => {
      setPassword(undefined)
    }
  }, [password, setPassword])

  useEffect(() => {
    setRoomId(roomId)

    return () => {
      setRoomId(undefined)
    }
  }, [roomId, setRoomId])

  useEffect(() => {
    if (isShowingMessages) setUnreadMessages(0)
  }, [isShowingMessages, setUnreadMessages])

  const [sendPeerMetadata, receivePeerMetadata] =
    peerRoom.makeAction<UserMetadata>(PeerActions.PEER_METADATA)

  const [sendMessageTranscript, receiveMessageTranscript] = peerRoom.makeAction<
    Array<ReceivedMessage | ReceivedInlineMedia>
  >(PeerActions.MESSAGE_TRANSCRIPT)

  const [sendPeerMessage, receivePeerMessage] =
    peerRoom.makeAction<UnsentMessage>(PeerActions.MESSAGE)

  const [sendPeerRecordingAlert, receivePeerRecordingAlert] =
    peerRoom.makeAction<UnsentMessage>(PeerActions.MESSAGE)

  const [sendPeerInlineMedia, receivePeerInlineMedia] =
    peerRoom.makeAction<UnsentInlineMedia>(PeerActions.MEDIA_MESSAGE)

  const { privateKey } = settingsContext.getUserSettings()

  const { verifyPeer } = usePeerVerification({
    peerRoom,
    privateKey,
    encryptionService,
  })

  const sendMessage = async (message: string) => {
    if (isMessageSending) return

    const unsentMessage: UnsentMessage = {
      authorId: userId,
      text: message,
      timeSent: Date.now(),
      id: getUuid(),
    }

    //setIsTyping(false)
    setIsMessageSending(true)
    if (message.includes('start recording')) {
      await sendPeerMessage(unsentMessage)
    } else {
      setMessageLog([...messageLog, unsentMessage])
      await sendPeerMessage(unsentMessage)

      setMessageLog([
        ...messageLog,
        { ...unsentMessage, timeReceived: Date.now() },
      ])
    }

    setIsMessageSending(false)
  }

  const sendRecordingAlert = async (message: string) => {
    if (isMessageSending) return

    const unsentMessage: UnsentMessage = {
      authorId: userId,
      text: message,
      timeSent: Date.now(),
      id: getUuid(),
    }

    setIsMessageSending(true)
    await sendPeerRecordingAlert(unsentMessage)

    setIsMessageSending(false)
  }

  receivePeerMetadata(
    async (
      { userId, displayName, avatar, publicKeyString },
      peerId: string
    ) => {
      const publicKey = await encryptionService.parseCryptoKeyString(
        publicKeyString,
        AllowedKeyType.PUBLIC
      )

      const peerIndex = peerList.findIndex(peer => peer.peerId === peerId)

      if (peerIndex === -1) {
        const newPeer: Peer = {
          peerId,
          userId,
          publicKey,
          displayName,
          avatar,
          audioState: AudioState.STOPPED,
          videoState: VideoState.STOPPED,
          screenShareState: ScreenShareState.NOT_SHARING,
          offeredFileId: null,
          isTyping: false,
          verificationToken: getUuid(),
          encryptedVerificationToken: new ArrayBuffer(0),
          verificationState: PeerVerificationState.VERIFYING,
          verificationTimer: null,
        }

        setPeerList([...peerList, newPeer])
        verifyPeer(newPeer)
      } else {
        const oldUsername = peerList[peerIndex].displayName || 'New Face'
        const newUsername = displayName || 'New Face'

        const newPeerList = [...peerList]
        const newPeer = {
          ...newPeerList[peerIndex],
          userId,
          displayName,
          avatar,
        }
        newPeerList[peerIndex] = newPeer
        setPeerList(newPeerList)

        if (oldUsername !== newUsername) {
          showAlert(`${oldUsername} is now ${newUsername}`)
        }
      }
    }
  )

  receiveMessageTranscript(transcript => {
    if (messageLog.length) return

    setMessageLog(transcript)
  })

  receivePeerMessage((message, peerId) => {
    const userSettings = settingsContext.getUserSettings()
    if (message.text.includes('start recording')) {
      showAlert(message.text, { severity: 'warning' })
    } else {
      if (!isShowingMessages) {
        setUnreadMessages(unreadMessages + 1)
      }

      if (!tabHasFocus || !isShowingMessages) {
        if (userSettings.playSoundOnNewMessage) {
          newMessageAudio.play()
        }

        if (userSettings.showNotificationOnNewMessage) {
          const displayUsername = getDisplayUsername(message.authorId)

          NotificationService.showNotification(
            `${displayUsername}: ${message.text}`
          )
        }
      }

      setMessageLog([...messageLog, { ...message, timeReceived: Date.now() }])
      updatePeer(peerId, { isTyping: false })
    }
  })

  receivePeerRecordingAlert((message, peerId) => {
    showAlert(message.text, { severity: 'warning' })
    if (message.text.includes('stop recording')) setRecordingAlertLog([])
    else
      setRecordingAlertLog([
        ...recordingAlertLog,
        { ...message, timeReceived: Date.now() },
      ])
  })

  peerRoom.onPeerJoin(PeerHookType.NEW_PEER, (peerId: string) => {
    showAlert(`Someone has joined the room`, {
      severity: 'success',
    })
    ;(async () => {
      try {
        const publicKeyString = await encryptionService.stringifyCryptoKey(
          publicKey
        )

        const username = settingsContext.getUserSettings().displayName
        const avatar = settingsContext.getUserSettings().avatar
        const promises: Promise<any>[] = [
          sendPeerMetadata(
            { userId, displayName: username, publicKeyString, avatar },
            peerId
          ),
        ]

        if (!isPrivate) {
          promises.push(
            sendMessageTranscript(messageLog.filter(isMessageReceived), peerId)
          )
        }

        await Promise.all(promises)
      } catch (e) {
        console.error(e)
      }
    })()
  })

  peerRoom.onPeerLeave(PeerHookType.NEW_PEER, (peerId: string) => {
    const peerIndex = peerList.findIndex(peer => peer.peerId === peerId)
    const doesPeerExist = peerIndex !== -1

    showAlert(
      `${
        doesPeerExist
          ? getDisplayUsername(peerList[peerIndex].userId)
          : 'Someone'
      } has left the room`,
      {
        severity: 'warning',
      }
    )

    if (doesPeerExist) {
      const peerListClone = [...peerList]
      peerListClone.splice(peerIndex, 1)
      setPeerList(peerListClone)
    }
  })

  const showVideoDisplay = Boolean(
    selfVideoStream ||
      selfScreenStream ||
      Object.values({ ...peerVideoStreams, ...peerScreenStreams }).length > 0
  )

  if (!showVideoDisplay && !isShowingMessages) setIsShowingMessages(true)

  const handleInlineMediaUpload = async (files: File[]) => {
    const fileOfferId = await fileTransfer.offer(files, roomId)

    const unsentInlineMedia: UnsentInlineMedia = {
      authorId: userId,
      magnetURI: fileOfferId,
      timeSent: Date.now(),
      id: getUuid(),
    }

    setIsMessageSending(true)
    setMessageLog([...messageLog, unsentInlineMedia])

    await sendPeerInlineMedia(unsentInlineMedia)

    setMessageLog([
      ...messageLog,
      { ...unsentInlineMedia, timeReceived: Date.now() },
    ])
    setIsMessageSending(false)
  }

  const handleMessageChange = () => {


    // This queues up the expiration of the typing state. It is effectively
    // cancelled once this message change handler is called again.
    // setIsTypingDebounced(false)
  }

  receivePeerInlineMedia(inlineMedia => {
    const userSettings = settingsContext.getUserSettings()

    if (!tabHasFocus) {
      if (userSettings.playSoundOnNewMessage) {
        newMessageAudio.play()
      }

      if (userSettings.showNotificationOnNewMessage) {
        NotificationService.showNotification(
          `${getDisplayUsername(inlineMedia.authorId)} shared media`
        )
      }
    }

    setMessageLog([...messageLog, { ...inlineMedia, timeReceived: Date.now() }])
  })

  receiveTypingStatusChange((typingStatus, peerId) => {
    const { isTyping } = typingStatus
    updatePeer(peerId, { isTyping })
  })

  useEffect(() => {
    ;(async () => {
      const publicKeyString = await encryptionService.stringifyCryptoKey(
        publicKey
      )

      sendPeerMetadata({
        displayName,
        avatar,
        userId,
        publicKeyString,
      })
    })()
  }, [
    displayName,
    avatar,
    userId,
    sendPeerMetadata,
    publicKey,
    encryptionService,
  ])

  useEffect(() => {
    ;(async () => {
      setPeerConnectionTypes(await peerRoom.getPeerConnectionTypes())
    })()
  }, [peerList, peerRoom, setPeerConnectionTypes])

  return {
    isPrivate,
    handleInlineMediaUpload,
    handleMessageChange,
    isMessageSending,
    messageLog,
    recordingAlertLog,
    peerRoom,
    roomContextValue,
    sendMessage,
    sendRecordingAlert,
    showVideoDisplay,
  }
}