import { Link, useNavigate, useParams } from "react-router-dom";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { create as createIPFS, IPFSHTTPClient } from "ipfs-http-client";
import { SubmitHandler, useForm } from "react-hook-form";
import { GlobalContext, useCeramicContext } from "../../contexts";
import { MyBlobToBuffer } from "../../utils/file";
import { Card, Page } from "../../components/structure";
import { CButton } from "../../components/mui";
import { Grid } from "@mui/material";
import { ControllerDropZone, ControllerTextField } from "../../components/rhf";
import { ControllerTagField } from "../../components/rhf/tag-field";
import { ReactComponent as Publish } from "../../assets/svg/publish.svg";
import {
  PostCreateRequest,
  editPost,
  findSinglePost,
} from "../../apis/post.apis";
import { PostModel } from '../../models/post.model'

interface Inputs {
  description: string;
  thumbnail: File[];
  tag: string;
}

export function EditPostPage(): ReactElement {

  const { id } = useParams();
  const navigate = useNavigate();
  const { makeAlert } = useContext(GlobalContext);
  const {
    control,
    handleSubmit,
    setError,
    watch,
    setValue,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      tag: "",
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [post, setPost] = useState<PostModel>();

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    findSinglePost(id)
      .then((res) => {
        if (res.data.post) {
          setPost(res.data.post);
        }
        setLoading(false);
        console.log(res);
      })
      .catch(() => {
        navigate("/posts");
      });
  }, []);

  useEffect(() => {
    if (post != null) {
      setTags([]);
      setValue("description", decodeURIComponent(post.body ?? ""), {
        shouldValidate: true,
      });
      post.tags
        ?.filter((item) => item !== "")
        .map((tag) => {
          setTags((tags) => [...tags, { text: tag }]);
        });
    }
  }, [post]);

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = createIPFS({
      url: "https://ipfs.infura.io:5001/api/v0",
      headers: {
        authorization:
          "Basic " +
          btoa(
            process.env.REACT_APP_INFURA_PROJECT_ID +
              ":" +
              process.env.REACT_APP_INFURA_API_KEY_SECRET
          ),
      },
    });
  } catch (error) {
    ipfs = undefined;
  }

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setIsSubmitting(true);

    if (watch("thumbnail") != null && ipfs == null) {
      setError("thumbnail", { message: "File could not be uploaded" });
    }

    if (isValid) {
      try {
        MyBlobToBuffer(
          watch("thumbnail") != null ? watch("thumbnail")[0] : undefined,
          async (err, buff) => {
            if (err) {
              setError("thumbnail", { message: "File could not be uploaded" });
              setIsSubmitting(false);
            } else {
              let upload;

              if (buff != null) {
                upload = await ipfs?.add(buff);
              }

              const thumbnailPath = upload ? upload.path : post?.attachment;

              const content: PostCreateRequest = {
                body: encodeURIComponent(watch("description")),
                attachment: thumbnailPath,
                tags: tags.map((item) => item.text),
              };

              const update = editPost(post?.id ?? "", content);

              if (update) {
                makeAlert("success", "Post updated");
                setIsSubmitting(false);

                navigate("/posts/get/" + post?.id + "?update=true");
              } else {
                makeAlert("error", "Error creating post with encryption");
                setIsSubmitting(false);
              }
            }
          }
        );
      } catch (e) {
        makeAlert("error", "Error updating post");
        setIsSubmitting(false);
      }
    } else {
      setIsSubmitting(false);
    }
  };

  const [tags, setTags] = useState<Array<{ text: string }>>([]);

  const handleDelete = (index: number) => {
    const _tags = [...tags];
    _tags.splice(index, 1);
    setTags(_tags);
    console.log(tags);
  };

  const handleAddition = (tag: any) => {
    const chars = /[a-zA-Z0-9?><;,{}[\]\-_+=!@#$%\^&*|']/;
    if (tag.text !== "" && chars.test(tag.text)) {
      if (tags.length <= 10) setTags((tags) => [...tags, { text: tag.text }]);
      else makeAlert("error", "Tags input reached (MAX 10)");
    }
  };

  return (
    <Page
      title={"Update Post"}
      sidebar={
        <div className={"back"}>
          <Link to={"/"}>
            <CButton
              size={"s"}
              background={"navy100"}
              backgroundHover={"navy100"}
              backgroundDisabled={"navy100"}
              color={"white100"}
              startIcon={"keyboard_arrow_left"}
            >
              <span style={{ marginLeft: "5px" }}>Back</span>
            </CButton>
          </Link>
        </div>
      }
      sidebar2={<></>}
    >
      <Card
        title={"Update Post"}
        footerAlignment={"row-reverse"}
        footer={[
          <CButton
            key={1}
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || loading}
            margin="0 15px 0 0"
            form={"update-post"}
            type={"submit"}
            backgroundHover={"navy25"}
            background={"navy25"}
            startIconSvg={<Publish />}
          >
            Edit Post
          </CButton>,
          <Link key={2} to="/">
            <CButton
              background={"gray40"}
              backgroundHover={"gray40"}
              color={"white100"}
              backgroundDisabled={"red60"}
            >
              Cancel
            </CButton>
          </Link>,
        ]}
      >
        <form
          className="form"
          id="update-post"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Grid
            container
            spacing={2}
            sx={{
              "@media (max-width:1130px)": {
                width: "100%",
                marginLeft: "0px",
                ".MuiGrid-item": {
                  paddingLeft: "0px",
                  width: "100%",
                  ".description": {
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    textAlign: "center",
                  },
                },
              },
            }}
          >
            <Grid item md={12} sm={12}>
              <ControllerTextField
                controllerInstance={control}
                controllerName="description"
                rows={10}
                multiline
                errors={errors}
                disabled={isSubmitting || loading}
                label={"Description"}
                placeholder={"The full content of your post"}
                controllerRules={{
                  required: {
                    value: true,
                    message: "Description is required",
                  },
                }}
              />
            </Grid>

            <Grid item md={12} sm={12}>
              <ControllerDropZone
                controllerInstance={control}
                controllerName="thumbnail"
                label={"Add An Image, Gif or Video (Optional)"}
                image={
                  "https://greenia.infura-ipfs.io/ipfs/" + post?.attachment
                }
                type={"post"}
                errors={errors}
                disabled={isSubmitting}
                acceptedFiles={[
                  "image/jpg",
                  "image/jpeg",
                  "image/png",
                  "image/gif",
                  "video/mp4",
                  "video/x-m4v",
                  "video/*",
                ]}
              />
            </Grid>

            <Grid item md={12} sm={12} key={1}>
              <ControllerTagField
                controllerInstance={control}
                controllerName={`tag`}
                errors={errors}
                disabled={isSubmitting}
                label={"Title"}
                placeholder={"Tag (Optional)"}
                tags={tags.map((item: any, index: number) => ({
                  text: item.text,
                  id: index.toString(),
                }))}
                handleAddition={handleAddition}
                handleDelete={handleDelete}
              />
            </Grid>
          </Grid>
        </form>
      </Card>
    </Page>
  );
}
