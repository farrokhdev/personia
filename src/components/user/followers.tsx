import styled from 'styled-components'
import { useAppSelector } from '../../redux/hooks'
import React, { ReactElement, useEffect, useState } from 'react'
import { MyInput } from '../custom/input'
import { UserInfoBox } from './list'
import { CTab, CTabs } from '../mui'
import { ProfileModel } from '../../models/profile.model'
import { FollowModel } from '../../models/follow.model'

const UserBox = styled.div`
  background: ${props => props.theme.black30};
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;

  > .header {
    border-bottom: 1px solid ${props => props.theme.black60};
    margin: 0 auto 0 auto;
    padding: 10px 0 0 0;

    > p {
      font-size: 14px;
      font-weight: 400;
      color: ${props => props.theme.green100};
      border-bottom: 2px solid ${props => props.theme.green100};
      text-align: center;
      line-height: 28px;
      width: 47%;
      align-self: center;
      margin: 0 auto 0 auto;
      padding: 5px;
    }
  }

  > .body {
    padding: 20px;
    background: ${props => props.theme.black30};

    .users {
      height: 400px;
      overflow-y: auto;
      margin-top: 10px;

      /* width */

      ::-webkit-scrollbar {
        background: ${props => props.theme.gray70};
        width: 8px;
        margin-left: 10px;
      }

      /* Track */

      ::-webkit-scrollbar-track {
        border-radius: 10px;
      }

      /* Handle */

      ::-webkit-scrollbar-thumb {
        background: ${props => props.theme.gray80};
        border-radius: 10px;
      }
    }
  }
`

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: sticky;
  top: 0;
  z-index: 20;

  > span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.black80};
  }

  .MuiTabs-root {
    background: ${props => props.theme.black30} !important;

    .MuiTab-root.Mui-selected {
      background: transparent !important;
      color: ${props => props.theme.blue90} !important;
      border-bottom: 1px solid ${props => props.theme.blue90} !important;
    }
  }
