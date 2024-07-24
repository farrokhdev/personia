import styled from "styled-components";
import React, { ReactElement, useState } from "react";
import { CIconButton, CTextField } from "../mui";
import { FieldErrors } from "react-hook-form";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs from "dayjs";
import { breakpoints } from "../../config/global-styles";
import { experienceModel } from "../../models/experience.model";
import { educationModel } from "../../models/education.model";

const Flex = styled.div<{ marginRight: string }>`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;

  > *:first-child {
    flex-grow: 1;
    margin-right: ${({ marginRight }) => marginRight};
  }
`;

const Length = styled.div`
  text-align: right;
  font-size: 14px;
  font-weight: 500;
  color: ${(props) => props.theme.gray50};
  display: block;
  text-decoration: none;
  margin-top: -40px;
  margin-right: 25px;
`;

type item = {
  title?: string;
  city?: string;
  id?: string;
  company?: string;
  school?: string;
  startDate?: Date | undefined;
  endDate?: Date | undefined;
  description?: string;
  isDeleted?: boolean;
};

interface Props {
  name: string;
  item: item;
  index: number;
  control: any;
  errors: FieldErrors;
  data: {
    name: string;
    placeholder?: string;
  }[];
  isSubmitting?: boolean;
  append: (item: experienceModel | educationModel) => void;
}

