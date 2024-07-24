import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { breakpoints } from "../../config/global-styles";
import { MyInput } from "../custom/input";
import { CButton, CSkeleton } from "../mui";
import { ProfileModel } from "../../models/profile.model";
import { useAppSelector } from "../../redux/hooks";
import { SearchAllUsers } from "../../apis/user.api";
import { ReactComponent as ArrowLeft } from "../../assets/svg/arrow-left.svg";
import { UserInfoBox } from "./userInfoBox";

type Props = {
  onBack: () => void;
  setSearchUsersModal: (searchUserModal?: any) => void;
};

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
  z-index: 40;
  @media only screen and (max-width: ${breakpoints.tablet}) {
    width: 100%;
    height: 100%;
    border-radius: 16px;
    /* min-height: 766px; */
    position: static;
  }

  @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
    width: 300px;
  }

  > .header {
    width: 100%;
    display: flex;
    align-items: center;
    padding: 8px 0px;
    justify-content: space-between;
    position: relative;
    > .icon {
      cursor: pointer;
      position: absolute;
      left: 0;
      top: 50%;
      transform: translateY(-50%);
    }

    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${(props) => props.theme.black100};
      text-align: justify;
      flex: 1;
      text-align: center;
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
      gap: "10px";
      > .search {
        flex-basis: 100%;
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

const ChatUsersSearchModal = (props: Props) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [users, setUsers] = useState<Array<ProfileModel>>([]);
  const [cursor, setCursor] = useState<string>("");
  const [numPerPage, setNumPerPage] = useState<number>(10);

  const [searchText, setSearchText] = useState<string>("");

  const getUsers = () => {
    setLoading(true);
    console.log(searchText);
    SearchAllUsers({
      q: searchText,
      cursor: cursor,
      perPage: 10,
    })
      .then((res) => {
        if (res.data.users) {
          // setNumPerPage((prev) => prev + num);
          console.log(res.data.users);
          setUsers((users) => [...users, ...res.data.users]);
          setCursor(res.data.cursor);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.log(err);
        setLoading(false);
      });
  };

  const searchUser = (txt: string = "") => {
    setUsers([]);
    setSearchText(txt);
  };

  useEffect(() => {
    setUsers([]);
    getUsers();
  }, [searchText]);

  const loadmore = () => {
    getUsers();
  };

  return (
    <ChatBoxStyle $background={"navy60"} right={window.innerWidth}>
      <div className={"header"}>
        <div className={"icon"} onClick={props.onBack}>
          <ArrowLeft />
        </div>
        <p className={"green"}>{"Search Profile"}</p>
      </div>

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
              onChange={searchUser}
              color={"white100"}
            />
          </div>
        </div>
        <div className={"users"}>
          {loading ? (
            [1, 2, 3, 4].map(() => (
              <div className={"row"}>
                <CSkeleton width={40} height={40} borderRadius={"20px"} />
                <div className={"column"}>
                  <CSkeleton width={200} height={10} marginBottom={"5px"} />
                  <CSkeleton width={200} height={10} />
                </div>
                <CSkeleton width={100} height={10} />
              </div>
            ))
          ) : users.length > 0 ? (
            users.map((userItem, index) => (
              <UserInfoBox
                user={userItem}
                key={index}
                setSearchUsersModal={props.setSearchUsersModal}
              />
            ))
          ) : (
            <div className="empty-row">
              <p className="empty">
                Sorry! no user with this profile info was found Please check
                your spelling
              </p>
            </div>
          )}

          <>
            {users.length > 9 && (
              <div style={{ marginTop: "10px" }}>
                <CButton
                  fullWidth
                  background={"navy80"}
                  color={"white100"}
                  backgroundHover={"navy100"}
                  loading={loading}
                  onClick={loadmore}
                >
                  Load More
                </CButton>
              </div>
            )}
          </>
        </div>
      </div>
    </ChatBoxStyle>
  );
};

export default ChatUsersSearchModal;
