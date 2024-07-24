import styled from "styled-components";
import {
  Link,
  useLocation,
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
import { CommentBox } from "../../components/post/comment";
import { Img } from "react-image";
import LinkPreview from "../../components/link-preview/LinkPreview";
import { LinkProps } from "@mui/material/Link";
import { CopyableBlock } from "../../components/room/copy";
import { materialDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import Typography, { TypographyProps } from "@mui/material/Typography";
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { CodeProps } from "react-markdown/lib/ast-to-react";
import { PrismAsyncLight as SyntaxHighlighter } from "react-syntax-highlighter";
import Markdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { PostModel } from "../../models/post.model";
import { doPostLike, findSinglePost } from "../../apis/post.apis";
import { ApiErrorData } from "../../apis/http.api";
import { update } from "../../redux/slices/post";
import { CSvgButton } from "../../components/mui/SvgButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
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
      margin-top: 10px;

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

        > p,
        span,
        strong {
          font-size: 14px;
          color: ${(props) => props.theme.white100};
          line-height: 1.6rem;
          display: block;
          text-overflow: ellipsis;
          word-wrap: break-word;
          white-space: pre-line;
          overflow: hidden;
          margin-bottom: 20px;
          text-align: justify;
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

  ol,
  li,
  ul {
    font-size: 14px;
    color: ${(props) => props.theme.white100};
    line-height: 1.6rem;
    display: block;
    text-overflow: ellipsis;
    word-wrap: break-word;
    overflow: hidden;
    margin-bottom: 10px;
    text-align: justify;
  }
`;

export function PostPage(): ReactElement {
  const { id } = useParams();
  const [searchParams] = useSearchParams();

  const { makeAlert } = useGlobalContext();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.user);
  const { locale='de-DE', dateOption } = useCeramicContext();

  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostModel>();

  const dispatch = useAppDispatch();

  const [commentsLoading, setCommentsLoading] = useState<boolean>(true);

  const getSinglePost = () => {
    findSinglePost(id)
      .then((result) => {
        setLoading(false);
        setCommentsLoading(false);
        setPost(result.data.post);
        console.log(result.data.post);
      })
      .catch((error: ApiErrorData) => {
        setLoading(false);
        if (error.message) {
          makeAlert("error", error.message);
          navigate("/");
        }
      });
  };

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    getSinglePost();
  }, [id]);

  useEffect(() => {
    if (searchParams.get("update")) {
      getSinglePost();
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

  const [liking, setLiking] = useState<boolean>(false);

  const like = async (e: Event) => {
    e.preventDefault();
    setLiking(true);
    try {
      if (user?.did !== "") {
        const res = await doPostLike(post.id);
        if (res) {
          setLiking(false);
          makeAlert("success", "Post liked");
          if (post != null && res != null && res.data.like) {
            dispatch(
              update({
                ...post,
                likesCount: _.get(post, "likesCount", 0) + 1,
                likes: [
                  ..._.get(post, "likes", []),
                  { postID: post?.id, profileID: user.id, isDeleted: false },
                ],
              })
            );

            setPost({
              ...post,
              likesCount: _.get(post, "likesCount", 0) + 1,
              likes: [
                ..._.get(post, "likes", []),
                { postID: post?.id, profileID: user.id, isDeleted: false },
              ],
            });
          } else {
            makeAlert("success", "Post unliked");
            setLiking(false);
            if (post != null && res != null) {
              dispatch(
                update({
                  ...post,
                  likesCount: _.get(post, "likesCount", 0) - 1,
                  likes: [
                    ..._.get(post, "likes", []).filter(
                      (x) => x?.profileID !== user.id
                    ),
                  ],
                })
              );

              setPost({
                ...post,
                likesCount: _.get(post, "likesCount", 0) - 1,
                likes: [
                  ..._.get(post, "likes", []).filter(
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
  };

  const copyUrl = (e: Event): void => {
    e.stopPropagation();
    setMoreAnchorEl(null);

    navigator.clipboard.writeText(
      window.location.href + "posts/get/" + post?.id
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
    if (post) {
      let links = decodeURIComponent(post.body)
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
  }, [post]);

  const linkFactory = (overrides: LinkProps) => (
    args: HTMLAttributes<HTMLElement>
  ) => {
    return (
      // @ts-ignore
      <a
        style={{ color: "white", textDecoration: "none" }}
        {...args}
        {...overrides}
      />
    );
  };
  const typographyFactory = (overrides: TypographyProps) => (
    args: HTMLAttributes<HTMLElement>
  ) => {
    return <Typography {...args} {...overrides} />;
  };
  const componentMap = {
    h1: typographyFactory({ variant: "h1" }),
    h2: typographyFactory({ variant: "h2" }),
    h3: typographyFactory({ variant: "h3" }),
    h4: typographyFactory({ variant: "h4" }),
    h5: typographyFactory({ variant: "h5" }),
    h6: typographyFactory({ variant: "h6" }),
    p: typographyFactory({ variant: "body1" }),
    a: linkFactory({
      variant: "body1",
      underline: "always",
      color: "#ffffff",
      target: "_blank",
    }),
    code({ node, inline, className, children, style, ...props }: CodeProps) {
      const match = /language-(\w+)/.exec(className || "");

      return !inline && match ? (
        <CopyableBlock>
          <SyntaxHighlighter
            children={String(children).replace(/\n$/, "")}
            language={match[1]}
            style={materialDark}
            PreTag="div"
            {...props}
          />
        </CopyableBlock>
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  return (
    <Page
      title={"Post Page"}
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
          <UserBox profile={post?.profile} />
        </>
      }
      sidebar2={<></>}
    >
      <Box className={`article type-${"1"}`}>
        {post && (
          <>
            <div className={"header"}>
              <Link to={"/u/" + post?.profile?.id}>
                <div className="img">
                  {loading ? (
                    <CSkeleton width={40} height={40} borderRadius={"20px"} />
                  ) : (
                    <Avatar
                      alt={post?.profile?.displayName}
                      src={`https://greenia.infura-ipfs.io/ipfs/${post?.profile?.avatar}`}
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
                      <span>{post?.profile?.displayName || "New Face"}</span>
                      <small>{post?.profile?.did ?? ""}</small>
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
                      {moment(post?.createdAt).locale(locale).fromNow()}
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
                      <CSkeleton
                        width={200}
                        height={20}
                        marginBottom={"15px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton width={"40%"} height={10} />

                      <CSkeleton
                        width={200}
                        height={20}
                        marginBottom={"15px"}
                        marginTop={"15px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton
                        width={"100%"}
                        height={10}
                        marginBottom={"5px"}
                      />
                      <CSkeleton width={"25%"} height={10} />
                    </>
                  ) : (
                    <>
                      <Markdown
                        components={componentMap}
                        remarkPlugins={[remarkGfm]}
                      >
                        {decodeURIComponent(post.body)}
                      </Markdown>

                      <div className={"tags"}>
                        {post?.tags
                          ? post?.tags
                              .filter((item) => item != null && item !== "null")
                              .map((tag, i) => {
                                return (
                                  <Link key={i} to={"/posts/search/" + tag}>
                                    #{tag}
                                  </Link>
                                );
                              })
                          : null}
                      </div>
                    </>
                  )}
                </div>
              </div>

              {loading ? (
                <div className="img">
                  <CSkeleton width={"100%"} height={150} borderRadius={"8px"} />
                </div>
              ) : post?.attachment != "" ? (
                <div className="img">
                  <Img
                    src={`https://greenia.infura-ipfs.io/ipfs/${post?.attachment}`}
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
                      {moment(post?.createdAt).locale(locale).format('YYYY-MM-DD HH:mm')}
                    </p>
                  </div>
                  <div className={"right"}>
                    <div>
                      <CSvgButton
                        icon={
                          post?.likes?.length &&
                          post?.likes?.filter(
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
                      <span>{loading ? 0 : post?.likesCount}</span>
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
                      <span>{loading ? 0 : post?.commentsCount}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ marginTop: "20px" }}>
                <CommentBox
                  makeAlert={makeAlert}
                  comments={post?.comments ?? []}
                  post={post}
                  loading={commentsLoading}
                  postId={post?.id ?? ""}
                  onSubmit={(comment) => {
                    setPost({
                      ...post,
                      comments: [...(post?.comments ?? []), comment],
                      commentsCount: (post?.commentsCount ?? 0) + 1,
                    });
                  }}
                />
              </div>
            </div>
          </>
        )}

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

          {post?.profileID === user?.id ? (
            <>
              <Link to={`/posts/edit/${post?.id ?? ""}`}>
                <CMenuItem
                  color={"white100"}
                  onClick={() => {
                    handleMoreClose();
                  }}
                >
                  Edit Post
                </CMenuItem>
              </Link>
            </>
          ) : null}
        </CMenu>
      </Box>
    </Page>
  );
}
