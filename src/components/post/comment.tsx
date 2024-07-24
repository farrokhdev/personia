import styled from "styled-components";
import React, { ReactElement, SyntheticEvent, useRef, useState } from "react";
import { ReactComponent as Send } from "../../assets/svg/send.svg";
import { ReactComponent as Emoji } from "../../assets/svg/emoji.svg";
import { CSvgButton } from "../mui/SvgButton";
import { PostCommentBox } from "./comment-box";
import { NothingFound } from "../custom";
import { useAppSelector } from "../../redux/hooks";
import { AlertColor } from "@mui/material";
import EmojiPicker from "emoji-picker-react";
import { CModal } from "../mui";
import { EmojiClickData } from "emoji-picker-react/dist/types/exposedTypes";
import { PostModel } from "../../models/post.model";
import { CommentModel } from "../../models/comment.model";
import { sendPostComment } from "../../apis/post.apis";
import { isDesktop } from '../../utils/detect-screen'

const Box = styled.div`
  padding: ${isDesktop() ? '15px' : '0'} ;
  margin-bottom: 15px;
  border-radius: 8px;
  display: block;
  text-decoration: none;

  > .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;

    > .img {
      margin-right: 15px;
    }

    > .author {
      flex-grow: 1;
      margin-right: 15px;

      > span {
        font-size: 14px;
        font-weight: 500;
        color: ${(props) => props.theme.white100};
        display: block;
        text-decoration: none;
      }

      > small {
        font-size: 12px;
        font-weight: 200;
        color: ${(props) => props.theme.black50};
        text-decoration: none;
      }
    }

    > .type {
      display: flex;
      align-items: center;

      > .material-symbols-outlined {
        font-size: 20px !important;
        font-weight: 200;
        color: ${(props) => props.theme.white100};
        text-decoration: none;
      }

      > p {
        font-size: 14px;
        font-weight: 500;
        color: ${(props) => props.theme.black50};
        display: block;
        text-decoration: none;
      }
    }
  }

  > .body {
    text-decoration: none;
    flex-direction: row;
    align-items: flex-start;

    > .img {
      width: 100%;
      margin-right: 15px;

      > img {
        display: block;
        width: 100%;
        border-radius: 8px;
      }
    }

    > .content {
      flex-grow: 1;

      > .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        > h5 {
          font-size: 18px;
          font-weight: 400;
          color: ${(props) => props.theme.white100};
        }

        > small {
          color: ${(props) => props.theme.white100};
        }

        > .right {
        }
      }

      > .body {
        margin-top: 15px;

        > .blur {
          position: relative;

          > p {
            font-size: 14px;
            color: ${(props) => props.theme.white100};
            line-height: 3rem;
            display: block;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
            margin-bottom: 20px;
            filter: blur(3.5px);
          }

          > .links {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 40%;
            align-content: space-between;
            align-items: center;
            align-self: center;
            display: flex;
            flex-wrap: wrap;
            text-align: center;

            > .column {
              flex-basis: 0;
              flex-grow: 1;
              align-self: center;
              align-items: center;
              width: 100%;
              margin: 0 auto 0 auto;

              > p {
                font-size: 14px;
                color: ${(props) => props.theme.green100};
                line-height: 1.3rem;
                display: block;
                text-overflow: ellipsis;
                word-wrap: break-word;
                overflow: hidden;
                margin-bottom: 20px;
                margin-top: 20px;
              }
            }
          }
        }

        > p {
          font-size: 14px;
          color: ${(props) => props.theme.white100};
          line-height: 1.3rem;
          display: block;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          max-height: 3.6em;
          margin-bottom: 20px;
        }

        > a {
          color: ${(props) => props.theme.green100};
          text-align: right;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          text-decoration: none;
          width: 100%;
          padding: 10px 24px;
          float: right;
        }

        > img {
          margin-top: 20px;
        }

        > .tags {
          display: flex;

          > a {
            color: ${(props) => props.theme.green100};
            text-align: right;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-decoration: none;
            padding: 10px;
            float: right;
          }
        }

        > .comment {
          border-top: 1px solid ${(props) => props.theme.white30};
          margin-top: 20px;
          margin-bottom: 30px;

          > .input {
            margin-top: 20px;
            border: 1px solid ${(props) => props.theme.white30};
            border-radius: 8px;
            display: flex;
            position: relative;

            > .textarea {
              margin-right: 80px;
              width: 100%;

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
                resize: vertical;
                min-height: 50px;
                height: auto;
                overflow: hidden;
              }

              > p {
                font-family: Inter;
                font-size: 14px;
                color: ${(props) => props.theme.white50};
                text-align: right;
                padding-bottom: 10px;
              }
            }

            > .actions {
              display: flex;
              position: absolute;
              right: 0;
              bottom: 0;
            }
          }

          > .load-more-comment {
            width: 30%;
            color: ${(props) => props.theme.white100};
            text-align: center;
            border-bottom: 1px solid ${(props) => props.theme.white100};
            padding-bottom: 5px;
            margin: 0 auto 0 auto;
            cursor: pointer;
          }
        }
      }

      > .actions {
        margin-top: 15px;
        padding-top: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        align-content: space-between;
        width: 100%;

        > .left {
          display: flex;
          width: 50%;

          > p {
            color: ${(props) => props.theme.white100};
            text-align: right;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-decoration: none;
            padding: 10px;
          }
        }

        > .right {
          display: flex;
          width: 50%;
          flex-direction: row-reverse;

          > div {
            flex-direction: row;
            align-items: center;
            margin-right: 15px;

            > span {
              color: ${(props) => props.theme.white100};
              font-size: 12px;
              font-weight: 500;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }

  &:hover {
  }

  &.type-2 {
    > .body {
      display: block;

      > .img {
        width: 100%;
        margin: 10px auto 15px auto;

        > img {
          width: 100%;
        }
      }
    }
  }
`;

