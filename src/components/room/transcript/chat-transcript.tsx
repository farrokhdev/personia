import { HTMLAttributes, useRef, useEffect, useState, useContext } from 'react'
import cx from 'classnames'
import Box from '@mui/material/Box'
import useTheme from '@mui/material/styles/useTheme'

import { Message as IMessage, InlineMedia } from '../../../models'
import { Message } from '../message'
import { ShellContext } from '../../../contexts/shell'

export interface ChatTranscriptProps extends HTMLAttributes<HTMLDivElement> {
  messageLog: Array<IMessage | InlineMedia>
  userId: string
}

export const ChatTranscript = ({
  className,
  messageLog,
  userId,
}: ChatTranscriptProps) => {
  const theme = useTheme()
  const boxRef = useRef<HTMLDivElement>(null)
  const [previousMessageLogLength, setPreviousMessageLogLength] = useState(0)

  useEffect(() => {
    const { current: boxEl } = boxRef
    if (!boxEl) return

    const { scrollHeight, clientHeight, scrollTop, children } = boxEl
    const scrollTopMax = scrollHeight - clientHeight

    if (children.length === 0) return

    const lastChild = children[children.length - 1]
    const lastChildHeight = lastChild.clientHeight
    const previousScrollTopMax = scrollTopMax - lastChildHeight

    // Accounts for rounding errors in layout calculations
    const marginBuffer = 1

    const wasPreviouslyScrolledToBottom =
      Math.ceil(scrollTop) >= Math.ceil(previousScrollTopMax) - marginBuffer
    const wasMessageLogPreviouslyEmpty = previousMessageLogLength === 0
    const shouldScrollToLatestMessage =
      wasPreviouslyScrolledToBottom || wasMessageLogPreviouslyEmpty

    if (
      shouldScrollToLatestMessage &&
      // scrollTo is not defined in the unit test environment
      'scrollTo' in boxEl
    ) {
      boxEl.scrollTo({ top: scrollTopMax })
    }
  }, [messageLog, previousMessageLogLength])

  useEffect(() => {
    setPreviousMessageLogLength(messageLog.length)
  }, [messageLog.length])

  const transcriptMaxWidth = theme.breakpoints.values.md
  const transcriptPaddingX = `(50% - ${
    transcriptMaxWidth / 2
  }px) - ${theme.spacing(1)}`
  const transcriptMinPadding = theme.spacing(1)

  return (
    <Box
      ref={boxRef}
      className={cx('ChatTranscript', className)}
      sx={{
        display: 'flex',
        flexDirection: 'column',
        py: transcriptMinPadding,
        px: `max(${transcriptPaddingX}, ${transcriptMinPadding})`,
        transition: `padding-top ${theme.transitions.duration.short}ms ${theme.transitions.easing.easeInOut}`,
        width: '100%',
        height: '88%',
        overflowY: 'auto',
      }}
    >
      {messageLog.map((message, idx) => {
        const previousMessage = messageLog[idx - 1]
        const isFirstMessageInGroup =
          previousMessage?.authorId !== message.authorId

        return (
          // This wrapper div is necessary for accurate layout calculations
          // when new messages cause the transcript to scroll to the bottom.
          <div key={message.id}>
            <Message
              message={message}
              userId={userId}
              showAuthor={isFirstMessageInGroup}
            />
          </div>
        )
      })}
    </Box>
  )
}
