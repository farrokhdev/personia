import { ReactElement, useEffect, useState } from "react";
import { SubmitHandler, useFieldArray, useForm } from "react-hook-form";
import { create, IPFSHTTPClient } from "ipfs-http-client";
import "cropperjs/dist/cropper.min.css";
import { Grid } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { set } from "../../redux/slices/user";
import { Card, Page } from "../../components/structure";
import { ProfileBox } from "../../components/profile";
import { CButton } from "../../components/mui";
import { useGlobalContext } from "../../contexts";
import { CropperJs } from "../../components/custom/cropper";
import { DropZone } from "../../components/custom";
import {
  ProfileFields,
  BasicProfile,
  ProfileField,
} from "../../components/profile";
import { experienceData, educationData } from "../../constant/data";
import { ReactComponent as Update } from "../../assets/svg/update.svg";
import {
  CreateExperiences,
  UpdateExperience,
} from "../../apis/experiences.apis";
import { createEducation, updateEducation } from "../../apis/education.apis";
import { UpdateUser } from "../../apis/user.api";
import { experienceModel } from "../../models/experience.model";
import { educationModel } from "../../models/education.model";

interface Inputs {
  displayName: string;
  email: string;
  bio: string;
  experiences: experienceModel[];
  skills: Array<{ title: string }>;
  educations: educationModel[];
}

