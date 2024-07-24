import styled from "styled-components";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { logout as logoutUser, set } from "../../redux/slices/user";
import { ReactElement, useEffect, useState } from "react";
import { Avatar } from "@mui/material";
import { CButton, CIconButton, CMenu, CMenuItem, CModal } from "../mui";
import { Link } from "react-router-dom";
import { useGlobalContext } from "../../contexts";
import _ from "lodash";
import { LoginButton, LoginWalletConnect } from "../auth";
import { breakpoints } from "../../config/global-styles";
import { isDesktop } from "../../utils/detect-screen";

const ProfileBoxStyle = styled.div`
  margin: 0 auto;
  background: ${(props) => props.theme.navy90};
  border-radius: 8px;

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

    > .edit {
      position: absolute;
      top: 0;
      left: 0;
      bottom: 0;
      z-index: 5;
    }
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
    line-height: 28px;
    margin-top: 15px;
    padding-left: 10px;
    padding-right: 10px;
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
        font-size: 18px;
        color: ${(props) => props.theme.white100};
        text-align: center;
        border: 1px solid ${(props) => props.theme.gray60};
        border-radius: 8px;
        width: 30%;
        padding: 5px;
        margin: 0 auto 10px auto;
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

  > .did-box {
    margin: 0 30px 15px 30px;
    background: ${(props) => props.theme.gray80};
    padding: 10px 30px 10px 30px;
    border-radius: 8px;
    display: flex;
    text-align: center;
    align-items: center;
    cursor: pointer;

    @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
      margin-left: 10px;
      margin-right: 10px;
    }

    > input {
      width: 100%;
      display: block;
      height: 40px;
      font-family: Inter;
      font-size: 14px;
      font-weight: 400;
      color: ${(props) => props.theme.white100};
      border: none;
      background: transparent;
      padding: 0 15px;
      cursor: pointer;
    }

    > .did {
      color: ${(props) => props.theme.white100};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      width: 200px;
      cursor: pointer;
    }

    > .material-symbols-outlined {
      color: ${(props) => props.theme.white100};
      background: transparent;
      cursor: pointer;
    }
  }

  > .actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
    margin-bottom: 15px;
    margin-left: 30px;
    margin-right: 30px;

    @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
      margin-left: 10px;
      margin-right: 10px;
    }
  }

  > .actions2 {
    display: grid;
    grid-template-columns: 1fr;
    gap: 15px;
    margin-bottom: 15px;
    margin-left: 30px;
    margin-right: 30px;
  }
`;

const ProfileEditBoxStyle = styled.div`
  margin: 0 auto;
  padding: 15px;
  background: ${(props) => props.theme.navy90};
  border-radius: 8px;

  > img {
    display: block;
    width: 100%;
    border-radius: 8px;
  }

  > .avatar {
    margin: -40px auto 15px auto;
  }

  > .title {
    font-size: 16px;
    font-weight: 500;
    color: ${(props) => props.theme.black80};
    margin: 0 auto 15px auto;
    text-align: center;
  }

  > .desc {
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.white100};
    margin: 0 auto 30px auto;
    text-align: left;
    line-height: 28px;
    margin-top: 15px;
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
        font-size: 22px;
        color: ${(props) => props.theme.black80};
        text-align: center;
        margin-bottom: 5px;
      }

      > span {
        display: block;
        font-weight: 300;
        font-size: 14px;
        color: ${(props) => props.theme.black50};
        text-align: center;
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
  }
`;

