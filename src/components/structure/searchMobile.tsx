import React, { ReactElement, useEffect, useRef, useState } from "react";
import { MyInput } from "../custom/input";
import { Grid, IconButton } from "@mui/material";
import { CLoader, NothingFound } from "../custom";
import { SearchUserResultBox } from "../search/user-result-box";
import { SearchArticleResultBox, SearchPostResultBox } from "../search";
import { Link } from "react-router-dom";
import { SearchMobileBox } from "./searchMobileStyledComps/SearchMobileBox";
import { search } from "../../apis/search.api";
import { PostModel } from "../../models/post.model";
import { ProfileModel } from "../../models/profile.model";
import { ReactComponent as Search } from "../../assets/svg/search-normal.svg";
import { ArticleModel } from '../../models/article.model'

export interface Props {
  title?: string;
  setIsOpenSearch?: any;
  isIcon?: boolean;
}

export function SearchBoxMobile(props: Props): ReactElement {
  const [value, setValue] = useState<string>("");

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          props.setIsOpenSearch(false);
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

  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Array<PostModel>>([]);
  const [articles, setArticles] = useState<Array<ArticleModel>>([]);
  const [users, setUsers] = useState<Array<ProfileModel>>([]);
  const [isOpenSearchMobile, setIsOpenSearchMobile] = useState<boolean>(false);

  const handleSearch = async (text: string) => {
    setLoading(true);
    setValue(text);

    setUsers([]);
    setPosts([]);
    setArticles([]);

    if (text !== "") {
      setIsOpenSearchMobile(true);
      search(text)
        .then((result) => {
          setPosts(result.data.posts);
          setArticles(result.data.articles);
          setUsers(result.data.users);
          setLoading(false);
        })
        .catch((error) => {
          setLoading(false);
          setIsOpenSearchMobile(false);
        });
    } else {
      setIsOpenSearchMobile(false);
      setLoading(false);
    }
  };

  const openModalIfIsIcon = () => {
    setIsOpenSearchMobile(!isOpenSearchMobile);
  };

  return (
    <>
      <SearchMobileBox
        $marginBottom={""}
        ref={wrapperRef}
        left={window.innerWidth}
      >
        {props.isIcon ? (
          <IconButton onClick={() => openModalIfIsIcon()}>
            <Search />
          </IconButton>
        ) : (
          <MyInput
            placeholder={"Search"}
            label={""}
            value={value}
            onChange={handleSearch}
            name={"search"}
            icon={"search"}
            background={"gray70"}
            border={"gray60"}
            color={"white100"}
          />
        )}

        {isOpenSearchMobile && (
          <div className="mobile-search-box">
            <div className={"body"}>
              <>
                {props.isIcon && (
                  <div style={{ marginBottom: "20px" }}>
                    <MyInput
                      placeholder={"Search"}
                      label={""}
                      value={value}
                      onChange={handleSearch}
                      name={"search"}
                      icon={"search"}
                      background={"gray70"}
                      border={"gray60"}
                      color={"white100"}
                    />
                  </div>
                )}
                <div className="view-all">
                  {loading ? (
                    <Grid item md={12}>
                      <CLoader width={50} height={50} />
                    </Grid>
                  ) : (
                    <>
                      {(users && users.length !== 0) ||
                      (articles && articles.length !== 0) ||
                      (posts && posts.length !== 0) ? (
                        <>
                          {users && users.length !== 0 && (
                            <>
                              <div className="title-box">
                                <div className="tag">
                                  <div className="tag-before" />
                                  <span>People</span>
                                </div>
                                <Link
                                  to={"posts/search/" + value}
                                  className={"view-all"}
                                >
                                  View All
                                </Link>
                              </div>
                              <div className="content-box">
                                {users.map((user, i) => (
                                  <Grid item md={12} key={i}>
                                    <SearchUserResultBox
                                      loading={loading}
                                      user={user}
                                    />
                                  </Grid>
                                ))}
                              </div>
                            </>
                          )}
                          {articles && articles.length !== 0 && (
                            <>
                              <div className="title-box">
                                <div className="tag">
                                  <div className="tag-before" />
                                  <span>Articles</span>
                                </div>
                                <Link
                                  to={"posts/search/" + value}
                                  className={"view-all"}
                                >
                                  View All
                                </Link>
                              </div>
                              <div className="content-box">
                                {articles.map((article, i) => (
                                  <Grid item md={12} key={i}>
                                    <SearchArticleResultBox article={article} />
                                  </Grid>
                                ))}
                              </div>
                            </>
                          )}
                          {posts && posts.length !== 0 && (
                            <>
                              <div className="title-box">
                                <div className="tag">
                                  <div className="tag-before" />
                                  <span>Posts</span>
                                </div>
                                <Link
                                  to={"posts/search/" + value}
                                  className={"view-all"}
                                >
                                  View All
                                </Link>
                              </div>
                              <div className="content-box">
                                {posts.map((post, i) => (
                                  <Grid item md={12} key={i}>
                                    <SearchPostResultBox post={post} />
                                  </Grid>
                                ))}
                              </div>
                            </>
                          )}
                        </>
                      ) : (
                        <>
                          <Grid item md={12}>
                            <NothingFound
                              icon={"person_search"}
                              title={"No Item Found"}
                            />
                          </Grid>
                        </>
                      )}
                    </>
                  )}
                </div>
              </>
            </div>
          </div>
        )}
      </SearchMobileBox>
    </>
  );
}
