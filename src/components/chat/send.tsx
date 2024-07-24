import React, { ReactElement, useState } from "react";
import styled from "styled-components";
import { CSvgButton } from "../mui/SvgButton";
import { ReactComponent as Send } from "../../assets/svg/send.svg";
import { ReactComponent as Emoji } from "../../assets/svg/emoji.svg";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";
import { CModal } from "../mui";
import EmojiPicker from "emoji-picker-react";
// @ts-ignore
import { breakpoints } from "../../config/global-styles";
import { sendChatMessage } from "../../apis/chat.apis";
import { ChatModel } from "../../models/chatProxy/chatProxy";
import { ChatMessageModel } from "../../models/chatProxy/chatMessageModel";

const ChatMessageBoxStyle = styled.div`
  border: 1px solid ${(props) => props.theme.white30};
  border-radius: 16px;
  padding: 5px;
  display: flex;
  position: absolute;
  bottom: 0;
  width: 330px;
  margin: 0 auto 10px auto;
  align-self: center;
  left: 10px;

  @media only screen and (max-width: ${breakpoints.tablet}) {
    width: 90%;
    left: 50%;
    transform: translateX(-50%);
    margin: 0;
    bottom: 20px;
  }

  @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
    width: 280px;
  }

  > textarea {
    width: 100%;
    background: transparent;
    border: none;
    color: ${(props) => props.theme.white100};
    text-align: right;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 24px;
    text-decoration: none;
    padding: 10px;
    text-align: left;
  }
`;

interface Props {
  receiver: {
    creator?: {
      id: string;
    };
    id?: string;
    displayName?: string;
    avatar?: string;
    bio?: string;
    nakamaID?: string;
  };
  chat: ChatModel;
  onSubmit: (message: ChatMessageModel) => void;
  loading: boolean;
  channel: any;
}

export function SendMessageBox(props: Props): ReactElement {
  const [message, setMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSetMessage = (event: any) => {
    setMessage(event.target.value);
  };

  const [emojiModal, setEmojiModal] = useState<boolean>(false);
  const handleOpenEmoji = () => {
    setEmojiModal(true);
  };

  const handleSendEmoji = (emoji: EmojiClickData) => {
    setMessage(message + "" + emoji.emoji);
  };

  const sendMessageFunc = () => {
    setIsSubmitting(true);
    sendChatMessage(props.chat.id, {
      content: encodeURIComponent(message),
      messageType: "text",
    })
      .then(async (result) => {
        if (result) {
          props.onSubmit(result.data.message);
          setMessage("");
        }
        setIsSubmitting(false);
      })
      .catch((error: any) => {
        console.error(error, "error");
        setIsSubmitting(false);
      });
  };

  const handleSubmitMessage = () => {
    sendMessageFunc();
  };

  const handleSetKeyDown = (event: any) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessageFunc();
    }
  };

  return (
    <ChatMessageBoxStyle>
      <textarea
        rows={1}
        placeholder={"Type your messages..."}
        onChange={handleSetMessage}
        onKeyDown={handleSetKeyDown}
        value={message}
      ></textarea>

      <CSvgButton
        disabled={false}
        loading={false}
        backgroundColor={"transparent"}
        backgroundColorHover={"transparent"}
        icon={<Emoji />}
        onClick={handleOpenEmoji}
      />
      <CSvgButton
        onClick={handleSubmitMessage}
        disabled={isSubmitting || props.loading}
        loading={isSubmitting || props.loading}
        backgroundColor={"transparent"}
        backgroundColorHover={"transparent"}
        customColor={"white100"}
        icon={<Send />}
      />

      <CModal
        width={"50%"}
        open={emojiModal}
        onClose={() => {
          setEmojiModal(false);
        }}
        title="Emoji"
      >
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData) => {
            handleSendEmoji(emoji);
          }}
        />
      </CModal>
    </ChatMessageBoxStyle>
  );
}