interface Props {
  comments?: CommentModel[];
  loading?: boolean;
  postId: string;
  onSubmit: (comment: CommentModel) => void;
  makeAlert: (type: AlertColor, message: string) => void;
  post: PostModel;
}

export function CommentBox(props: Props): ReactElement {
  const { comments, loading, makeAlert } = props;
  const user = useAppSelector((state) => state.user);
  const [commentMessage, setCommentMessage] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleSubmitComment = async () => {
    if (user.did !== "") {
      setIsSubmitting(true);

      sendPostComment(props.postId, {
        content: encodeURIComponent(commentMessage),
      })
        .then((res) => {
          if (res) {
            setCommentMessage("");
            props.onSubmit(res.data.comment);
          }
          setIsSubmitting(false);
        })
        .catch((err) => {
          console.log(err, "err");
          setIsSubmitting(false);
        });
    } else {
      makeAlert("error", "Please connect your wallet");
    }
  };

  const handleSetComment = (event: any) => {
    setCommentMessage(event.target.value);
    setCounter(event.target.value.length);
  };

  const [commentPageCount, setCommentPageCount] = useState<number>(5);
  const handleShowMoreComment = () => {
    setCommentPageCount(commentPageCount + 5);
  };

  const [emojiModal, setEmojiModal] = useState<boolean>(false);
  const handleOpenEmoji = () => {
    setEmojiModal(true);
  };

  const [counter, setCounter] = useState<number>(0);
  const handleSendEmoji = (emoji: EmojiClickData) => {
    setCommentMessage(commentMessage + "" + emoji.emoji);
    setCounter((commentMessage + "" + emoji.emoji).length);
  };

  const handleKeyDown = (e: any) => {
    e.target.style.height = "inherit";
    e.target.style.height = `${e.target.scrollHeight}px`;
  };

  return (
    <Box>
      <div className={"body"}>
        <div className={"content"}>
          <div className={"body"}>
            <div className={"comment"}>
              {!loading ? (
                <div className={"input"}>
                  <div className={"textarea"}>
                    <textarea
                      rows={1}
                      contentEditable="true"
                      placeholder={"Type your comment..."}
                      onChange={handleSetComment}
                      onKeyDown={handleKeyDown}
                      value={commentMessage}
                    ></textarea>

                    {counter > 0 ? <p>{counter} / 500</p> : null}
                  </div>

                  <div className={"actions"}>
                    <CSvgButton
                      disabled={false}
                      loading={false}
                      backgroundColor={"transparent"}
                      backgroundColorHover={"transparent"}
                      icon={<Emoji />}
                      onClick={handleOpenEmoji}
                    />
                    <CSvgButton
                      onClick={handleSubmitComment}
                      disabled={isSubmitting}
                      loading={isSubmitting}
                      backgroundColor={"transparent"}
                      backgroundColorHover={"transparent"}
                      icon={<Send />}
                    />
                  </div>
                </div>
              ) : null}

              <div style={{ marginTop: "20px" }}>
                {loading ? (
                  [1, 2, 3, 4, 5].map((i) => (
                    <PostCommentBox
                      key={i}
                      loading
                      lastItem={i === 5}
                      makeAlert={makeAlert}
                      onSubmit={props.onSubmit}
                      comments={[]}
                    />
                  ))
                ) : comments.length === 0 ? (
                  <NothingFound icon={"comment"} title={"No Comments Found"} />
                ) : (
                  [...comments]
                    .filter((item) => !item.replyingToID)
                    .sort(
                      (x: any, y: any) =>
                        new Date(y.createdAt).getTime() -
                        new Date(x.createdAt).getTime()
                    )
                    .map((comment, i) =>
                      i < commentPageCount ? (
                        <PostCommentBox
                          key={i}
                          comment={comment}
                          postId={props.postId}
                          loading={loading}
                          makeAlert={makeAlert}
                          onSubmit={props.onSubmit}
                          comments={comments}
                        />
                      ) : null
                    )
                )}
              </div>

              {comments.length >= commentPageCount ? (
                <p
                  className={"load-more-comment"}
                  onClick={handleShowMoreComment}
                >
                  Load more comments
                </p>
              ) : null}
            </div>
          </div>
        </div>
      </div>

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
    </Box>
  );
}
