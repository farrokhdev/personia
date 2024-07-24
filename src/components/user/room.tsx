import styled from 'styled-components';
import { useAppSelector } from '../../redux/hooks';
import React, { ReactElement, useEffect, useState } from 'react';
import { MyInput } from '../custom/input';
import { UserInfoRoomBox } from './list-room'
import { ProfileModel } from '../../models/profile.model'
import { SearchAllUsers } from '../../apis/user.api'


const UserBox = styled.div<{ background: string }>`
  background: ${({ theme, background }) => theme[background]};
  border-radius: 8px;
  width: 100%;

  > .header {
    border-bottom: 1px solid ${(props) => props.theme.black60};
    margin: 0 auto 0 auto;
    padding: 10px 0 0 0;

    > p {
      font-size: 14px;
      font-weight: 400;
      color: ${(props) => props.theme.green100};
      border-bottom: 2px solid ${(props) => props.theme.green100};
      text-align: center;
      line-height: 28px;
      width: 47%;
      align-self: center;
      margin: 0 auto 0 auto;
      padding: 5px;
    }
  }

  > .body {
    padding-top: 20px;
    padding-bottom: 20px;

    .users {
        height: 100vh;
      overflow-y: auto;
      margin-top: 10px;

      /* width */

      ::-webkit-scrollbar {
        background: ${(props) => props.theme.gray70};
        width: 8px;
        margin-left: 10px;
      }

      /* Track */

      ::-webkit-scrollbar-track {
        border-radius: 10px;
      }

      /* Handle */

      ::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.gray80};
        border-radius: 10px;
      }
    }
  }

`;


interface Props {
  users?: Array<ProfileModel>;
  title: string;
  loading: boolean;
  background: string;
  roomType: string;
  password?:string
}

export function UsersRoomBox(props: Props): ReactElement {
  const user = useAppSelector(state => state.user);
  const [users, setUsers] = useState<Array<ProfileModel>>(props.users ?? []);

  useEffect(() => {
    if (users.length === 0) {
      SearchAllUsers({ perPage: 30, cursor: '' }).then(result => {
        if (result)
          setUsers(result.data.users);
      });
    }
  }, []);

  const handleSearchUser = (text: string) => {
    SearchAllUsers({ perPage: 30, cursor: '',  q: text }).then(result => {
      if (result)
        setUsers(result.data.users);
    });
  };

  return (
    <UserBox background={props.background}>
      {props.title ?
        <div className={'header'}>
          <p>{props.title}</p>
        </div>
        : null}
      <div className={'body'}>
        <MyInput
          placeholder={'Search'}
          label={''}
          onChange={handleSearchUser}
          name={'search'}
          icon={'search'}
          background={'gray70'}
          border={'gray60'}
          color={'white100'} />

        <div className={'users'}>
          {props.loading ?
            [1, 2, 3, 4, 5, 6].map((i) => (
              <UserInfoRoomBox loading={props.loading} key={i}  roomType={props.roomType} />
            ))
            :
            users.filter(item => item.id !== user.id)?.map((user, index) => (
              <UserInfoRoomBox password={props.password} user={user} key={index}  roomType={props.roomType} />
            ))}
        </div>

      </div>
    </UserBox>
  );
}
