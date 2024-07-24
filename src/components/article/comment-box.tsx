import React, { useState } from 'react'
import styled from 'styled-components'
import { CIconButton, CMenu, CMenuItem, CModal, CSkeleton } from '../mui'
import { AlertColor, Avatar } from '@mui/material'
import _ from 'lodash'
import { CSvgButton } from '../mui/SvgButton'
import { ReactComponent as Reply } from '../../assets/svg/reply.svg'
import { ReactComponent as Send } from '../../assets/svg/send.svg'
import { ReactComponent as Emoji } from '../../assets/svg/emoji.svg'
import { EmojiClickData } from 'emoji-picker-react/dist/types/exposedTypes'
import EmojiPicker from 'emoji-picker-react'
import { useAppSelector } from '../../redux/hooks'
import { breakpoints } from '../../config/global-styles'
import { sendArticleComment } from '../../apis/article.apis'
import moment from 'moment-timezone'
import { useCeramicContext } from '../../contexts'
import { isDesktop } from '../../utils/detect-screen'
import { CommentModel } from '../../models/comment.model'

const Box = styled.div<{ $marginBottom: string; $background: string }>`
  padding: ${isDesktop() ? '15px' : '0'};
  border-radius: 8px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  display: flex;
  flex-direction: row;
  align-items: flex-start;
  background: ${({ theme, $background }) => theme[$background]};

  @media only screen and (max-width: ${breakpoints.mobile}) {
    width: 100%;
    padding: 0;
    > .content {
      > .header {
        display: flex;
        position: relative;

        > .avatar {
          margin-right: 15px;
        }

        > p {
          font-size: 16px;
        }

        > .action {
          font-size: 12px;

          > .date {
            font-size: 12px;
          }
        }
      }

      > .body {
        > p {
        }

        > .actions {
          display: flex;
          height: 20px;
          align-items: center;
          padding: auto 0px;

          > div {
            display: flex;
            align-items: center;
            height: 100%;

            > span {
              height: 100%;
              display: flex;
              align-items: center;
              margin: auto 0px;
            }
          }
        }
      }
    }
  }

  > .avatar {
    margin-right: 15px;
  }

  > .content {
    flex-grow: 1;

    > .header {
      display: flex;
      position: relative;
      width: 100%;

      > p {
        font-size: 14px;
        font-weight: 400;
        color: ${props => props.theme.white100};
        font-family: Inter;

        &.name {
          font-weight: 600;
          margin-bottom: 10px;
          color: ${props => props.theme.white100};
          font-family: Inter;
          @media (max-width: ${breakpoints.tablet}) {
            margin-bottom: 0px;
            margin-top: 10px;
            margin-left: 10px;
          }
        }
      }

      > .action {
        flex: 1;
        float: right;
        text-align: right;
        display: flex;
        align-self: center;
        align-items: center;
        position: absolute;
        right: 0;

        > .date {
          font-size: 14px;
          font-weight: 400;
          color: ${props => props.theme.white100};
          font-family: Inter;
        }
      }
    }

    > .body {
      background: ${props => props.theme.gray70};
      padding: 8px 8px 8px 16px;
      border-radius: 8px;
      margin-top: 10px;

      > p {
        font-size: 14px;
        font-weight: 400;
        color: ${props => props.theme.white100};
        line-height: 24px;
        margin-top: 10px;
        white-space: pre-line;
        word-break: break-word;
      }

      > .actions {
        display: flex;
        flex-direction: row;
        margin-top: 30px;

        > div {
          flex-direction: row;
          align-items: center;
          margin-right: 15px;

          > span {
            color: ${props => props.theme.white100};
            font-size: 12px;
            font-weight: 500;
            font-family: Inter;
          }
        }

        > .reply {
          display: flex;

          > .divider {
            width: 50px;
            height: 1px;
            background: ${props => props.theme.white100};
          }

          > p {
            color: ${props => props.theme.white100};
            font-size: 12px;
            font-weight: 500;
            margin-left: 5px;
            font-family: Inter;
          }
        }
      }

      > .input {
        margin-top: 20px;
        border: 1px solid ${props => props.theme.white30};
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
            color: ${props => props.theme.white100};
            text-align: left;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-decoration: none;
            padding: 10px;
            resize: vertical;
            min-height: 50px;
            font-family: Inter;
            height: auto;
            overflow: hidden;
          }

          > p {
            font-family: Inter;
            font-size: 14px;
            color: ${props => props.theme.white50};
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
    }
  }
`

interface Props {
  comment?: CommentModel
  loading?: boolean
  lastItem?: boolean
  postId?: string
  onSubmit: (comment: CommentModel) => void
  makeAlert: (type: AlertColor, message: string) => void
  comments: Array<CommentModel>
}

