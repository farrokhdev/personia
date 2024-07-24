import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import React, { ReactElement, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { CButton, CIconButton, CMenu, CMenuItem, CSkeleton } from "../mui";
import { useGlobalContext, useCeramicContext } from "../../contexts";
import { set } from "../../redux/slices/user";
import { ProfileModel } from "../../models/profile.model";
import { CheckUserFollow, FollowUnfollow } from "../../apis/user.api";
import { createChat } from "../../apis/chat.apis";

const ProfileBoxStyle = styled.div`
  background: ${(props) => props.theme.navy90};
  border-radius: 8px;
  border: 0.5px solid ${(props) => props.theme.white30};
  margin-top: 10px;

  > .header {
    position: relative;

    > img {
      display: block;
      width: 100%;
      height: 100px;
      border-top-right-radius: 8px;
      border-top-left-radius: 8px;
    }

    > .avatar {
      top: 0;
      margin: -40px auto 15px auto;
    }

    > .more {
      position: absolute;
      top: 0;
      right: 0;
      bottom: 0;
      z-index: 5;
    }
  }

  > .title-link {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.white100};
    margin: 0 auto 30px auto;
    text-align: center;
    text-decoration: none;
    line-height: 30px;
  }

  > .title {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.white100};
    margin: 0 auto 15px auto;
    text-align: center;
  }

  > .desc {
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.white80};
    margin: 0 auto 30px auto;
    text-align: center;
    padding-right: 19px;
    padding-left: 10px;
    line-height: 22px;
    white-space: pre-line;
  }

  > .stats {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 30px;

    > p {
      flex-grow: 1;
      flex-basis: 0;

      > strong {
        display: block;
        font-weight: 500;
        font-size: 20px;
        color: ${(props) => props.theme.white100};
        border: 1px solid ${(props) => props.theme.gray60};
        border-radius: 8px;
        text-align: center;
        padding: 5px;
        width: 30%;
        margin: 0 auto 5px auto;
      }

      > span {
        display: block;
        font-weight: 300;
        font-size: 14px;
        color: ${(props) => props.theme.white100};
        text-align: center;
      }
    }
  }

  > .experiences {
    margin-bottom: 15px;

    > .experience {
      margin-bottom: 15px;

      > h5 {
        font-size: 16px;
        font-weight: 500;
        color: ${(props) => props.theme.white100};
        margin-bottom: 5px;
      }

      > p {
        font-size: 14px;
        font-weight: 400;
        color: ${(props) => props.theme.black60};
      }

      &:last-child {
        margin-bottom: 0;
      }
    }
  }

  > .did-box {
    margin: 0 auto 15px auto;

    > input {
      width: 100%;
      display: block;
      height: 40px;
      border: 1px solid ${(props) => props.theme.black12};
      border-radius: 8px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      color: ${(props) => props.theme.black80};
      padding: 0 15px;
    }
  }

  > .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
    padding: 16px 32px 24px 32px;
  }
`;

interface Props {
  profile: ProfileModel;
}

export function UserBox(props: Props): ReactElement {
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { makeAlert } = useGlobalContext();
  const { setHasNewChat, setChat } = useCeramicContext();
  const { profile } = props;
  const [isChatLoading, setIsChatLoading] = useState<boolean>(false);

  const [loading] = useState<boolean>(false);
  const [isFollowingLoading, setIsFollowingLoading] = useState<boolean>(false);
  const [isFollowing, setIsFollowing] = useState<boolean>(false);
  const [realTimeFollowerCount, setRealTimeFollowerCount] = useState<number>(0);

  useEffect(() => {
    if (profile?.id != "" && profile?.id != undefined) {
      setRealTimeFollowerCount(profile.followersCount ?? 0);

      CheckUserFollow(user.id, profile.id).then((result) => {
        setIsFollowing(result.data.followed);
      });
    }
  }, [profile]);

  const follow = () => {
    setIsFollowingLoading(true);
    FollowUnfollow(profile.id)
      .then((res2) => {
        setIsFollowing(res2.data.follow);
        setIsFollowingLoading(false);
        if (res2.data.follow) {
          setRealTimeFollowerCount(realTimeFollowerCount + 1);

          dispatch(
            set({ ...user, followingsCount: (user.followingsCount ?? 0) + 1 })
          );
        } else {
          setRealTimeFollowerCount(realTimeFollowerCount - 1);

          dispatch(
            set({ ...user, followingsCount: (user.followingsCount ?? 0) - 1 })
          );
        }
      })
      .catch((e) => {
        setIsFollowingLoading(false);
      });
  };

  const sendMessage = async () => {
    setIsChatLoading(true);
    createChat(props.profile.id)
      .then((res) => {
        setHasNewChat(true)
        setChat(res.data.chat)
        setIsChatLoading(false);
      })
      .catch(() => {
        setIsChatLoading(false);
      });
  };

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreClick = (event: any): void => {
    event.stopPropagation();
    setMoreAnchorEl(event.currentTarget);
  };
  const handleMoreClose = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);
  };
  const moreOpen = Boolean(moreAnchorEl != null);

  const copyUrl = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);

    navigator.clipboard.writeText(window.location.href + "u/" + user?.id);
    makeAlert("success", "Copied");
  };

  const reportUser = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);
  };

  const blockUser = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);
  };

  return (
    <ProfileBoxStyle>
      {loading ? (
        <CSkeleton width={"100%"} height={100} borderRadius={"8px"} />
      ) : (
        <div className={"header"}>
          <img
            src={
              profile?.cover != null && profile?.cover !== ""
                ? `https://greenia.infura-ipfs.io/ipfs/${profile?.cover}`
                : require("../../assets/images/wallpaper.png")
            }
          />

          <Avatar
            className={"avatar"}
            sx={{ width: 80, height: 80 }}
            alt={profile?.displayName ?? profile?.id ?? ""}
            src={`https://greenia.infura-ipfs.io/ipfs/${profile?.avatar}`}
          />

          <div className={"more"}>
            <CIconButton
              onClick={handleMoreClick}
              backgroundColor={"transparent"}
              backgroundColorHover={"transparent"}
              customColor={"white100"}
              icon="more_horiz"
            />
            <CMenu
              open={moreOpen}
              id="options-menu"
              left={"80"}
              anchorEl={moreAnchorEl}
              onClose={handleMoreClose}
              anchorOriginHorizontal="left"
              transformOriginHorizontal="left"
              anchorOriginVertical="bottom"
              transformOriginVertical="top"
            >
              <CMenuItem
                color={"white100"}
                onClick={(e) => {
                  copyUrl(e);
                }}
              >
                Copy link
              </CMenuItem>
              <CMenuItem
                color={"red100"}
                onClick={(e) => {
                  blockUser(e);
                }}
              >
                Block
              </CMenuItem>
              <CMenuItem
                color={"red100"}
                onClick={(e) => {
                  reportUser(e);
                }}
              >
                Report
              </CMenuItem>
            </CMenu>
          </div>
        </div>
      )}

      {loading ? (
        <>
          <CSkeleton
            width={200}
            height={15}
            marginBottom={"15px"}
            marginLeft={"auto"}
            marginRight={"auto"}
          />
          <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
          <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
          <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
          <CSkeleton
            width={200}
            height={10}
            marginBottom={"15px"}
            marginLeft={"auto"}
            marginRight={"auto"}
          />
        </>
      ) : (
        <>
          <p className={"title"}>{profile?.displayName || "New Face"}</p>
          <p className={"desc"}>
            {decodeURIComponent(profile?.bio ?? "No Bio")}
          </p>
        </>
      )}

      <div className={"stats"}>
        <p>
          <strong>{realTimeFollowerCount}</strong>
          <span>Followers</span>
        </p>
        <p>
          <strong>{profile?.followingsCount ?? 0}</strong>
          <span>Followings</span>
        </p>
      </div>

      {profile?.id !== user.id && user.did !== "" ? (
        <div className={"actions"}>
          <CButton
            fullWidth
            background={"navy50"}
            backgroundHover={"navy50"}
            backgroundDisabled={"navy50"}
            color={"white100"}
            loading={isFollowingLoading}
            disabled={isFollowingLoading || profile?.id === user.id}
            onClick={follow}
            startIcon={"person_add"}
          >
            <span style={{ marginLeft: "5px" }}>
              {isFollowing ? "UnFollow" : "Follow"}
            </span>
          </CButton>

          <CButton
            fullWidth
            background={"gray80"}
            backgroundHover={"gray80"}
            backgroundDisabled={"gray80"}
            color={"white100"}
            disabled={profile?.did === user.did || isChatLoading}
            onClick={sendMessage}
            loading={isChatLoading}
            startIcon={"chat"}
          >
            <span style={{ marginLeft: "5px" }}>Message</span>
          </CButton>
        </div>
      ) : null}
    </ProfileBoxStyle>
  );
}
