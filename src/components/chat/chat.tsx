import React, {
  HTMLAttributes,
  ReactElement,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import styled from "styled-components";
import { useCeramicContext } from "../../contexts";
import { useAppSelector } from "../../redux/hooks";
import { Chat, ChatMessage } from "allostasis-js-sdk/lib/types/allostasis";
import { Avatar } from "@mui/material";
import { ReactComponent as ArrowLeft } from "../../assets/svg/arrow-left.svg";
import { SendMessageBox } from "./send";
import { CButton, CIconButton, CModal, CSkeleton, CTextField } from "../mui";
import { CopyableBlock } from "../room/copy";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Typography, { TypographyProps } from "@mui/material/Typography";
import Link, { LinkProps } from "@mui/material/Link";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import remarkGfm from "remark-gfm";
import Markdown from "react-markdown";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { encryptionService } from "../../services";
import { breakpoints } from "../../config/global-styles";
import { getSingleChat, sendChatMessage } from "../../apis/chat.apis";
import { io } from "socket.io-client";

export interface StyledInputType {
  $background: string;
  right: number;
}

const ChatMessageBoxStyle = styled.div<StyledInputType>`
  background: ${({ theme, $background }) => theme[$background]};
  border: 0.5px solid ${(props) => props.theme.gray60};
  width: 350px;
  border-radius: 16px 16px 0 0;
  position: absolute;
  right: ${({ right }) => right};
  bottom: 0;
  box-shadow: -1px -1px 4px 0 rgba(255, 255, 255, 0.1);
  z-index: 30;

  @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
    width: 300px;
  }
  @media only screen and (max-width: ${breakpoints.tablet}) {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  > .header {
    display: flex;
    align-items: center;
    background: ${(props) => props.theme.navy100};
    justify-content: space-between;
    width: 100%;
    padding: 8px 16px 8px 16px;
    border-top-right-radius: 10px;
    border-top-left-radius: 10px;

    > .div {
      align-self: center;
      display: flex;
      align-items: center;
      margin: 0 auto 0 auto;

      > .img {
        text-align: center;
      }

      > p {
        font-size: 16px;
        font-weight: 500;
        font-family: Inter;
        color: ${(props) => props.theme.white100};
        text-align: center;
        margin-left: 15px;
      }
    }

    > .icon {
      text-align: left;
      cursor: pointer;
    }
  }

  > .body {
    height: 580px;
    background: ${(props) => props.theme.navy60};
    border-bottom-right-radius: 10px;
    border-bottom-left-radius: 10px;
    @media only screen and (max-width: ${breakpoints.tablet}) {
      flex-basis: 100%;
      position: relative;
    }

    > .messages {
      height: 500px;
      padding: 0;
      overflow-y: auto;
      position: relative;
      @media only screen and (max-width: ${breakpoints.tablet}) {
        overflow-x: hidden;
      }

      > .left {
        padding: 16px 8px 8px 16px;
        justify-content: center;
        align-items: flex-start;
        gap: 8px;
        border-radius: 0 16px 16px 0;
        background: rgba(255, 255, 255, 0.05);
        width: 300px;
        margin-top: 10px;
        overflow-x: hidden;

        @media only screen and (max-width: ${breakpoints.tablet}) {
          width: 250px;
        }

        > p {
          color: ${(props) => props.theme.white40};
          font-size: 14px;
          line-height: 24px;
          font-family: Inter;
          white-space: pre-line;
          word-break: break-all;
        }

        > .date {
          color: ${(props) => props.theme.white40};
          font-size: 14px;
          line-height: 24px;
          font-family: Inter;
          margin-top: 15px;
        }
      }

      > .right {
        padding: 16px 8px 8px 16px;
        justify-content: center;
        align-items: flex-end;
        gap: 8px;
        border-radius: 16px 0px 0px 16px;
        background: ${(props) => props.theme.navy70};
        width: 300px;
        margin-top: 10px;
        overflow-x: hidden;
        margin-left: auto;
        @media only screen and (max-width: ${breakpoints.tablet}) {
          width: 250px;
        }

        > p {
          color: ${(props) => props.theme.white40};
          font-size: 14px;
          line-height: 24px;
          font-family: Inter;
          white-space: pre-line;
          word-break: break-all;
        }

        > .date {
          color: ${(props) => props.theme.white40};
          font-size: 14px;
          line-height: 24px;
          font-family: Inter;
          margin-top: 15px;
        }
      }
    }
  }
`;

const SelectionSStyle = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;

  > .column {
    align-items: center;
    align-content: center;
    align-self: center;
    margin: 0 auto 0 auto;
    width: 100%;
    flex: 1;
    text-align: center;
    height: 170px;

    &:last-child {
      border-left: 1px solid ${(props) => props.theme.black100};
    }

    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${(props) => props.theme.black100};
      text-align: center;
      flex: 1;
      padding: 10px;
      vertical-align: top;
    }

    > button {
      vertical-align: bottom;
    }
  }
