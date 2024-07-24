import React, { useContext, useEffect, useRef, useState } from 'react'
import { ReactComponent as Chat } from '../assets/svg/chat.svg'
import { ReactComponent as ArrowLeft } from '../assets/svg/arrow-left.svg'
import styled from 'styled-components'
import { ChatTranscript } from '../components/room/transcript'
import { InlineMedia, Message as IMessage } from '../models'
import { MessageForm } from '../components/room/message'

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
  padding: 10px;

  > .header {
    height: 40px;

    > .icon {
      cursor: pointer;
      rotate: 180deg;
      float: left;
    }
  }
`

export interface ChatProps {
  messageLog: Array<IMessage | InlineMedia>
  userId: string
  onMessageSubmit: (message: string) => void
  onMessageChange: (message: string) => void
  isMessageSending: boolean
}

export function RoomShowMessagesControls(props: ChatProps) {
  const {
    messageLog,
    userId,
    onMessageSubmit,
    onMessageChange,
    isMessageSending,
  } = props
  const [isShowingMessages, setIsShowingMessages] = useState<boolean>(false)

  useEffect(() => {
    messageLog.forEach((message=>{
    }))
  }, [messageLog])
  return (
    <>
      <Button
        background={isShowingMessages ? 'navy60' : 'transparent'}
        border={isShowingMessages ? 'navy40' : 'gray50'}
        padding={isShowingMessages ? '12px' : '13px'}
        onClick={() => setIsShowingMessages(!isShowingMessages)}
      >
        <div className={'border'}>
          <div className={isShowingMessages ? 'icon-active' : 'icon'}>
            <div style={{ cursor: 'pointer' }}>
              <Chat />
            </div>
          </div>
        </div>

        <span>{'Chat'}</span>
      </Button>

      {isShowingMessages ? (
        <Sidebar width={isShowingMessages ? '350' : '0'}>
          <div className={'header'}>
            <div className={'icon'} onClick={() => setIsShowingMessages(false)}>
              <ArrowLeft />
            </div>
          </div>
          <ChatTranscript
            messageLog={messageLog}
            userId={userId}
            className="grow overflow-auto"
          />
          <MessageForm
            onMessageSubmit={onMessageSubmit}
            isMessageSending={isMessageSending}
            onMessageChange={onMessageChange}
          />
        </Sidebar>
      ) : null}
    </>
  )
}
