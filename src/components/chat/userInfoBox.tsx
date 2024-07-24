import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import _ from "lodash";
import { CSkeleton } from "../mui";
import { useCeramicContext } from "../../contexts";
import { Link, useNavigate } from "react-router-dom";
import { CSvgButton } from "../mui/SvgButton";
import { ProfileModel } from "../../models/profile.model";

import { createChat } from "../../apis/chat.apis";

const Box = styled.div<{ $marginBottom: string }>`
  padding: 8px;
  /* border-radius: 8px; */
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-right: 7px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  margin-top: ${({ $marginBottom }) => $marginBottom};
  border-bottom: 1px solid ${(props) => props.theme.gray90};
  > .grow {
    flex-grow: 1;
  }

  > a > .name {
    margin-left: 15px;
    text-decoration: none;

    > span:first-child {
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => props.theme.white100};
      display: block;
      margin-bottom: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 120px;
    }

    > span:last-child {
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => props.theme.white40};
      display: block;
      margin-bottom: 5px;
      display: -webkit-box;
      -webkit-line-clamp: 1; /* number of lines to show */
      line-clamp: 1;
      -webkit-box-orient: vertical;
      overflow: hidden;
      max-width: 100px;
      text-overflow: ellipsis;
    }

    > input {
      width: 200px;
      height: 20px;
      background: ${(props) => props.theme.black3};
      outline: none;
      border: none;
      font-size: 12px;
      font-weight: 400;
      color: ${(props) => props.theme.black60};
    }
  }
`;

interface Props {
  user?: ProfileModel;
  setSearchUsersModal?: (searchUserModal?: boolean) => void;
  loading?: boolean;
  index?: number;
  followAction?: string;
  onChangeFollowersList?: (users: any) => void;
  onChangeFollowingList?: (users: any) => void;

  setTheUser?: (user: ProfileModel) => void;
  userId?: string;
  fromUserProfile?: boolean;
}

export function UserInfoBox(props: Props): ReactElement {
  const { user } = props;
  const { setHasNewChat, setChat } = useCeramicContext();

  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const handleStartChat = async () => {
    setHasNewChat(true);
    setChatLoading(true);
    createChat(user.id)
      .then((res) => {
        setChatLoading(false);
        setChat(res.data.chat);
        setHasNewChat(true);
        props.setSearchUsersModal(false);
      })
      .catch((err) => {
        console.log(err);
        setChatLoading(false);
      });
  };

  return (
    <Box $marginBottom={"10px"}>
      {props.loading ? (
        <CSkeleton width={40} height={40} borderRadius={"20px"} />
      ) : (
        <Avatar
          src={`https://greenia.infura-ipfs.io/ipfs/${_.get(
            user,
            "avatar",
            ""
          )}`}
          alt={_.get(user, "name", "")}
        />
      )}

      <Link to={"/u/" + user?.id}>
        <div className={"name"}>
          {props.loading ? (
            <>
              <CSkeleton width={100} height={10} borderRadius={"20px"} />
              <CSkeleton width={100} height={10} borderRadius={"20px"} />
            </>
          ) : (
            <>
              <span>{user?.displayName || "New Face"}</span>
            </>
          )}
        </div>
      </Link>

      <div className={"grow"} />

      <div style={{ marginLeft: "5px" }}></div>
      <CSvgButton
        backgroundColor={"navy25"}
        backgroundColorHover={"navy50"}
        customColor={"#fff"}
        icon={
          <span
            className="material-symbols-outlined"
            style={{ marginRight: 4 }}
          >
            add
          </span>
        }
        customSvg={true}
        loading={props.loading || chatLoading}
        disabled={props.loading || chatLoading}
        onClick={handleStartChat}
      />
    </Box>
  );
}