export function ProfileField({
  name,
  item,
  isSubmitting,
  append,
}: Props): ReactElement {
  const [length, setLength] = useState<number>(item.description?.length ?? 0);

  const [title, setTitle] = useState<string>("");
  const [titleError, setTitleError] = useState<string>("");

  const [companyName, setCompanyName] = useState<string>("");
  const [companyNameError, setCompanyNameError] = useState<string>("");

  const [schoolName, setSchoolName] = useState<string>("");
  const [schoolNameError, setSchoolNameError] = useState<string>("");

  const [city, setCity] = useState<string>("");
  const [cityError, setCityError] = useState<string>("");

  const [startDate, setStartDate] = useState<undefined | string>("");

  const [endDate, setEndDate] = useState<undefined | string>("");

  const [description, setDescription] = useState<string>("");
  const [descriptionError, setDescriptionError] = useState<string>("");

  return (
    <div>
      <Flex marginRight={"15px"}>
        {name === "experiences" ? (
          <CTextField
            disabled={isSubmitting}
            label={"Title"}
            hasError={!!titleError}
            helperText={titleError}
            defaultValue={item.title}
            value={title}
            placeholder={"Ex: Retail Sales Manager"}
            onChange={(event) => {
              item.title = event.target.value;
              setTitle(event.target.value);
              if (event.target.value.length > 100) {
                setTitleError("Input can not be more than 100 character");
              }
            }}
          />
        ) : (
          <CTextField
            disabled={isSubmitting}
            label={"Field of Study"}
            defaultValue={item.title}
            hasError={!!titleError}
            helperText={titleError}
            placeholder={"EX: Computer software engineering"}
            onChange={(event) => {
              item.title = event.target.value;
              if (event.target.value.length > 100) {
                setTitleError("Input can not be more than 100 character");
              }
            }}
          />
        )}
        <CIconButton
          loading={isSubmitting}
          disabled={isSubmitting}
          onClick={() => {
            append(item);

            item.title = "";
            item.school = "";
            item.company = "";
            item.city = "";
            item.startDate = undefined;
            item.endDate = undefined;
            item.description = "";

            setTitle("");
            setTitleError("");

            setCompanyName("");
            setCompanyNameError("");

            setCity("");
            setCityError("");

            setSchoolName("");
            setSchoolNameError("");

            setStartDate("");

            setEndDate("");

            setDescription("");
            setDescriptionError("");

            setLength(0);
          }}
          icon="add"
        />
      </Flex>
      <Flex marginRight={"15px"}>
        {name === "experiences" ? (
          <CTextField
            disabled={isSubmitting}
            label={"Company Name"}
            hasError={!!companyNameError}
            helperText={companyNameError}
            defaultValue={item.company}
            value={companyName}
            onChange={(event) => {
              item.company = event.target.value;
              setCompanyName(event.target.value);
              if (event.target.value.length > 100) {
                setCompanyNameError("Input can not be more than 100 character");
              }
            }}
            placeholder={"Ex: Microsoft"}
          />
        ) : (
          <CTextField
            disabled={isSubmitting}
            label={"School Name"}
            placeholder={"Ex: Boston University"}
            hasError={!!schoolNameError}
            helperText={schoolNameError}
            defaultValue={item.school}
            value={schoolName}
            onChange={(event) => {
              item.school = event.target.value;
              setSchoolName(event.target.value);
              if (event.target.value.length > 100) {
                setSchoolNameError("Input can not be more than 100 character");
              }
            }}
          />
        )}
        <CTextField
          disabled={isSubmitting}
          label={"City"}
          placeholder={"Ex: London"}
          hasError={!!cityError}
          helperText={cityError}
          defaultValue={item.city}
          value={city}
          onChange={(event) => {
            item.city = event.target.value;
            setCity(event.target.value);
            if (event.target.value.length > 100) {
              setCityError("Input can not be more than 100 character");
            }
          }}
        />
      </Flex>
      <Flex marginRight={"15px"}>
        <div className={"datepicker"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DemoItem label={"Start date"}>
                <DatePicker
                  value={dayjs(startDate) ?? null}
                  defaultValue={
                    item.startDate != null ? dayjs(item.startDate) : null
                  }
                  className={"datepicker"}
                  onChange={(val) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    item.startDate = val
                      ? `${val?.toDate()?.getFullYear()}-${(
                          val?.toDate()?.getMonth() + 1
                        )
                          ?.toString()
                          ?.padStart(
                            2,
                            "0"
                          )}-${val
                          .toDate()
                          ?.getDate()
                          .toString()
                          .padStart(2, "0")}`
                      : undefined;

                    setStartDate(
                      val
                        ? `${val?.toDate()?.getFullYear()}-${(
                            val?.toDate()?.getMonth() + 1
                          )
                            ?.toString()
                            ?.padStart(
                              2,
                              "0"
                            )}-${val
                            .toDate()
                            ?.getDate()
                            .toString()
                            .padStart(2, "0")}`
                        : undefined
                    );
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div className={"datepicker"}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DemoContainer components={["DatePicker", "DatePicker"]}>
              <DemoItem label={"End date (or expected)"}>
                <DatePicker
                  value={dayjs(endDate)}
                  defaultValue={
                    item.endDate != null ? dayjs(item.endDate) : null
                  }
                  className={"datepicker"}
                  onChange={(val) => {
                    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                    // @ts-ignore
                    item.endDate = val
                      ? `${val?.toDate()?.getFullYear()}-${(
                          val?.toDate()?.getMonth() + 1
                        )
                          ?.toString()
                          ?.padStart(
                            2,
                            "0"
                          )}-${val
                          .toDate()
                          ?.getDate()
                          .toString()
                          .padStart(2, "0")}`
                      : undefined;

                    setEndDate(
                      val
                        ? `${val?.toDate()?.getFullYear()}-${(
                            val?.toDate()?.getMonth() + 1
                          )
                            ?.toString()
                            ?.padStart(
                              2,
                              "0"
                            )}-${val
                            .toDate()
                            ?.getDate()
                            .toString()
                            .padStart(2, "0")}`
                        : undefined
                    );
                  }}
                />
              </DemoItem>
            </DemoContainer>
          </LocalizationProvider>
        </div>
      </Flex>
      <>
        <Flex marginRight={"0"}>
          <CTextField
            disabled={isSubmitting}
            label={"Description"}
            multiline
            rows={7}
            placeholder={""}
            hasError={!!descriptionError}
            helperText={descriptionError}
            defaultValue={item.description}
            value={description}
            onChange={(event) => {
              item.description = event.target.value;
              setDescription(event.target.value);
              if (event.target.value.length > 1000) {
                setDescriptionError(
                  "Input can not be more than 1000 character"
                );
              } else {
                setLength(event.target.value.length);
              }
            }}
          />
        </Flex>
        <Length>
          <p>{length}/1000</p>
        </Length>
      </>
    </div>
  );
}
