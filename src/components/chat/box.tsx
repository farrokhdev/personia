import React, { ReactElement, useEffect, useMemo, useState } from "react";
import styled from "styled-components";
import { useCeramicContext } from "../../contexts";
import { useAppSelector } from "../../redux/hooks";
import { Avatar } from "@mui/material";
import { MyInput } from "../custom/input";
import { CButton, CIconButton, CModal, CSkeleton, CTextField } from "../mui";
import { ChatMessagingBox } from "./chat";
import { v4 as uuid } from "uuid";
import { useNavigate } from "react-router-dom";
import { encryptionService } from "../../services";
import { breakpoints } from "../../config/global-styles";
import { getChat, getSingleChat, sendChatMessage } from "../../apis/chat.apis";
import ChatUsersSearchModal from "./chatUsersSearchModal";
import { ChatModel } from "../../models/chatProxy/chatProxy";
import { ChatMessageModel } from "../../models/chatProxy/chatMessageModel";

export interface StyledInputType {
  $background: string;
  right: number;
}

const ChatBoxStyle = styled.div<StyledInputType>`
  padding: 8px 16px 8px 16px;
  background: ${({ theme, $background }) => theme[$background]};
  border: 0.5px solid ${(props) => props.theme.gray60};
  width: 350px;
  border-radius: 16px 16px 0 0;
  position: absolute;
  right: ${({ right }) => right};
  bottom: 0;
  box-shadow: -1px -1px 4px 0 rgba(255, 255, 255, 0.1);
  z-index: 30;

  @media only screen and (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    /* min-height: 766px;//// */
    position: static;
  }

  @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
    width: 300px;
  }

  > .header {
    display: flex;
    align-items: center;
    padding: 8px 16px;

    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${(props) => props.theme.black100};
      text-align: justify;
      flex: 1;
      @media only screen and (max-width: ${breakpoints.tablet}) {
        text-align: center;
        height: 56px;
      }

      &.green {
        color: ${(props) => props.theme.green100};
      }
    }

    > .material-symbols-outlined {
      color: ${(props) => props.theme.black100};
      cursor: pointer;
      font-size: 28px;

      &.green {
        color: ${(props) => props.theme.green100};
      }
    }
  }

  > .body {
    height: 504px;
    @media only screen and (max-width: ${breakpoints.tablet}) {
      height: 530px;
    }
    overflow: auto;

    .search-and-add {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: "10px";

      > .search {
        flex-basis: 50%;
      }

      > .add-new {
        flex-basis: 45%;
      }
    }

    > .users {
      margin-top: 15px;

      > .row {
        display: flex;
        padding-bottom: 15px;
        padding-top: 15px;
        border-bottom: 1px solid ${(props) => props.theme.gray90};
        width: 100%;
        cursor: pointer;

        > .column {
          width: 170px;
          margin-left: 10px;

          > p {
            font-size: 14px;
            font-weight: 400;
            font-family: Inter;
            color: ${(props) => props.theme.white100};
            text-align: left;
            text-overflow: ellipsis;
            overflow: hidden;
            white-space: nowrap;
          }
        }

        > p {
          font-size: 14px;
          font-weight: 400;
          font-family: Inter;
          color: ${(props) => props.theme.white100};
          text-align: right;
          align-self: center;
          margin-left: 10px;
          width: 40px;
        }

        > span {
          font-size: 22px;
          color: ${(props) => props.theme.white100};
          align-self: center;
          margin-left: 5px;
        }
      }
      > .empty-row {
        display: flex;
        padding-bottom: 15px;
        padding-top: 15px;
        width: 100%;
        cursor: pointer;
        > p.empty {
          font-size: 14px;
          font-weight: 400;
          font-family: Inter;
          color: ${(props) => props.theme.white100};
          text-align: center;
          align-self: center;
          margin-left: 0px;
          width: 100%;
          opacity: 50%;
          line-height: 22px;
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

type Props = {
  mobileChat?: boolean;
};

export function ChatBox({ mobileChat }: Props): ReactElement {
  const { chat, setChat, hasNewChat, setHasNewChat } = useCeramicContext();
  const [showChat, setShowChat] = useState<boolean>(false);
  const user = useAppSelector((state) => state.user);
  const [loading, setLoading] = useState<boolean>(true);
  const [selectedChat, setSelectedChat] = useState<ChatModel>();
  const [selectedChatVideo, setSelectedChatVideo] = useState<ChatModel>();
  const [chats, setChats] = useState<Array<ChatModel>>([]);
  const [searchedChats, setSearchedChats] = useState<Array<ChatModel>>([]);
  const [channel, setChannel] = useState(null);
  const navigate = useNavigate();
  const [decryptedChats, setDecryptedChats] = useState<
    Array<ChatModel & { decryptedBody?: string }>
  >([]);

  const [searchUsersModal, setSearchUsersModal] = useState<boolean>(false);

  const handleShowChat = () => {
    setShowChat(!showChat);
    setDecryptedChats([]);
    setChats([]);
    setSearchedChats([]);

    setLoading(true);

    getChat({ profileId: [user.id], cursor: "" })
      .then((result) => {
        const jsonData = result.data.chat.chats;
        jsonData.forEach((obj) => {
          obj.messages.sort(
            (a, b) =>
              new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        });
        jsonData.sort((a, b) => {
          const dateA = new Date(
            a.messages.length ? a.messages[0].createdAt : a.createdAt
          ).getTime();
          const dateB = new Date(
            b.messages.length ? b.messages[0].createdAt : b.createdAt
          ).getTime();
          return dateB - dateA;
        });
        setSearchedChats(jsonData);
        setChats(jsonData);

        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  // check is mobile or not
  useEffect(() => {
    if (mobileChat) {
      handleShowChat();
      setShowChat(true);
    }
  }, []);

  useEffect(() => {
    if (hasNewChat) {
      setSelectedChat(chat);
      setChat(null);
      setHasNewChat(false);
      setLoading(false);
    }
  }, [hasNewChat]);

  const getTime = (date: Date) => {
    return date.getHours() + ":" + date.getMinutes();
  };

  const handleOpenMessages = (chat: ChatModel) => {
    setLoading(true);
    getSingleChat(chat.id)
      .then(async (result) => {
        if (result) {
          setSelectedChat(result.data.chat);
          setLoading(false);
        }
      })
      .catch((error) => {
        setLoading(false);
      });
  };

  const [openModal, setOpenModal] = useState(false);
  const handleChatCreate = (chat: ChatMessageModel): void => {
    setOpenModal(true);
    setSelectedChatVideo(chat);
  };

  const handleSearchUser = (value: string) => {
    if (value === "") {
      setSearchedChats(chats);
    } else {
      const _chats = [];
      chats.map((chat, index) => {
        if (chat.recipientProfile.id !== user.id) {
          if (chat.recipientProfile.displayName.includes(value)) {
            _chats.push(chat);
          }
        } else {
          if (chat.profile.displayName.includes(value)) {
            _chats.push(chat);
          }
        }
      });
      setSearchedChats(_chats);
    }
  };

  const [password, setPassword] = useState<string>("");
  const handleSetPassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleStartPrivateChat = async () => {
    setOpenModal(false);
    const roomId = uuid();

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

    sendChatMessage(selectedChatVideo.id, {
      content: encodeURIComponent(message),
      messageType: "text",
    })
      .then((result) => {
        if (result) {
          navigate("/chat/private/" + roomId + "#" + params);
        }
      })
      .catch((error: any) => {
        console.error(error, "error");
      });
  };

  // useMemo(() => {
  //   (async () => {
  //     setDecryptedChats([
  //       ...decryptedChats,
  //       ...(await Promise.all(
  //         chats.map(async (chat) => {
  //           try {
  //             const string = chat.messages[
  //               chat.messages.length - 1
  //             ].body.replace(/`/g, '"');
  //             const plaintext = await allostasis.encryptionDid.decryptDagJWE(
  //               JSON.parse(string)
  //             );
  //             return {
  //               ...chat,
  //               decryptedBody: decodeURIComponent(plaintext.body),
  //             };
  //           } catch (error) {
  //             return {
  //               ...chat,
  //               decryptedBody: "",
  //             };
  //           }
  //         })
  //       )),
  //     ]);
  //   })();
  // }, [chats]);

  const openSearchUsersModal = () => {
    setSearchUsersModal(!searchUsersModal);
  };

  return selectedChat ? (
    <ChatMessagingBox
      chat={selectedChat}
      loading={loading}
      onBack={() => {
        setSelectedChat(undefined);
      }}
      channel={channel}
    />
  ) : (
    ((((
      <>
        {searchUsersModal ? (
          <ChatUsersSearchModal
            onBack={() => {
              setSearchUsersModal(false);
            }}
            setSearchUsersModal={setSearchUsersModal}
          />
        ) : (
          <ChatBoxStyle
            $background={showChat ? "navy60" : "navy60"}
            right={window.innerWidth}
          >
            <div className={"header"}>
              <p className={showChat ? "green" : "green"}>
                {showChat ? "Inbox" : "Messages"}
              </p>
              {!mobileChat && (
                <span
                  className={
                    showChat
                      ? "material-symbols-outlined green"
                      : "material-symbols-outlined green"
                  }
                  onClick={handleShowChat}
                >
                  {!showChat ? "expand_less" : "expand_more"}
                </span>
              )}
            </div>
            {showChat ? (
              <div className={"body"}>
                <div style={{ marginTop: "10px" }}></div>
                <div className="search-and-add">
                  <div className="search">
                    <MyInput
                      placeholder={"Search"}
                      label={""}
                      name={"search"}
                      icon={"search"}
                      background={"gray70"}
                      border={"gray60"}
                      onChange={handleSearchUser}
                      color={"white100"}
                    />
                  </div>
                  <div className="add-new">
                    <CButton
                      fullWidth
                      // size={"sm"}
                      background={"green100"}
                      backgroundHover={"green100"}
                      color={"black100"}
                      fontSize="12px"
                      fontWeight="800"
                      loadingColor={"green100"}
                      onClick={async () => {
                        openSearchUsersModal();
                      }}
                    >
                      Add a new Chat
                    </CButton>
                  </div>
                </div>
                <div className={"users"}>
                  {loading ? (
                    [1, 2, 3, 4].map(() => (
                      <div className={"row"}>
                        <CSkeleton
                          width={40}
                          height={40}
                          borderRadius={"20px"}
                        />
                        <div className={"column"}>
                          <CSkeleton
                            width={200}
                            height={10}
                            marginBottom={"5px"}
                          />
                          <CSkeleton width={200} height={10} />
                        </div>
                        <CSkeleton width={100} height={10} />
                      </div>
                    ))
                  ) : searchedChats.length > 0 ? (
                    searchedChats.map((chat) =>
                      chat.recipientProfile?.id !== user.id ? (
                        <div className={"row"}>
                          <Avatar
                            src={
                              "https://greenia.infura-ipfs.io/ipfs/" +
                                chat.recipientProfile?.avatar ?? ""
                            }
                            onClick={() => handleOpenMessages(chat)}
                          />
                          {/* @ts-ignore */}
                          <div
                            className={"column"}
                            onClick={() => handleOpenMessages(chat)}
                          >
                            <p>
                              {chat.recipientProfile?.displayName || "New Face"}
                            </p>
                            <p>
                              {chat.messages.length > 0
                                ? chat.messages[0].body
                                : ""}
                            </p>
                          </div>
                          <p>
                            {getTime(
                              chat.messages?.length
                                ? new Date(chat.messages[0].createdAt + "")
                                : new Date(chat.createdAt + "")
                            )}
                          </p>
                          <div style={{ marginLeft: "5px", zIndex: 10 }}>
                            <CIconButton
                              backgroundColor={"gray80"}
                              backgroundColorHover={"gray80"}
                              customColor={"white100"}
                              icon={"videocam"}
                              onClick={() => handleChatCreate(chat)}
                            />
                          </div>
                        </div>
                      ) : (
                        <div className={"row"}>
                          <Avatar
                            src={
                              "https://greenia.infura-ipfs.io/ipfs/" +
                                chat.profile?.avatar ?? ""
                            }
                            onClick={() => handleOpenMessages(chat)}
                          />
                          {/* @ts-ignore */}
                          <div
                            className={"column"}
                            onClick={() => handleOpenMessages(chat)}
                          >
                            <p>{chat.profile?.displayName || "New Face"}</p>
                            <p>
                              {chat.messages.length > 0
                                ? chat.messages[0].body
                                : ""}
                            </p>
                          </div>
                          <p>
                            {getTime(
                              chat.messages?.length
                                ? new Date(chat.messages[0].createdAt + "")
                                : new Date(chat.createdAt + "")
                            )}
                          </p>
                          <div style={{ marginLeft: "5px", zIndex: 10 }}>
                            <CIconButton
                              backgroundColor={"gray80"}
                              backgroundColorHover={"gray80"}
                              customColor={"white100"}
                              icon={"videocam"}
                              onClick={() => handleChatCreate(chat)}
                            />
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <div className="empty-row">
                      <p className="empty">
                        Sorry! no user with this profile info was found Please
                        check your spelling
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : null}

            <CModal
              open={openModal}
              onClose={() => {
                setOpenModal(false);
              }}
              title="Select type of video chat"
            >
              <SelectionSStyle>
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
          </ChatBoxStyle>
        )}
      </>
    ) as React.ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >) as React.ReactElement<
      any,
      string | React.JSXElementConstructor<any>
    >) as React.ReactElement<any, string | React.JSXElementConstructor<any>>)
  );
}