export function ProfileBox(): ReactElement {
  const user = useAppSelector((state) => state.user);
  const { makeAlert } = useGlobalContext();
  const dispatch = useAppDispatch();
  const [logoutLoading, setLogoutLoading] = useState<boolean>(false);
  const userName = _.get(user, "displayName", "");

  const handleCopyDID = () => {
    navigator.clipboard.writeText(user?.did ?? "");
    makeAlert("success", "Copied");
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

    navigator.clipboard.writeText(window.location.href + "u/" + user?.id);
    makeAlert("success", "Copied");

    setMoreAnchorEl(null);
  };

  const reportBug = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);
  };

  const logout = async () => {
    setLogoutLoading(true);
    dispatch(logoutUser());
    localStorage.removeItem("token");
  };

  return (
    <>
      <ProfileBoxStyle>
        <div className={"header"}>
          <img
            src={
              user.did !== "" && user.cover != null && user.cover !== ""
                ? `https://greenia.infura-ipfs.io/ipfs/${user.cover}`
                : require("../../assets/images/wallpaper.png")
            }
          />
          {user.did !== "" ? (
            <>
              <Avatar
                className={"avatar"}
                alt={_.get(user, "name", "")}
                sx={{ width: 80, height: 80 }}
                src={`https://greenia.infura-ipfs.io/ipfs/${user.avatar}`}
              />

              <div className={"more"}>
                <CIconButton
                  backgroundColor={"transparent"}
                  backgroundColorHover={"transparent"}
                  customColor={"white100"}
                  icon="more_horiz"
                  onClick={handleMoreClick}
                />
                <CMenu
                  open={moreOpen}
                  left={"100"}
                  id="options-menu"
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
                      reportBug(e);
                    }}
                  >
                    Report a bug
                  </CMenuItem>
                </CMenu>
              </div>
              <div className={"edit"}>
                <Link to={"/profile"}>
                  <CIconButton
                    backgroundColor={"transparent"}
                    backgroundColorHover={"transparent"}
                    customColor={"white100"}
                    icon="edit_square"
                  />
                </Link>
              </div>
            </>
          ) : null}
        </div>

        {user.id !== "" ? (
          <>
            <p className={"title"}>{userName == "" ? "New Face" : userName}</p>
            <p className={"desc"}>{decodeURIComponent(user.bio ?? "No Bio")}</p>

            <div className={"stats"}>
              <p>
                <strong>{_.get(user, "followersCount", 0)}</strong>
                <span>Followers</span>
              </p>
              <p>
                <strong>{_.get(user, "followingsCount", 0)}</strong>
                <span>Followings</span>
              </p>
            </div>

            <div className={"did-box"} onClick={handleCopyDID}>
              <span className="material-symbols-outlined">key</span>
              <span className={"did"}>Copy DID</span>
              <input readOnly value={"(" + user.did + ")"} />
            </div>

            {isDesktop() && (
              <div className={"did-box"}>
                <span className="material-symbols-outlined">wallet</span>
                <span className={"did"}>Wallet</span>
                <input readOnly value={"(" + user.wallet + ")"} />
              </div>
            )}

            <div className={"actions"}>
              <CButton
                fullWidth
                onClick={logout}
                background={"red40"}
                backgroundHover={"red40"}
                color={"red100"}
                startIcon={"logout"}
              >
                <span style={{ marginLeft: "10px" }}>Logout</span>
              </CButton>

              <Link to={"/u/" + user.id}>
                <CButton
                  fullWidth
                  background={"gray80"}
                  backgroundHover={"gray80"}
                  color={"white100"}
                  startIcon={"visibility"}
                >
                  <span style={{ marginLeft: "10px" }}>View as</span>
                </CButton>
              </Link>

              <br />
            </div>
          </>
        ) : (
          isDesktop() && (
            <>
              <p className={"desc"}>
                Welcome to our decentralized social network! 🎉 We're thrilled
                to have you here! 🤗 This is a community of individuals who
                value privacy, freedom of speech, and building connections.
                Here, you're not
              </p>
              <LoginButton
                color={"navy25"}
                textColor={"white100"}
                size={"m"}
              />
            </>
          )
        )}
      </ProfileBoxStyle>

      {user.id !== "" && isDesktop() ? (
        <>
          <div style={{ marginTop: "20px" }}></div>
          <ProfileEditBoxStyle>
            <img src={require("../../assets/images/profile.png")} />

            <>
              <p className={"desc"}>
                Welcome to our decentralized social network! 🎉 We're thrilled
                to have you here! 🤗 This is a community of individuals who
                value privacy, freedom of speech, and building connections.
                Here, you're not
              </p>
              <Link to={"/profile"}>
                <CButton
                  fullWidth
                  loading={false}
                  disabled={false}
                  background={"navy25"}
                  backgroundHover={"navy25"}
                  startIcon={"edit_square"}
                >
                  <p style={{ marginLeft: "10px" }}>Update Profile</p>
                </CButton>
              </Link>
            </>
          </ProfileEditBoxStyle>
        </>
      ) : null}
    </>
  );
}
