import { ReactElement, ReactNode, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { ReactComponent as Logo } from "../../assets/svg/logtypo-02.svg";
import { ReactComponent as Menu } from "../../assets/svg/menu.svg";
import { ReactComponent as Close } from "../../assets/svg/close.svg";
import { ReactComponent as Video } from "../../assets/svg/video.svg";

import { ReactComponent as MsgWithNotif } from "../../assets/svg/msg-with-notif.svg";
import { Link, NavLink, useLocation, useNavigate } from "react-router-dom";

import {
  CButton,
  CIconButton,
  CMenu,
  CMenuItem,
  CModal,
  CTextField,
} from "../mui";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { MyInput } from "../custom/input";
import { SearchBox } from "./search";
import { ChatBox } from "../chat";
import { v4 as uuid } from "uuid";
import { encryptionService } from "../../services";
import { breakpoints } from "../../config/global-styles";
import { CSvgButton } from "../mui/SvgButton";
import { LoginButton, LoginWalletConnect } from "../auth";
import { logout as logoutUser } from "../../redux/slices/user";
import { SearchBoxMobile } from "./searchMobile";
import { isTablet, isDesktop, isMobile } from "../../utils/detect-screen";
import { Avatar, Box, IconButton } from "@mui/material";
import _ from "lodash";
import { ROUTES } from "../../routes/route-path";
import path from "path";

const PageStyle = styled.section<{ height: string; mobileMenuOpacity: string }>`
  > nav.menu {
    width: 100%;
    margin: 0 auto;
    height: 60px;
    background: ${(props) => props.theme.navy100};
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.1);

    > .wrapper {
      max-width: 1440px;
      width: 95%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      height: 100%;

      > .icon {
        > svg {
          width: 150px;
        }
      }

      > .links {
        ul {
          display: flex;
          flex-wrap: wrap;

          li {
            list-style: none;
            margin-right: 32px;

            a {
              color: ${(props) => props.theme.white100};
              text-decoration: none;
            }

            &.active {
              a {
                color: ${(props) => props.theme.green100};
                border-bottom: 2px solid ${(props) => props.theme.green100};
              }
            }

            &.disabled {
              a {
                color: ${(props) => props.theme.black50};
              }
            }
          }
        }
      }

      > .items {
        display: grid;
        grid-template-columns: repeat(5, auto);
        gap: 15px;

        > .icon {
          > svg {
            width: 150px;
          }
        }

        > a {
          font-size: 16px;
          font-weight: 500;
          color: ${(props) => props.theme.black80};
          text-decoration: none;
          display: flex;
          flex-direction: row;
          align-items: center;

          &:hover {
            color: ${(props) => props.theme.blue100};
          }
        }

        .balance {
          border: 1px solid ${(props) => props.theme.green100};
          display: flex;
          padding: 8px;
          border-radius: 8px;
          color: ${(props) => props.theme.green100};
        }
      }
    }
  }

  > nav.menu-mobile {
    width: 100%;
    margin: 0 auto;
    background: ${(props) => props.theme.navy100};
    position: sticky;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    box-shadow: 0 1px 2px 0 rgba(255, 255, 255, 0.1);
    height: 120px;

    > .wrapper {
      max-width: 1440px;
      width: 95%;
      margin: 0 auto;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      gap: 10px;
      height: 55px;

      .avatar-box {
        display: flex;
        align-items: center;
        gap: 0.5rem;
        text-transform: capitalize;
      }

      > .icon {
        width: 120px;
        margin-left: -10px;

        > svg {
          width: 150px;
          height: 40px;
        }
      }

      > .mobile-search-box {
        color: #fff;
        width: 100%;
      }

      .items {
        display: flex;
        align-items: center;
        gap: 0.2rem;
        text-transform: capitalize;
      }
    }
  }

  > .top-content {
    width: ${isDesktop ? "95%" : "100%"};
    max-width: 1440px;
    margin: ${isDesktop ? "15px auto" : "auto"};
  }

  > .content {
    display: grid;
    grid-template-columns: 1fr;
    max-width: 1440px;
    margin: ${isDesktop ? "15px auto" : "auto"};
    width: ${isDesktop ? "95%" : "97%"};
    gap: ${isDesktop ? "15px" : "0"};
    height: ${isDesktop ? ({ height }) => height : "100%"};
    overflow: auto;
    z-index: 10;

    & > ::-webkit-scrollbar {
      background: ${(props) => props.theme.gray70};
      width: 1px;
      margin-left: 10px;
      display: none !important;
    }

    &.with-sidebar {
      grid-template-columns: ${isDesktop()
        ? `350px 1fr 350px`
        : isTablet()
        ? `300px 1fr`
        : `1fr`};
      height: ${isDesktop() ? ({ height }) => height : "100%"};
      padding: ${isDesktop() ? "0" : "15px"};
      overflow: auto;
      flex-direction: ${isMobile() ? "column" : ""};
      display: ${isMobile() ? "flex" : "grid"};

      &.with-sidebar-2 {
        grid-template-columns: ${isDesktop()
          ? `350px 1fr 350px`
          : isTablet()
          ? `300px 1fr`
          : `1fr`};
        height: ${isDesktop() ? ({ height }) => height : "100%"};
        padding: ${isDesktop() ? "0" : "15px"};
        overflow: auto;
        flex-direction: ${isMobile() ? "column" : ""};
        display: ${isMobile() ? "flex" : "grid"};
      }
    }

    > .sidebar {
      overflow: auto;

      @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
        width: 100%;
      }

      @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
        width: fit-content;
      }

      .back {
        margin-left: 75%;
        margin-bottom: 30px;
        border-bottom: 1px solid ${(props) => props.theme.white100};

        @media only screen and (max-width: ${breakpoints.tablet}) {
          margin-left: 0;
          margin-bottom: 0;
          display: flex;
          align-items: center;
          justify-content: flex-start;
        }
      }
    }

    > .sidebar-2 {
      height: ${({ height }) => height};
      overflow: auto;
    }

    > .main {
      height: ${({ height }) => height};
      overflow: auto;
    }
  }

  > .footer {
    height: 60px;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-around;
    background: ${(props) => props.theme.black80};

    > p {
      font-size: 14px;
      font-weight: 400;
      color: ${(props) => props.theme.white100};
      text-align: center;
      margin: 0;
    }
  }

  > .overlay {
    width: 100%;
    height: 100vh;
    position: fixed;
    background: rgba(0, 0, 0, 0.4);
    top: 0;
    opacity: ${({ mobileMenuOpacity }) => mobileMenuOpacity};
    -webkit-transition: all 0.5s;
    transition: all 0.5s;
    z-index: ${({ mobileMenuOpacity }) =>
      mobileMenuOpacity === "1" ? 1000 : -1999};
  }
`;

const MenuSidebar = styled.div<{ width: string }>`
  width: 300px;
  height: 100vh;
  position: fixed;
  left: ${({ width }) => width}px;
  top: 0;
  z-index: 1000;
  background: ${({ theme }) => theme.navy90};
  border-bottom-left-radius: 16px;
  border-top-left-radius: 16px;
  -webkit-transition: all 0.5s;
  transition: all 0.5s;
  padding: 15px;

  > .icon {
    width: 120px;

    > svg {
      width: 150px;
      height: 40px;
    }
  }

  > .links {
    ul {
      display: flex;
      flex-direction: column;
      flex-wrap: wrap;
      gap: 15px;
      margin-top: 30px;
      margin-left: 30px;

      li {
        list-style: none;
        margin-right: 32px;

        a {
          color: ${(props) => props.theme.white100};
          text-decoration: none;
        }

        &.active {
          a {
            color: ${(props) => props.theme.green100};
            border-bottom: 2px solid ${(props) => props.theme.green100};
          }
        }

        &.disabled {
          a {
            color: ${(props) => props.theme.black50};
          }
        }

        &.logout {
          background: ${(props) => props.theme.label1};
          border-radius: 10px;
          padding: 10px 24px;
          color: ${(props) => props.theme.white100};
          cursor: pointer;
        }
      }
    }
  }
`;

const SelectionSStyle = styled.div`
  display: flex;
  padding: 10px;
  align-items: center;

  > .column {
    align-items: center;
    align-content: center;
    align-self: center;
    margin: 0 auto 0 auto;
    width: 100%;
    flex: 1;
    text-align: center;
    height: 170px;

    > p {
      font-size: 16px;
      font-weight: 500;
      font-family: Inter;
      color: ${(props) => props.theme.black100};
      text-align: center;
      flex: 1;
      padding: 10px;
      vertical-align: top;
    }

    > button {
      vertical-align: bottom;
    }
  }
`;

interface Props {
  title: string;
  sidebar?: ReactNode;
  sidebar2?: ReactNode;
  children: ReactNode;
  topChildren?: ReactNode;
  mainHeight?: string;
}

export function Page(props: Props): ReactElement {
  const { title, sidebar, sidebar2, children, topChildren } = props;
  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const location = useLocation();
  const [menuSidebar, setMenuSidebar] = useState<boolean>(false);

  useEffect(() => {
    document.title = title;
    return () => {
      document.title = "";
    };
  }, [title]);

  const [moreCreateEl, setMoreCreateEl] = useState(null);
  const handleMoreCreate = (event: any): void => {
    event.stopPropagation();
    setMoreCreateEl(event.currentTarget);
  };
  const handleMoreClose = (e: Event): void => {
    e.stopPropagation();
    setMoreCreateEl(null);
  };
  const moreOpen = Boolean(moreCreateEl != null);

  const createNewPost = (): void => {
    setMoreCreateEl(null);
  };

  const createNewArticle = (): void => {
    setMoreCreateEl(null);
  };

  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);

  const handleOpenSearch = () => {
    setIsOpenSearch(!isOpenSearch);
  };

  const [openModal, setOpenModal] = useState(false);

  const [password, setPassword] = useState("");
  const handleSetPassword = (event: any) => {
    setPassword(event.target.value);
  };

  const handleStartPrivateChat = async () => {
    const roomId = uuid();
    const encoded = await encryptionService.encodePassword(roomId, password);

    const params = new URLSearchParams();
    params.set("secret", encoded);

    navigate("/chat/private/" + roomId + "#" + params);
  };

  const [value, setValue] = useState("");
  const handleSetValue = () => {
    setValue("");
  };

  const dispatch = useAppDispatch();
  const handleLogout = () => {
    localStorage.removeItem("token");
    setMenuSidebar(false);
    dispatch(logoutUser());
  };

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setMenuSidebar(false);
        }
      }

      // Bind the event listener
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        // Unbind the event listener on clean up
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [ref]);
  }

  const wrapperRef = useRef(null);
  useOutsideAlerter(wrapperRef);
  const { pathname } = useLocation();

  return (
    <PageStyle
      height={
        props.mainHeight ? props.mainHeight : window.innerHeight - 100 + "px"
      }
      mobileMenuOpacity={menuSidebar ? "1" : "0"}
    >
      {isDesktop() ? (
        <nav className={"menu"}>
          <div className={"wrapper"}>
            <div className={"items"} style={{ alignItems: "center" }}>
              <div className={"icon"} style={{ width: "120px" }}>
                <Link to={"/"}>
                  <Logo />
                </Link>
              </div>

              <MyInput
                placeholder={"Search"}
                label={""}
                value={value}
                onChange={handleSetValue}
                onClick={handleOpenSearch}
                name={"search"}
                icon={"search"}
                background={"gray70"}
                border={"gray60"}
                color={"white100"}
              />
            </div>

            <div className={"links"}>
              <ul>
                <li
                  className={
                    !window.location.href.includes("profile") &&
                    !window.location.href.includes("articles") &&
                    !window.location.href.includes("platforms") &&
                    !window.location.href.includes("startups")
                      ? "active"
                      : ""
                  }
                >
                  <Link to={"/"}>Posts</Link>
                </li>
                <li
                  className={
                    window.location.href.includes("articles") ? "active" : ""
                  }
                >
                  <Link to={"/articles"}>Articles</Link>
                </li>
                <li
                  className={
                    window.location.href.includes("startups")
                      ? "active"
                      : "disabled"
                  }
                >
                  <Link to={"#"}>Startups</Link>
                </li>
                <li
                  className={
                    window.location.href.includes("platforms")
                      ? "active "
                      : "disabled"
                  }
                >
                  <Link to={"#"}>Platforms</Link>
                </li>
              </ul>
            </div>
            <div className={"items"}>
              {user?.did === "" ? (
                <LoginButton
                  color={"green100"}
                  textColor={"black100"}
                  size={"s"}
                />
              ) : (
                <>
                  <>
                    <CButton
                      size={"s"}
                      onClick={handleMoreCreate}
                      background={"navy25"}
                      backgroundHover={"navy25"}
                      color={"white100"}
                      startIcon={"add"}
                    >
                      <span style={{ marginLeft: "5px" }}>Create</span>
                    </CButton>
                    <CMenu
                      open={moreOpen}
                      left={!isDesktop ? "0" : "30"}
                      id="options-menu"
                      anchorEl={moreCreateEl}
                      onClose={handleMoreClose}
                      anchorOriginHorizontal="left"
                      transformOriginHorizontal="left"
                      anchorOriginVertical="bottom"
                      transformOriginVertical="top"
                    >
                      <Link to={"/articles/new"}>
                        <CMenuItem
                          color={"white100"}
                          onClick={createNewArticle}
                        >
                          New Article
                        </CMenuItem>
                      </Link>

                      <Link to={"/posts/new"}>
                        <CMenuItem color={"white100"} onClick={createNewPost}>
                          New Post
                        </CMenuItem>
                      </Link>
                    </CMenu>
                  </>
                  <CButton
                    size={"s"}
                    background={"green100"}
                    variant={"outlined"}
                    backgroundHover={"transparent"}
                    color={"green100"}
                    startIcon={"wallet"}
                  >
                    <span style={{ marginLeft: "5px" }}>0 ALS</span>
                  </CButton>
                </>
              )}

              {user?.did !== "" ? (
                <Link to={"/profile"}>
                  <CIconButton
                    backgroundColorHover={"white100"}
                    backgroundColor={"transparent"}
                    customColor={"white100"}
                    icon={"person"}
                  />
                </Link>
              ) : null}
            </div>

            {isOpenSearch ? (
              <SearchBox setIsOpenSearch={setIsOpenSearch} />
            ) : null}
          </div>
        </nav>
      ) : (
        <nav className={"menu-mobile"}>
          <div className={"wrapper"}>
            <Link to={"/"} className={"icon"}>
              <Logo />
            </Link>

            <CSvgButton
              icon={menuSidebar ? <Close /> : <Menu />}
              onClick={() => setMenuSidebar(!menuSidebar)}
              backgroundColor={"transparent"}
              backgroundColorHover={"transparent"}
            />
          </div>
          <div className={"wrapper"} style={{ padding: "10px" }}>
            <Box
              sx={{
                ".MuiButtonBase-root": {
                  "&:hover": {
                    svg: {
                      path: {
                        stroke: "green100",
                      },
                    },
                  },
                },
              }}
              className="mobile-search-box"
            >
              {user.did === "" ? (
                <SearchBoxMobile isIcon={false} />
              ) : (
                <Box
                  sx={{
                    "a.active-mobile": {
                      svg: {
                        path: {
                          fill: "#30BA97",
                        },
                      },
                    },
                  }}
                  style={{ display: "flex" }}
                >
                  <SearchBoxMobile isIcon={true} />

                  <NavLink
                    className={
                      pathname === ROUTES.PRIVATE_MOBILE_CHAT
                        ? "active-mobile"
                        : ""
                    }
                    to={ROUTES.PRIVATE_MOBILE_CHAT}
                  >
                    <IconButton sx={{ height: "100%" }}>
                      <MsgWithNotif />
                    </IconButton>
                  </NavLink>
                  <NavLink
                    className={
                      pathname === ROUTES.PRIVATE_MOBILE_NEW_ROOM
                        ? "active-mobile"
                        : ""
                    }
                    to={ROUTES.PRIVATE_MOBILE_NEW_ROOM}
                  >
                    <IconButton sx={{ height: "100%" }}>
                      <Video />
                    </IconButton>
                  </NavLink>
                </Box>
              )}
            </Box>
            <div className={"items"}>
              {user.did === "" ? (
                <LoginButton
                  color={"green100"}
                  textColor={"black100"}
                  size={"s"}
                />
              ) : (
                <>
                  <>
                    <CButton
                      size={"s"}
                      onClick={handleMoreCreate}
                      background={"navy25"}
                      backgroundHover={"navy25"}
                      color={"white100"}
                      startIcon={"add"}
                    >
                      <span style={{ marginLeft: "5px" }}>Create</span>
                    </CButton>

                    <CMenu
                      open={moreOpen}
                      left={!isDesktop ? "0" : "30"}
                      id="options-menu"
                      anchorEl={moreCreateEl}
                      onClose={handleMoreClose}
                      anchorOriginHorizontal="left"
                      transformOriginHorizontal="left"
                      anchorOriginVertical="bottom"
                      transformOriginVertical="top"
                    >
                      <Link to={"/articles/new"}>
                        <CMenuItem
                          color={"white100"}
                          onClick={createNewArticle}
                        >
                          New Article
                        </CMenuItem>
                      </Link>

                      <Link to={"/posts/new"}>
                        <CMenuItem color={"white100"} onClick={createNewPost}>
                          New Post
                        </CMenuItem>
                      </Link>
                    </CMenu>
                  </>
                </>
              )}
            </div>
          </div>
        </nav>
      )}

      {topChildren != null ? (
        <div className={"top-content"}>{topChildren}</div>
      ) : null}

      <div
        className={`content ${sidebar != null ? "with-sidebar" : ""} ${
          sidebar2 != null ? "with-sidebar-2" : ""
        }`}
      >
        {sidebar != null ? <div className="sidebar">{sidebar}</div> : null}

        <div className="main">{children}</div>

        {isDesktop() && sidebar2 != null ? (
          <div className="sidebar-2">
            <>
              {sidebar2}
              {user.did !== "" && !location.pathname.includes("chat") ? (
                <ChatBox />
              ) : null}
            </>
          </div>
        ) : null}
      </div>

      <CModal
        open={openModal}
        onClose={() => {
          setOpenModal(false);
        }}
        title="Choose password"
      >
        <SelectionSStyle>
          <div className={"column"}>
            <p>Private video chat</p>

            <div
              style={{
                marginLeft: "20px",
                marginRight: "20px",
                marginBottom: "20px",
              }}
            >
              <CTextField
                label={"Password"}
                value={password}
                onChange={(event: any) => handleSetPassword(event)}
                placeholder={"Set password to chat"}
                background={"navy100"}
              />
            </div>

            <CButton
              background={"navy60"}
              size={"s"}
              backgroundHover={"navy100"}
              onClick={handleStartPrivateChat}
            >
              Generate Room
            </CButton>
          </div>
        </SelectionSStyle>
      </CModal>

      <div className={"overlay"}>
        <MenuSidebar width={menuSidebar ? "0" : "-1000"} ref={wrapperRef}>
          <Link to={"/"} className={"icon"}>
            <Logo />
          </Link>

          <div className={"links"}>
            <ul onClick={() => setMenuSidebar(!menuSidebar)}>
              <li
                className={
                  !window.location.href.includes("articles") &&
                  !window.location.href.includes("profile") &&
                  !window.location.href.includes("platforms") &&
                  !window.location.href.includes("startups")
                    ? "active"
                    : ""
                }
              >
                <Link to={"/"}>Posts</Link>
              </li>
              <li
                className={
                  window.location.href.includes("articles") ? "active" : ""
                }
              >
                <Link to={"/articles"}>Articles</Link>
              </li>
              <li
                className={
                  window.location.href.includes("startups")
                    ? "active"
                    : "disabled"
                }
              >
                <Link to={"#"}>Startups</Link>
              </li>
              <li
                className={
                  window.location.href.includes("platforms")
                    ? "active"
                    : "disabled"
                }
              >
                <Link to={"#"}>Platforms</Link>
              </li>

              {user.did && (
                <>
                  <li
                    className={
                      window.location.href.includes("profile") ? "active" : ""
                    }
                  >
                    <Link to={"/profile"}>Profile</Link>
                  </li>
                  <li className={"logout"} onClick={handleLogout}>
                    Logout
                  </li>
                </>
              )}
            </ul>
          </div>
        </MenuSidebar>
      </div>
    </PageStyle>
  );
}
