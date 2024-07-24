import { useContext, useEffect, useState } from 'react'
import { RoomContext, ShellContext } from '../contexts'
import { AudioState, Peer, ScreenShareState, VideoStreamType } from '../models'
import { PeerVideo } from '../components/room/peer'
import _ from 'lodash'
import { Avatar } from '@mui/material'
import { useAppSelector } from '../redux/hooks'
import styled from 'styled-components'
import { ReactComponent as MicOff } from '../assets/svg/mic.svg'
import { ReactComponent as MicOn } from '../assets/svg/microphone-on.svg'
import { ReactComponent as AvatarSvg } from '../assets/svg/avatar.svg'
import { ReactComponent as ConnectionStrong } from '../assets/svg/connection-strong.svg'
import { ReactComponent as ConnectionWeak } from '../assets/svg/connection-weak.svg'
import { PeerConnectionType } from '../services'
import Tooltip from '@mui/material/Tooltip'
import { isDesktop, isTablet } from '../utils/detect-screen'

const Box = styled.div<{ selectedVideo: any }>`
  display: ${isDesktop()
    ? ({ selectedVideo }) => (selectedVideo ? 'flex' : 'block')
    : 'block'};
  width: 100%;
  height: 98%;

  > .row-2 {
    display: flex;
    flex-direction: ${isDesktop() ? 'column' : 'column'};
    overflow: auto;
    width: ${isDesktop() ? '30%' : '100%'};
    margin-top: 10px;
    margin-left: ${isDesktop() ? '10px' : '0'};

    > .column {
      padding: 10px;
      border-radius: 10px;
      background: ${({ theme }) => theme.navy80};
      margin: 5px;
      align-items: center;
      text-align: center;
      height: 200px !important;

      > .top {
        display: flex;
        position: relative;
        top: 0;
        height: 80%;
        justify-content: center;
        align-items: center;

        > .avatar {
          top: 0;
          margin: 0 auto 0 auto;
          border-radius: 50%;
          width: 100px;
          height: 100px;
          color: ${({ theme }) => theme.white100};
          fill: ${({ theme }) => theme.white100};
          background: #bdbdbd;
          line-height: 1;
          font-size: 1.25rem;
          align-items: center;
          justify-content: center;
          display: flex;
        }

        > video {
          height: 150px !important;
          margin-top: 5px !important;
          border-radius: 10px !important;
        }
      }

      > .bottom {
        position: relative;
        align-self: start;
        background: ${({ theme }) => theme.black30};
        width: auto;
        margin-right: 2px;
        margin-left: 2px;
        padding: 10px;
        border-radius: 10px;
        z-index: 100;
        margin-bottom: 3px;

        > .d-flex {
          display: flex;

          > .connection {
            width: 22px;
            height: 22px;
            margin-right: 10px;
            margin-top: -5px;
          }

          > .name {
            color: ${({ theme }) => theme.white100};
            margin-left: 10px;
          }
        }
      }
    }
  }

  > .row {
    display: grid;
    grid-template-columns: ${isDesktop() ? '1fr 1fr' : '1fr'};
    height: 96%;
    position: relative;

    > .column {
      //padding: 10px;
      border-radius: 10px;
      background: ${({ theme }) => theme.navy80};
      margin: 5px;
      align-items: center;
      text-align: center;

      > .top {
        display: flex;
        position: relative;
        top: 0;
        height: 85%;
        justify-content: center;
        align-items: center;

        > .avatar {
          top: 0;
          margin: 0 auto 0 auto;
          border-radius: 50%;
          width: 200px;
          height: 200px;
          color: ${({ theme }) => theme.white100};
          fill: ${({ theme }) => theme.white100};
          background: #bdbdbd;
          line-height: 1;
          font-size: 1.25rem;
          align-items: center;
          justify-content: center;
          display: flex;
        }
      }

      > .bottom {
        position: relative;
        align-self: start;
        background: ${({ theme }) => theme.black30};
        margin-right: 10px;
        margin-left: 10px;
        padding: 10px;
        border-radius: 10px;
        z-index: 100;
        margin-top: -50px;

        > .d-flex {
          display: flex;

          > .connection {
            width: 22px;
            height: 22px;
            margin-right: 10px;
            margin-top: -5px;
          }

          > .name {
            color: ${({ theme }) => theme.white100};
            margin-left: 10px;
            margin-right: 10px;
          }
        }
      }
    }
  }
`

interface PeerWithVideo {
  peer: Peer
  videoStream?: MediaStream
  screenStream?: MediaStream
  hasPeerConnection: boolean
  isPeerConnectionDirect: boolean
}

