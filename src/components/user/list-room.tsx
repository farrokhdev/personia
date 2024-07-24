import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Avatar } from '@mui/material'
import _ from 'lodash'
import { CMenu, CMenuItem, CSkeleton } from '../mui'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CSvgButton } from '../mui/SvgButton'
import { ReactComponent as UserAdd } from '../../assets/svg/profile-add.svg'
import { v4 as uuid } from 'uuid'
import { ProfileModel } from '../../models/profile.model'
import { createChat, sendChatMessage } from '../../apis/chat.apis'

const Box = styled.div<{ $marginBottom: string }>`
  background: ${props => props.theme.gray70};
  padding: 8px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 7px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  margin-top: ${({ $marginBottom }) => $marginBottom};

  > .grow {
    flex-grow: 1;
  }

  > a > .name {
    margin-left: 15px;
    text-decoration: none;

    > span:first-child {
      font-size: 14px;
      font-weight: 500;
      color: ${props => props.theme.white100};
      display: block;
      margin-bottom: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    > span:last-child {
      font-size: 14px;
      font-weight: 500;
      color: ${props => props.theme.white40};
      display: block;
      margin-bottom: 5px;
    }

    > input {
      width: 200px;
      height: 20px;
      background: ${props => props.theme.black3};
      outline: none;
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: ${props => props.theme.black60};
    }
  }
`

interface Props {
  user?: ProfileModel
  loading?: boolean
  index?: number
  followAction?: string
  onChangeList?: (users: any) => void
  roomType: string
  password?: string
}

export function UserInfoRoomBox(props: Props): ReactElement {
  const { user } = props
  const [isAddLoading, setIsAddLoading] = useState<boolean>(false)

  const me = useAppSelector(state => state.user)

  const addUser = async () => {
    setIsAddLoading(true)
    var message = ''

    if (props.roomType === 'private') {
      if (props.password) {
        message = 'Private video chat request'
        message += '\n Room Link:\n\n' + window.location.href
        message += '\n\n Click on link to join room'
        message += '\n\n Room password:\n\n' + props.password
      } else {
        message = 'Private video chat request'
        message += '\n Room Link:\n\n' + window.location.href
        message += '\n\n Click on link to join room'
      }
    } else {
      message = 'Public video chat request'
      message += '\n Room Link:\n\n' + window.location.href
      message += '\n\n Click on link to join room'
    }

    createChat(me.id).then(res => {
      sendChatMessage(res.data.chat.id, {
        content: encodeURIComponent(message),
        messageType: 'text',
      })
        .then( (result) => {
          if (result) {

          }
          setIsAddLoading(false)
        })
        .catch((error: any) => {
          console.error(error, 'error')
          setIsAddLoading(false)
        })
    })
  }

  return (
    <Box $marginBottom={'10px'}>
      {props.loading ? (
        <CSkeleton width={40} height={40} borderRadius={'20px'} />
      ) : (
        <Avatar
          src={`https://greenia.infura-ipfs.io/ipfs/${_.get(
            user,
            'avatar',
            ''
          )}`}
          alt={_.get(user, 'name', '')}
        />
      )}

      <Link to={'/u/' + user?.id}>
        <div className={'name'}>
          {props.loading ? (
            <>
              <CSkeleton width={100} height={10} borderRadius={'20px'} />
              <CSkeleton width={100} height={10} borderRadius={'20px'} />
            </>
          ) : (
            <>
              <span>{user?.displayName || 'New Face'}</span>
              <span>{_.get(user, 'did', '')}</span>
            </>
          )}
        </div>
      </Link>

      <div className={'grow'} />

      <CSvgButton
        loading={props.loading}
        disabled={props.loading}
        loadingColor={isAddLoading ? 'green100' : 'white100'}
        backgroundColor={isAddLoading ? 'gray70' : 'navy25'}
        backgroundColorHover={isAddLoading ? 'gray70' : 'navy25'}
        icon={<UserAdd />}
        onClick={addUser}
      />
    </Box>
  )
}
