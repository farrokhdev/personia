import React, { useEffect, useState } from 'react'
import { breakpoints } from '../../../config/global-styles'
import styled from 'styled-components'
import { MyInput } from '../../custom/input'
import { SearchAllUsers } from '../../../apis/user.api'
import { ProfileModel } from '../../../models/profile.model'
import { Avatar } from '@mui/material'
import './../../../assets/svg/arrow-left.svg'
import { ReactComponent as AddIcon } from '../../../assets/svg/add.svg'
import { ReactComponent as RemoveIcon } from '../../../assets/svg/remove.svg'
import { ReactComponent as ArrowLeft } from '../../../assets/svg/arrow-left.svg'
import { CButton, CIconButton, CSkeleton } from '../../mui'
import { CSvgButton } from '../../mui/SvgButton'
import { useCeramicContext, useGlobalContext } from '../../../contexts'
import { displayName } from 'react-quill'
export interface StyledInputType {
  $background: string
  right: number
}

const RoomBoxStyle = styled.div<StyledInputType>`
  padding: 8px 16px 8px 16px;
  background: ${({ theme, $background }) => theme[$background]};
  border: 0.5px solid ${props => props.theme.gray60};
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
    position: relative;
    height: fit-content;
    > .buttonBack {
      position: absolute;
      left: -10px;
      top: -5px;
    }
    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${props => props.theme.black100};
      text-align: justify;
      flex: 1;
      @media only screen and (max-width: ${breakpoints.tablet}) {
        text-align: center;
        height: 56px;
      }

      &.green {
        color: ${props => props.theme.green100};
      }
    }
  }
  > .search {
    margin-top: -30px;
    position: relative;
    z-index: 10;
  }
  > .body {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    margin-top: 30px;
    overflow-y: scroll;
    height: 530px;
    >.noUser{
      color:  rgba(255, 255, 255, 0.50);
      font-size: 14px;
      line-height: 22px;
      width: 95%;
      margin-top: 20px;
      text-align: center;
    }
    > .loadMore {
      width: 95%;
      height: 40px;
      background: #140e26;
      border-radius: 8px;
      color: white;
      border: none;
      margin-top: 15px;
      margin-bottom: 15px;
    }
    > .profile {
      width: 95%;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid #40404a;
      padding-bottom: 12px;
      padding-top: 12px;
      align-items: start;
      color: white;
      font-size: 14px;
      height: fit-content;
      > .plus {
        width: 44px;
        height: 44px;
        border-radius: 8px;
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px;
        font-size: 25px;
        font-weight: 100;
        color: #201a31;
      }
      > div {
        display: flex;
        align-items: center;
        font-weight: 400;
        p {
          margin-left: 20px;
        }
      }
    }
    .plus {
      width: 44px;
      height: 44px;
      border-radius: 8px;
      background: #2f1775;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 10px;
      font-size: 25px;
      font-weight: 100;
    }
  }
  > .row {
    display: flex;
    padding-bottom: 15px;
    padding-top: 15px;
    border-bottom: 1px solid ${props => props.theme.gray90};
    width: 100%;
    cursor: pointer;
    margin-top: 30px;
    > .column {
      width: 170px;
      margin-left: 10px;

      > p {
        font-size: 14px;
        font-weight: 400;
        font-family: Inter;
        color: ${props => props.theme.white100};
        text-align: left;
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
      }
    }
  }
`
interface Props {
  setAddedUsers: (users: Array<ProfileModel>) => void
  addedUsers: Array<ProfileModel>
  setSearchUser: (searchUse: 'noUser' | 'search') => void
}
export default function UserList(props: Props) {
  const { makeAlert } = useGlobalContext()
  const { setAddedUsers, addedUsers, setSearchUser } = props
  const x = [1, 2, 3, 4]
  const [usersLoading, setUsersLoading] = useState<boolean>(true)
  const [users, setUsers] = useState<Array<ProfileModel>>([])
  const [cursor, setCursor] = useState<string>('')
  const [searchText, setSearchText] = useState<string>('')

  const getUsers = (text: string = '') => {
    SearchAllUsers({
      q: searchText,
      cursor: cursor,
      perPage: 10,
    })
      .then(res => {
        if (res.data.users) {
          setUsers(users => [...users, ...res.data.users])
          setCursor(res.data.cursor)
        }
        setUsersLoading(false)
      })
      .catch(err => {
        console.log(err)
        setUsersLoading(false)
      })
  }
  const searchUser = (txt: string = '') => {
    setUsers([])
    setSearchText(txt)
  }
  useEffect(() => {
    setUsers([])
    getUsers()
  }, [searchText])

  const handleAddUser = (user: ProfileModel, index: number) => {
    const _users = [...addedUsers]
    if (_users.filter(item => item.id === user.id).length) {
      setAddedUsers(_users.filter(u => u.id !== user.id))
    } else {
      if (_users.length <= 3) {
        _users.push(user)
        setAddedUsers(_users)
      } else {
        makeAlert('error', 'Users added exsists')
      }
    }
  }

  return (
    <RoomBoxStyle $background={'navy60'} right={window.innerWidth}>
      <div className="header">
        <div className="buttonBack">
          <CSvgButton
            backgroundColor="navy60"
            icon={<ArrowLeft />}
            onClick={() => setSearchUser('noUser')}
          />
        </div>
        <p className="green">Search Profile</p>
      </div>
      <div className="search">
        <MyInput
          placeholder={'Search'}
          label={''}
          name={'search'}
          icon={'search'}
          background={'gray70'}
          border={'gray60'}
          onChange={searchUser}
          color={'white100'}
        />
      </div>
      {usersLoading ? (
        x.map(val => {
          return (
            <div className={'row'}>
              <CSkeleton width={40} height={40} borderRadius={'20px'} />
              <div className={'column'}>
                <CSkeleton width={200} height={10} marginBottom={'5px'} />
                <CSkeleton width={200} height={10} />
              </div>
              <CSkeleton width={100} height={10} />
            </div>
          )
        })
      ) : (
        <div className="body">
          {users.length > 0 ? (
            users.map((val, i) => {
              return (
                <div className="profile" key={val.id}>
                  <div>
                    <Avatar
                      alt={val.displayName}
                      src={`https://greenia.infura-ipfs.io/ipfs/${val.avatar}`}
                    />
                    <p>{val.displayName}</p>
                  </div>
                  <div className="plus">
                    <CSvgButton
                      backgroundColor="navy30"
                      customColorHover="transparent"
                      backgroundColorHover="navy30"
                      icon={
                        addedUsers.filter(item => item.id === val.id).length ? (
                          <RemoveIcon />
                        ) : (
                          <AddIcon />
                        )
                      }
                      onClick={() => handleAddUser(val, i)}
                    />
                  </div>
                </div>
              )
            })
          ) : (
            <div className='noUser'>
              Sorry! no user with this profile info was found Please check your
              spelling
            </div>
          )}

          {users.length > 9 && (
            <div className="loadMore">
              <CButton
                fullWidth
                background={'navy80'}
                color={'white100'}
                backgroundHover={'navy100'}
                loading={usersLoading}
                onClick={getUsers}
              >
                Load More
              </CButton>
            </div>
          )}
        </div>
      )}
    </RoomBoxStyle>
  )
}
