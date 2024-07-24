import React, {
  useContext,
  useState,
} from 'react'
import styled from 'styled-components'
import { CSvgButton } from '../../../mui/SvgButton'
import { CModal } from '../../../mui'
import EmojiPicker from 'emoji-picker-react'
import { EmojiClickData } from 'emoji-picker-react/dist/types/exposedTypes'
import { ReactComponent as Send } from '../../../../assets/svg/send.svg';
import { ReactComponent as Emoji } from '../../../../assets/svg/emoji.svg';

interface MessageFormProps {
  onMessageSubmit: (message: string) => void
  onMessageChange: (message: string) => void
  isMessageSending: boolean
}

const ChatMessageBoxStyle = styled.div`
  border: 1px solid ${(props) => props.theme.white30};
  border-radius: 16px;
  padding: 5px;
  display: flex;
  position: absolute;
  bottom: 0;
  width: 330px;
  margin: 0 -40px 20px auto;
  align-self: center;

  > textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: ${(props) => props.theme.white100};
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
    padding: 10px;
    text-align: left;
  }
`;

export const MessageForm = ({
  onMessageSubmit,
}: MessageFormProps) => {
  const [message, setMessage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSetMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const [emojiModal, setEmojiModal] = useState<boolean>(false);
  const handleOpenEmoji = () => {
    setEmojiModal(true);
  };

  const handleSendEmoji = (emoji: EmojiClickData) => {
    setMessage(message + '' + emoji.emoji);
  };

  const handleSubmitMessage = () => {
    setIsSubmitting(true);

    onMessageSubmit(message)
    setMessage('')
    setIsSubmitting(false)
  };

  const handleSetKeyDown = (event: any) =>{
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault()
      setIsSubmitting(true);

      onMessageSubmit(message)
      setMessage('')
      setIsSubmitting(false)
    }
  }

  return (
    <ChatMessageBoxStyle>
        <textarea
          rows={1}
          placeholder={'Type your messages...'}
          onChange={handleSetMessage}
          onKeyDown={handleSetKeyDown}
          value={message}></textarea>

      <CSvgButton
        disabled={false}
        loading={false}
        backgroundColor={'transparent'}
        backgroundColorHover={'transparent'}
        icon={<Emoji />}
        onClick={handleOpenEmoji}
      />
      <CSvgButton
        onClick={handleSubmitMessage}
        disabled={isSubmitting}
        loading={isSubmitting}
        backgroundColor={'transparent'}
        backgroundColorHover={'transparent'}
        customColor={'white100'}
        icon={<Send />}
      />

      <CModal
        width={'50%'}
        open={emojiModal}
        onClose={() => {
          setEmojiModal(false);
        }}
        title='Emoji'>
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData) => {
            handleSendEmoji(emoji);
          }} />
      </CModal>
    </ChatMessageBoxStyle>
  )
}
