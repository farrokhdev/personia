import React from 'react'
import ListItemText from '@mui/material/ListItemText'
import ListItem from '@mui/material/ListItem'
import { AudioVolume } from '../audio'
import { Peer } from '../../../models'
import { PeerConnectionType } from '../../../services'
import styled from 'styled-components'
import { Avatar } from '@mui/material'
import { usePeerNameDisplay } from '../../../hook'

const Box2 = styled.div<{ $marginBottom: string }>`
    background: ${props => props.theme.gray70};
    padding: 8px;
    border-radius: 8px;
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-right: 7px;
    margin-bottom: ${({ $marginBottom }) => $marginBottom};
    cursor: pointer;
    position: relative;
    text-align: center;
    align-self: center;
    align-content: center;

    > .left {
        display: flex;
        width: 100%;
        text-align: center;
        align-self: center;
        align-content: center;

        > span {
            font-size: 14px;
            font-weight: 500;
            color: ${props => props.theme.white100};
            display: block;
            margin-bottom: 5px;
            display: -webkit-box;
            -webkit-line-clamp: 1; /* number of lines to show */
            line-clamp: 1;
            -webkit-box-orient: vertical;
            overflow: hidden;
            margin-left: 10px;
            text-align: center;
            margin-top: 10px;
        }
    }

    > .right {
        display: flex;
        gap: 5px;
        float: right;
        text-align: center;
        align-self: center;
        align-content: center;
    }
    
`

interface PeerListItemProps {
  peer: Peer
  peerAudios: Record<string, HTMLAudioElement>
}

export const PeerListItem = ({
  peer,
  peerAudios,
}: PeerListItemProps): JSX.Element => {


  const { getdisplayName, getAvatar } = usePeerNameDisplay()

  return (
    <>
      <ListItem key={peer.peerId} divider={true}>
        <ListItemText>
          <Box2 $marginBottom={'10px'}>
            <div className={'left'}>
              <Avatar src={getAvatar(peer.userId)} alt={peer.userId} />
              <span>{getdisplayName(peer.userId)}</span>
            </div>
            <div className={'right'}>
              {peer.peerId in peerAudios && (
                <AudioVolume audioEl={peerAudios[peer.peerId]} />
              )}
            </div>

          </Box2>

        </ListItemText>
      </ListItem>
    </>
  )
}
