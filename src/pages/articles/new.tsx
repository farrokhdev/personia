import { Link, useNavigate } from "react-router-dom";
import React, { ReactElement, useContext, useEffect, useState } from "react";
import { create as createIPFS, IPFSHTTPClient } from "ipfs-http-client";
import { useAppSelector } from "../../redux/hooks";
import { Card, Page } from "../../components/structure";
import { CButton } from "../../components/mui";
import { SubmitHandler, useForm } from "react-hook-form";
import { Grid } from "@mui/material";
import {
  ControllerDropZone,
  ControllerEditorField,
  ControllerFileField,
  ControllerTextField,
} from "../../components/rhf";
import { GlobalContext } from "../../contexts";
import { MyBlobToBuffer } from "../../utils/file";
import { ControllerTagField } from "../../components/rhf/tag-field";
import { ReactComponent as Publish } from "../../assets/svg/publish.svg";
import { createArticle } from "../../apis/article.apis";

interface Inputs {
  description: string;
  thumbnail: File[];
  file: File[];
  tag: string;
  encryption: boolean;
  title: string;
  shortDescription: string;
  price: number;
}

export function NewArticlePage(): ReactElement {

  const user = useAppSelector((state) => state.user);
  const navigate = useNavigate();
  const { makeAlert } = useContext(GlobalContext);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
    });
  }, []);

  const {
    control,
    handleSubmit,
    setError,
    watch,
    reset,
    setValue,
    getValues,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      tag: "",
      encryption: false,
    },
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Initialize IPFS
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

  const createArticleFunc = (filePath?: string, data?: any) => {
    MyBlobToBuffer(
      watch("thumbnail") != null ? watch("thumbnail")[0] : undefined,
      async (err, buff) => {
        setIsSubmitting(true);
        if (err) {
          setError("thumbnail", { message: "File could not be uploaded" });
          setIsSubmitting(false);
        } else {
          let upload;

          if (buff != null) {
            upload = await ipfs?.add(buff);
          }

          const thumbnailPath = upload?.path ?? "";
          const externalUrl = filePath ?? "";

          const content = {
            abstract: encodeURIComponent(data.shortDescription),
            body: encodeURIComponent(data.description),
            visualAbstract: data.title,
            attachment: thumbnailPath,
            externalURL: externalUrl,
            tags: tags.map((x) => x.text),
            isDeleted: false,
            isEncrypted: encryption,
            price: data.price ?? 0,
          };

          await createArticle(content)
            .then((result) => {
              setIsSubmitting(false);
              makeAlert("success", "Post Created");
              navigate("/articles");
            })
            .catch((error) => {
              makeAlert("error", "Error creating post");
              setIsSubmitting(false);
            });
        }
      }
    );
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);

    if (watch("thumbnail") != null && ipfs == null) {
      setError("thumbnail", { message: "Thumbnail could not be uploaded" });
    }

    if (watch("file") != null && ipfs == null) {
      setError("file", { message: "File could not be uploaded" });
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
                  createArticleFunc(filePath?.path ?? "", data);
                }
              }
            }
          );
        } else {
          createArticleFunc("", data);
        }
      } catch (e) {
        makeAlert("error", "Error creating post");
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

  const handleResetForm = () => {
    reset();
    setTags([]);
  };

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

  return (
    <Page
      title={"New Article"}
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
        title={"Create Article"}
        footerAlignment={"row-reverse"}
        footer={[
          <CButton
            key={1}
            loading={isSubmitting}
            disabled={isSubmitting || !isValid}
            margin="0 15px 0 0"
            form={"create-article"}
            background={"navy25"}
            backgroundHover={"navy25"}
            color={"white100"}
            type={"submit"}
            startIconSvg={<Publish />}
          >
            Publish Article
          </CButton>,
          <CButton
            background={"gray40"}
            backgroundHover={"gray40"}
            color={"white100"}
            backgroundDisabled={"gray40"}
            onClick={handleResetForm}
          >
            Clear
          </CButton>,
        ]}
      >
        <form
          className="form"
          id="create-article"
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
                controllerName="title"
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
                controllerName="shortDescription"
                rows={5}
                multiline
                errors={errors}
                disabled={isSubmitting}
                label={"Abstract"}
                placeholder={"The abstract of your post"}
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
                placeholder={"Full post Description"}
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