export function ArticleCommentBox(props: Props) {
  const { comment, loading = false, lastItem = false } = props
  const user = useAppSelector(state => state.user)
  const { locale } = useCeramicContext()
  const [moreActionEl, setMoreActionEl] = useState(null)
  const handleMoreClick = (event: any): void => {
    event.stopPropagation()
    setMoreActionEl(event.currentTarget)
  }
  const handleMoreClose = (e: Event): void => {
    e.stopPropagation()
    setMoreActionEl(null)
  }
  const moreOpen = Boolean(moreActionEl != null)

  const reportBug = (e: Event): void => {
    e.stopPropagation()
    setMoreActionEl(null)
  }

  const [commentMessage, setCommentMessage] = useState<string>('')
  const [showReplyBox, setReplyBox] = useState<boolean>(false)
  const handleReply = () => {
    setReplyBox(!showReplyBox)
  }

  const handleSetComment = (event: any) => {
    setCommentMessage(event.target.value)
    setCounter(event.target.value.length)
  }

  // const [commentPageCount, setCommentPageCount] = useState<number>(5);
  // const handleShowMoreComment = () => {
  //   setCommentPageCount(commentPageCount + 5);
  // };

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const handleSubmitComment = async () => {
    setIsSubmitting(true)

    if (user.did !== '') {
      setIsSubmitting(true)
      console.log('did')
      sendArticleComment(props.postId, {
        content: encodeURIComponent(commentMessage),
        replyingTo: comment.id,
      })
        .then(result => {
          if (result) {
            setCommentMessage('')
            props.onSubmit(result.data.comment)
            setShowReplies(true)
            // console.log(result)
          }
          setIsSubmitting(false)
        })
        .catch(error => {
          setIsSubmitting(false)
        })
    } else {
      props.makeAlert('error', 'Please connect your wallet')
    }
  }

  const [emojiModal, setEmojiModal] = useState<boolean>(false)
  const handleOpenEmoji = () => {
    setEmojiModal(true)
  }

  const handleSendEmoji = (emoji: EmojiClickData) => {
    setCommentMessage(commentMessage + '' + emoji.emoji)
    setCounter((commentMessage + '' + emoji.emoji).length)
  }

  const [showReplies, setShowReplies] = useState<boolean>(false)
  const handleShowReplies = () => {
    setShowReplies(!showReplies)
  }

  const [replyPage, setReplyPage] = useState<number>(5)

  const [counter, setCounter] = useState<number>(0)

  const handleKeyDown = (e: any) => {
    e.target.style.height = 'inherit'
    e.target.style.height = `${e.target.scrollHeight}px`
  }

  return (
    <Box $marginBottom={lastItem ? '0' : '15px'} $background={'transparent'}>
      {isDesktop() ? (
        <>
          <div className={'avatar'}>
            {loading ? (
              <CSkeleton width={40} height={40} borderRadius={'20px'} />
            ) : (
              <Avatar
                src={
                  'https://greenia.infura-ipfs.io/ipfs/' +
                    comment?.profile?.avatar ?? ''
                }
              />
            )}
          </div>
          <div className={'content'}>
            {loading ? (
              <>
                <CSkeleton width={100} height={10} marginBottom={'10px'} />
                <CSkeleton width={'100%'} height={10} marginBottom={'5px'} />
                <CSkeleton width={'100%'} height={10} marginBottom={'5px'} />
                <CSkeleton width={'50%'} height={10} />
              </>
            ) : (
              <>
                <div className={'header'}>
                  <p className={'name'}>
                    {_.get(comment, 'profile.displayName', 'New Face')}
                    <br />
                    {_.get(comment, 'profile.did', '')}
                  </p>
                  <div className={'action'}>
                    {comment?.createdAt ? (
                      <p style={{ color: 'white' }}>
                        {moment(comment.createdAt).locale(locale).fromNow()}
                      </p>
                    ) : null}
                    <CIconButton
                      icon={'more_horiz'}
                      customColor={'white100'}
                      backgroundColor={'transparent'}
                      backgroundColorHover={'transparent'}
                      onClick={handleMoreClick}
                    />
                  </div>
                </div>
                <div className={'body'}>
                  <p> {decodeURIComponent(comment?.content ?? '')}</p>

                  <div className={'actions'}>
                    <div>
                      <CSvgButton
                        icon={<Reply />}
                        disabled={false}
                        onClick={handleReply}
                        customColor={'white100'}
                        backgroundColorHover={'transparent'}
                        backgroundColor={'transparent'}
                      />
                      <span>reply</span>
                    </div>
                    {props.comments.filter(
                      item => item.replyingToID === comment?.id
                    ).length > 0 ? (
                      <div className={'reply'}>
                        <span className={'divider'}></span>
                        <p
                          style={{ cursor: 'pointer' }}
                          onClick={handleShowReplies}
                        >
                          {!showReplies ? 'view' : 'hide'}{' '}
                          {props.comments.filter(
                            item => item.replyingToID === comment?.id
                          ).length ?? 0}{' '}
                          reply
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {showReplyBox ? (
                    <div className={'input'} style={{ marginBottom: '10px' }}>
                      <div className={'textarea'}>
                        <textarea
                          rows={1}
                          contentEditable="true"
                          placeholder={'Type your comment...'}
                          onChange={handleSetComment}
                          onKeyDown={handleKeyDown}
                          value={commentMessage}
                        ></textarea>

                        {counter > 0 ? <p>{counter} / 500</p> : null}
                      </div>

                      <div className={'actions'}>
                        <CSvgButton
                          backgroundColor={'transparent'}
                          backgroundColorHover={'transparent'}
                          onClick={handleOpenEmoji}
                          icon={<Emoji />}
                        />
                        <CSvgButton
                          onClick={handleSubmitComment}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          backgroundColor={'transparent'}
                          backgroundColorHover={'transparent'}
                          icon={<Send />}
                        />
                      </div>
                    </div>
                  ) : null}

                  {showReplies
                    ? props.comments
                        .filter(item => item.replyingToID === comment?.id)
                        .sort(
                          (x: any, y: any) =>
                            new Date(y.createdAt).getTime() -
                            new Date(x.createdAt).getTime()
                        )
                        .map((item, index) =>
                          !loading ? (
                            index <= replyPage ? (
                              <Box $marginBottom={'5px'} $background={'navy80'}>
                                <div className={'avatar'}>
                                  <Avatar
                                    src={
                                      'https://greenia.infura-ipfs.io/ipfs/' +
                                        item?.profile?.avatar ?? ''
                                    }
                                  />
                                </div>
                                <div className={'content'}>
                                  <div className={'header'}>
                                    <p className={'name'}>
                                      {_.get(
                                        item,
                                        'profile.displayName',
                                        'New Face'
                                      )}
                                      <br />
                                      {_.get(item, 'profile.did', '')}
                                    </p>
                                    <div className={'action'}>
                                      {item?.createdAt ? (
                                        <p style={{ color: 'white' }}>
                                          {moment(item.createdAt)
                                            .locale(locale)
                                            .fromNow()}
                                        </p>
                                      ) : null}
                                      <CIconButton
                                        icon={'more_horiz'}
                                        customColor={'white100'}
                                        backgroundColor={'transparent'}
                                        backgroundColorHover={'transparent'}
                                        onClick={handleMoreClick}
                                      />
                                    </div>
                                  </div>

                                  <div className={'body'}>
                                    <p>
                                      {' '}
                                      {decodeURIComponent(item?.content ?? '')}
                                    </p>
                                  </div>
                                </div>
                              </Box>
                            ) : null
                          ) : null
                        )
                    : null}
                </div>
              </>
            )}
          </div>
        </>
      ) : (
        <>
          <div className={'content'}>
            {loading ? (
              <>
                <CSkeleton width={100} height={10} marginBottom={'10px'} />
                <CSkeleton width={'100%'} height={10} marginBottom={'5px'} />
                <CSkeleton width={'100%'} height={10} marginBottom={'5px'} />
                <CSkeleton width={'50%'} height={10} />
              </>
            ) : (
              <>
                <div className={'header'}>
                  <div className={'avatar'}>
                    {loading ? (
                      <CSkeleton width={40} height={40} borderRadius={'20px'} />
                    ) : (
                      <Avatar
                        src={
                          'https://greenia.infura-ipfs.io/ipfs/' +
                            comment?.profile?.avatar ?? ''
                        }
                      />
                    )}
                  </div>
                  <p className={'name'}>
                    {_.get(comment, 'profile.displayName', 'New Face').slice(
                      0,
                      10
                    ) + '..'}
                    <br />
                    {_.get(comment, 'profile.did', '')}
                  </p>
                  <div className={'action'}>
                    {comment?.createdAt ? (
                      <p style={{ color: 'white' }}>
                        {moment(comment?.createdAt).locale(locale).fromNow()}
                      </p>
                    ) : null}
                    <CIconButton
                      icon={'more_horiz'}
                      customColor={'white100'}
                      backgroundColor={'transparent'}
                      backgroundColorHover={'transparent'}
                      onClick={handleMoreClick}
                    />
                  </div>
                </div>
                <div className={'body'}>
                  <p> {decodeURIComponent(comment?.content ?? '')}</p>

                  <div className={'actions'}>
                    <div>
                      <CSvgButton
                        icon={<Reply />}
                        disabled={false}
                        onClick={handleReply}
                        customColor={'white100'}
                        backgroundColorHover={'transparent'}
                        backgroundColor={'transparent'}
                      />
                      <span>reply</span>
                    </div>
                    {props.comments.filter(
                      item => item.replyingToID === comment?.id
                    ).length > 0 ? (
                      <div className={'reply'}>
                        <span className={'divider'}></span>
                        <p
                          style={{ cursor: 'pointer' }}
                          onClick={handleShowReplies}
                        >
                          {!showReplies ? 'view' : 'hide'}{' '}
                          {props.comments.filter(
                            item => item.replyingToID === comment?.id
                          ).length ?? 0}{' '}
                          reply
                        </p>
                      </div>
                    ) : null}
                  </div>
                  {showReplyBox ? (
                    <div className={'input'} style={{ marginBottom: '10px' }}>
                      <div className={'textarea'}>
                        <textarea
                          rows={1}
                          contentEditable="true"
                          placeholder={'Type your comment...'}
                          onChange={handleSetComment}
                          onKeyDown={handleKeyDown}
                          value={commentMessage}
                        ></textarea>

                        {counter > 0 ? <p>{counter} / 500</p> : null}
                      </div>

                      <div className={'actions'}>
                        <CSvgButton
                          backgroundColor={'transparent'}
                          backgroundColorHover={'transparent'}
                          onClick={handleOpenEmoji}
                          icon={<Emoji />}
                        />
                        <CSvgButton
                          onClick={handleSubmitComment}
                          disabled={isSubmitting}
                          loading={isSubmitting}
                          backgroundColor={'transparent'}
                          backgroundColorHover={'transparent'}
                          icon={<Send />}
                        />
                      </div>
                    </div>
                  ) : null}

                  {showReplies
                    ? props.comments
                        .filter(item => item.replyingToID === comment?.id)
                        .sort(
                          (x: any, y: any) =>
                            new Date(y.createdAt).getTime() -
                            new Date(x.createdAt).getTime()
                        )
                        .map((item, index) =>
                          !loading ? (
                            index <= replyPage ? (
                              <Box $marginBottom={'5px'} $background={'navy80'}>
                                <div className={'avatar'}>
                                  <Avatar
                                    src={
                                      'https://greenia.infura-ipfs.io/ipfs/' +
                                        item?.profile?.avatar ?? ''
                                    }
                                  />
                                </div>
                                <div className={'content'}>
                                  <div className={'header'}>
                                    <p className={'name'}>
                                      {_.get(
                                        item,
                                        'profile.displayName',
                                        'New Face'
                                      )}
                                      <br />
                                      {_.get(item, 'profile.did', '')}
                                    </p>
                                    <div className={'action'}>
                                      {item?.createdAt ? (
                                        <p style={{ color: 'white' }}>
                                          {moment(item?.createdAt).locale(locale).fromNow()}
                                        </p>
                                      ) : null}
                                      <CIconButton
                                        icon={'more_horiz'}
                                        customColor={'white100'}
                                        backgroundColor={'transparent'}
                                        backgroundColorHover={'transparent'}
                                        onClick={handleMoreClick}
                                      />
                                    </div>
                                  </div>

                                  <div className={'body'}>
                                    <p>
                                      {' '}
                                      {decodeURIComponent(item?.content ?? '')}
                                    </p>
                                  </div>
                                </div>
                              </Box>
                            ) : null
                          ) : null
                        )
                    : null}
                </div>
              </>
            )}
          </div>
        </>
      )}

      <CMenu
        open={moreOpen}
        id="options-menu"
        anchorEl={moreActionEl}
        onClose={handleMoreClose}
        anchorOriginHorizontal="left"
        transformOriginHorizontal="left"
        anchorOriginVertical="bottom"
        transformOriginVertical="top"
      >
        <CMenuItem
          color={'red100'}
          onClick={e => {
            reportBug(e)
          }}
        >
          <span>Report a bug</span>
        </CMenuItem>
      </CMenu>

      <CModal
        width={'50%'}
        open={emojiModal}
        onClose={() => {
          setEmojiModal(false)
        }}
        title="Emoji"
      >
        <EmojiPicker
          onEmojiClick={(emoji: EmojiClickData) => {
            handleSendEmoji(emoji)
          }}
        />
      </CModal>
    </Box>
  )
}
