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
  height?: string;
  color?: string;
  background?: string;
  backgroundHover?: string;
  hoverColor?: string;
  backgroundDisabled?: string;
  border?: string;
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
  fontWeight?: number;
  fontSize?: string;
}

export interface StyledButtonType {
  $height?: string;
  $background: string;
  $backgroundHover: string;
  $hoverColor: string;
  $backgroundDisabled: string;
  $border: string;
  $color: string;
  variant: "outlined" | "filled";
  $fullWidth: boolean;
  size: "s" | "m" | "l";
  $margin: string;
  disableRipple: boolean;
  maxWidth?: string;
  $fontWeight?: number;
  $fontSize?: string;
}

const TmpButton: React.ComponentType<any> = (props) => {
  return <Button {...props} />;
};

const CButtonStyleTwo = styled(TmpButton)<StyledButtonType>`
  && {
    display: flex;
    align-items: center;
    text-align: center;
    justify-content: center;
    box-shadow: none;
    font-family: Inter;
    font-size: ${({ $fontSize }) => ($fontSize ? $fontSize : "16px")};
    font-weight: ${({ $fontWeight }) => ($fontWeight ? $fontWeight : 400)};
    background: ${({ theme, $background, variant }) =>
      variant === "outlined" ? "transparent" : $background};
    color: ${({ theme, $color }) => $color};
    border-radius: 8px;
    border: 1px solid ${({ theme, $border }) => $border};
    transition: all 50ms ease-in-out;
    width: ${({ $fullWidth }) => ($fullWidth === true ? "100%" : "auto")};
    height: ${({ $height }) => ($height ? $height : "fit-content")};
    max-width: ${({ maxWidth }) => (maxWidth ? maxWidth : "")};
    padding: ${({ size }) =>
      size === "s" ? "5px 10px" : size === "l" ? "15px 25px" : "10px 15px"};
    margin: ${({ $margin }) => $margin};
    text-transform: unset;
    transition: 0.3s ease;
    @media (max-width: ${breakpoints.tablet}) {
      font-size: 14px; // Smaller font size for tablet and mobile
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
      background: ${({ theme, $backgroundHover }) => $backgroundHover};
      color: ${({ theme, $hoverColor }) => $hoverColor};
      transition: all 50ms ease-in-out;
      border-color: ${({
        theme,
        $background,
        $backgroundHover,
        variant,
        $border,
      }) => (variant === "outlined" ? theme[$background] : $border)};

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

export const CButtonTwo: React.ComponentType<CButtonType> = (
  props: CButtonType
) => {
  const {
    height = "",
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
    border = "transparent",
    hoverColor = "",
    startIcon,
    startIconSvg,
    loadingColor = "green100",
    maxWidth = null,
    fontWeight = null,
    fontSize = null,
    ...other
  } = props;

  return (
    <CButtonStyleTwo
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
      $fontWeight={fontWeight}
      $height={height}
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
      {loading ? (
        <div className="loader">
          <CLoader color={loadingColor} width={30} height={24} />
        </div>
      ) : (
        props.children
      )}
    </CButtonStyleTwo>
  );
};
