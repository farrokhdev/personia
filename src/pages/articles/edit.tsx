import { Link, useNavigate, useParams } from "react-router-dom";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { create as createIPFS, IPFSHTTPClient } from "ipfs-http-client";
import { useAppSelector } from "../../redux/hooks";
import { SubmitHandler, useForm } from "react-hook-form";
import { GlobalContext } from "../../contexts";
import { MyBlobToBuffer } from "../../utils/file";
import { Card, Page } from "../../components/structure";
import { CButton } from "../../components/mui";
import { Grid } from "@mui/material";
import {
  ControllerDropZone,
  ControllerEditorField,
  ControllerFileField,
  ControllerTextField,
} from "../../components/rhf";
import { ControllerTagField } from "../../components/rhf/tag-field";
import { ReactComponent as Publish } from "../../assets/svg/publish.svg";
import {
  ArticleCreateRequest,
  editArticle,
  findSingleArticle,
} from "../../apis/article.apis";
import { ArticleModel } from "../../models/article.model";

interface Inputs {
  description: string;
  thumbnail: File[];
  file: File[];
  tag: string;
  encryption: boolean;
  visualAbstract: string;
  abstract: string;
  price: number;
}

export function EditArticlePage(): ReactElement {


  const { id } = useParams();
  const navigate = useNavigate();
  const { makeAlert } = useContext(GlobalContext);
  const user = useAppSelector((state) => state.user);
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
      encryption: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const [loading, setLoading] = useState<boolean>(true);
  const [article, setArticle] = useState<ArticleModel>();
  const [, setDecrypted] = useState<boolean>(false);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });

    findSingleArticle(id)
      .then((res) => {
        console.log(res);
        if (res.data.article) {
          setArticle(res.data.article);
        }
        setLoading(false);
        console.log(res);
      })
      .catch(() => {
        navigate("/articles");
      });
  }, []);

  const [encryption, setEncryption] = useState(false);
  const handleOnChangeEncryption = (event: any) => {
    // const { checked } = event.target
    // if (checked) {
    //   setValue('encryption', true)
    //   setEncryption(true)
    // } else {
    //   setValue('encryption', false)
    //   setEncryption(false)
    // }
  };

  useEffect(() => {
    if (article != null) {
      setTags([]);
      setValue("description", decodeURIComponent(article.body ?? ""), {
        shouldValidate: true,
      });
      setValue("abstract", decodeURIComponent(article.abstract ?? ""), {
        shouldValidate: true,
      });
      setValue("visualAbstract", article.visualAbstract, {
        shouldValidate: true,
      });
      setValue("price", article.price, {
        shouldValidate: true,
      });
      article.tags
        .filter((item) => item !== "" && item !== null)
        .map((tag) => {
          setTags((tags) => [...tags, { text: tag }]);
        });
    }
  }, [article]);

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

  const updateArticle = (fileId?: string) => {
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

          const thumbnailPath = upload ? upload.path : article?.attachment;
          const externalUrl = fileId ? fileId : article?.externalURL;

          const content: ArticleCreateRequest = {
            abstract: encodeURIComponent(watch("abstract")),
            body: encodeURIComponent(watch("description")),
            visualAbstract: watch("visualAbstract"),
            attachment: thumbnailPath,
            externalURL: externalUrl,
            tags: tags.map((x) => x.text),
            isDeleted: false,
            isEncrypted: encryption,
            price: watch("price") ? watch("price").toString() : "0",
          };

          const update = editArticle(
            article?.id ?? "",
            content
            // profileID: user?.id ?? "",
          );

          if (update) {
            makeAlert("success", "Article updated");
            setIsSubmitting(false);

            navigate("/articles/get/" + article?.id + "?update=true");
          } else {
            makeAlert("error", "Error creating article with encryption");
            setIsSubmitting(false);
          }
        }
      }
    );
  };

  const onSubmit: SubmitHandler<Inputs> = async () => {
    setIsSubmitting(true);

    if (watch("thumbnail") != null && ipfs == null) {
      setError("thumbnail", { message: "File could not be uploaded" });
    }

    if (isValid) {
      try {
        let filePath;
        if (watch("file")) {
          MyBlobToBuffer(
            watch("file") != null ? watch("file")[0] : undefined,
            async (err, buff) => {
              if (err) {
                setError("file", { message: "File could not be uploaded" });
                setIsSubmitting(false);
              } else {
                if (buff != null) {
                  filePath = await ipfs?.add(buff);

                  updateArticle(filePath ? filePath.path : "");
                }
              }
            }
          );
        } else {
          updateArticle();
        }
      } catch (e) {
        makeAlert("error", "Error updating article");
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
      title={"Update Article"}
      sidebar={
        <div className={"back"}>
          <Link to={"/articles"}>
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
        title={"Update Article"}
        footerAlignment={"row-reverse"}
        footer={[
          <CButton
            key={1}
            loading={isSubmitting}
            disabled={isSubmitting || !isValid || loading}
            margin="0 15px 0 0"
            form={"update-article"}
            type={"submit"}
            backgroundHover={"navy25"}
            background={"navy25"}
            startIconSvg={<Publish />}
          >
            Edit Article
          </CButton>,
          <Link key={2} to="/articles">
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
          id="update-article"
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
                controllerName="visualAbstract"
                errors={errors}
                disabled={isSubmitting}
                label={"Title"}
                placeholder={"The title of your article"}
                controllerRules={{
                  required: {
                    value: true,
                    message: "Title is required",
                  },
                }}
              />
            </Grid>

            <Grid item md={12} sm={12}>
              <ControllerTextField
                controllerInstance={control}
                controllerName="abstract"
                rows={5}
                multiline
                errors={errors}
                disabled={isSubmitting}
                label={"Abstract"}
                placeholder={"The abstract of your article"}
                controllerRules={{
                  required: {
                    value: true,
                    message: "Abstract is required",
                  },
                }}
              />
            </Grid>

            <Grid item md={12} sm={12}>
              <ControllerEditorField
                label={"Description"}
                placeholder={"Full article Description"}
                controllerName={"description"}
                controllerInstance={control}
                disabled={isSubmitting}
                controllerRules={{
                  required: {
                    value: true,
                    message: "Description is required",
                  },
                }}
                errors={errors}
              />
            </Grid>

            <Grid item md={12} sm={12}>
              <ControllerFileField
                controllerInstance={control}
                controllerName="file"
                errors={errors}
                marginTop={"20px"}
                disabled={isSubmitting}
                label={"File - Optional"}
                placeholder={""}
              />
            </Grid>

            <Grid item md={12} sm={12}>
              <ControllerDropZone
                controllerInstance={control}
                controllerName="thumbnail"
                label={"Add An Image, Gif or Video (Optional)"}
                errors={errors}
                disabled={isSubmitting}
                image={
                  "https://greenia.infura-ipfs.io/ipfs/" + article?.attachment
                }
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

            <Grid item md={12} sm={12}>
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

            {/*<Grid item md={12} sm={12} container>*/}
            {/*  <Grid item md={6} sm={6}>*/}
            {/*    <SwitchComponent*/}
            {/*      label={'Encryption'}*/}
            {/*      checked={encryption}*/}
            {/*      onChange={(event: any) => handleOnChangeEncryption(event)}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*  <Grid item md={6} sm={6}>*/}
            {/*    <ControllerTextField*/}
            {/*      controllerInstance={control}*/}
            {/*      controllerName="price"*/}
            {/*      errors={errors}*/}
            {/*      disabled={isSubmitting}*/}
            {/*      label={'Price ALS - Optional'}*/}
            {/*      placeholder={'10'}*/}
            {/*    />*/}
            {/*  </Grid>*/}
            {/*</Grid>*/}
          </Grid>
        </form>
      </Card>
    </Page>
  );
}
