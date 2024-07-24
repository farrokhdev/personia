import styled from "styled-components";
import { useParams } from "react-router-dom";
import React, { ReactElement, useEffect, useState } from "react";
import { PostBox } from "../../components/post/box";
import { Page } from "../../components/structure";
import { FollowersBox, UserBox, WalletBox } from "../../components/user";
import { NothingFound } from "../../components/custom";
import { CButton, CSkeleton, CTab, CTabs } from "../../components/mui";
import { useAppSelector } from "../../redux/hooks";
import { EducationBox, ExperienceBox } from "../../components/user";
import { ArticleBox } from "../../components/article/box";
import { PostModel } from "../../models/post.model";
import { findAllPosts } from "../../apis/post.apis";
import { findAllArticles } from "../../apis/article.apis";
import { ArticleModel } from "../../models/article.model";
import { GetSingleUser } from "../../apis/user.api";
import { ProfileModel } from "../../models/profile.model";

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
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

const About = styled.div`
  background: ${(props) => props.theme.navy80};
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  display: block;
  text-decoration: none;

  > p {
    color: ${(props) => props.theme.white100};
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 22px;
    margin-top: 10px;
  }

  > .skills {
    display: inline-flex;

    > p {
      color: ${(props) => props.theme.white100};
      font-family: Inter;
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 22px;
      margin-top: 10px;
      margin-right: 10px;
    }
  }
`;

