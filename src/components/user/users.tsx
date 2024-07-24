import styled from "styled-components";
import { useAppSelector } from "../../redux/hooks";
import React, { ReactElement, useEffect, useState } from "react";
import { MyInput } from "../custom/input";
import { UserInfoBox } from "./list";
import { breakpoints } from "../../config/global-styles";
import { SearchAllUsers, searchUsers } from "../../apis/user.api";
import { ProfileModel } from "../../models/profile.model";

const UserBox = styled.div<{ background: string }>`
  background: ${({ theme, background }) => theme[background]};
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;

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

      @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
        width: 70%;
      }
    }
  }

  > .body {
    padding: 20px;

    .users {
      height: 400px;
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
  setLoading: (loading: boolean) => void;
}

export function UsersBox(props: Props): ReactElement {
  const me = useAppSelector((state) => state.user);
  const [searchedUsers, setSearchedUsers] = useState<Array<ProfileModel>>([]);
  const [searchText, setSearchText] = useState<string>("");

  const handleSearchUser = async (text: string) => {
    props.setLoading(true);
    setSearchText(text);

    await SearchAllUsers({
      q: text,
      perPage: 5,
    }).then((res) => {
      if (res) {
        props.setLoading(false);
        setSearchedUsers(res.data.users);
      }
    });
  };

  return (
    <UserBox background={props.background}>
      {props.title ? (
        <div className={"header"}>
          <p>{props.title}</p>
        </div>
      ) : null}
      <div className={"body"}>
        <MyInput
          placeholder={"Search"}
          label={""}
          onChange={handleSearchUser}
          name={"search"}
          icon={"search"}
          background={"gray70"}
          border={"gray60"}
          color={"white100"}
        />

        <div className={"users"}>
          {props.loading
            ? [1, 2, 3, 4, 5, 6].map((i) => (
                <UserInfoBox
                  loading={props.loading}
                  key={i}
                  setLoading={(loading) => {
                    props.setLoading(loading);
                  }}
                />
              ))
            : searchText === ""
            ? props.users
                .filter((item) => item.id !== me.id)
                ?.map((user, index) => (
                  <UserInfoBox
                    user={user}
                    userId={me.id}
                    key={index}
                    setLoading={(loading) => {
                      props.setLoading(loading);
                    }}
                  />
                ))
            : searchedUsers
                .filter((item) => item.id !== me.id)
                ?.map((user, index) => (
                  <UserInfoBox
                    user={user}
                    userId={me.id}
                    key={index}
                    setLoading={(loading) => {
                      props.setLoading(loading);
                    }}
                  />
                ))}
        </div>
      </div>
    </UserBox>
  );
}
