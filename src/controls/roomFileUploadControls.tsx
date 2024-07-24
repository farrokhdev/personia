import React, { ChangeEventHandler, useContext, useRef } from 'react'
import Folder from '@mui/icons-material/Folder'
import FolderOff from '@mui/icons-material/FolderOff'
import CircularProgress from '@mui/material/CircularProgress'
import { RoomContext } from '../contexts/room'
import { PeerRoom } from '../services'
import { useRoomFileShare } from '../hook'
import { ReactComponent as DocumentUpload } from '../assets/svg/document-upload.svg'
import styled from 'styled-components'

export interface RoomFileUploadControlsProps {
  onInlineMediaUpload: (files: File[]) => void
  peerRoom: PeerRoom
}

const Button = styled.div<{ background: string; border: string, padding: string }>`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;
    margin-left: 24px;
    width: auto;

    > .border {
        background: ${({ theme, background }) => theme[background]};
        border: 1px solid ${({ theme, border }) => theme[border]};
        display: flex;
        padding: ${({ padding }) => padding};
        border-radius: 12px;
        width: 55px;
        margin: 0 auto 10px auto;

        > .icon-active {
            color: ${props => props.theme.white100};
            height: 18px;
            margin-top: 2px;
        }

        > .icon {
            color: ${props => props.theme.white100};
            height: 18px;
            text-align: center;
        }
    }

    > span {
        color: ${props => props.theme.white100};
        text-align: center;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: text;
        margin-top: 30px;
    }

`

export function RoomFileUploadControls({
  peerRoom,
  onInlineMediaUpload,
}: RoomFileUploadControlsProps) {
  const roomContext = useContext(RoomContext)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const { isMessageSending } = roomContext

  const {
    isFileSharingEnabled,
    isSharingFile,
    handleFileShareStart,
    handleFileShareStop,
    sharedFiles,
  } = useRoomFileShare({
    peerRoom,
    onInlineMediaUpload,
  })

  const handleToggleScreenShareButtonClick = () => {
    const { current: fileInput } = fileInputRef

    if (isSharingFile) {
      handleFileShareStop()
    } else {
      if (!fileInput) return

      fileInput.click()
    }
  }

  const handleFileSelect: ChangeEventHandler<HTMLInputElement> = e => {
    const { files } = e.target

    if (!files || files.length < 1) return

    handleFileShareStart(files)
  }

  return (

    <Button
      background={isSharingFile ? 'navy60' : 'transparent'}
      border={isSharingFile ? 'navy40' : 'gray50'}
      padding={isSharingFile ? '14px' : '14px'}
      onClick={handleToggleScreenShareButtonClick}
    >
      <input
        multiple
        ref={fileInputRef}
        type='file'
        id='file-upload'
        className='hidden'
        style={{ display: 'none' }}
        onChange={handleFileSelect}
      />

      <div className={'border'}>
        <div className={isSharingFile ? 'icon-active' : 'icon'}>
          <div style={{ cursor: 'pointer' }}>
            {isFileSharingEnabled ? (
              isSharingFile ? <DocumentUpload /> : <DocumentUpload />
            ) : (
              <CircularProgress variant="indeterminate" color="inherit" />
            )}
          </div>
        </div>
      </div>

      <span>{isSharingFile ? 'Stop Share' : 'Share a file'}</span>
    </Button>

  )
}
