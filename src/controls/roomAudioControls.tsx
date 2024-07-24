import { useState } from 'react'
import { PeerRoom } from '../services'
import { useRoomAudio } from '../hook'
import { ReactComponent as Mic } from '../assets/svg/mic.svg'
import { ReactComponent as MicOn } from '../assets/svg/microphone-on.svg'
import { ReactComponent as LINE } from '../assets/svg/line.svg'
import { ReactComponent as ArrowDown } from '../assets/svg/arrow-down.svg'
import { ReactComponent as ArrowUp } from '../assets/svg/arrow-up.svg'
import styled from 'styled-components'
import { CButton, CMenu, CMenuItem } from '../components/mui'
import { CSvgButton } from '../components/mui/SvgButton'

const Button = styled.div<{ background: string; border: string, padding: string }>`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;

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

export interface RoomAudioControlsProps {
  peerRoom: PeerRoom
  setSpeakingToRoom: (value: boolean) => void
}

export function RoomAudioControls({
  peerRoom,
  setSpeakingToRoom,
}: RoomAudioControlsProps) {
  const {
    audioDevices,
    isSpeakingToRoom,
    setIsSpeakingToRoom,
    handleAudioDeviceSelect,
  } = useRoomAudio({ peerRoom })

  const [audioAnchorEl, setAudioAnchorEl] = useState<null | HTMLElement>(null)
  const isAudioDeviceSelectOpen = Boolean(audioAnchorEl)
  const [selectedAudioDeviceIdx, setSelectedAudioDeviceIdx] = useState(0)

  const handleVoiceCallClick = () => {
    setIsSpeakingToRoom(!isSpeakingToRoom)
    setSpeakingToRoom(!isSpeakingToRoom)
    setIsOpenMenu(false)
  }

  const handleAudioDeviceListItemClick = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    setAudioAnchorEl(event.currentTarget)
  }

  const handleAudioDeviceMenuItemClick = (
    _event: React.MouseEvent<HTMLElement>,
    idx: number
  ) => {
    setSelectedAudioDeviceIdx(idx)
    handleAudioDeviceSelect(audioDevices[idx])
    setAudioAnchorEl(null)
    setIsOpenMenu(!isOpenMenu)
  }

  const [isOpenMenu, setIsOpenMenu] = useState<boolean>(false)
  const handleOpenMenu = () => {
    setIsOpenMenu(!isOpenMenu)
  }

  return (
    <>
      <Button
        background={isSpeakingToRoom ? 'navy60' : 'transparent'}
        border={isSpeakingToRoom ? 'navy40' : 'gray50'}
        padding={isSpeakingToRoom ? '8px' : '14px'}
      >
        <div className={'border'}>
          <div className={isSpeakingToRoom ? 'icon-active' : 'icon'}>
            <div style={{ cursor: 'pointer' }} onClick={handleVoiceCallClick}>
              {isSpeakingToRoom ? <MicOn /> : <Mic />}
            </div>
          </div>
            {isSpeakingToRoom &&
              (audioDevices.length > 0 ? (
                <>
                  <div style={{ marginLeft: '8px', marginRight: '8px' }}>
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

        <span>{isSpeakingToRoom ? 'REC' : 'MIC'}</span>
      </Button>

      {audioDevices.length > 0 && isOpenMenu && isSpeakingToRoom && (
        <CMenu
          open={isOpenMenu}
          id='options-menu'
          anchorEl={audioAnchorEl}
          left={'17'}
          onClose={handleOpenMenu}
          anchorOriginHorizontal='left'
          transformOriginHorizontal='left'
          anchorOriginVertical='bottom'
          transformOriginVertical='top'
        >
          {audioDevices.map((audioDevice, idx) => (
            <CMenuItem
              color={'white100'}
              key={audioDevice.deviceId}
              onClick={event => handleAudioDeviceMenuItemClick(event, idx)}
            >
              {audioDevice.label}
            </CMenuItem>
          ))}
        </CMenu>
      )}
    </>
  )
}
