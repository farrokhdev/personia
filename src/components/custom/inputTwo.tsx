import React, { ReactElement } from "react";
import styled from "styled-components";
import Key from "../../assets/svg/Key.svg";

export interface StyledInputType {
  $background: string;
  $height: string;
  $color: string;
  $border: string;
}

const Input = styled.div<StyledInputType>`
  display: flex;
  border-radius: 8px;
  align-items: flex-start;
  width: 100%;
  flex-direction: column;
  gap: 0.5rem;
  > .label-box {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    img {
      width: 25px;
    }
  }

  > label {
    font-size: 14px;
    font-weight: bold;
    display: block;
    margin-bottom: 5px;
    color: ${({ theme, $color }) => theme[$color]};
  }

  > input,
  > .wallet-box {
    width: 100%;
    outline: none;
    height: ${({ $height }) => $height}px;
    color: ${({ theme, $color }) => theme[$color]};
    background: ${({ theme, $background }) => theme[$background]};
    padding: 0 10px;
    border: none;
    border: 1px solid ${({ theme, $border }) => theme[$border]};
    border-radius: 8px;
  }
  > .wallet-box {
    display: flex;
    align-items: center;
    justify-content: center;
    text-align: center;
    > .inside {
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 0.2rem;
      span {
        font-size: 12px;
      }
    }
  }

  > .material-symbols-outlined {
    background: ${({ theme, $background }) => theme[$background]};
    color: ${({ theme, $color }) => theme[$color]};
    height: ${({ $height }) => $height}px;
    padding: 5px;
  }
  > .alert {
    color: #cf1322;
    font-size: 12px;
  }
`;

interface Props {
  name: string;
  placeholder: string;
  label: string;
  onChange?: (value: any) => void;
  onClick?: () => void;
  disabled?: boolean;
  type?: "text" | "email" | "password" | "file";
  value?: any;
  icon?: string;
  background?: string;
  height?: string;
  color?: string;
  border?: string;
  alert?: string;
  boxType?: "metamask";
  boxIcon?: any;
  boxText?: string;
}

export function MyInputTwo(props: Props): ReactElement {
  const {
    name,
    label,
    placeholder,
    onChange,
    onClick,
    disabled = false,
    type = "text",
    value,
    icon,
    background = "white100",
    height = "35",
    color = "black100",
    border = "black100",
    alert = "required field",
    boxType = null,
    boxIcon = null,
    boxText = null,
  } = props;

  return (
    <>
      {!boxType ? (
        <Input
          $background={background}
          $height={height}
          $border={border}
          $color={color}
          onClick={onClick}
        >
          <label>{label}</label>
          <input
            name={name}
            placeholder={placeholder}
            disabled={disabled}
            autoComplete={"off"}
            onChange={onChange}
            type={type}
            value={value}
          />
          {icon != null ? (
            <span className="material-symbols-outlined">{icon}</span>
          ) : null}
          <div className="alert">{alert}</div>
        </Input>
      ) : (
        <Input
          $background={background}
          $height={height}
          $border={border}
          $color={color}
          onClick={onClick}
        >
          <div className="label-box">
            <img src={boxIcon} alt="" />
            {/* {boxIcon} */}
            <label>{label}</label>
          </div>
          <div className="wallet-box">
            <div className="inside">
              <img src={Key} alt="" />
              <span>{boxText}</span>
            </div>
          </div>
        </Input>
      )}
    </>
  );
}
