import styled from "styled-components";
import {
  Link,
  useNavigate,
  useParams,
  useSearchParams,
} from "react-router-dom";
import React, {
  HTMLAttributes,
  ReactElement,
  useEffect,
  useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { Page } from "../../components/structure";
import { UserBox } from "../../components/user";
import {
  CButton,
  CIconButton,
  CMenu,
  CMenuItem,
  CSkeleton,
} from "../../components/mui";
import { useGlobalContext, useCeramicContext } from "../../contexts";
import _ from "lodash";
import { Avatar } from "@mui/material";
import { CommentBox } from "../../components/article/comment";
import "../../assets/editor.css";
import { Img } from "react-image";
import { Download } from "@mui/icons-material";
import LinkPreview from "../../components/link-preview/LinkPreview";
import { doArticleLike, findSingleArticle } from "../../apis/article.apis";
import { ArticleModel } from "../../models/article.model";
import { update } from "../../redux/slices/post";
import { CSvgButton } from "../../components/mui/SvgButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import moment from 'moment-timezone'
import { CommentModel } from '../../models/comment.model'

const Box = styled.div`
  background: ${(props) => props.theme.navy80};
  padding: 15px;
  margin-bottom: 15px;
  border-radius: 8px;
  display: block;
  text-decoration: none;

  > .header {
    display: flex;
    flex-direction: row;
    align-items: center;
    margin-bottom: 15px;
    padding-bottom: 15px;
    justify-content: space-between;

    > a {
      display: flex;
      text-decoration: none;
      flex-direction: row;

      > .img {
        margin-right: 15px;
      }

      > .author {
        flex-grow: 1;
        margin-right: 15px;

        > span {
          font-size: 14px;
          font-weight: 500;
          color: ${(props) => props.theme.white100};
          display: block;
          text-decoration: none;
        }

        > small {
          font-size: 12px;
          font-weight: 200;
          color: ${(props) => props.theme.black50};
          text-decoration: none;
        }
      }
    }

    > .type {
      display: flex;
      align-items: center;

      > .material-symbols-outlined {
        font-size: 20px !important;
        font-weight: 200;
        color: ${(props) => props.theme.white100};
        text-decoration: none;
      }

      > p {
        font-size: 14px;
        font-weight: 500;
        color: ${(props) => props.theme.black50};
        display: block;
        text-decoration: none;
      }
    }
  }

  > .body {
    text-decoration: none;
    flex-direction: row;
    align-items: flex-start;

    > .img {
      width: 100%;
      margin-right: 15px;

      > img {
        display: block;
        width: 100%;
        border-radius: 8px;
        max-height: 630px;
      }
    }

    > .content {
      flex-grow: 1;

      > .header {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        > h5 {
          font-size: 18px;
          font-weight: 400;
          color: ${(props) => props.theme.white100};
        }

        > small {
          color: ${(props) => props.theme.white100};
        }

        > .right {
        }
      }

      > .body {
        margin-top: 15px;

        > h4.title {
          color: ${(props) => props.theme.white100};
          border-left: 1px solid ${(props) => props.theme.white100};
          padding: 10px;
          border-radius: 9px;
          margin-bottom: 15px;
        }

        > .blur {
          position: relative;

          > p {
            font-size: 14px;
            color: ${(props) => props.theme.white100};
            line-height: 3rem;
            display: block;
            text-overflow: ellipsis;
            word-wrap: break-word;
            overflow: hidden;
            margin-bottom: 20px;
            filter: blur(3.5px);
          }

          > .links {
            position: absolute;
            left: 20px;
            right: 20px;
            top: 40%;
            align-content: space-between;
            align-items: center;
            align-self: center;
            display: flex;
            flex-wrap: wrap;
            text-align: center;

            > .column {
              flex-basis: 0;
              flex-grow: 1;
              align-self: center;
              align-items: center;
              width: 100%;
              margin: 0 auto 0 auto;

              > p {
                font-size: 14px;
                color: ${(props) => props.theme.green100};
                line-height: 1.3rem;
                display: block;
                text-overflow: ellipsis;
                word-wrap: break-word;
                overflow: hidden;
                margin-bottom: 20px;
                margin-top: 20px;
              }
            }
          }
        }

        p,
        span,
        strong {
          color: ${(props) => props.theme.white100};
        }

        h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        ul,
        li,
        ol {
          color: ${(props) => props.theme.white100};
        }

        > a {
          color: ${(props) => props.theme.green100};
        }

        > img {
          margin-top: 20px;
        }

        > .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;
          margin-bottom: 20px;
          margin-top: 20px;

          > a {
            color: ${(props) => props.theme.green100};
            text-align: right;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-decoration: none;
            padding: 0 10px 0 10px;
            float: right;
          }
        }
      }

      > .actions {
        margin-top: 15px;
        padding-top: 15px;
        display: flex;
        flex-direction: row;
        align-items: center;
        flex-wrap: wrap;
        align-content: space-between;
        width: 100%;

        > .left {
          display: flex;
          width: 50%;

          > p {
            color: ${(props) => props.theme.white100};
            text-align: right;
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: 24px;
            text-decoration: none;
            padding: 10px;
          }
        }

        > .right {
          display: flex;
          width: 50%;
          flex-direction: row-reverse;

          > div {
            flex-direction: row;
            align-items: center;
            margin-right: 15px;

            > span {
              color: ${(props) => props.theme.white100};
              font-size: 12px;
              font-weight: 500;
              margin-left: 5px;
            }
          }
        }
      }
    }
  }

  &:hover {
  }

  &.type-2 {
    > .body {
      display: block;

      > .img {
        width: 100%;
        margin: 10px auto 15px auto;

        > img {
          width: 100%;
        }
      }
    }
  }
`;

export function ArticleDetailPage(): ReactElement {


  const [article, setArticle] = useState<ArticleModel>();
  const { id } = useParams();
  const { makeAlert } = useGlobalContext();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const { locale='de-DE', dateOption } = useCeramicContext();
  const [searchParams] = useSearchParams();

  const [loading, setLoading] = useState<boolean>(true);

  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

  const getSingleArticle = async () => {
    await findSingleArticle(id)
      .then((res) => {
        console.log(res);
        if (res.data.article) {
          setArticle(res.data.article);
        }
        // setComments(res.comments ?? []);
        setLoading(false);
        setCommentsLoading(false);
        console.log(res);
      })
      .catch(() => {
        navigate("/");
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
    getSingleArticle();
  }, []);

  useEffect(() => {
    if (searchParams.get("update")) {
      getSingleArticle();
    }
  }, []);

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreClick = (event: any): void => {
    setMoreAnchorEl(event.currentTarget);
  };
  const handleMoreClose = (): void => {
    setMoreAnchorEl(null);
  };
  const moreOpen = Boolean(moreAnchorEl != null);
  const dispatch = useAppDispatch();
  const [liking, setLiking] = useState<boolean>(false);
  const like = async (e: Event) => {
    e.preventDefault();
    setLiking(true);
    if (user.did !== "") {
      setLiking(true);
      try {
        if (user.did !== "") {
          const res = await doArticleLike(article.id);
          if (res) {
            setLiking(false);
            makeAlert("success", "Article liked");
            if (article != null && res != null && res.data.like) {
              dispatch(
                update({
                  ...article,
                  likesCount: _.get(article, "likesCount", 0) + 1,
                  likes: [
                    ..._.get(article, "likes", []),
                    {
                      articleID: article?.id,
                      profileID: user.id,
                      isDeleted: false,
                    },
                  ],
                })
              );

              setArticle({
                ...article,
                likesCount: _.get(article, "likesCount", 0) + 1,
                likes: [
                  ..._.get(article, "likes", []),
                  {
                    articleID: article?.id,
                    profileID: user.id,
                    isDeleted: false,
                  },
                ],
              });
            } else {
              makeAlert("success", "Post unliked");
              setLiking(false);
              if (article != null && res != null) {
                dispatch(
                  update({
                    ...article,
                    likesCount: _.get(article, "likesCount", 0) - 1,
                    likes: [
                      ..._.get(article, "likes", []).filter(
                        (x) => x?.profileID !== user.id
                      ),
                    ],
                  })
                );

                setArticle({
                  ...article,
                  likesCount: _.get(article, "likesCount", 0) - 1,
                  likes: [
                    ..._.get(article, "likes", []).filter(
                      (x) => x.profileID !== user.id
                    ),
                  ],
                });
              }
            }
          }
        }
      } catch (err) {
        console.log(err);
        setLiking(false);
      }
    }
  };

  const copyUrl = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);

    navigator.clipboard.writeText(
      window.location.href + "articles/get/" + article?.id
    );
    makeAlert("success", "Copied");
  };

  const reportBug = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);
  };

  const [linkPreview, setLinkPreview] = useState(
    <div className="img">
      <LinkPreview url={""} />
    </div>
  );

  useEffect(() => {
    if (article) {
      let links = decodeURIComponent(article.body)
        .replace(/<\/?[^>]+(>|$)/g, " ")
        .match(/(https?:\/\/[^\s]+)/g);
      if (links && links.length > 0) {
        setLinkPreview(
          <div className="img">
            <LinkPreview url={links[0]} />
          </div>
        );
      }
    }
  }, [article]);

  return (
    <Page
      title={"Article Page"}
      sidebar={
        <>
          <div className={"back"}>
            <CButton
              size={"s"}
              background={"navy100"}
              backgroundHover={"navy100"}
              backgroundDisabled={"navy100"}
              color={"white100"}
              onClick={() => navigate(-1)}
              startIcon={"keyboard_arrow_left"}
            >
              <span style={{ marginLeft: "5px" }}>Back</span>
            </CButton>
          </div>
          <UserBox profile={article?.profile} />
        </>
      }
      sidebar2={<></>}
    >
      <Box className={`article type-${"1"}`}>
        <div className={"header"}>
          <Link to={"/u/" + article?.profile?.id}>
            <div className="img">
              {loading ? (
                <CSkeleton width={40} height={40} borderRadius={"20px"} />
              ) : (
                <Avatar
                  alt={article?.profile?.displayName}
                  src={`https://greenia.infura-ipfs.io/ipfs/${article?.profile?.avatar}`}
                />
              )}
            </div>

            <div className="author">
              {loading ? (
                <>
                  <CSkeleton width={200} height={10} marginBottom={"5px"} />
                  <CSkeleton width={100} height={10} />
                </>
              ) : (
                <>
                  <span>{article?.profile?.displayName || "New Face"}</span>
                  {/*<small>{article?.visualAbstract}</small>*/}
                </>
              )}
            </div>
          </Link>

          <div className="type">
            {loading ? (
              <CSkeleton width={50} height={10} />
            ) : (
              <>
                <p>
                  {moment(article?.createdAt).locale(locale).fromNow()}
                </p>
                <CIconButton
                  onClick={handleMoreClick}
                  backgroundColor={"transparent"}
                  backgroundColorHover={"transparent"}
                  icon="more_horiz"
                />
              </>
            )}
          </div>
        </div>

        <div className={"body"}>
          <div className="content">
            <div className="body">
              {loading ? (
                <>
                  <CSkeleton width={200} height={20} marginBottom={"15px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"40%"} height={10} />

                  <CSkeleton
                    width={200}
                    height={20}
                    marginBottom={"15px"}
                    marginTop={"15px"}
                  />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                  <CSkeleton width={"25%"} height={10} />
                </>
              ) : (
                <>
                  <h4 className={"title"}>{article.visualAbstract}</h4>
                  <div className={"editor"}>
                    <div
                      className={"ql-container ql-snow"}
                      style={{ height: "auto" }}
                    >
                      <div
                        className={"ql-editor"}
                        dangerouslySetInnerHTML={{
                          __html: decodeURIComponent(article.body),
                        }}
                      ></div>
                    </div>
                  </div>

                  <div className={"tags"}>
                    {article?.tags
                      ? article?.tags
                          .filter((item) => item !== null)
                          .map((tag, i) => (
                            <Link key={i} to={"/articles/search/" + tag}>
                              #{tag}
                            </Link>
                          ))
                      : null}
                  </div>
                </>
              )}
            </div>
          </div>

          {article?.externalURL && (
            <a
              href={`https://greenia.infura-ipfs.io/ipfs/${article?.externalURL}`}
              target={"_blank"}
              className={"download"}
              style={{ marginTop: "10px", marginBottom: "30px" }}
            >
              <CButton
                key={1}
                background={"navy25"}
                backgroundHover={"navy25"}
                backgroundDisabled={"gray60"}
                margin="10px 0 30px 0"
                form={"edit-profile"}
                type={"submit"}
                fullWidth
                startIconSvg={<Download />}
              >
                Download Article attachment
              </CButton>
            </a>
          )}

          {loading ? (
            <div className="img">
              <CSkeleton width={"100%"} height={150} borderRadius={"8px"} />
            </div>
          ) : article?.attachment != "" ? (
            <div className="img" style={{ marginTop: "10px" }}>
              <Img
                src={`https://greenia.infura-ipfs.io/ipfs/${article?.attachment}`}
                loading={"lazy"}
              />
            </div>
          ) : null}

          {linkPreview}

          <div className="content">
            <div className={"actions"}>
              <div className={"left"}>
                {/*<p>235 views</p>*/}
                <p>
                  {moment(article?.createdAt).locale(locale).format('YYYY-MM-DD HH:mm')}
                </p>
              </div>
              <div className={"right"}>
                <div>
                  <CSvgButton
                    icon={
                      article?.likes?.length &&
                      article?.likes?.filter(
                        (item) => item?.profileID === user.id
                      ).length ? (
                        <FavoriteIcon
                          sx={{
                            fill: "#fff",
                          }}
                        />
                      ) : (
                        <FavoriteBorderIcon
                          sx={{
                            fill: "#fff",
                          }}
                        />
                      )
                    }
                    customSvg={true}
                    loading={liking}
                    disabled={liking}
                    customColor={"white100"}
                    backgroundColorHover={"transparent"}
                    backgroundColor={"transparent"}
                    customColorHover={"green100"}
                    onClick={like}
                  />
                  <span>{loading ? 0 : article?.likesCount}</span>
                </div>
                <div>
                  <CIconButton
                    icon={"comment"}
                    loading={false}
                    disabled={true}
                    customColor={"white100"}
                    backgroundColorHover={"transparent"}
                    backgroundColor={"transparent"}
                  />
                  <span>{loading ? 0 : article?.commentsCount}</span>
                </div>
              </div>
            </div>
          </div>

          <div style={{ marginTop: "20px" }}>
            <CommentBox
              makeAlert={makeAlert}
              comments={article?.comments ?? []}
              article={article}
              loading={commentsLoading}
              postId={article?.id ?? ""}
              onSubmit={(comment) => {
                setArticle({
                  ...article,
                  comments: [...(article?.comments ?? []), comment],
                  commentsCount: (article?.commentsCount ?? 0) + 1,
                });
              }}
            />
          </div>
        </div>

        <CMenu
          open={moreOpen}
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
            <span>Report a bug</span>
          </CMenuItem>

          {article?.profileID === user?.id ? (
            <>
              <Link to={`/articles/edit/${article?.id ?? ""}`}>
                <CMenuItem
                  color={"white100"}
                  onClick={() => {
                    handleMoreClose();
                  }}
                >
                  Edit Article
                </CMenuItem>
              </Link>
            </>
          ) : null}
        </CMenu>
      </Box>
    </Page>
  );
}
