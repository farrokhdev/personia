import styled from "styled-components";
import React, { ReactElement, useState } from "react";
import { CIconButton } from "../mui";
import { ControllerTextField, ControllerDaypickerField } from "../rhf";
import { FieldErrors } from "react-hook-form";
import { Accordion, AccordionDetails, AccordionSummary } from "@mui/material";

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
  array: item[];
  data: {
    name: string;
    placeholder?: string;
  }[];
  isSubmitting?: boolean;
  append: () => void;
  deleteItem: () => void;
  isFirst: boolean;
}

export function ProfileFields({
  name,
  item,
  index,
  data,
  control,
  errors,
  isSubmitting,
  deleteItem,
}: Props): ReactElement {
  const numbers = Array.from(
    { length: Object.keys(data).length },
    (_, index) => index
  );
  const keys = Object.keys(item);

  const [length, setLength] = useState<number>(item.description?.length ?? 0);
  const handleGetLength = (text: any) => {
    if (text.target.value === "") setLength(0);
    else setLength(text.target.value.length);
  };

  return (
    <Accordion className={"accordion"}>
      <AccordionSummary aria-controls="panel1a-content" id="panel1a-header">
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            width: "100%",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              width: "100%",
              alignItems: "center",
            }}
          >
            <span>{item.title}</span>
            <span>{item.company || item.school}</span>
            <span>
              {(item.startDate
                ? new Date(item.startDate).toLocaleDateString().split("-")[0]
                : "") +
                " - " +
                (item.endDate
                  ? new Date(item.endDate).toLocaleDateString().split("-")[0]
                  : "Present")}
            </span>

            <div style={{ float: "right" }}>
              <CIconButton
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={deleteItem}
                backgroundColor={"transparent"}
                backgroundColorHover={"transparent"}
                icon="delete"
              />
            </div>

            <div style={{ float: "right" }}>
              <CIconButton
                loading={isSubmitting}
                disabled={isSubmitting}
                onClick={deleteItem}
                backgroundColor={"transparent"}
                backgroundColorHover={"transparent"}
                icon="delete"
              />
            </div>
          </div>
          |
        </div>
      </AccordionSummary>
      <AccordionDetails>
        <div>
          {numbers.map((i) => {
            return i == 3 ? (
              <Flex marginRight={"15px"}>
                <ControllerDaypickerField
                  label={"Start date"}
                  controllerInstance={control}
                  controllerName={`${name}.${index}.${keys[i]}`}
                />
                <ControllerDaypickerField
                  label={"End date (or expected)"}
                  controllerInstance={control}
                  controllerName={`${name}.${index}.${keys[i + 1]}`}
                />
              </Flex>
            ) : i == 0 ? (
              <Flex marginRight={"0"}>
                <ControllerTextField
                  controllerInstance={control}
                  controllerName={`${name}.${index}.${keys[i]}`}
                  errors={errors}
                  disabled={isSubmitting}
                  label={data[i].name}
                  placeholder={data[i].placeholder ?? ""}
                  controllerRules={{
                    maxLength: {
                      value: 100,
                      message: "Input can not be more than 100 character",
                    },
                  }}
                />
              </Flex>
            ) : i == 1 ? (
              <Flex marginRight={"15px"}>
                <ControllerTextField
                  controllerInstance={control}
                  controllerName={`${name}.${index}.${keys[i]}`}
                  errors={errors}
                  disabled={isSubmitting}
                  label={data[i].name}
                  placeholder={data[i].placeholder ?? ""}
                  controllerRules={{
                    maxLength: {
                      value: 100,
                      message: "Input can not be more than 100 character",
                    },
                  }}
                />
                <ControllerTextField
                  controllerInstance={control}
                  controllerName={`${name}.${index}.${keys[i + 1]}`}
                  errors={errors}
                  disabled={isSubmitting}
                  label={data[i + 1].name}
                  placeholder={data[i + 1].placeholder ?? ""}
                  controllerRules={{
                    maxLength: {
                      value: 100,
                      message: "Input can not be more than 100 character",
                    },
                  }}
                />
              </Flex>
            ) : (
              i != 4 &&
              i != 1 &&
              i != 2 && (
                <>
                  <Flex marginRight={"0"}>
                    <ControllerTextField
                      controllerInstance={control}
                      controllerName={`${name}.${index}.${keys[i]}`}
                      errors={errors}
                      disabled={isSubmitting}
                      label={data[i].name}
                      placeholder={data[i].placeholder ?? ""}
                      multiline
                      onKeyDown={handleGetLength}
                      paddingBottom={"40px"}
                      rows={data[i].name == "Description" ? 3 : 1}
                      controllerRules={
                        length !== 0
                          ? {
                              maxLength: {
                                value: length != 0 ? 1000 : "",
                                message:
                                  "Description can not be more than 1000 character",
                              },
                            }
                          : {}
                      }
                    />
                  </Flex>
                  <Length>
                    <p>{length}/1000</p>
                  </Length>
                </>
              )
            );
          })}
        </div>
      </AccordionDetails>
    </Accordion>
  );
}
