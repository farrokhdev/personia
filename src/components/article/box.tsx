import React, { ReactElement, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { Avatar } from "@mui/material";
import { CIconButton, CMenu, CMenuItem, CSkeleton } from "../mui";
import _ from "lodash";
import { useGlobalContext, useCeramicContext } from "../../contexts";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { update } from "../../redux/slices/post";
import { CommentBox } from "./comment";
import { CSvgButton } from "../mui/SvgButton";
import { ReactComponent as Message } from "../../assets/svg/messages.svg";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Img } from "react-image";
import { breakpoints } from "../../config/global-styles";
import LinkPreview from "../link-preview/LinkPreview";
import { ArticleModel } from "../../models/article.model";
import { doArticleLike } from "../../apis/article.apis";
import moment from 'moment-timezone'

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
      flex-direction: row;
      justify-content: space-between;
      text-decoration: none;
      align-items: center;

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
    display: flex;
    flex-direction: row;
    align-items: flex-start;

    > .img {
      width: 150px;
      margin-right: 15px;

      > img {
        display: block;
        width: 150px;
        border-radius: 8px;
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

        > p {
          font-size: 14px;
          color: ${(props) => props.theme.white100};
          line-height: 1.3rem;
          display: block;
          text-overflow: ellipsis;
          word-wrap: break-word;
          overflow: hidden;
          margin-bottom: 20px;
          display: -webkit-box;
        }

        > a {
          color: ${(props) => props.theme.green100};
          text-align: right;
          font-size: 14px;
          font-style: normal;
          font-weight: 400;
          line-height: 24px;
          text-decoration: none;
          width: 100%;
          padding: 10px 24px;
          float: right;
        }

        > .img {
          width: 100%;
          margin-right: 15px;

          > img {
            display: block;
            width: 100%;
            border-radius: 8px;
            max-height: 630px;

            @media only screen and (min-width: ${breakpoints.minDesktop}) and (max-width: ${breakpoints.maxDesktop}) {
              max-height: 430px;
            }
          }
        }

        > .tags {
          display: flex;
          flex-direction: row;
          flex-wrap: wrap;
          width: 100%;

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

interface Props {
  article?: ArticleModel;
  type?: 1 | 2;
  loading?: boolean;
}

export function ArticleBox(props: Props): ReactElement {
  const { type = 1, loading } = props;
  const { makeAlert } = useGlobalContext();
  const user = useAppSelector((state) => state.user);
  const dispatch = useAppDispatch();
  const { locale='de-DE', dateOption } = useCeramicContext();
  const [article, setArticle] = useState<ArticleModel>(props.article);
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

  const [moreAnchorEl, setMoreAnchorEl] = useState(null);
  const handleMoreClick = (event: any): void => {
    setMoreAnchorEl(event.currentTarget);
  };
  const handleMoreClose = (): void => {
    setMoreAnchorEl(null);
  };
  const moreOpen = Boolean(moreAnchorEl != null);

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

  // const [commentPageCount, setCommentPageCount] = useState<number>(5);
  // const handleShowMoreComment = () => {
  //   setCommentPageCount(commentPageCount + 5);
  // };

  return (
    <Box className={`article type-${type}`}>
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
              <div>
                <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                <CSkeleton width={"100%"} height={10} marginBottom={"5px"} />
                <CSkeleton width={100} height={10} />
              </div>
            ) : (
              <>
                <h4 className={"title"}>{article.visualAbstract}</h4>
                <p>{decodeURIComponent(article?.abstract ?? "")}</p>
                <div className={"tags"}>
                  {article?.tags
                    ?.filter((item) => item != null && item !== "null")
                    .map((tag) => {
                      if (tag) {
                        return (
                          <Link to={"/articles/search/" + tag}>#{tag}</Link>
                        );
                      }
                    })}
                </div>
                <Link to={"/articles/get/" + article?.id}>...See More</Link>
              </>
            )}

            {loading ? (
              <div
                className="img"
                style={{ marginTop: "10px", marginBottom: "10px" }}
              >
                <CSkeleton width={"100%"} height={200} borderRadius={"8px"} />
              </div>
            ) : article?.attachment != "" ? (
              <div className="img">
                <Img
                  src={`https://greenia.infura-ipfs.io/ipfs/${article?.attachment}`}
                  loading={"lazy"}
                />
              </div>
            ) : null}
            {linkPreview}
            <div className={"actions"}>
              <div className={"left"}>
                {/*<p>235 views</p>*/}
                {loading ? (
                  <CSkeleton width={100} height={10} />
                ) : (
                  <p>
                    {moment(article?.createdAt).locale(locale).format('YYYY-MM-DD HH:mm')}
                  </p>
                )}
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
                  <CSvgButton
                    icon={<Message />}
                    customSvg={true}
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

            {user.did != "" ? (
              <CommentBox
                comments={article?.comments ?? []}
                makeAlert={makeAlert}
                loading={loading}
                postId={article?.id ?? ""}
                article={article}
                onSubmit={(comment) => {
                  setArticle({
                    ...article,
                    comments: [...(article?.comments ?? []), comment],
                    commentsCount: (article?.commentsCount ?? 0) + 1,
                  });
                }}
              />
            ) : null}
          </div>
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

        {user.did != "" && article?.profileID === user?.id ? (
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
  );
}
