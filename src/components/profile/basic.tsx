import React, { ReactElement, useState } from "react";
import { Grid } from "@mui/material";
import styled from "styled-components";
import { FieldErrors } from "react-hook-form";
import { ControllerTextField } from "../rhf";
import { ControllerTagField } from "../rhf/tag-field";
import { isMobile } from '../../utils/detect-screen'

interface Props {
  control: any;
  errors: FieldErrors;
  skillsArray: any;
  isSubmitting: boolean;
  handleAddSkill: (title: string) => void;
  handleRemoveSkill: (index: number) => void;
}

const Length = styled.div`
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.gray50};
  display: block;
  text-decoration: none;
  margin-top: -30px;
  margin-right: 15px;
`;

export function BasicProfile({
  control,
  errors,
  skillsArray,
  isSubmitting,
  handleAddSkill,
  handleRemoveSkill,
}: Props): ReactElement {
  const handleDelete = (index: number) => {
    handleRemoveSkill(index);
  };

  const handleAddition = (tag: any) => {
    handleAddSkill(tag.text);
  };

  const [length, setLength] = useState<number>(0);
  const handleGetLength = (text: any): void => {
    if (text.target.value === "") setLength(0);
    else setLength(text.target.value.length);
  };

  return (
    <Grid container spacing={2} marginBottom={2} flexDirection={isMobile() ? 'column' : 'row'}>
      <Grid item md={6} sm={12}>
        <ControllerTextField
          controllerInstance={control}
          controllerName="displayName"
          errors={errors}
          background={"gray70"}
          disabled={isSubmitting}
          label={"Full Name"}
          placeholder={"John Doe"}
          controllerRules={{
            maxLength: {
              value: 100,
              message: "Max length 100 char",
            },
          }}
        />
      </Grid>

      <Grid item md={6} sm={12}>
        <ControllerTextField
          controllerInstance={control}
          controllerName="email"
          errors={errors}
          background={"gray70"}
          disabled={isSubmitting}
          label={"Email Address"}
          placeholder={"my@email.com"}
          controllerRules={{
            maxLength: {
              value: 100,
              message: "Max length 100 char",
            },
          }}
        />
      </Grid>

      <Grid item md={12} sm={12}>
        <ControllerTextField
          controllerInstance={control}
          controllerName="bio"
          errors={errors}
          background={"gray70"}
          disabled={isSubmitting}
          label={"Bio"}
          placeholder={"A small bio ..."}
          multiline
          paddingBottom={"40px"}
          controllerRules={
            length !== 0
              ? {
                  maxLength: {
                    value: length != 0 ? 500 : "",
                    message: "Bio can not be more than 500 character",
                  },
                }
              : {}
          }
          onKeyDown={handleGetLength}
          rows={6}
        />
        <Length>
          <p>{length}/500</p>
        </Length>
      </Grid>

      <Grid
        item
        md={12}
        sm={12}
        style={{ marginTop: "20px", marginBottom: "20px" }}
      >
        <h4>Skills</h4>
      </Grid>

      <Grid item md={12} sm={12} key={1}>
        <ControllerTagField
          controllerInstance={control}
          controllerName={`skills.${skillsArray.length}.title`}
          errors={errors}
          disabled={isSubmitting}
          label={"Title"}
          placeholder={"Skill Title"}
          tags={skillsArray.map((item: any, index: number) => ({
            text: item.title,
            id: index.toString(),
          }))}
          handleAddition={handleAddition}
          handleDelete={handleDelete}
        />
      </Grid>
    </Grid>
  );
}
