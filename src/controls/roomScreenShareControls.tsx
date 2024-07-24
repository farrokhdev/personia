import { PeerRoom } from '../services'
import { useRoomScreenShare } from '../hook'
import { ReactComponent as ShareScreen } from '../assets/svg/share-screen.svg'
import styled from 'styled-components'
import React, { useEffect } from 'react'

export interface RoomFileUploadControlsProps {
  peerRoom: PeerRoom
  setIsScreenSharing: (isScreenSharing: boolean) => void
}

const Button = styled.div<{
  background: string
  border: string
  padding: string
}>`
  justify-content: center;
  align-items: center;
  cursor: pointer;
  text-align: center;
  margin-left: 24px;

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

export function RoomScreenShareControls({
  peerRoom,
  setIsScreenSharing,
}: RoomFileUploadControlsProps) {
  const { isSharingScreen, handleScreenShareStart, handleScreenShareStop } =
    useRoomScreenShare({
      peerRoom,
    })

  const handleToggleScreenShareButtonClick = () => {
    if (isSharingScreen) {
      handleScreenShareStop()
      setIsScreenSharing(false)
    } else {
      handleScreenShareStart()
    }
  }

  useEffect(() => {
    if (isSharingScreen) {
      setIsScreenSharing(true)
    }
  }, [isSharingScreen])

  if (!window.navigator?.mediaDevices?.getDisplayMedia) {
    return <></>
  }

  return (
    <Button
      background={isSharingScreen ? 'navy60' : 'transparent'}
      border={isSharingScreen ? 'navy40' : 'gray50'}
      padding={isSharingScreen ? '14px' : '14px'}
      onClick={handleToggleScreenShareButtonClick}
    >
      <div className={'border'}>
        <div className={isSharingScreen ? 'icon-active' : 'icon'}>
          <div style={{ cursor: 'pointer' }}>
            {isSharingScreen ? <ShareScreen /> : <ShareScreen />}
          </div>
        </div>
      </div>

      <span>{isSharingScreen ? 'Stop Share' : 'Share Screen'}</span>
    </Button>
  )
}