export function ProfilePage(): ReactElement {
  const dispatch = useAppDispatch();
  const { makeAlert } = useGlobalContext();
  const user = useAppSelector((state) => state.user);

  const [coverUploading, setCoverUploading] = useState<boolean>(false);
  const [selectedCovers, setSelectedCovers] = useState<File[]>();
  const [selectedCover, setSelectedCover] = useState<File>();
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [avatarUploading, setAvatarUploading] = useState<boolean>(false);
  const [queryError, setQueryError] = useState<boolean>(false);
  const [selectedAvatars, setSelectedAvatars] = useState<File[]>();
  const [selectedAvatar, setSelectedAvatar] = useState<File>();

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
    setValue,
    formState: { errors, isValid },
  } = useForm<Inputs>({
    defaultValues: {
      skills: [{ title: "" }],
    },
  });

  const experiencesArray = useFieldArray({
    control,
    name: "experiences",
  });

  const educationArray = useFieldArray({
    control,
    name: "educations",
  });

  const [skillsArray, setSkillArray] = useState<Array<{ title: string }>>([]);

  const deleteExperienceItem = (index: number) => {
    experiencesArray.update(index, {
      ...experiencesArray.fields[index],
      isDeleted: true,
    });
  };

  const deleteEducationItem = (index: number) => {
    educationArray.update(index, {
      ...educationArray.fields[index],
      isDeleted: true,
    });
  };

  function getNeedUpdateExperiences(experiences: experienceModel[]) {
    const arr1 = user.experiences;
    const differentIndexes = [];
    for (let i = 0; i < arr1?.length; i++) {
      if (
        (experiences[i].title == "" || experiences[i].title == null) &&
        !experiences.every((exp) => exp.isDeleted)
      ) {
        makeAlert("error", "Title can not be empty");
        setQueryError(false);
        break;
      } else {
        if (
          arr1[i].title !== experiences[i].title ||
          arr1[i].city !== experiences[i].city ||
          arr1[i].company !== experiences[i].company ||
          arr1[i].endDate !== experiences[i].endDate ||
          arr1[i].startDate !== experiences[i].startDate ||
          arr1[i].description !== experiences[i].description ||
          arr1[i].isDeleted !== experiences[i].isDeleted
        ) {
          differentIndexes.push({
            title: experiences[i].title,
            city: experiences[i].city,
            company: experiences[i].company,
            endDate: experiences[i].endDate,
            startDate: experiences[i].startDate,
            description: experiences[i].description,
            id: arr1[i].id,
            isDeleted: experiences[i].isDeleted,
          });
        }
      }
    }

    // Return the array of different indexes
    return differentIndexes;
  }

  function getNeedUpdateEducations(education: educationModel[]) {
    const differentIndexes = [];
    const arr1 = user.educations ?? [];
    // Iterate over the arrays and compare elements at each index
    for (let i = 0; i < arr1?.length; i++) {
      if (
        (education[i].title == "" || education[i].title == null) &&
        !education.every((exp) => exp.isDeleted)
      ) {
        makeAlert("error", "Title can not be empty");
        setQueryError(false);
      } else {
        if (
          arr1[i].title !== education[i].title ||
          arr1[i].city !== education[i].city ||
          arr1[i].school !== education[i].school ||
          arr1[i].endDate !== education[i].endDate ||
          arr1[i].startDate !== education[i].startDate ||
          arr1[i].description !== education[i].description ||
          arr1[i].isDeleted !== education[i].isDeleted
        ) {
          differentIndexes.push({
            title: education[i].title,
            school: education[i].school,
            city: education[i].city,
            startDate: education[i].startDate,
            endDate: education[i].endDate,
            description: education[i].description,
            isDeleted: education[i].isDeleted,
            id: arr1[i].id,
          });
        }
      }
    }

    // Return the array of different indexes
    return differentIndexes;
  }

  useEffect(() => {
    (async () => {
      setSkillArray([]);
      setValue("displayName", user?.displayName ?? "", {
        shouldValidate: true,
      });
      setValue("email", user?.email ?? "", { shouldValidate: true });
      setValue("bio", decodeURIComponent(user?.bio ?? ""), {
        shouldValidate: true,
      });
      user.skills
        ?.filter((item) => item != null && item !== "")
        .map((_tag: any) => {
          setSkillArray((skillsArray) => [...skillsArray, { title: _tag }]);
        });
      if (user?.experiences) {
        if (user?.experiences?.length > 0) {
          setValue(
            "experiences",
            user?.experiences
              .filter((item) => !item.isDeleted)
              .map((x) => {
                return {
                  title: x.title ?? "",
                  city: x.city ?? "",
                  company: x.company ?? "",
                  startDate: x.startDate ?? new Date(),
                  endDate: x.endDate ?? undefined,
                  description: decodeURIComponent(x.description ?? ""),
                  isDeleted: x.isDeleted ?? false,
                  id: x.id ?? "",
                };
              }),
            { shouldValidate: true }
          );
        }
      }
      if (user.educations) {
        if (user.educations?.length > 0) {
          setValue(
            "educations",
            user.educations
              // .filter(
              //   (item) => item.title !== null && item.title != ''
              // )
              .map((x) => {
                return {
                  title: x.title ?? "",
                  school: x.school ?? "",
                  city: x.city ?? "",
                  startDate: x.startDate ?? new Date(),
                  endDate: x.endDate ?? undefined,
                  description: decodeURIComponent(x.description ?? ""),
                  isDeleted: x.isDeleted ?? false,
                  id: x.id ?? "",
                };
              }),
            { shouldValidate: true }
          );
        }
      }
    })();
    setQueryError(false);
  }, [user]);

  let ipfs: IPFSHTTPClient | undefined;
  try {
    ipfs = create({
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

  const handleAddSkill = (title: string) => {
    if (setSkillArray.length <= 10)
      setSkillArray((skillsArray) => [...skillsArray, { title: title }]);
    else makeAlert("error", "Skills input reached (MAX 10)");
  };

  const handleRemoveSkill = (index: number) => {
    const skills = [...skillsArray];
    skills.splice(index, 1);
    setSkillArray(skills);
  };

  const onSubmit: SubmitHandler<Inputs> = async (data) => {
    setIsSubmitting(true);
    const { experiences, educations, ...otherData } = data;

    try {
      if (isValid) {
        await UpdateUser({
          displayName: otherData.displayName,
          email: otherData.email,
          avatar: user.avatar ?? "",
          bio: encodeURIComponent(otherData.bio ?? ""),
          cover: user.cover ?? "",
          skills:
            skillsArray == null
              ? [""]
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                skillsArray
                  .filter(
                    (item) => item.title !== undefined && item.title !== ""
                  )
                  .map((item) => {
                    return item.title;
                  }),
          nakamaID: user.nakamaID ?? "",
        })
          .then((res2) => {
            //null
          })
          .catch((e) => {
            console.log(e);
          });

        let addedExperience = 0;
        if (user.experiences) {
          addedExperience = user?.experiences?.length - experiences.length;
        }
        if (addedExperience < 0) {
          const arr = experiences.slice(addedExperience);
          arr
            .filter((x) => x.title != null && x.title != "" && !x.isDeleted)
            .map(async (item) => {
              await CreateExperiences({
                title: item.title ?? "",
                company: item.company ?? "",
                endDate: item.endDate,
                startDate: item.startDate ?? new Date(),
                city: item.city ?? "",
                description: encodeURIComponent(item.description ?? ""),
                isDeleted: item.isDeleted,
              })
                .then((res) => {})
                .catch((err) => {
                  setQueryError(true);
                });
            });
        }
        let addedEducation = 0;
        if (user.educations) {
          addedEducation = user.educations?.length - educations.length;
        }

        if (addedEducation < 0) {
          const arr = educations.slice(addedEducation);
          arr
            .filter((x) => x.title != null && x.title != "" && !x.isDeleted)
            .map(async (item) => {
              await createEducation({
                title: item.title ?? "",
                school: item.school ?? "",
                endDate: item.endDate ?? undefined,
                startDate: item.startDate ?? new Date(),
                city: item.city ?? "",
                description: encodeURIComponent(item.description ?? ""),
              })
                .then((res) => {
                  //null
                })
                .catch(() => {
                  setQueryError(true);
                });
            });
        }

        // update profile
        const needUpdateExperiences = getNeedUpdateExperiences(experiences);
        needUpdateExperiences.map(async (item) => {
          await UpdateExperience(item.id + "", {
            title: item.title ?? "",
            company: item.company ?? "",
            endDate: item.endDate,
            startDate: item.startDate,
            city: item.city ?? "",
            description: encodeURIComponent(item.description ?? ""),
            isDeleted: item.isDeleted,
          })
            .then((res) => {
              console.log("updateProfileExperience", res);
            })
            .catch((err) => {
              setQueryError(true);
            });
        });

        const needUpdateEducations = getNeedUpdateEducations(educations);
        needUpdateEducations.map(async (item) => {
          await updateEducation(item.id ?? "", {
            title: item.title ?? "",
            school: item.school ?? "",
            endDate: item.endDate ?? undefined,
            startDate: item.startDate ?? new Date(),
            city: item.city ?? "",
            description: encodeURIComponent(item.description ?? ""),
            isDeleted: item.isDeleted,
          })
            .then((res) => {})
            .catch((err) => {
              setQueryError(true);
            });
        });
        if (!queryError) {
          dispatch(
            set({
              ...user,
              displayName: otherData.displayName,
              email: otherData.email,
              bio: decodeURIComponent(otherData.bio),
              experiences: experiences.filter(
                (x) => x.title != null && x.title !== ""
              ),
              educations: educations.filter(
                (x) => x.title != null && x.title !== ""
              ),
              skills: skillsArray
                .filter((x) => x.title != null && x.title !== "")
                .map((x) => x.title),
            })
          );

          makeAlert("success", "Profile edited", () => {
            alert("click");
          });
        } else {
          makeAlert("error", "An error in query occurred");
        }
        setIsSubmitting(false);
      } else {
        setIsSubmitting(false);
      }
    } catch (e) {
      setIsSubmitting(false);
      makeAlert("error", "An error occurred");
    }
  };

  const onCropAvatar = async (blob: Blob | null) => {
    setAvatarUploading(true);

    if (blob != null && ipfs != null) {
      const upload = await ipfs?.add(blob);
      if (upload) {
        const updateResult = await UpdateUser({
          avatar: upload.path,
          cover: user.cover,
          displayName: user.displayName,
          email: user.email,
          bio: encodeURIComponent(user.bio ?? ""),
          skills:
            skillsArray == null
              ? [""]
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                skillsArray
                  .filter(
                    (item) => item.title !== undefined && item.title !== ""
                  )
                  .map((item) => {
                    return item.title;
                  }),
          nakamaID: user.nakamaID ?? "",
        });

        if (updateResult) {
          setSelectedAvatars(undefined);
          setSelectedAvatar(undefined);
          dispatch(set({ ...user, avatar: upload.path }));
          makeAlert("success", "Avatar updated");
        } else {
          makeAlert("error", "Avatar could not be uploaded");
        }

        setAvatarUploading(false);
      } else {
        makeAlert("error", "Avatar could not be uploaded");
        setAvatarUploading(false);
      }
    } else {
      makeAlert("error", "Avatar could not be uploaded");
      setAvatarUploading(false);
    }
  };

  const onCropCover = async (blob: Blob | null) => {
    setCoverUploading(true);

    if (blob != null && ipfs != null) {
      const upload = await ipfs?.add(blob);
      if (upload) {
        const updateResult = await UpdateUser({
          cover: upload.path,
          displayName: user.displayName,
          email: user.email,
          avatar: user.avatar ?? "",
          bio: encodeURIComponent(user.bio ?? ""),
          skills:
            skillsArray == null
              ? [""]
              : // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                // @ts-ignore
                skillsArray
                  .filter(
                    (item) => item.title !== undefined && item.title !== ""
                  )
                  .map((item) => {
                    return item.title;
                  }),
          nakamaID: user.nakamaID ?? "",
        });
        if (updateResult) {
          setSelectedCovers(undefined);
          setSelectedCover(undefined);
          dispatch(set({ ...user, cover: upload.path }));
          makeAlert("success", "Cover updated");
        } else {
          makeAlert("error", "Cover could not be uploaded");
        }
        setCoverUploading(false);
      } else {
        makeAlert("error", "Cover could not be uploaded");
        setCoverUploading(false);
      }
    } else {
      makeAlert("error", "Cover could not be uploaded");
      setCoverUploading(false);
    }
  };

  return (
    <Page
      title={"Profile"}
      sidebar={<ProfileBox />}
      sidebar2={<></>}
      topChildren={<></>}
    >
      <Card
        title={"Profile"}
        marginBottom={"15px"}
        footer={[
          <CButton
            key={1}
            loading={isSubmitting}
            disabled={isSubmitting || !isValid}
            background={"navy25"}
            backgroundHover={"navy25"}
            backgroundDisabled={"gray60"}
            margin="0 15px 0 0"
            form={"edit-profile"}
            type={"submit"}
            startIconSvg={<Update />}
          >
            Update Profile
          </CButton>,
        ]}
      >
        <form
          className="form"
          id="edit-profile"
          onSubmit={handleSubmit(onSubmit)}
        >
          <BasicProfile
            control={control}
            errors={errors}
            skillsArray={skillsArray}
            isSubmitting={isSubmitting}
            handleAddSkill={handleAddSkill}
            handleRemoveSkill={handleRemoveSkill}
          />
          <Grid container spacing={2}>
            <Grid item md={12} sm={12}>
              <h4>Experiences</h4>
            </Grid>

            <Grid item md={12} sm={12} key={0}>
              <ProfileField
                name={"experiences"}
                item={{
                  title: "",
                  company: "",
                  city: "",
                  startDate: undefined,
                  endDate: undefined,
                  description: "",
                  isDeleted: false,
                  id: "",
                }}
                index={0}
                data={experienceData}
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                append={(item: experienceModel | experienceModel[]) => {
                  experiencesArray.append(item);
                }}
              />
            </Grid>
            <div style={{ margin: "10px" }}></div>
            {experiencesArray.fields.map((item, index) => {
              return (
                !item.isDeleted && (
                  <Grid item md={12} sm={12} key={item.id}>
                    <ProfileFields
                      name={"experiences"}
                      item={item}
                      index={index}
                      isFirst={false}
                      data={experienceData}
                      array={experiencesArray.fields}
                      control={control}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      append={() => {
                        experiencesArray.append({
                          title: "",
                          company: "",
                          city: "",
                          startDate: undefined,
                          endDate: undefined,
                          description: "",
                          isDeleted: false,
                          id: "",
                        });
                      }}
                      deleteItem={() => deleteExperienceItem(index)}
                    />
                  </Grid>
                )
              );
            })}

            <Grid item md={12} sm={12} style={{ marginTop: "10px" }}>
              <h4>Education</h4>
            </Grid>

            <Grid item md={12} sm={12} key={0}>
              <ProfileField
                name={"educations"}
                item={{
                  title: "",
                  school: "",
                  city: "",
                  startDate: undefined,
                  endDate: undefined,
                  description: "",
                  isDeleted: false,
                  id: "",
                }}
                index={0}
                data={educationData}
                control={control}
                errors={errors}
                isSubmitting={isSubmitting}
                append={(item) => {
                  educationArray.append(item);
                }}
              />
            </Grid>
            <div style={{ margin: "10px" }}></div>
            {educationArray.fields.map((item, index) => {
              return (
                !item.isDeleted && (
                  <Grid item md={12} sm={12} key={item.id}>
                    <ProfileFields
                      key={index}
                      name={"educations"}
                      item={item}
                      index={index}
                      isFirst={false}
                      data={educationData}
                      array={educationArray.fields}
                      control={control}
                      errors={errors}
                      isSubmitting={isSubmitting}
                      append={() => {
                        educationArray.append({
                          title: "",
                          school: "",
                          city: "",
                          startDate: undefined,
                          endDate: undefined,
                          description: "",
                          isDeleted: false,
                          id: "",
                        });
                      }}
                      deleteItem={() => deleteEducationItem(index)}
                    />
                  </Grid>
                )
              );
            })}
          </Grid>
        </form>
      </Card>

      <Card title={"Avatar"} marginBottom={"15px"} footer={[]}>
        {selectedAvatar ? (
          <CropperJs
            src={URL.createObjectURL(selectedAvatar)}
            onCrop={(blob) => {
              onCropAvatar(blob);
            }}
            aspectRatio={1}
            selectedFile={selectedAvatar}
            setSelectedFile={(item) => {
              setSelectedAvatar(item);
              setSelectedAvatars(item);
            }}
            aspectRatioEditable={false}
            submitLoading={avatarUploading}
          />
        ) : (
          <DropZone
            label={"Avatar"}
            disabled={isSubmitting}
            acceptedFiles={[
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
            ]}
            selectedFiles={selectedAvatars}
            type={"avatar"}
            image={"https://greenia.infura-ipfs.io/ipfs/" + user.avatar}
            onSelect={(files) => {
              setSelectedAvatar(files[0]);
              setSelectedAvatars(files);
            }}
          />
        )}
      </Card>

      <Card title={"Cover"} marginBottom={"15px"} footer={[]}>
        {selectedCover ? (
          <CropperJs
            src={URL.createObjectURL(selectedCover)}
            onCrop={(blob) => {
              onCropCover(blob ?? null);
            }}
            aspectRatio={1440 / 450}
            setSelectedFile={(item) => {
              setSelectedCover(item);
              setSelectedCovers(item);
            }}
            selectedFile={selectedCover}
            aspectRatioEditable={false}
            submitLoading={coverUploading}
          />
        ) : (
          <DropZone
            label={"Cover Image"}
            disabled={isSubmitting}
            acceptedFiles={[
              "image/jpeg",
              "image/jpg",
              "image/png",
              "image/gif",
            ]}
            selectedFiles={selectedCovers}
            type={"cover"}
            image={"https://greenia.infura-ipfs.io/ipfs/" + user.cover}
            onSelect={(files) => {
              setSelectedCover(files[0]);
              setSelectedCovers(files);
            }}
          />
        )}
      </Card>
    </Page>
  );
}
