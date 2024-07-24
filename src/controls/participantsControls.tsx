import React, { useEffect, useRef, useState } from 'react'
import { ReactComponent as Participants } from '../assets/svg/participants.svg'
import styled from 'styled-components'
import { CTab, CTabs } from '../components/mui'
import { PeerList } from '../components/room/peer'
import { AudioState, Peer } from '../models'
import { PeerConnectionType } from '../services'
import { ConnectionTestResults as IConnectionTestResults } from '../components/room/shell/useConnectionTest'
import { UsersRoomBox } from '../components/user/room'
import { ProfileModel } from '../models/profile.model'

export interface ParticipantProps {
  roomId: string
  userId: string
  peerList: Peer[]
  peerConnectionTypes: Record<string, PeerConnectionType>
  audioState: AudioState
  peerAudios: Record<string, HTMLAudioElement>
  connectionTestResults: IConnectionTestResults
  users: Array<ProfileModel>
  usersLoading: boolean
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
      height: 20px;
      margin-top: 2px;
    }

    > .icon {
      color: ${props => props.theme.white100};
      height: 20px;
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

const Sidebar = styled.div<{ width: string }>`
  width: ${({ width }) => width}px;
  height: 100vh;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.navy90};
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;

  > .tabs {
    padding: 10px;
  }
`

export function ParticipantsControls(props: ParticipantProps) {
  const {
    roomId,
    userId,
    connectionTestResults,
    peerConnectionTypes,
    peerAudios,
    peerList,
    audioState,
    users,
    usersLoading
  } = props

  const [isOpenSidebar, setIsOpenSidebar] = useState(false)

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setIsOpenSidebar(false)
        }
      }

      // Bind the event listener
      document.addEventListener('mousedown', handleClickOutside)
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener('mousedown', handleClickOutside)
      }
    }, [ref])
  }

  const wrapperRef = useRef(null)
  useOutsideAlerter(wrapperRef)

  const [tab, setTab] = useState<'peers' | 'users'>('peers')
  const handleChangeViewType = (event: any, newValue: any): void => {
    setTab(newValue)
  }

  return (
    <>
      <Button
        background={isOpenSidebar ? 'navy60' : 'transparent'}
        border={isOpenSidebar ? 'navy40' : 'gray50'}
        padding={isOpenSidebar ? '12px' : '13px'}
        onClick={() => setIsOpenSidebar(!isOpenSidebar)}
      >
        <div className={'border'}>
          <div className={isOpenSidebar ? 'icon-active' : 'icon'}>
            <div style={{ cursor: 'pointer' }}>
              <Participants />
            </div>
          </div>
        </div>

        <span>{'Participants'}</span>
      </Button>

      {isOpenSidebar ? (
        <Sidebar width={isOpenSidebar ? '300' : '0'} ref={wrapperRef}>
          <div className={'tabs'}>
            <CTabs
              value={tab}
              onChange={handleChangeViewType}
              key={1}
              $background={'navy60'}
              $activeBG={'navy60'}
            >
              <CTab
                label={'Connected Peers'}
                id={'view-tab-peers'}
                aria-controls={'view-tabpanel-peers'}
                value={'peers'}
                disableTouchRipple
                $fullWidth
              />
              <CTab
                label={'Invite Others'}
                id={'view-tab-users'}
                aria-controls={'view-tabpanel-users'}
                value={'users'}
                disableTouchRipple
                $fullWidth
              />
            </CTabs>

            {tab === 'peers' ? (
              <PeerList
                userId={userId}
                roomId={roomId}
                peerList={peerList}
                peerConnectionTypes={peerConnectionTypes}
                audioState={audioState}
                peerAudios={peerAudios}
                connectionTestResults={connectionTestResults}
              />
            ) : (
              <UsersRoomBox
                background={'navy90'}
                users={users}
                loading={usersLoading}
                title={''}
                roomType={'private'}
              />
            )}
          </div>
        </Sidebar>
      ) : null}
    </>
  )
}
