import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { useStopwatch } from 'react-timer-hook'
import { useAppSelector } from '../../redux/hooks'
import { ReactComponent as Record } from '../../assets/svg/record.svg'

const PageStyle = styled.section`
  
`
interface Props {
  isScreenRecording?: boolean,
  recordingAlertLog: Array<{
    id: string
    text: string
    timeSent: number
    authorId: string
  }>
}

export function RecordingTitle(props: Props): ReactElement {
  const { isScreenRecording, recordingAlertLog } = props
  const user = useAppSelector(state => state.user)

  const { seconds, minutes, hours, start } = useStopwatch({ autoStart: false })

  useEffect(() => {
    if(isScreenRecording || recordingAlertLog.length > 0){
      start()
    }
  }, [isScreenRecording, recordingAlertLog])

  return (
    <PageStyle>
      {(isScreenRecording || recordingAlertLog.length > 0) && (
        <li>
          <Record />
          <span>{recordingAlertLog.length > 0 ? recordingAlertLog[0].text : ((user.displayName ?? 'New Face') + ' start recording' || 'New Face start recording')}</span>
          <small>({hours}:{minutes}:{seconds})</small>
        </li>
      )}
    </PageStyle>
  )
}
