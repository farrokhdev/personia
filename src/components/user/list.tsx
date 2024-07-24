import React, { ReactElement, useEffect, useState } from "react";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import _ from "lodash";
import { CMenu, CMenuItem, CSkeleton } from "../mui";
import { useCeramicContext } from "../../contexts";
import { set } from "../../redux/slices/user";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Link, useNavigate } from "react-router-dom";
import { CSvgButton } from "../mui/SvgButton";
import { ReactComponent as Message } from "../../assets/svg/messages.svg";
import { ReactComponent as UserTick } from "../../assets/svg/profile-tick.svg";
import { ReactComponent as UserAdd } from "../../assets/svg/profile-add.svg";
import { v4 as uuid } from "uuid";
import { ProfileModel } from "../../models/profile.model";
import {
  CheckUserFollow,
  FollowUnfollow,
  GetSingleUser,
} from "../../apis/user.api";
import { createChat } from "../../apis/chat.apis";

const Box = styled.div<{ $marginBottom: string }>`
  background: ${(props) => props.theme.gray70};
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
  loading?: boolean;
  index?: number;
  followAction?: string;
  onChangeFollowersList?: (users: any) => void;
  onChangeFollowingList?: (users: any) => void;
  setLoading?: (loading: boolean) => void;
  setTheUser?: (user: ProfileModel) => void;
  userId?: string;
  fromUserProfile?: boolean;
}

export function UserInfoBox(props: Props): ReactElement {
  const { user } = props;
  const { setHasNewChat, setChat } = useCeramicContext();
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(
    user ? user.isFollowed : false
  );
  const me = useAppSelector(state=>state.user)
  const [chatLoading, setChatLoading] = useState<boolean>(false);

  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user) {
      setIsFollowingLoading(true);
      CheckUserFollow(props.userId, user.id).then((result) => {
        setIsFollowing(result.data.followed);
        setIsFollowingLoading(false);
      });
    }
  }, [user]);

  const follow = () => {
    setIsFollowingLoading(true);

    if (props.setLoading) {
      props.setLoading(true);
    }
    FollowUnfollow(user.id)
      .then((res2) => {
        setIsFollowing(res2.data.follow);

        GetSingleUser(user.id, props.userId, true).then((result) => {
          if (me.id === props.userId) {
            dispatch(set(result.data.user));
            if (props.setTheUser) props.setTheUser(result.data.user);
          }

          if (props.onChangeFollowingList)
            props.onChangeFollowingList(result.data.user.followings);
          if (props.onChangeFollowersList)
            props.onChangeFollowersList(result.data.user.followers);

          if (props.setLoading) {
            props.setLoading(false);
          }

          setIsFollowingLoading(false);
        });
      })
      .catch((e) => {
        setIsFollowingLoading(false);
        if (props.setLoading) {
          props.setLoading(false);
        }
      });
  };


  const handleStartChat = async () => {
    setHasNewChat(true);
    setChatLoading(true);
    createChat(user.id)
      .then(res => {
        setHasNewChat(true)
        setChat(res.data.chat)
        setChatLoading(false)
      })
      .catch(err => {
        console.log(err)
        setChatLoading(false)
      })
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
              <span>{_.get(user, "did", "")}</span>
            </>
          )}
        </div>
      </Link>

      <div className={"grow"} />

      <CSvgButton
        loading={isFollowingLoading}
        disabled={isFollowingLoading}
        loadingColor={isFollowing ? "green100" : "white100"}
        backgroundColor={isFollowing ? "gray70" : "navy25"}
        backgroundColorHover={isFollowing ? "gray70" : "navy25"}
        icon={!isFollowing ? <UserAdd /> : <UserTick />}
        onClick={follow}
      />
      {props.user && props.user.id !== me.id &&(
        <>
          <div style={{ marginLeft: "5px" }}></div>
          <CSvgButton
            backgroundColor={"gray80"}
            backgroundColorHover={"gray80"}
            customColor={"white100"}
            icon={<Message />}
            customSvg={true}
            loading={props.loading || chatLoading}
            disabled={props.loading || chatLoading}
            onClick={handleStartChat}
          />
        </>
      )}

    </Box>
  );
}