export interface SelectedPeerStream {
  peerId: string
  videoStreamType: VideoStreamType
  videoStream: MediaStream
}

export interface RoomVideoDisplayProps {
  userId: string
  isSpeakingToRoom: boolean
  peerConnectionTypes: Record<string, PeerConnectionType>
}

export const RoomVideoDisplay = ({
  userId,
  isSpeakingToRoom,
  peerConnectionTypes,
}: RoomVideoDisplayProps) => {
  const shellContext = useContext(ShellContext)
  const roomContext = useContext(RoomContext)
  const [selectedPeerStream, setSelectedPeerStream] =
    useState<SelectedPeerStream | null>(null)

  const { peerList, peerAudios } = shellContext
  const {
    peerVideoStreams,
    selfVideoStream,
    peerScreenStreams,
    selfScreenStream,
  } = roomContext

  const peersWithVideo: PeerWithVideo[] = peerList.reduce(
    (acc: PeerWithVideo[], peer: Peer) => {
      const videoStream = peerVideoStreams[peer.peerId]
      const screenStream = peerScreenStreams[peer.peerId]
      const hasPeerConnection = peer.peerId in peerConnectionTypes
      const isPeerConnectionDirect =
        peerConnectionTypes[peer.peerId] === PeerConnectionType.DIRECT

      acc.push({
        peer,
        videoStream,
        screenStream,
        hasPeerConnection,
        isPeerConnectionDirect,
      })

      return acc
    },
    []
  )

  const numberOfVideos =
    (selfVideoStream ? 1 : 0) +
    (selfScreenStream ? 1 : 0) +
    peersWithVideo.reduce((sum, peerWithVideo) => {
      sum++
      return sum
    }, 0)

  useEffect(() => {
    if (!selectedPeerStream) return

    if (numberOfVideos < 2) {
      setSelectedPeerStream(null)
      return
    }

    const allMediaStreams = [
      ...Object.values(peerVideoStreams),
      ...Object.values(peerScreenStreams),
      selfVideoStream,
      selfScreenStream,
    ]

    for (const mediaStream of allMediaStreams) {
      if (mediaStream?.id === selectedPeerStream.videoStream.id) {
        return
      }
    }

    setSelectedPeerStream(null)
  }, [
    numberOfVideos,
    peerScreenStreams,
    peerVideoStreams,
    selectedPeerStream,
    selfScreenStream,
    selfVideoStream,
  ])

  const handleVideoClick = (
    peerId: string,
    videoStreamType: VideoStreamType,
    videoStream: MediaStream
  ) => {
    if (selectedPeerStream?.videoStream === videoStream) {
      setSelectedPeerStream(null)
    } else if (numberOfVideos >= 1) {
      setSelectedPeerStream({ peerId, videoStreamType, videoStream })
    }
  }

  const user = useAppSelector(state => state.user)
  const [rows, setRows] = useState<number>(1)
  useEffect(() => {
    setRows(Math.ceil((peerList.length + 1) / 2))
  }, [numberOfVideos, peerList])

  useEffect(() => {
    peersWithVideo.map(item => {
      if (item.screenStream) {
        setSelectedPeerStream({
          peerId: item.peer.userId,
          videoStreamType: VideoStreamType.SCREEN_SHARE,
          videoStream: item.screenStream,
        })
      }
    })
  }, [peersWithVideo])

  return (
    <Box selectedVideo={selectedPeerStream}>
      {selectedPeerStream && (
        <PeerVideo
          numberOfVideos={numberOfVideos}
          onVideoClick={handleVideoClick}
          isSelfVideo={selectedPeerStream.peerId === userId}
          userId={selectedPeerStream.peerId}
          selectedPeerStream={selectedPeerStream}
          videoStream={selectedPeerStream.videoStream}
          videoStreamType={selectedPeerStream.videoStreamType}
        />
      )}
      <div className={selectedPeerStream ? 'row-2' : 'row'}>
        {!selectedPeerStream ||
        (selectedPeerStream && selectedPeerStream.peerId !== userId) ? (
          <div
            className={'column'}
            style={{
              height: isDesktop()
                ? (window.innerHeight - 195) / rows
                : (window.innerHeight - 195) / rows / 2 -
                  (isTablet() ? 30 : 20),
            }}
          >
            <div
              className={'top'}
              style={{
                height: selectedPeerStream
                  ? '80%'
                  : isDesktop()
                  ? '100%'
                  : selectedPeerStream
                  ? '200px'
                  : (window.innerHeight - 195) / rows / 2 - 20 + 'px',
              }}
            >
              {!selfScreenStream &&
                !selfVideoStream &&
                (user.avatar ? (
                  <Avatar
                    className={'avatar'}
                    alt={_.get(user, 'name', '')}
                    sx={{ width: 200, height: 200 }}
                    src={`https://greenia.infura-ipfs.io/ipfs/${user.avatar}`}
                  />
                ) : (
                  <div className={'avatar'}>
                    <AvatarSvg />
                  </div>
                ))}
              {selfVideoStream && (
                <PeerVideo
                  isSelfVideo
                  numberOfVideos={numberOfVideos}
                  onVideoClick={handleVideoClick}
                  userId={userId}
                  selectedPeerStream={selectedPeerStream}
                  videoStream={selfVideoStream}
                  videoStreamType={VideoStreamType.WEBCAM}
                />
              )}
              {selfScreenStream && (
                <PeerVideo
                  isSelfScreenStream
                  numberOfVideos={numberOfVideos}
                  onVideoClick={handleVideoClick}
                  userId={userId}
                  selectedPeerStream={selectedPeerStream}
                  videoStream={selfScreenStream}
                  videoStreamType={VideoStreamType.SCREEN_SHARE}
                />
              )}
            </div>
            <div className={'bottom'}>
              <div className={'d-flex'}>
                {isSpeakingToRoom ? <MicOn /> : <MicOff />}
                <p className={'name'}>{user.displayName || 'New Face'}</p>
              </div>
            </div>
          </div>
        ) : null}

        {peersWithVideo.map((peerWithVideo, index) =>
          !selectedPeerStream ||
          (selectedPeerStream &&
            selectedPeerStream.peerId !== peerWithVideo.peer.userId) ? (
            <div
              key={index}
              className={'column'}
              style={{
                height: isDesktop()
                  ? (window.innerHeight - 195) / rows
                  : (window.innerHeight - 195) / rows / 2 -
                    (isTablet() ? 30 : 20),
              }}
            >
              <>
                <div
                  className={'top'}
                  style={{
                    height: selectedPeerStream
                      ? '80%'
                      : isDesktop()
                      ? '100%'
                      : selectedPeerStream
                      ? '200px'
                      : (window.innerHeight - 195) / rows / 2 - 20 + 'px',
                  }}
                >
                  {!peerWithVideo.videoStream && !peerWithVideo.screenStream ? (
                    !peerWithVideo.peer.avatar.includes('undefined') ? (
                      <Avatar
                        className={'avatar'}
                        alt={_.get(user, 'name', '')}
                        sx={{ width: 200, height: 200 }}
                        src={peerWithVideo.peer.avatar}
                      />
                    ) : (
                      <div className={'avatar'}>
                        <AvatarSvg />
                      </div>
                    )
                  ) : (
                    <>
                      {peerWithVideo.videoStream && (
                        <PeerVideo
                          numberOfVideos={numberOfVideos}
                          onVideoClick={handleVideoClick}
                          userId={peerWithVideo.peer.userId}
                          selectedPeerStream={selectedPeerStream}
                          videoStream={peerWithVideo.videoStream}
                          videoStreamType={VideoStreamType.WEBCAM}
                        />
                      )}
                      {peerWithVideo.screenStream && (
                        <PeerVideo
                          numberOfVideos={numberOfVideos}
                          onVideoClick={handleVideoClick}
                          userId={peerWithVideo.peer.userId}
                          selectedPeerStream={selectedPeerStream}
                          videoStream={peerWithVideo.screenStream}
                          videoStreamType={VideoStreamType.SCREEN_SHARE}
                        />
                      )}
                    </>
                  )}
                </div>
                <div className={'bottom'}>
                  <div className={'d-flex'}>
                    {peerWithVideo.hasPeerConnection && (
                      <div className={'connection'}>
                        {peerWithVideo.isPeerConnectionDirect ? (
                          <Tooltip
                            title={
                              'You are connected directly to ' +
                              (peerWithVideo.peer.displayName || 'New Face')
                            }
                          >
                            <ConnectionStrong />
                          </Tooltip>
                        ) : (
                          <Tooltip
                            title={
                              'You are connected to ' +
                              (peerWithVideo.peer.displayName || 'New Face') +
                              ' via a relay server. Your connection is still private and encrypted, but performance may be degraded.'
                            }
                          >
                            <ConnectionWeak />
                          </Tooltip>
                        )}
                      </div>
                    )}

                    {peerWithVideo.peer.audioState === AudioState.PLAYING ? (
                      <MicOn />
                    ) : (
                      <MicOff />
                    )}
                    <p className={'name'}>
                      {peerWithVideo.peer.displayName || 'New Face'}
                    </p>
                  </div>
                </div>
              </>
            </div>
          ) : null
        )}
      </div>
    </Box>
  )
}
