import { PropsWithChildren } from 'react'
import List from '@mui/material/List'
import CircularProgress from '@mui/material/CircularProgress'
import { AudioState, Peer } from '../../../models'
import { PeerConnectionType, TrackerConnection } from '../../../services'
import { PeerListItem } from './peerListItem'
import { ConnectionTestResults as IConnectionTestResults } from '../shell/useConnectionTest'
import styled from 'styled-components'

export const peerListWidth = 300

export interface PeerListProps extends PropsWithChildren {
  userId: string
  roomId: string | undefined
  peerList: Peer[]
  peerConnectionTypes: Record<string, PeerConnectionType>
  audioState: AudioState
  peerAudios: Record<string, HTMLAudioElement>
  connectionTestResults: IConnectionTestResults
}

const UserBox = styled.div<{ background: string }>`
  background: ${({ theme, background }) => theme[background]};
  border-radius: 8px;
  width: 100%;
  height: 100vh;

  > .header {
    border-bottom: 1px solid ${props => props.theme.black60};
    margin: 0 auto 0 auto;
    padding: 10px 0 0 0;

    > p {
      font-size: 14px;
      font-weight: 400;
      color: ${props => props.theme.green100};
      border-bottom: 2px solid ${props => props.theme.green100};
      text-align: center;
      line-height: 28px;
      width: 47%;
      align-self: center;
      margin: 0 auto 0 auto;
      padding: 5px;
    }
  }

  > .body {
    padding: 20px;

    /* width */

    ::-webkit-scrollbar {
      background: ${props => props.theme.gray70};
      width: 8px;
      margin-left: 10px;
    }

    /* Track */

    ::-webkit-scrollbar-track {
      border-radius: 10px;
    }

    /* Handle */

    ::-webkit-scrollbar-thumb {
      background: ${props => props.theme.gray80};
      border-radius: 10px;
    }
  }

  > .search {
    display: flex;

    > p {
      font-size: 14px;
      font-weight: 400;
      color: ${props => props.theme.white100};
      text-align: center;
      line-height: 28px;
      align-self: center;
      margin: 0 auto 0 auto;
      padding: 5px;
    }

    > span {
      font-size: 22px;
      color: ${props => props.theme.white100};
      text-align: center;
      align-self: center;
      margin: 0 auto 0 auto;
    }
  }
`

export const PeerList = ({
  roomId,
  peerList,
  peerConnectionTypes,
  peerAudios,
  connectionTestResults,
}: PeerListProps) => {
  return (
    <UserBox background={'navy90'}>
      <List style={{ padding: '0 !important' }}>
        <div className={'body'}>
          {peerList.map((peer: Peer) => (
            <PeerListItem
              key={peer.peerId}
              peer={peer}
              peerAudios={peerAudios}
            />
          ))}
        </div>
      </List>

      {peerList.length === 0 &&
      typeof roomId === 'string' &&
      connectionTestResults.trackerConnection === TrackerConnection.CONNECTED &&
      connectionTestResults.hasHost ? (
        <div className={'search'}>
          <CircularProgress size={19} />
          <p>Searching for peers...</p>
        </div>
      ) : null}
    </UserBox>
  )
}
