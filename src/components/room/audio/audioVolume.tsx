import { useState, useEffect } from 'react'
import { CSvgButton } from '../../mui/SvgButton'
import { ReactComponent as VolumeHigh } from '../../../assets/svg/volume-high.svg'
import { ReactComponent as VolumeSlash } from '../../../assets/svg/volume-slash.svg'

interface AudioVolumeProps {
  audioEl: HTMLAudioElement
}

export const AudioVolume = ({ audioEl }: AudioVolumeProps) => {
  const [audioVolume, setAudioVolume] = useState(audioEl.volume)

  useEffect(() => {
    audioEl.volume = audioVolume
  }, [audioEl, audioVolume])

  const handleIconClick = () => {
    if (audioVolume === 0) {
      setAudioVolume(1)
    } else {
      setAudioVolume(0)
    }
  }

  return (
      <CSvgButton icon={audioVolume === 0 ? <VolumeSlash /> : <VolumeHigh />}
                  backgroundColorHover={'white60'}
                  customColor={'white100'}
                  backgroundColor={'white60'}
                  onClick={handleIconClick}/>
  )
}
