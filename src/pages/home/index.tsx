import { useAppSelector } from "../../redux/hooks";
import React, { ReactElement, useEffect, useState } from "react";
import { Page } from "../../components/structure";
import { PostBox } from "../../components/post/box";
import { NothingFound } from "../../components/custom";
import { CButton, CTab, CTabs } from "../../components/mui";
import { ProfileBox } from "../../components/profile";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { UsersBox } from "../../components/user";
import { breakpoints } from "../../config/global-styles";
import { PostModel } from "../../models/post.model";
import { findAllPosts } from "../../apis/post.apis";
import { ProfileModel } from "../../models/profile.model";
import { GetAllUsers, SearchAllUsers, searchUsers } from "../../apis/user.api";
import { isDesktop, isMobile, isTablet } from "../../utils/detect-screen";

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  z-index: 20;

  > span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.black80};
  }
`;

const AdvertiseBox = styled.div`
  padding: 16px;
  background: ${(props) => props.theme.navy90};
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;

  > img {
    display: block;
    width: 100%;
    border-radius: 8px;
  }

  > h5 {
    font-size: 22px;
    font-weight: 500;
    color: ${(props) => props.theme.white100};
    text-align: center;
    display: block;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  > p {
    font-size: 14px;
    font-weight: 400;
    color: ${(props) => props.theme.white100};
    text-align: justify;
    display: block;
    margin-bottom: 30px;
    line-height: 28px;
    margin-top: 30px;
  }

  > .mobile {
    display: none;
    @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
      display: flex;
      overflow: hidden;
      width: 100%;
      gap: 16px;
      height: 160px;
    }

    > img {
      display: block;
      width: 142px;
      flex-basis: 40%;
      height: 100%;
      object-fit: cover;
      border-radius: 8px;
    }

    > .column {
      flex-basis: 60%;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      /* margin-left: 10px; */
      /* gap: 0.5rem; */

      > p {
        font-size: 14px;
        font-weight: 400;
        color: ${(props) => props.theme.white100};
        /* text-align: justify; */
        display: block;
        /* margin-bottom: 30px; */
        line-height: 17px;
      }

      > a {
        > .MuiButtonBase-root {
          width: fit-content !important;
        }
      }
    }
  }
