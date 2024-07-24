import { HTMLAttributes, useEffect } from 'react'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import YouTube from 'react-youtube'
import Box from '@mui/material/Box'
import Tooltip from '@mui/material/Tooltip'
import Typography, { TypographyProps } from '@mui/material/Typography'
import Link, { LinkProps } from '@mui/material/Link'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Markdown from 'react-markdown'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CodeProps } from 'react-markdown/lib/ast-to-react'
import remarkGfm from 'remark-gfm'

import {
  InlineMedia as I_InlineMedia,
  Message as IMessage,
  isMessageReceived,
  isInlineMedia,
} from '../../../models'
import { PeerNameDisplay } from '../peer'
import { CopyableBlock } from '../copy'
import { InlineMedia } from './inlineMedia'
import './message.sass'

export interface MessageProps {
  message: IMessage | I_InlineMedia
  showAuthor: boolean
  userId: string
}

const typographyFactory =
  (overrides: TypographyProps) => (args: HTMLAttributes<HTMLElement>) => {
    return <Typography {...args} {...overrides} />
  }

const linkFactory =
  (overrides: LinkProps) => (args: HTMLAttributes<HTMLElement>) => {
    return <Link {...args} {...overrides} />
  }

const componentMap = {
  h1: typographyFactory({ variant: 'h1' }),
  h2: typographyFactory({ variant: 'h2' }),
  h3: typographyFactory({ variant: 'h3' }),
  h4: typographyFactory({ variant: 'h4' }),
  h5: typographyFactory({ variant: 'h5' }),
  h6: typographyFactory({ variant: 'h6' }),
  p: typographyFactory({ variant: 'body1' }),
  a: linkFactory({
    variant: 'body1',
    underline: 'always',
    color: 'primary.contrastText',
    target: '_blank',
  }),
  code({ node, inline, className, children, style, ...props }: CodeProps) {
    const match = /language-(\w+)/.exec(className || '')

    return !inline && match ? (
      <CopyableBlock>
        <SyntaxHighlighter
          children={String(children).replace(/\n$/, '')}
          language={match[1]}
          style={materialDark}
          PreTag="div"
          {...props}
        />
      </CopyableBlock>
    ) : (
      <code className={className} {...props}>
        {children}
      </code>
    )
  },
}

const spaceNeededForSideDateTooltip = 850

const getYouTubeVideoId = (videoUrl: string) => {
  const trimmedMessage = videoUrl.trim()

  const matchArray =
    trimmedMessage.match(/https:\/\/www.youtube.com\/watch\?v=(\S{8,})$/) ||
    trimmedMessage.match(/https:\/\/youtu.be\/(\S{8,})$/)

  return matchArray?.pop()
}

const isYouTubeLink = (message: IMessage) => {
  return typeof getYouTubeVideoId(message.text) === 'string'
}

export const Message = ({ message, showAuthor, userId }: MessageProps) => {
  let backgroundColor: string

  if (message.authorId === userId) {
    backgroundColor = isMessageReceived(message) ? '#111A2C' : '#FFFFFF0D'
  } else {
    backgroundColor = '#FFFFFF0D'
  }

  const getTime = (date: Date) => {
    return date.getHours() + ':' + date.getMinutes()
  }

  return (
    <Box
      className="Message"
      sx={{
        backgroundColor,
        margin: 0.5,
        padding: '0.5em 0.75em',
        transition: 'background-color 1s',
        borderRadius: 6,
        width: '250px',
        float: message.authorId === userId ? 'right' : 'left',
        color: '#ffffff',
      }}
    >
      {showAuthor && (
        <p
          style={{
            color: '#949494',
            marginTop: '10px',
            textAlign: message.authorId === userId ? 'right' : 'left',
            fontSize: '12px',
          }}
        >
          <PeerNameDisplay>{message.authorId}</PeerNameDisplay>
        </p>
      )}

      {isInlineMedia(message) ? (
        <InlineMedia magnetURI={message.magnetURI} />
      ) : isYouTubeLink(message) ? (
        <YouTube videoId={getYouTubeVideoId(message.text)} />
      ) : (
        <Markdown
          components={componentMap}
          remarkPlugins={[remarkGfm]}
          className={message.authorId === userId ? 'right-text' : 'left-text'}
        >
          {message.text}
        </Markdown>
      )}

      <p
        style={{
          color: '#949494',
          marginTop: '10px',
          textAlign: message.authorId === userId ? 'right' : 'left',
          fontSize: '12px',
        }}
      >
        {getTime(new Date(message.timeSent))}
      </p>
    </Box>
  )
}
