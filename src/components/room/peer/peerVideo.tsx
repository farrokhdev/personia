import { useEffect, useRef } from 'react'
import { VideoStreamType } from '../../../models'
import { SelectedPeerStream } from '../../../controls'

interface PeerVideoProps {
  isSelfScreenStream?: boolean
  isSelfVideo?: boolean
  numberOfVideos: number
  onVideoClick?: (
    userId: string,
    videoStreamType: VideoStreamType,
    videoStream: MediaStream
  ) => void
  selectedPeerStream: SelectedPeerStream | null
  userId: string
  videoStream: MediaStream
  videoStreamType: VideoStreamType
}

export const PeerVideo = ({
  isSelfScreenStream,
  isSelfVideo,
  numberOfVideos,
  onVideoClick,
  userId,
  selectedPeerStream,
  videoStream,
  videoStreamType,
}: PeerVideoProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const { current: video } = videoRef
    if (!video) return

    video.autoplay = true
    video.srcObject = videoStream

  }, [videoRef, videoStream])

  const rows = Math.ceil((numberOfVideos === 2 ? (numberOfVideos + 1) : (numberOfVideos)) / 2)

  const handleVideoClick = () => {
    onVideoClick?.(userId, videoStreamType, videoStream)
  }

  return (
    <video
      playsInline
      muted={isSelfScreenStream}
      ref={videoRef}
      onClick={handleVideoClick}
      style={{
        borderRadius: '10px',
        cursor: 'pointer',
        overflow: 'auto',
        marginLeft: selectedPeerStream ? '0' : 'auto',
        marginRight: selectedPeerStream ? '0' : 'auto',
        // marginTop: selectedPeerStream ? '10px' : '50px',
        objectFit: 'cover',
        width: '100%',
        height: selectedPeerStream
          ? (window.innerHeight - 195)
          : '100%',
          // : numberOfVideos === 2
          // ? '100%'
          // : (window.innerHeight - 250) / rows,
        ...(isSelfVideo && {
          transform: 'rotateY(180deg)',
        }),
      }}
    />
  )
}