`;

export function HomePage(): ReactElement {
  const user = useAppSelector((state) => state.user);

  const [loading, setLoading] = useState<boolean>(true);
  const [usersLoading, setUsersLoading] = useState<boolean>(true);
  const [noMoreData, setNoMoreDate] = useState<boolean>(false);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const [cursor, setCursor] = useState<string>("");
  const [tab, setTab] = useState<"allPosts" | "followingPosts" | "minePosts">(
    "allPosts"
  );
  const [users, setUsers] = useState<Array<ProfileModel>>([]);
  const [posts, setPosts] = useState<Array<PostModel>>([]);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const fetchAllPosts = (_cursor: string, profiles?: any) => {
    setLoading(true);
    setPaginationLoading(true);

    findAllPosts({
      numberPerPage: 5,
      cursor: _cursor,
      search: { profileIDs: profiles ?? "", q: "" },
    })
      .then((result) => {
        if (result) {
          if (result.data.posts.length > 0) {
            setPosts((posts) => [...posts, ...result.data.posts]);
            setCursor(result.data.cursor);
          }
        }

        setLoading(false);
        setPaginationLoading(false);
      })
      .catch(() => {
        setLoading(false);
        setPaginationLoading(false);
      });
  };

  const loadMoreHandler = () => {
    if (tab == "allPosts") {
      fetchAllPosts(cursor);
    } else if (tab == "followingPosts") {
      fetchAllPosts(
        cursor,
        user?.followings?.map((item) => item.targetProfile.id)
      );
    } else if (tab == "minePosts") {
      fetchAllPosts(cursor, [user.id]);
    }
  };

  const handleChangeViewType = (event: any, newValue: any): void => {
    setTab(newValue);
    setPosts([]);
    setNoMoreDate(false);
    if (newValue == "allPosts") {
      setCursor("");
      fetchAllPosts("");
    } else if (newValue == "followingPosts") {
      setCursor("");
      fetchAllPosts(
        "",
        user?.followings?.map((item) => item.targetProfile.id)
      );
    } else if (newValue == "minePosts") {
      fetchAllPosts("", [user.id]);
    }
  };

  const getAllUsers = () => {
    setUsersLoading(true);

    SearchAllUsers({
      q: "",
      cursor: "",
      perPage: 30,
    })
      .then((res) => {
        if (res.data.users) {
          setUsersLoading(false);
          setUsers(res.data.users);
        }
      })
      .catch((err) => {
        setUsersLoading(false);
        console.log(err);
      });
  };

  useEffect(() => {
    if(user.did !== ''){
      getAllUsers();
    }
  }, [user])

  useEffect(() => {
    if (tab == "allPosts") {
      setPosts([]);
      setCursor("");
      fetchAllPosts("");
    }
  }, []);

  return (
    <Page
      title="Personia"
      sidebar={isDesktop() || isTablet() ? <ProfileBox /> : <></>}
      sidebar2={
        isDesktop() ? (
          <>
            {user.did !== "" ? (
              <UsersBox
                background={"navy90"}
                users={users}
                loading={usersLoading}
                setLoading={(loading) => {
                  //setUsersLoading(loading);
                }}
                title={"People You May Know"}
              />
            ) : null}
            <AdvertiseBox>
              <img src={require("../../assets/images/create-article.png")} />
              <p>
                By sharing you content on allostasis ecosystem, You can monetize
                your assets and make money from them. Just start sharing your
                interesting content and let the ecosystem make money for you!
              </p>
              <Link to={"/posts/new"}>
                <CButton
                  fullWidth
                  background={"transparent"}
                  color={"green100"}
                  variant={"outlined"}
                  hoverColor={"navy100"}
                  backgroundHover={"green10"}
                >
                  Create Post
                </CButton>
              </Link>
            </AdvertiseBox>
            <AdvertiseBox>
              <img src={require("../../assets/images/wallet.png")} />
              <h5>Allostasis!</h5>
              <p>
                Unlock the world of NFTs and embrace a universe of creativity,
                uniqueness, and meaningful assets. Your journey to collectibles,
                art, and more begins here. Click now to explore, own, and make a
                difference!
              </p>
              <a href={"https://centeria.io"} target={"_blank"}>
                <CButton
                  fullWidth
                  background={"transparent"}
                  color={"green100"}
                  variant={"outlined"}
                  hoverColor={"navy100"}
                  backgroundHover={"green10"}
                >
                  Visit Centeria
                </CButton>
              </a>
            </AdvertiseBox>
            <div style={{ marginTop: "60px" }}></div>
          </>
        ) : (
          <></>
        )
      }
    >
      {isMobile() && user.did !== "" && (
        <AdvertiseBox>
          <div className={"mobile"}>
            <img src={require("../../assets/images/create-article.png")} />
            <div className={"column"}>
              <p>
                sum dolor sit amet, consectetur trud exercitation ullamco
                laboris nisi ut aliquip ex ea commodo con Duis aute irure do
              </p>
              <Link to={"/articles/new"}>
                <CButton
                  fullWidth
                  background={"transparent"}
                  color={"green100"}
                  variant={"outlined"}
                  hoverColor={"navy100"}
                  backgroundHover={"green10"}
                >
                  Create article
                </CButton>
              </Link>
            </div>
          </div>
        </AdvertiseBox>
      )}

      {user && user.did === "" ? null : (
        <TabBox>
          <CTabs
            value={tab}
            onChange={handleChangeViewType}
            key={1}
            $background={"navy60"}
            $activeBG={"navy60"}
          >
            <CTab
              label={"All"}
              id={"view-tab-all-posts"}
              aria-controls={"view-tabpanel-all-posts"}
              value={"allPosts"}
              disableTouchRipple
              $fullWidth
            />
            <CTab
              label={"Following's"}
              id={"view-tab-following-posts"}
              aria-controls={"view-tabpanel-following-post"}
              value={"followingPosts"}
              disableTouchRipple
              $fullWidth
            />
            <CTab
              label={"Mine"}
              id={"view-tab-mine-posts"}
              aria-controls={"view-tabpanel-mine-posts"}
              value={"minePosts"}
              disableTouchRipple
              $fullWidth
            />
          </CTabs>
        </TabBox>
      )}

      {loading ? (
        [1, 2, 3, 4].map((i) => <PostBox loading={loading} key={i} type={2} />)
      ) : posts.length === 0 ? (
        <NothingFound
          icon="hourglass_disabled"
          title="No Posts Found"
          padding={"30px"}
        />
      ) : (
        <div>
          {[...posts]
            .sort(
              (x: any, y: any) =>
                new Date(y.createdAt).getTime() -
                new Date(x.createdAt).getTime()
            )
            .map((post, i) => {
              return <PostBox loading={loading} post={post} key={i} type={2} />;
            })}
          {!noMoreData ? (
            <CButton
              fullWidth
              background={"navy80"}
              color={"white100"}
              backgroundHover={"navy100"}
              loading={paginationLoading}
              onClick={loadMoreHandler}
            >
              Load More
            </CButton>
          ) : (
            <CButton
              fullWidth
              background={"black5"}
              color={"black80"}
              backgroundHover={"black3"}
              disabled
            >
              No More Posts
            </CButton>
          )}
        </div>
      )}
    </Page>
  );
}
