import { Button } from "@mui/material";
import styled from "styled-components";
import React from "react";
import { CLoader } from "../custom";
const breakpoints = {
  mobile: "320px",
  tablet: "1130px",
  desktop: "1024px",
};

export interface CButtonType {
  children: any;
  color?: string;
  background?: string;
  backgroundHover?: string;
  hoverColor?: string;
  backgroundDisabled?: string;
  variant?: "outlined" | "filled";
  fullWidth?: boolean;
  type?: "submit" | "button";
  size?: "s" | "m" | "l";
  loading?: boolean;
  disabled?: boolean;
  margin?: string;
  onClick?: any;
  form?: string;
  startIcon?: string;
  startIconSvg?: any;
  loadingColor?: string;
  maxWidth?: string;
  fontSize?: string;
  fontWeight?: string;
}

export interface StyledButtonType {
  $background: string;
  $backgroundHover: string;
  $hoverColor: string;
  $backgroundDisabled: string;
  $color: string;
  variant: "outlined" | "filled";
  $fullWidth: boolean;
  size: "s" | "m" | "l";
  $margin: string;
  disableRipple: boolean;
  maxWidth?: string;
  fontSize?: string;
  fontWeight?: string;
}

const TmpButton: React.ComponentType<any> = (props) => {
  return <Button {...props} />;
};

const CButtonStyle = styled(TmpButton)<StyledButtonType>`
  && {
    box-shadow: none;
    font-family: Inter;
    font-size: ${({ fontSize }) => fontSize};
    font-weight: ${({ fontWeight }) => fontWeight};
    background: ${({ theme, $background, variant }) =>
      variant === "outlined" ? "transparent" : theme[$background]};
    color: ${({ theme, $color }) => theme[$color]};
    border-radius: 8px;
    border: 1px solid ${({ theme, $background }) => theme[$background]};
    transition: all 50ms ease-in-out;
    width: ${({ $fullWidth }) => ($fullWidth === true ? "100%" : "auto")};
    max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "")};
    padding: ${({ size }) =>
      size === "s" ? "5px 10px" : size === "l" ? "15px 25px" : "10px 15px"};
    margin: ${({ $margin }) => $margin};
    text-transform: unset;
    transition: 0.3s ease;
    @media (max-width: ${breakpoints.tablet}) {
      font-size: 12px; // Smaller font size for tablet and mobile
      padding: ${({ size }) =>
        size === "s" ? "4px 8px" : size === "l" ? "12px 20px" : "8px 12px"};
    }

    @media (max-width: ${breakpoints.mobile}) {
      font-size: 12px; // Even smaller font size for mobile
    }
    & svg {
      margin-right: 10px;
      fill: ${({ theme, $color }) => theme[$color]};
    }

    > .MuiButton-startIcon {
      margin-right: 0;
    }

    &:hover {
      background: ${({ theme, $backgroundHover }) => theme[$backgroundHover]};
      color: ${({ theme, $hoverColor }) => theme[$hoverColor]};
      transition: all 50ms ease-in-out;
      border-color: ${({ theme, $background, $backgroundHover, variant }) =>
        variant === "outlined" ? theme[$background] : theme[$backgroundHover]};

      & svg {
        margin-right: 10px;
        fill: ${({ theme, $color }) => theme[$color]} !important;
      }
    }

    > .loader {
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-around;
    }
  }

  &&.Mui-disabled {
    background: ${({ theme, $backgroundDisabled }) =>
      theme[$backgroundDisabled]};
    border: 1px solid
      ${({ theme, $backgroundDisabled }) => theme[$backgroundDisabled]};

    &:hover {
      cursor: not-allowed;
    }
  }
`;

export const CButton: React.ComponentType<CButtonType> = (
  props: CButtonType
) => {
  const {
    loading = false,
    disabled = false,
    margin = "0",
    variant = "filled",
    fullWidth = false,
    type = "button",
    size = "md",
    color = "white100",
    background = "blue100",
    backgroundHover = "blue80",
    backgroundDisabled = "gray60",
    hoverColor = "",
    startIcon,
    startIconSvg,
    loadingColor = "green100",
    maxWidth = null,
    fontSize = "16px",
    fontWeight = "400",
    ...other
  } = props;

  return (
    <CButtonStyle
      size={size}
      disabled={disabled}
      disableRipple={true}
      $margin={margin}
      variant={variant}
      $fullWidth={fullWidth}
      type={type}
      $color={color}
      $background={background}
      $backgroundHover={backgroundHover}
      $hoverColor={hoverColor}
      $backgroundDisabled={backgroundDisabled}
      maxWidth={maxWidth}
      fontSize={fontSize}
      fontWeight={fontWeight}
      startIcon={
        startIcon != null ? (
          <span
            className="material-symbols-outlined"
            style={{ marginRight: 4 }}
          >
            {startIcon}
          </span>
        ) : null
      }
      {...other}
    >
      {startIconSvg != null ? startIconSvg : null}
      {props.children}
      {loading ? (
        <div className="loader">
          <CLoader color={loadingColor} width={30} height={24} />
        </div>
      ) : null}
    </CButtonStyle>
  );
};
