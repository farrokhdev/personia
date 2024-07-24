import React, { ReactElement, useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { CTab, CTabs } from "../mui";
import { MyInput } from "../custom/input";
import { Grid } from "@mui/material";
import { CLoader, NothingFound } from "../custom";
import { SearchUserResultBox } from "../search/user-result-box";
import { SearchArticleResultBox, SearchPostResultBox } from "../search";
import { Link } from "react-router-dom";
import { breakpoints } from "../../config/global-styles";
import { search } from '../../apis/search.api'
import { PostModel } from '../../models/post.model'
import { ProfileModel } from '../../models/profile.model'
import { ArticleModel } from '../../models/article.model'

const Box = styled.div<{ $marginBottom: string; left: number }>`
  background: ${(props) => props.theme.navy80};
  border-radius: 8px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  width: 600px;
  position: absolute;
  top: 60px;
  z-index: 100;
  margin-left: 130px;
  /* @media only screen and ((max-width: ${breakpoints.tablet})) {
    width: 100%;
  } */

  .body {
    padding: 10px;
    display: block;
    position: relative;

    .view-all {
      margin-right: 15px;
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => props.theme.green100};
      position: absolute;
      right: 0;
      text-decoration: none;
    }
  }
`;

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;

  > span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: 500;
    color: ${(props) => props.theme.black80};
  }

  .fwMDce.fwMDce {
    background: ${(props) => props.theme.navy80} !important;
  }

  .fwMDce.fwMDce .MuiTab-root.Mui-selected {
    background: ${(props) => props.theme.navy80} !important;
  }
`;

export interface Props {
  title?: string;
  setIsOpenSearch?: any;
}

export function SearchBox(props: Props): ReactElement {
  const [viewType, setViewType] = useState(0);
  const [value, setValue] = useState<string>("");

  function useOutsideAlerter(ref: any) {
    useEffect(() => {
      /**
       * Alert if clicked on outside of element
       */
      function handleClickOutside(event: any) {
        if (ref.current && !ref.current.contains(event.target)) {
          setPosts([])
          setUsers([])
          setArticles([])
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

  const handleChangeViewType = (event: any, newValue: any): void => {
    setViewType(newValue);
    setPage("1");
    setUsers([]);
    setPosts([]);
    setArticles([])
    setValue("");
  };

  const [, setPage] = useState<string>("1");
  const [loading, setLoading] = useState(false);
  const [posts, setPosts] = useState<Array<PostModel>>([]);
  const [articles, setArticles] = useState<Array<ArticleModel>>([]);
  const [users, setUsers] = useState<Array<ProfileModel>>([]);

  const handleSearch = (text: string) => {
    setLoading(true);
    setValue(text);

    setUsers([]);
    setPosts([]);
    setArticles([]);

    if (text !== "") {

      search(text).then(result=>{
        setPosts(result.data.posts)
        setArticles(result.data.articles)
        setUsers(result.data.users)

        setLoading(false);
      }).catch(error=>{
        setLoading(false);
      })
    } else setLoading(false);
  };

  return (
    <Box $marginBottom={""} ref={wrapperRef} left={window.innerWidth}>
      <TabBox>
        <CTabs value={viewType} onChange={handleChangeViewType} key={1}>
          <CTab
            label={"Post"}
            id={"view-tab-0"}
            aria-controls={"view-tabpanel-0"}
            value={0}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={"Article"}
            id={"view-tab-0"}
            aria-controls={"view-tabpanel-2"}
            value={2}
            disableTouchRipple
            $fullWidth
          />
          <CTab
            label={"People"}
            id={"view-tab-1"}
            aria-controls={"view-tabpanel-1"}
            value={1}
            disableTouchRipple
            $fullWidth
          />
        </CTabs>
      </TabBox>

      <div className={"body"}>
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

        <div style={{ marginTop: "20px" }}></div>

        {viewType === 0 ? (
          loading ? (
            <Grid item md={12}>
              <CLoader width={50} height={50} />
            </Grid>
          ) : (
            <>
              {posts && posts.length === 0 ? (
                <Grid item md={12}>
                  <NothingFound
                    icon={"person_search"}
                    title={"No Posts Found"}
                  />
                </Grid>
              ) : (
                <>
                  <Link to={"posts/search/" + value} className={"view-all"}>
                    View All
                  </Link>
                  <div style={{ marginTop: "60px" }} />
                  {posts && posts.map((post, i) => (
                    <Grid item md={12} key={i}>
                      <SearchPostResultBox post={post} />
                    </Grid>
                  ))}
                </>
              )}
            </>
          )
        ) : viewType === 1 ? (
          loading ? (
            <Grid item md={12}>
              <CLoader width={50} height={50} />
            </Grid>
          ) : (
            <>
              {users && users.length === 0 ? (
                <Grid item md={12}>
                  <NothingFound
                    icon={"person_search"}
                    title={"No Users Found"}
                  />
                </Grid>
              ) : (
                users && users.map((user, i) => (
                  <Grid item md={12} key={i}>
                    <SearchUserResultBox loading={loading} user={user} />
                  </Grid>
                ))
              )}
            </>
          )
        ) : loading ? (
          <Grid item md={12}>
            <CLoader width={50} height={50} />
          </Grid>
        ) : (
          <>
            {articles && articles.length === 0 ? (
              <Grid item md={12}>
                <NothingFound
                  icon={"person_search"}
                  title={"No Articles Found"}
                />
              </Grid>
            ) : (
              <>
                <Link to={"articles/search/" + value} className={"view-all"}>
                  View All
                </Link>
                <div style={{ marginTop: "60px" }} />
                {articles && articles.map((article, i) => (
                  <Grid item md={12} key={i}>
                    <SearchArticleResultBox article={article} />
                  </Grid>
                ))}
              </>
            )}
          </>
        )}
      </div>
    </Box>
  );
}
