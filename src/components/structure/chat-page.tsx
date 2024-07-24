import React, { ReactElement, ReactNode, useEffect, useState } from 'react'
import styled from 'styled-components'
import { ReactComponent as Logo } from '../../assets/svg/logtypo-02.svg'
import { Link } from 'react-router-dom'
import { CButton, CModal } from '../mui'
import { ReactComponent as Leave } from '../../assets/svg/leave.svg'
import { ReactComponent as Warning } from '../../assets/svg/warning.svg'
import { ReactComponent as Clock } from '../../assets/svg/clock.svg'
import { useStopwatch } from 'react-timer-hook'
import { useAppSelector } from '../../redux/hooks'
import { RecordingTitle } from './recording'

const PageStyle = styled.section`
    > nav.menu {
        width: 100%;
        margin: 0 auto;
        height: 60px;
        background: ${props => props.theme.navy100};
        position: sticky;
        top: 0;
        left: 0;
        right: 0;
        z-index: 100;
        box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.1);

        > .wrapper {
            max-width: 1440px;
            width: 95%;
            margin: 0 auto;
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            height: 100%;

            > .icon {
                > svg {
                    width: 150px;
                }
            }

            > .links {
                display: flex;

                ul {
                    display: flex;
                    flex-wrap: wrap;

                    li {
                        display: flex;
                        list-style: none;
                        margin-right: 32px;

                        > svg {
                        }

                        span {
                            color: ${props => props.theme.white100};
                            margin-left: 10px;
                            text-align: center;
                            margin-top: 2px;
                        }

                        small {
                            color: ${props => props.theme.white100};
                            margin-left: 10px;
                            text-align: center;
                            margin-top: 7px;
                        }
                    }
                }
            }

            > .items {
                display: grid;
            }
        }
    }

    > .content {
        display: grid;
        grid-template-columns: 1fr;
        max-width: 1440px;
        margin: auto;
        width: 100%;
        height: 93vh;
        overflow: hidden;

        & > ::-webkit-scrollbar {
            background: ${props => props.theme.gray70};
            width: 1px;
            margin-left: 10px;
            display: none !important;
        }

        > .main {
            overflow: auto;
        }
    }
`

const LeaveCall = styled.div`
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

interface Props {
  title: string
  children: ReactNode
  isScreenRecording?: boolean
  recordingAlertLog: Array<{
    id: string
    text: string
    timeSent: number
    authorId: string
  }>
}

export function ChatPage(props: Props): ReactElement {
  const { title, isScreenRecording, children, recordingAlertLog } = props
  const user = useAppSelector(state => state.user)

  useEffect(() => {
    document.title = title
    return () => {
      document.title = ''
    }
  }, [title])

  const [openLeaveModal, setOpenLeaveModal] = useState<boolean>(false)
  const handleLeaveRoom = () => {
    setOpenLeaveModal(!openLeaveModal)
  }

  const { seconds, minutes, hours } = useStopwatch({ autoStart: true })

  return (
    <PageStyle>
      <nav className={'menu'}>
        <div className={'wrapper'}>
          <div className={'items'} style={{ alignItems: 'center' }}>
            <div className={'icon'} style={{width: '120px'}}>
              <Link to={'/'}>
                <Logo />
              </Link>
            </div>
          </div>

          <div className={'links'}>
            <ul>
              <RecordingTitle
                recordingAlertLog={recordingAlertLog}
                isScreenRecording={isScreenRecording}
              />
              <li>
                <Clock />
                <span>
                  {hours}:{minutes}:{seconds}
                </span>
              </li>
            </ul>
          </div>

          <div className={'items'}>
            <div style={{ alignSelf: 'center', marginLeft: '20px' }}>
              <CButton
                startIconSvg={<Leave />}
                onClick={handleLeaveRoom}
                background={'red90'}
                size={'s'}
                backgroundHover={'red90'}
              >
                Leave call
              </CButton>
            </div>
          </div>
        </div>
      </nav>

      <div className={`content`}>
        <div className="main">{children}</div>
      </div>

      <CModal
        open={openLeaveModal}
        onClose={() => {
          setOpenLeaveModal(false)
        }}
        title=""
        width={'300'}
        background={'navy90'}
      >
        <LeaveCall>
          <div className={'icon'}>
            <Warning />
          </div>
          <h3>Warning</h3>
          <p>
            With Leaving this call all shared data in the call will be lost to
            you! Do you want to proceed?
          </p>

          <div style={{ marginBottom: '24px' }} />
          <CButton
            onClick={() => {
              setOpenLeaveModal(false)
              window.opener = null
              window.open('', '_self')
              window.close()
              window.history.go(-1)
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
            onClick={() => setOpenLeaveModal(false)}
            background={'red120'}
            backgroundHover={'red120'}
            fullWidth={true}
            size={'s'}
          >
            No, Cancel
          </CButton>
        </LeaveCall>
      </CModal>
    </PageStyle>
  )
}
