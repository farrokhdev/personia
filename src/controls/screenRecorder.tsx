import React, { useEffect, useState } from 'react'
import { PeerRoom, PeerStreamType } from '../services'
import { invokeSaveAsDialog } from 'recordrtc'
import styled from 'styled-components'
import { ReactComponent as Record } from '../assets/svg/record.svg'
import fixWebmDuration from 'webm-duration-fix'
import { useAppSelector } from '../redux/hooks'
import { CButton, CModal } from '../components/mui'
import { ReactComponent as Warning } from '../assets/svg/question.svg'

export interface PageProps {
  showAlert: any
  onMessageSubmit: (message: string) => void
  peerRoom: PeerRoom
  onInlineMediaUpload: (files: File[]) => void
  isSpeakingToRoom: boolean
  isScreenRecording: boolean
  setIsScreenRecording: (isScreenRecording: boolean) => void
  recordingAlertLog: Array<{
    id: string
    text: string
    timeSent: number
    authorId: string
  }>
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

const ShareVideo = styled.div`
  width: 100%;
  margin: 0 auto 0 auto;

  > .icon {
    background: ${({ theme }) => theme.red120};
    border-radius: 100%;
    width: 72px;
    height: 72px;
    padding: 24px;
    text-align: center;
    margin: 0 auto 0 auto;
  }

  > h3 {
    color: ${({ theme }) => theme.white100};
    font-family: Inter;
    font-size: 20px;
    font-weight: 600;
    line-height: 28px;
    text-align: center;
    margin-top: 20px;
  }

  > p {
    color: ${({ theme }) => theme.white100};
    font-family: Inter;
    font-size: 12px;
    font-weight: 500;
    line-height: 20px;
    text-align: justify;
    margin-top: 20px;
  }
`

export function ScreenRecorderControls(props: PageProps) {
  const {
    peerRoom,
    onMessageSubmit,
    onInlineMediaUpload,
    isScreenRecording,
    setIsScreenRecording,
    isSpeakingToRoom,
  } = props

  const user = useAppSelector(state => state.user)
  const [desktopStream, setDesktopStream] = useState(null)
  const [voiceStream, setVoiceStream] = useState(null)
  const [stream, setStream] = useState<MediaStream>(null)
  const [blobs, setBlobs] = useState<Array<Blob>>([])
  const [recorder, setRecorder] = useState<MediaRecorder>(null)
  const [videoFile, setVideoFile] = useState<File>(null)
  const [openShareModal, setOpenShareModal] = useState<boolean>(false)

  const mergeAudioStreams = (
    desktopStream: MediaStream,
    voiceStream: MediaStream
  ) => {
    const context = new AudioContext()
    const destination = context.createMediaStreamDestination()
    let hasDesktop = false
    let hasVoice = false
    if (desktopStream && desktopStream.getAudioTracks().length > 0) {
      const source1 = context.createMediaStreamSource(desktopStream)
      const desktopGain = context.createGain()
      desktopGain.gain.value = 0.7
      source1.connect(desktopGain).connect(destination)
      hasDesktop = true
    }

    if (voiceStream && voiceStream.getAudioTracks().length > 0) {
      const source2 = context.createMediaStreamSource(voiceStream)
      const voiceGain = context.createGain()
      voiceGain.gain.value = 1
      source2.connect(voiceGain).connect(destination)
      hasVoice = true
    }

    return hasDesktop || hasVoice ? destination.stream.getAudioTracks() : []
  }

  const makeRecorder = async () => {
    const desktopStream = await navigator.mediaDevices.getDisplayMedia({
      video: true,
      audio: true,
    })
    setDesktopStream(desktopStream)
    const voiceStream = await navigator.mediaDevices.getUserMedia({
      video: false,
      audio: true,
    })
    setVoiceStream(voiceStream)
    const tracks = [
      ...desktopStream.getVideoTracks(),
      ...mergeAudioStreams(desktopStream, voiceStream),
    ]
    const stream = new MediaStream(tracks)
    setStream(stream)
    setBlobs([])
    const recorder = new MediaRecorder(stream, {
      mimeType: 'video/webm; codecs=vp8,opus',
    })

    recorder.ondataavailable = function (e: any) {
      const chunk = e.data
      setBlobs(blobs => [...blobs, chunk])
    }
    setRecorder(recorder)
    return recorder
  }

  const handleRecording = async () => {
    let _recorder = recorder
    if (!recorder) {
      _recorder = await makeRecorder()
    }

    if (isScreenRecording) {
      _recorder.stop()
      _recorder.stream.getTracks().map(track => {
        track.stop()
      })
      stream.getTracks().map(track => {
        track.stop()
      })
      voiceStream.getTracks().map(track => {
        track.stop()
      })
      desktopStream.getTracks().map(track => {
        track.stop()
      })

      const fixBlob = await fixWebmDuration(
        new Blob([...blobs], { type: 'video/webm' })
      )
      const blobReadStream = fixBlob.stream()
      const blobReader = blobReadStream.getReader()

      const _blobs = []
      while (true) {
        let { done, value } = await blobReader.read()
        if (done) {
          break
        }
        _blobs.push(value)
        value = null
      }

      const blob = new Blob(_blobs, { type: 'video/webm' })
      invokeSaveAsDialog(blob)

      var videoFile = new File([blob], `recorded_video.webm`, {
        type: blob.type,
        lastModified: new Date().getTime(),
      })
      setVideoFile(videoFile)

      onMessageSubmit(
        (user.displayName || 'New Face') +
          ' stop recording'
      )

      setStream(null)
      setDesktopStream(null)
      setVoiceStream(null)
      setBlobs([])
      setRecorder(null)
      setIsScreenRecording(false)

      setOpenShareModal(true)
    } else {
      _recorder.start(500)
      setIsScreenRecording(true)
      onMessageSubmit((user.displayName || 'New Face') + ' start recording')
    }
  }

  useEffect(() => {
    if (voiceStream) {
      if (isSpeakingToRoom) {
        voiceStream.getAudioTracks().forEach(function (track) {
          track.enabled = true
        })
      } else {
        voiceStream.getAudioTracks().forEach(function (track) {
          track.enabled = false
        })
      }
    }
  }, [isSpeakingToRoom, voiceStream])



  return (
    <>
      <Button
        background={isScreenRecording ? 'navy60' : 'transparent'}
        border={isScreenRecording ? 'navy40' : 'gray50'}
        padding={isScreenRecording ? '14px' : '14px'}
        onClick={handleRecording}
      >
        <div className={'border'}>
          <div className={isScreenRecording ? 'icon-active' : 'icon'}>
            <div style={{ cursor: 'pointer' }}>
              {isScreenRecording ? <Record /> : <Record />}
            </div>
          </div>
        </div>

        <span>{isScreenRecording ? 'Stop REC' : 'REC'}</span>
      </Button>

    <CModal
      open={openShareModal}
      onClose={() => {
        setOpenShareModal(false)
      }}
      title=""
      width={'300'}
      background={'navy90'}
    >
      <ShareVideo>
        <div className={'icon'}>
          <Warning />
        </div>
        <p>
         Do you want to share recorded screen with others?
        </p>

        <div style={{ marginBottom: '24px' }} />
        <CButton
          onClick={() => {
            setOpenShareModal(false)
            onInlineMediaUpload([videoFile])
            onMessageSubmit(
              (user.displayName || 'New Face') +
              ' share recorded file in the chat'
            )
          }}
          background={'navy25'}
          backgroundHover={'navy25'}
          fullWidth={true}
          size={'s'}
        >
          Yes,Proceed
        </CButton>
        <div style={{ marginBottom: '10px' }} />
        <CButton
          onClick={() => setOpenShareModal(false)}
          background={'red120'}
          backgroundHover={'red120'}
          fullWidth={true}
          size={'s'}
        >
          No, Cancel
        </CButton>
      </ShareVideo>
    </CModal>
    </>

  )
}