export function UserProfilePage(): ReactElement {
  const { did } = useParams();

  const [loading, setLoading] = useState<boolean>(true);
  const [theUser, setTheUser] = useState<ProfileModel>();
  const [viewType, setViewType] = useState<
    "about" | "posts" | "platforms" | "articles"
  >("about");
  const user = useAppSelector((state) => state.user);
  const [posts, setPosts] = useState<Array<PostModel>>([]);
  const [articles, setArticles] = useState<Array<ArticleModel>>([]);
  const [cursor, setCursor] = useState<string>("");
  const [cursorArticle, setCursorArticle] = useState<string>("");

  const handleChangeViewType = (event: any, newValue: any): void => {
    setViewType(newValue);
    if (newValue === "posts") {
      setLoading(true);

      getPosts();
    } else if (newValue === "articles") {
      getAllArticles()
    }
  };

  const getAllArticles = () =>{
    setLoading(true);
    findAllArticles({
      numberPerPage: 5,
      cursor: "",
      search: {
        q: "",
        profileIDs: [did],
      },
    })
      .then(async (res) => {
        setLoading(false);
        setArticles(res.data.articles);
        setCursorArticle(res.data.cursor);
      })
      .catch((err) => {
        setLoading(false);
      });
  }

  const getAllContents = async () => {
    if (viewType === "posts") {
      await getPosts();
    }
    if (viewType === "articles") {
      getAllArticles()
    }

    await GetSingleUser(user?.id ?? "", did)
      .then((res) => {
        setTheUser(res.data.user);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getAllContents();
  }, [did]);

  const getPosts = () => {
    findAllPosts({
      numberPerPage: 5,
      cursor: cursor,
      search: {
        profileIDs: [did],
        q: "",
      },
    })
      .then(async (res) => {
        setLoading(false);
        if (res) {
          if (res.data.posts.length > 0) {
            setPosts((posts) => [...posts, ...res.data.posts]);
            setCursor(res.data.cursor);
          }
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const loadMoreHandler = () => {
    setLoading(true);
    if (viewType === "posts") {
      getPosts();
    }
    if (viewType === "articles") {
      getAllArticles()
    }
  };

  return (
    <Page
      title={"User Profile"}
      sidebar={
        <>
          <UserBox profile={theUser} />
          {user.did !== "" && theUser?.id === user.id ? <WalletBox /> : null}
        </>
      }
      sidebar2={
        <>
          <FollowersBox
            setTheUser={setTheUser}
            theUser={theUser}
            loading={loading}
            setLoading={(loading) => setLoading(loading)}
          />
        </>
      }
    >
      <TabBox>
        <CTabs
          value={viewType}
          onChange={handleChangeViewType}
          key={1}
          $background={"navy80"}
          $activeBG={"navy80"}
        >
          <CTab
            label={"About"}
            id={"view-tab-about"}
            aria-controls={"view-tabpanel-about"}
            value={"about"}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={"Posts"}
            id={"view-tab-posts"}
            aria-controls={"view-tabpanel-posts"}
            value={"posts"}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={"Articles"}
            id={"view-tab-articles"}
            aria-controls={"view-tabpanel-articles"}
            value={"articles"}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={"Platforms"}
            id={"view-tab-platforms"}
            aria-controls={"view-tabpanel-platforms"}
            value={"platforms"}
            disableTouchRipple
            $fullWidth
          />
        </CTabs>
      </TabBox>

      {viewType === "about" ? (
        <About>
          <h4>Bio</h4>
          {loading ? (
            <CSkeleton
              width={100}
              height={10}
              borderRadius={"12px"}
              marginBottom={"3px"}
            />
          ) : (
            <p> {decodeURIComponent(theUser?.bio ?? "")}</p>
          )}

          <div style={{ marginTop: "20px" }}></div>
          <h4>Skills</h4>
          <div className={"skills"}>
            {loading ? (
              <CSkeleton
                width={100}
                height={10}
                borderRadius={"12px"}
                marginBottom={"3px"}
              />
            ) : (
              theUser?.skills?.map((skill, index) => {
                return (
                  <p>
                    {skill}{" "}
                    {index < (theUser?.skills?.length ?? 1) - 1 ? "," : ""}
                  </p>
                );
              })
            )}
          </div>

          <div style={{ marginTop: "20px" }}></div>
          <h4>Experiences</h4>
          <div style={{ marginTop: "15px" }}>
            {loading
              ? [1].map((i) => <ExperienceBox loading key={i} />)
              : theUser?.experiences?.map((experience, index) => (
                  <ExperienceBox experience={experience} key={index} />
                ))}
          </div>

          <div style={{ marginTop: "20px" }}></div>
          <h4>Educations</h4>
          <div style={{ marginTop: "15px" }}>
            {loading
              ? [1].map((i) => <EducationBox loading key={i} />)
              : theUser?.educations?.map((education, index) => (
                  <EducationBox education={education} key={index} />
                ))}
          </div>
        </About>
      ) : viewType === "posts" ? (
        loading ? (
          [1, 2, 3, 4].map((i) => <PostBox loading key={i} />)
        ) : posts?.length === 0 ? (
          <NothingFound
            icon="hourglass_disabled"
            title="No Posts Found"
            padding={"30px"}
          />
        ) : (
          <div>
            {posts.map((post, i) => {
              return <PostBox loading={loading} post={post} key={i} type={2} />;
            })}
            <CButton
              fullWidth
              background={"navy80"}
              color={"white100"}
              backgroundHover={"navy100"}
              loading={loading}
              onClick={loadMoreHandler}
            >
              Load More
            </CButton>
          </div>
        )
      ) : viewType === "articles" ? (
        loading ? (
          [1, 2, 3, 4].map((i) => <ArticleBox loading key={i} />)
        ) : articles?.length === 0 ? (
          <NothingFound
            icon="hourglass_disabled"
            title="No Articles Found"
            padding={"30px"}
          />
        ) : (
          <div>
            {articles.map((article, i) => {
              return (
                <ArticleBox
                  loading={loading}
                  article={article}
                  key={i}
                  type={2}
                />
              );
            })}
            <CButton
              fullWidth
              background={"navy80"}
              color={"white100"}
              backgroundHover={"navy100"}
              loading={loading}
              onClick={loadMoreHandler}
            >
              Load More
            </CButton>
          </div>
        )
      ) : (
        <></>
      )}
    </Page>
  );
}
