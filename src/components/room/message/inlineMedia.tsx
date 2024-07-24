import { useContext, useEffect, useRef, useState } from 'react'
import { TorrentFile } from 'webtorrent'
import CircularProgress from '@mui/material/CircularProgress'
import Typography from '@mui/material/Typography'
import { ReactComponent as Download } from '../../../assets/svg/download.svg'
import { fileTransfer } from '../../../services'
import { ShellContext } from '../../../contexts/shell'
import styled from 'styled-components'
import { CButton } from '../../mui'

type TorrentFiles = Awaited<ReturnType<typeof fileTransfer.download>>

interface InlineMediaProps {
  magnetURI: string
}

interface InlineFileProps {
  file: TorrentFile
  magnetURI: string
}

export const InlineFile = ({ file, magnetURI }: InlineFileProps) => {
  const containerRef = useRef(null)
  const [didRenderingMediaFail, setDidRenderingMediaFail] = useState(false)
  const shellContext = useContext(ShellContext)
  const [blob, setBlob] = useState<Blob>(null)
  const [downloadProgress, setDownloadProgress] = useState<number | null>(null)

  const onProgress = (progress: number) => {
    setDownloadProgress(progress * 100)
  }

  useEffect(() => {
    ;(async () => {
      const { current: container } = containerRef
      if (file.name.includes('mp4')) return
      if (!container) return

      file.getBlob((err, blob) => {
        setBlob(blob)
      })

      try {
        file.appendTo(container)
      } catch (e) {
        setDidRenderingMediaFail(true)
      }
    })()
  }, [file, containerRef, shellContext.roomId])

  const handleDownloadFile = async () => {
    await fileTransfer.download(magnetURI, shellContext.roomId, {
      doSave: true,
    })
  }

  return (
    <div ref={containerRef}>
      {didRenderingMediaFail ? (
        <Typography sx={{ fontStyle: 'italic' }}>
          Media failed to render
        </Typography>
      ) : (
        <>
          <small style={{ marginBottom: '10px', wordBreak: 'break-word', padding: '10px', lineHeight: '24px' }}>{file.name}</small>

          <div style={{ margin: '10px' }}></div>
          <CButton
            onClick={handleDownloadFile}
            backgroundHover={'navy100'}
            background={'navy100'}
            startIconSvg={<Download />}
            size={'s'}
            fullWidth={true}
          >
            Download file
          </CButton>
          <div style={{ margin: '10px' }}></div>
        </>
      )}
    </div>
  )
}

const FileStyle = styled.div`
  > div > img {
    width: 100%;
    border-radius: 24px;
    padding: 3px;
  }

  > div > audio {
    width: 100%;
    border-radius: 24px;
    padding: 3px;
  }

  > div > object {
    width: 100%;
    border-radius: 24px;
    padding: 3px;
  }

  > div > video {
    width: 100%;
    border-radius: 24px;
    padding: 3px;
  }

  > div > svg {
    width: 100%;
    border-radius: 24px;
    padding: 3px;
  }
`

export const InlineMedia = ({ magnetURI }: InlineMediaProps) => {
  const [hasDownloadInitiated, setHasDownloadInitiated] = useState(false)
  const [downloadedFiles, setDownloadedFiles] = useState<TorrentFiles>([])
  const shellContext = useContext(ShellContext)

  useEffect(() => {
    ;(async () => {
      if (hasDownloadInitiated) return
      if (typeof shellContext.roomId !== 'string') {
        throw new Error('shellContext.roomId is not a string')
      }

      setHasDownloadInitiated(true)
      const files = await fileTransfer.download(magnetURI, shellContext.roomId)
      setDownloadedFiles(files)
    })()

  }, [hasDownloadInitiated, magnetURI, shellContext.roomId])

  return (
    <>
      {hasDownloadInitiated && downloadedFiles.length === 0 ? (
        <CircularProgress variant="indeterminate" color="inherit" />
      ) : (
        downloadedFiles.map(file => (
          <FileStyle>
            <InlineFile magnetURI={magnetURI} file={file} key={file.name} />
          </FileStyle>
        ))
      )}
    </>
  )
}
