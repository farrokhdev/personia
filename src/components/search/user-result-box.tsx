import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Avatar } from '@mui/material'
import _ from 'lodash'
import { Link } from 'react-router-dom'
import { CButton } from '../mui'
import { ProfileModel } from '../../models/profile.model'
import { FollowUnfollow } from '../../apis/user.api'

const Box = styled.div<{ $marginBottom: string }>`
  padding: 10px 0px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;

  > .name-box {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;

    > span {
      font-size: 14px;
      font-weight: 500;
      color: ${props => props.theme.white100};
      display: block;
    }

    > input {
      width: 200px;
      height: 20px;
      background: transparent;
      outline: none;
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: ${props => props.theme.white100};
    }
  }
`

interface Props {
  user?: ProfileModel
  loading?: any
}

export function SearchUserResultBox(props: Props): ReactElement {
  const { user, loading } = props
  const [buttonLoading, setLoading] = useState<boolean>(false)
  const [isFollowed, setSFollowed] = useState<boolean>(false)
  useEffect(() => {
    if (user) {
      setSFollowed(user.isFollowed)
    }
  }, [user])

  const follow = () => {
    setLoading(true)
    FollowUnfollow(user.id)
      .then(result => {
        setLoading(false)
        setSFollowed(result.data.follow)
      })
      .catch(error => {
        setLoading(false)
      })
  }

  return (
    <Link to={'/u/' + user?.id}>
      <Box $marginBottom={'0'}>
        <div className={'name-box'}>
          <Avatar
            src={`https://greenia.infura-ipfs.io/ipfs/${_.get(
              user,
              'avatar',
              ''
            )}`}
            alt={_.get(user, 'displayName', '')}
          />
          <span>{_.get(user, 'displayName', 'New Face')}</span>
          <input
            value={_.get(user, 'did', '')}
            readOnly
            style={{ display: 'none' }}
          />
        </div>

        <div style={{zIndex: 10}}>
          <CButton
            size={'m'}
            background={'navy25'}
            backgroundHover={'navy50'}
            color={'white100'}
            loading={loading}
            disabled={loading}
            loadingColor={'green100'}
            onClick={follow}
          >
            <p style={{ marginLeft: '0px' }}>Follow</p>
          </CButton>
        </div>

      </Box>
    </Link>
  )
}
