import { useEffect, useState } from 'react'
import { PeerRoom } from '../services'
import { useRoomVideo } from '../hook'
import styled from 'styled-components'
import { ReactComponent as Video } from '../assets/svg/video.svg'
import { ReactComponent as VideoOn } from '../assets/svg/video-on.svg'
import { ReactComponent as LINE } from '../assets/svg/line.svg'
import { ReactComponent as ArrowDown } from '../assets/svg/arrow-down.svg'
import { ReactComponent as ArrowUp } from '../assets/svg/arrow-up.svg'
import { CMenu, CMenuItem } from '../components/mui'

export interface RoomVideoControlsProps {
  peerRoom: PeerRoom
  isScreenSharing: boolean,
  showAlert: (message: string)=>void
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
    margin-bottom: 10px;
    padding: ${({ padding }) => padding};
    border-radius: 12px;

    > .icon-active {
      color: ${props => props.theme.white100};
      height: 18px;
      margin-top: 5px;
    }

    > .icon {
      color: ${props => props.theme.white100};
      height: 18px;
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

export function RoomVideoControls({
  peerRoom,
  isScreenSharing,
  showAlert
}: RoomVideoControlsProps) {
  const {
    isCameraEnabled,
    setIsCameraEnabled,
    videoDevices,
    handleVideoDeviceSelect,
  } = useRoomVideo({ peerRoom })

  const handleEnableCameraClick = () => {
    try {
      if (isScreenSharing) {
        setIsCameraEnabled(false)
        setIsOpenMenu(false)
        showAlert('For start camera please stop the screen sharing')
      } else {
        setIsCameraEnabled(!isCameraEnabled)
        setIsOpenMenu(false)
      }
    } catch (error) {
      console.error('video', error)
    }
  }

  useEffect(() => {
    if (isScreenSharing) {
      setIsCameraEnabled(false)
      setIsOpenMenu(false)
    }
  }, [isScreenSharing])

  const [videoAnchorEl, setVideoAnchorEl] = useState<null | HTMLElement>(null)
  const isVideoDeviceSelectOpen = Boolean(videoAnchorEl)
  const [selectedVideoDeviceIdx, setSelectedVideoDeviceIdx] = useState(0)

  const handleVideoDeviceMenuItemClick = (
    _event: React.MouseEvent<HTMLElement>,
    idx: number
  ) => {
    setSelectedVideoDeviceIdx(idx)
    handleVideoDeviceSelect(videoDevices[idx])
    setVideoAnchorEl(null)
    setIsOpenMenu(!isOpenMenu)
  }

  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const handleOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu)
  }

  return (
    <>
      <Button
        background={isCameraEnabled ? 'navy60' : 'transparent'}
        border={isCameraEnabled ? 'navy40' : 'gray50'}
        padding={isCameraEnabled ? '8px' : '14px'}
      >
        <div className={'border'}>
          <div className={isCameraEnabled ? 'icon-active' : 'icon'}>
            <div
              style={{ cursor: 'pointer' }}
              onClick={handleEnableCameraClick}
            >
              {isCameraEnabled ? <Video /> : <VideoOn />}
            </div>
          </div>
          {isCameraEnabled &&
            (videoDevices.length > 0 ? (
              <>
                <div style={{ marginLeft: '16px', marginRight: '8px' }}>
                  <LINE />
                </div>
                {!isOpenMenu ? (
                  <div onClick={handleOpenMenu}>
                    <ArrowDown />
                  </div>
                ) : (
                  <div onClick={handleOpenMenu}>
                    <ArrowUp />
                  </div>
                )}
              </>
            ) : null)}
        </div>

        <span>{isCameraEnabled ? 'REC' : 'CAM'}</span>
      </Button>

      {videoDevices.length > 0 && isOpenMenu && isCameraEnabled && (
        <CMenu
          open={isOpenMenu}
          id="options-menu"
          anchorEl={videoAnchorEl}
          left={'21'}
          onClose={handleOpenMenu}
          anchorOriginHorizontal="left"
          transformOriginHorizontal="left"
          anchorOriginVertical="bottom"
          transformOriginVertical="top"
        >
          {videoDevices.map((videoDevice, idx) => (
            <CMenuItem
              key={videoDevice.deviceId}
              color={'white100'}
              onClick={event => handleVideoDeviceMenuItemClick(event, idx)}
            >
              {videoDevice.label}
            </CMenuItem>
          ))}
        </CMenu>
      )}
    </>
  )
}