`;

interface Props {
  chat: Chat;
  loading: boolean;
  onBack: () => void;
  channel: any;
}

export function ChatMessagingBox(props: Props): ReactElement {
  const { allostasis } = useCeramicContext();
  const user = useAppSelector((state) => state.user);

  const socket = io(process.env.REACT_APP_API_BASE_URL_SOCKET, {
    auth: { Authorization: "Bearer " + localStorage.getItem("token") },
  });

  function onConnect() {
    socket.emit("joinChat", { profileID: user.id });
  }

  function onDisconnect() {}

  useEffect(() => {
    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on("joinChat", joinChat);
    socket.on("newMessage", newMessage);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("joinChat", joinChat);
      socket.off("newMessage", newMessage);
    };
  }, []);

  const joinChat = (value: any) => {
    console.log(value);
  };

  const newMessage = (message: ChatMessage) => {
    console.log(message, "1231");
  };

  const [messages, setMessages] = useState<
    Array<ChatMessage & { decryptedBody?: string }>
  >([]);

  const [decryptedMessages, setDecryptedMessages] = useState<
    Array<ChatMessage & { decryptedBody?: string }>
  >([]);

  const navigate = useNavigate();

  const messagesEndRef = useRef(null);
  const scrollToBottom = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const getTime = (date: Date) => {
    return date.getHours() + ":" + date.getMinutes();
  };

  useEffect(() => {
    getSingleChat(props.chat.id).then((res) => {
      setMessages(res.data.chat.messages);
    });
  }, []);

  useMemo(() => {
    setTimeout(() => {
      scrollToBottom();
    }, 1000);
  }, [messages]);

  // useMemo(() => {
  //   scrollToBottom();
  //   (async () => {
  //     setDecryptedMessages([
  //       ...decryptedMessages,
  //       ...(await Promise.all(
  //         messages
  //           .filter(
  //             (item) => !decryptedMessages.map((x) => x.id).includes(item.id)
  //           )
  //           .map(async (message) => {
  //             if (message.decryptedBody == null) {
  //               try {
  //                 const string = message.body.replace(/`/g, '"');
  //                 const plaintext = await allostasis.encryptionDid.decryptDagJWE(
  //                   JSON.parse(string)
  //                 );

  //                 return {
  //                   ...message,
  //                   decryptedBody: plaintext.body,
  //                 };
  //               } catch (error) {
  //                 return {
  //                   ...message,
  //                   decryptedBody: "",
  //                 };
  //               }
  //             } else {
  //               return message;
  //             }
  //           })
  //       )),
  //     ]);
  //   })();
  // }, [messages]);

  const typographyFactory = (overrides: TypographyProps) => (
    args: HTMLAttributes<HTMLElement>
  ) => {
    return <Typography {...args} {...overrides} />;
  };

  const linkFactory = (overrides: LinkProps) => (
    args: HTMLAttributes<HTMLElement>
  ) => {
    return <Link {...args} {...overrides} />;
  };

  const componentMap = {
    h1: typographyFactory({ variant: "h1" }),
    h2: typographyFactory({ variant: "h2" }),
    h3: typographyFactory({ variant: "h3" }),
    h4: typographyFactory({ variant: "h4" }),
    h5: typographyFactory({ variant: "h5" }),
    h6: typographyFactory({ variant: "h6" }),
    p: typographyFactory({ variant: "body1" }),
    a: linkFactory({
      variant: "body1",
      underline: "always",
      color: "primary.contrastText",
      target: "_blank",
    }),
    // https://github.com/remarkjs/react-markdown#use-custom-components-syntax-highlight
    code({ node, inline, className, children, style, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <CopyableBlock>
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, "")}
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
      );
    },
  };

  const [openModal, setOpenModal] = useState(false);
  const handleChatCreate = (): void => {
    setOpenModal(true);
  };

  const [password, setPassword] = useState<string>("");
  const handleSetPassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleStartPrivateChat = async () => {
    setOpenModal(false);
    const roomId = uuid();

    const persistence = true;
    const hidden = false;
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    await socket.socket?.send({
      channel_message_send: {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        channel_id: socket.room.id,
        content: {
          message:
            (props.chat.recipientProfile?.nakamaID == user.nakamaID
              ? props.chat.profile?.nakamaID
              : props.chat.recipientProfile?.nakamaID) ?? "",
        },
      },
    });

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const channel = await socket.socket?.joinChat(
      props.chat.recipientProfile?.nakamaID == user.nakamaID
        ? props.chat.profile?.nakamaID
        : props.chat.recipientProfile?.nakamaID,
      2,
      persistence,
      hidden
    );

    const encoded = await encryptionService.encodePassword(roomId, password);
    const params = new URLSearchParams();
    params.set("secret", encoded);

    var message = "Private video chat request";
    message +=
      "\n Room Link:\n\n" +
      "https://" +
      window.location.host +
      "/chat/private/" +
      roomId +
      "#" +
      params;
    message += "\n\n Click on link to join room";

    allostasis
      .sendMessage({
        profileID: user.id ?? "",
        chatID: props.chat.id ?? "",
        content: encodeURIComponent(message),
        messageType: "text",
        publicEncryptionDIDs: [
          props.chat.profile.publicEncryptionDID.id,
          props.chat.recipientProfile.publicEncryptionDID.id,
        ],
      })
      .then(async (result: ChatMessage) => {
        if (result) {
        }
      })
      .catch((error: any) => {
        console.error(error, "error");
      });

    navigate("/chat/private/" + roomId + "#" + params);
  };

  return (
    <ChatMessageBoxStyle $background="navy100" right={window.innerWidth}>
      <div className={"header"}>
        <div className={"icon"} onClick={props.onBack}>
          <ArrowLeft />
        </div>
        <div className={"div"}>
          <Avatar
            src={
              "https://greenia.infura-ipfs.io/ipfs/" +
              (props.chat.recipientProfile?.id === user.id
                ? props.chat.profile?.avatar
                : props.chat.recipientProfile?.avatar)
            }
            className={"img"}
          />
          <p>
            {(props.chat.recipientProfile?.id === user.id
              ? props.chat.profile?.displayName
              : props.chat.recipientProfile?.displayName) || "New Face"}
          </p>
        </div>
        <div style={{ marginLeft: "5px", zIndex: 100 }}>
          <CIconButton
            backgroundColor={"gray80"}
            backgroundColorHover={"gray80"}
            customColor={"white100"}
            icon={"videocam"}
            onClick={handleChatCreate}
          />
        </div>
      </div>

      <div className={"body"}>
        <div className={"messages"}>
          {props.loading ? (
            <>
              <div className={"left"}>
                <CSkeleton
                  width={"100%"}
                  height={10}
                  borderRadius={"12px"}
                  marginBottom={"3px"}
                />
                <CSkeleton
                  width={100}
                  height={10}
                  borderRadius={"12px"}
                  marginBottom={"3px"}
                />
              </div>
              <div className={"right"}>
                <CSkeleton
                  width={"100%"}
                  height={10}
                  borderRadius={"12px"}
                  marginBottom={"3px"}
                />
                <CSkeleton
                  width={100}
                  height={10}
                  borderRadius={"12px"}
                  marginBottom={"3px"}
                />
              </div>
            </>
          ) : (
            <>
              {messages.map((message, index) =>
                message.profile?.id === user.id ? (
                  <div className={"left"}>
                    {props.loading ? (
                      <>
                        <CSkeleton
                          width={"100%"}
                          height={10}
                          borderRadius={"12px"}
                          marginBottom={"3px"}
                        />
                        <CSkeleton
                          width={100}
                          height={10}
                          borderRadius={"12px"}
                          marginBottom={"3px"}
                        />
                      </>
                    ) : (
                      <>
                        <Markdown
                          components={componentMap}
                          remarkPlugins={[remarkGfm]}
                        >
                          {decodeURIComponent(message.body)}
                        </Markdown>
                        <p className={"date"}>
                          {getTime(new Date(message.createdAt + ""))}
                        </p>
                      </>
                    )}
                  </div>
                ) : (
                  <div className={"right"}>
                    {props.loading ? (
                      <>
                        <CSkeleton
                          width={"100%"}
                          height={10}
                          borderRadius={"12px"}
                          marginBottom={"3px"}
                        />
                        <CSkeleton
                          width={100}
                          height={10}
                          borderRadius={"12px"}
                          marginBottom={"3px"}
                        />
                      </>
                    ) : (
                      <>
                        <Markdown
                          components={componentMap}
                          remarkPlugins={[remarkGfm]}
                        >
                          {decodeURIComponent(message.decryptedBody)}
                        </Markdown>
                        <p className={"date"}>
                          {getTime(new Date(message.createdAt + ""))}
                        </p>
                      </>
                    )}
                  </div>
                )
              )}
              <div ref={messagesEndRef}></div>
            </>
          )}
        </div>
        <SendMessageBox
          chat={props.chat}
          channel={props.channel}
          loading={props.loading}
          onSubmit={(message) => {
            setMessages((messages) => [...messages, message]);
            scrollToBottom();
          }}
          receiver={
            (user.id === props.chat.recipientProfile?.id
              ? props.chat.recipientProfile
              : props.chat.profile) ?? user
          }
        />
      </div>

      <CModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Select type of video chat"
      >
        <SelectionSStyle>
          {/*<div className={'column'}>*/}
          {/*  <p>Public video chat</p>*/}

          {/*  <div*/}
          {/*    style={{*/}
          {/*      marginLeft: '20px',*/}
          {/*      marginRight: '20px',*/}
          {/*      marginBottom: '20px',*/}
          {/*    }}*/}
          {/*  >*/}
          {/*    <CTextField*/}
          {/*      label={''}*/}
          {/*      placeholder={''}*/}
          {/*      disabled={true}*/}
          {/*      background={'white100'}*/}
          {/*    />*/}
          {/*  </div>*/}

          {/*  <CButton*/}
          {/*    background={'navy60'}*/}
          {/*    size={'s'}*/}
          {/*    backgroundHover={'navy100'}*/}
          {/*    onClick={handleStartPublicChat}*/}
          {/*  >*/}
          {/*    Generate Room*/}
          {/*  </CButton>*/}
          {/*</div>*/}
          <div className={"column"}>
            <p>Private video chat</p>

            <div
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            >
              <CTextField
                label={"Password"}
                value={password}
                onChange={(event: any) => handleSetPassword(event)}
                placeholder={"Set password to chat"}
                background={"navy100"}
              />
            </div>

            <CButton
              background={"navy60"}
              size={"s"}
              backgroundHover={"navy100"}
              onClick={handleStartPrivateChat}
            >
              Generate Room
            </CButton>
          </div>
        </SelectionSStyle>
      </CModal>
    </ChatMessageBoxStyle>
  );
}
