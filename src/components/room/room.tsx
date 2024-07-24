import React, { useContext, useEffect, useState } from 'react'
import Box from '@mui/material/Box'
import { v4 as uuid } from 'uuid'
import { rtcConfig, trackerUrls } from '../../config'
import { RoomContext, ShellContext, SettingsContext } from '../../contexts'
import { encryptionService as encryptionServiceInstance } from '../../services'
import { useRoom } from '../../hook'
import {
  RoomAudioControls,
  RoomVideoControls,
  RoomScreenShareControls,
  RoomFileUploadControls,
  RoomVideoDisplay,
  ScreenRecorderControls,
  SharePasswordControls,
  ParticipantsControls,
  RoomShowMessagesControls,
} from '../../controls'
import { ChatPage, Page } from '../structure'
import styled from 'styled-components'
import { useLocation } from 'react-router-dom'
import { SearchAllUsers } from '../../apis/user.api'
import { ProfileModel } from '../../models/profile.model'

const Footer = styled.div`
  background: transparent;
  width: 100% !important;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  margin-top: 20px;

  > .right {
    display: flex;
    justify-self: start;
  }

  > .center {
    display: flex;
    justify-self: center;
  }

  > .left {
    display: flex;
    justify-self: end;
  }
`

export interface RoomProps {
  appId?: string
  getUuid?: typeof uuid
  password?: string
  roomId: string
  userId: string
  encryptionService?: typeof encryptionServiceInstance
  rPass?: string
  currentWindow: Window
}

export function Room({
  appId = `${encodeURI(window.location.origin)}_tellus`,
  getUuid = uuid,
  encryptionService = encryptionServiceInstance,
  roomId,
  password,
  userId,
  rPass,
  currentWindow,
}: RoomProps) {
  const location = useLocation()
  const settingsContext = useContext(SettingsContext)
  const { showActiveTypingStatus, publicKey } =
    settingsContext.getUserSettings()
  const {
    isMessageSending,
    handleInlineMediaUpload,
    handleMessageChange,
    messageLog,
    peerRoom,
    roomContextValue,
    sendMessage,
    sendRecordingAlert,
    showVideoDisplay,
    recordingAlertLog,
  } = useRoom(
    {
      appId,
      trackerUrls,
      rtcConfig,
      password,
      trackerRedundancy: 4,
    },
    {
      roomId,
      userId,
      getUuid,
      publicKey,
      encryptionService,
    }
  )

  const handleMessageSubmit = async (message: string) => {
    await sendMessage(message)
  }

  const handleRecordingAlertSubmit = async (message: string) => {
    await sendRecordingAlert(message)
  }

  const {
    peerList,
    peerConnectionTypes,
    audioState,
    peerAudios,
    connectionTestResults,
    showAlert,
  } = useContext(ShellContext)

  const [usersLoading, setUsersLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<Array<ProfileModel>>([])
  useEffect(() => {
    setUsersLoading(true)

    SearchAllUsers({ perPage: 30, cursor: '' })
      .then(result => {
        if (result) setUsers(result.data.users)
        setUsersLoading(false)
      })
  }, [])

  const [isSpeakingToRoom, setIsSpeakingToRoom] = useState<boolean>(false)
  const [isScreenRecording, setIsScreenRecording] = useState<boolean>(false)
  const [isScreenSharing, setIsScreenSharing] = useState<boolean>(false)

  // @ts-ignore
  return (
    <RoomContext.Provider value={roomContextValue}>
      <ChatPage
        isScreenRecording={isScreenRecording}
        title={'Chat room'}
        recordingAlertLog={recordingAlertLog}
      >
        <Box
          className="Room"
          sx={{
            height: '100%',
            flexGrow: '1',
            overflow: 'auto',
          }}
        >
          <Box
            sx={{
              display: 'flex',
              height: 'calc(100%-100px)',
              width: '100%',
              overflow: 'auto',
              marginTop: '10px',
            }}
          >
            <RoomVideoDisplay
              userId={userId}
              isSpeakingToRoom={isSpeakingToRoom}
              peerConnectionTypes={peerConnectionTypes}
            />
          </Box>

          <Footer>
            <div className={'right'}>
              <RoomAudioControls
                peerRoom={peerRoom}
                setSpeakingToRoom={isSpeakingToRoom =>
                  setIsSpeakingToRoom(isSpeakingToRoom)
                }
              />
              <RoomVideoControls
                peerRoom={peerRoom}
                isScreenSharing={isScreenSharing}
                showAlert={showAlert}
              />
            </div>
            <div className={'center'}>
              <ScreenRecorderControls
                peerRoom={peerRoom}
                isSpeakingToRoom={isSpeakingToRoom}
                onInlineMediaUpload={handleInlineMediaUpload}
                showAlert={showAlert}
                onMessageSubmit={handleRecordingAlertSubmit}
                isScreenRecording={isScreenRecording}
                setIsScreenRecording={isScreenRecording =>
                  setIsScreenRecording(isScreenRecording)
                }
                recordingAlertLog={recordingAlertLog}
              />
              <RoomScreenShareControls
                peerRoom={peerRoom}
                setIsScreenSharing={isScreenSharing =>
                  setIsScreenSharing(isScreenSharing)
                }
              />
              <RoomFileUploadControls
                onInlineMediaUpload={handleInlineMediaUpload}
                peerRoom={peerRoom}
              />
            </div>
            <div className={'left'}>
              <SharePasswordControls
                roomId={roomId}
                showAlert={showAlert}
                password={password}
              />
              <ParticipantsControls
                roomId={roomId}
                audioState={audioState}
                connectionTestResults={connectionTestResults}
                peerAudios={peerAudios}
                peerConnectionTypes={peerConnectionTypes}
                peerList={peerList}
                userId={userId}
                users={users}
                usersLoading={usersLoading}
              />
              <RoomShowMessagesControls
                isMessageSending={isMessageSending}
                messageLog={messageLog}
                onMessageChange={handleMessageChange}
                onMessageSubmit={handleMessageSubmit}
                userId={userId}
              />
            </div>
          </Footer>
        </Box>
      </ChatPage>
    </RoomContext.Provider>
  )
}
