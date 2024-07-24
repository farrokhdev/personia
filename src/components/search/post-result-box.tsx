import React, { ReactElement } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { useCeramicContext } from '../../contexts'
import { PostModel } from '../../models/post.model'
import moment from 'moment-timezone'

const Box = styled.div<{ $marginBottom: string }>`
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  background: ${({ theme }) => theme.black30};

  > img {
    width: 130px;
  }

  .column {
    display: block;
    margin-left: 15px;

    > p > a {
      font-size: 14px;
      color: ${props => props.theme.white100};
      line-height: 1.3rem;
      display: block;
      text-overflow: ellipsis;
      word-wrap: break-word;
      overflow: hidden;
      margin-bottom: 20px;
      display: -webkit-box;
      -webkit-line-clamp: 2; /* number of lines to show */
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }

    > .flex {
      display: inline-flex;

      > p {
        border: 1px solid ${props => props.theme.gray60};
        font-size: 14px;
        color: ${props => props.theme.white100};
        line-height: 1.3rem;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        padding: 5px;
        border-radius: 8px;
        margin-right: 10px;
      }

      > a {
        border: 1px solid ${props => props.theme.gray60};
        font-size: 14px;
        color: ${props => props.theme.white100};
        line-height: 1.3rem;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        padding: 5px;
        border-radius: 8px;
        margin-right: 10px;
        text-decoration: none;
      }
    }
  }
`

interface Props {
  post: PostModel
}

export function SearchPostResultBox(props: Props): ReactElement {
  const { post } = props
  const { locale = 'de-DE', dateOption } = useCeramicContext()

  return (
    <Box $marginBottom={'5px'}>
      <img src={`https://greenia.infura-ipfs.io/ipfs/${post.attachment}`} />

      <div className={'column'}>
        <p>
          <Link to={'posts/get/' + post.id}>
            {decodeURIComponent(post.body ?? '')}
          </Link>
        </p>
        <div className={'flex'}>
          <p>
            {' '}
            {moment(post?.createdAt)
              .locale(locale)
              .format('YYYY-MM-DD HH:mm')}
          </p>
          <Link to={'/u/' + post.profile?.id}>
            <p>{post.profile?.displayName ?? ''}</p>
          </Link>
        </div>
      </div>
    </Box>
  )
}