`

interface Props {
  theUser?: ProfileModel
  loading: boolean
  setLoading: (loading: boolean) => void
  setTheUser: (users: ProfileModel) => void
}

export function FollowersBox(props: Props): ReactElement {
  const user = useAppSelector(state => state.user)
  const [viewType, setViewType] = useState<
    'followers' | 'followings' | 'mutual'
  >('followers')

  const [users, setUsers] = useState<Array<FollowModel>>(
    props.theUser?.followers ?? []
  )

  const [followers, setFollowers] = useState<Array<FollowModel>>(
    props.theUser?.followers ?? []
  )

  const [followings, setFollowings] = useState<Array<FollowModel>>(
    props.theUser?.followers ?? []
  )

  useEffect(() => {
    setViewType('followers')
    setUsers(props.theUser?.followers ?? [])
    setFollowers(props.theUser?.followers ?? [])
    setFollowings(props.theUser?.followings ?? [])
  }, [props.theUser])

  const handleChangeViewType = (event: any, newValue: any): void => {
    setViewType(newValue)

    if (newValue === 'followers') setUsers(followers)
    else if (newValue === 'followings') setUsers(followings)
    else {
      setUsers([])
      const _users: ProfileModel[] = []
      user.followings?.map((item, index) => {
        const _user = props.theUser?.followings?.filter(
          (item2: FollowModel) => item2.targetProfileID === item.targetProfileID
        )
        if (_user.length > 0) {
          _users.push(_user[0])
        }
      })
      setUsers(_users)
    }
  }

  const handleSearchUser = (value: string) => {
    if (value === '') {
      if (viewType === 'followers') setUsers(followers)
      else if (viewType === 'followings') setUsers(followings)
      else {
        setUsers([])
        const _users: ProfileModel[] = []
        user.followings?.map((item, index) => {
          const _user = props.theUser?.followings?.filter(
            item2 => item2.targetProfile?.id === item.id
          )
          if (_user.length > 0) {
            _users.push(_user[0])
          }
        })
        setUsers(_users)
      }
    } else {
      if (viewType === 'followers')
        setUsers(
          followers.filter(item => item.profile?.displayName.includes(value)) ??
            []
        )
      else if (viewType === 'followings')
        setUsers(
          followings.filter(item =>
            item.targetProfile?.displayName.includes(value)
          ) ?? []
        )
      else {
        setUsers([])
        const _users: ProfileModel[] = []
        user.followings?.map((item, index) => {
          const _user = props.theUser?.followings?.filter(
            item2 =>
              item2.targetProfile?.id === item.id &&
              item.targetProfile?.displayName.includes(value)
          )
          if (_user.length > 0) {
            _users.push(_user[0])
          }
        })
        setUsers(_users)
      }
    }
  }

  console.log(users);

  return (
    <UserBox>
      <TabBox>
        <CTabs
          value={viewType}
          onChange={handleChangeViewType}
          key={1}
          $background={'black30'}
          $activeBG={'black30'}
        >
          <CTab
            label={'Followers'}
            id={'view-tab-about'}
            aria-controls={'view-tabpanel-about'}
            value={'followers'}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={'Followings'}
            id={'view-tab-posts'}
            aria-controls={'view-tabpanel-posts'}
            value={'followings'}
            disableTouchRipple
            $fullWidth
          />
          {user.id !== props.theUser?.id ? (
            <CTab
              label={'Mutual'}
              id={'view-tab-platforms'}
              aria-controls={'view-tabpanel-platforms'}
              value={'mutual'}
              disableTouchRipple
              $fullWidth
            />
          ) : null}
        </CTabs>
      </TabBox>

      <div className={'body'}>
        <MyInput
          placeholder={'Search'}
          label={''}
          onChange={handleSearchUser}
          name={'search'}
          icon={'search'}
          background={'gray70'}
          border={'gray60'}
          color={'white100'}
        />

        <div className={'users'}>
          {props.loading
            ? [1, 2, 3, 4, 5, 6].map(i => (
                <UserInfoBox loading={props.loading} key={i} />
              ))
            : users.map((_user, index) =>
                viewType === 'followers' ? (
                  <UserInfoBox
                    user={_user.profile}
                    key={index}
                    index={index}
                    setTheUser={props.setTheUser}
                    userId={props.theUser.id}
                    fromUserProfile={true}
                    followAction={viewType}
                    onChangeFollowersList={(users: any) => {
                      setUsers(users)
                      setFollowers(users)
                    }}
                    onChangeFollowingList={(users: any) => {
                      setFollowings(users)
                    }}
                    setLoading={loading => props.setLoading(loading)}
                  />
                ) : viewType === 'followings' ? (
                  <UserInfoBox
                    user={_user.targetProfile}
                    key={index}
                    index={index}
                    setTheUser={props.setTheUser}
                    fromUserProfile={true}
                    userId={props.theUser.id}
                    followAction={viewType}
                    onChangeFollowersList={(users: any) => {
                      setFollowers(users)
                    }}
                    onChangeFollowingList={(users: any) => {
                      setFollowings(users)
                      setUsers(users)
                    }}
                    setLoading={loading => props.setLoading(loading)}
                  />
                ) : (
                  <UserInfoBox
                    user={_user.targetProfile}
                    key={index}
                    index={index}
                    setTheUser={props.setTheUser}
                    fromUserProfile={true}
                    userId={user.id}
                    followAction={viewType}
                    onChangeFollowersList={(users: any) => {
                      setFollowers(users)
                      setUsers(users)
                    }}
                    onChangeFollowingList={(users: any) => {
                      setFollowings(users)
                      setUsers(users)
                    }}
                    setLoading={loading => props.setLoading(loading)}
                  />
                )
              )}
        </div>
      </div>
    </UserBox>
  )
}
