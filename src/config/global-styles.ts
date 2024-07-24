import { createGlobalStyle } from "styled-components";

export const breakpoints = {
  mobile: "320px",
  tablet: "912px",
  minDesktop: "1280px",
  maxDesktop: "1380px",
};

export const breakpointSizes = {
  mobile: 500,
  tablet: 500,
  minDesktop: 1280,
  maxDesktop: 1380,
};

export const LightTheme = {
  white30: "rgba(255, 255, 255, 0.3)",
  white40: "rgba(255, 255, 255, 0.65)",
  white50: "#CACCCE",
  white60: "#FFFFFF0F",
  white80: "#D9D9D9",
  white100: "#FFFFFF",

  gray30: "#B8B7B7A3",
  gray40: "rgba(255, 255, 255, 0.04)",
  gray50: "rgba(255, 255, 255, 0.25)",
  gray60: "#50505D",
  gray70: "rgba(255, 255, 255, 0.05)",
  gray80: "rgba(255, 255, 255, 0.06)",
  gray90: "#40404A",
  gray100: "#26262C",

  black3: "#F7F7F7",
  black5: "#F2F2F2",
  black8: "#EBEBEB",
  black12: "#E0E0E0",
  black20: "#CCCCCC",
  black30: "rgba(0, 0, 0, 0.20)",
  black40: "#999999",
  black50: "#808080",
  black60: "#666666",
  black70: "#4C4C4C",
  black80: "#333333",
  black100: "#212121",
  black: "#000000",

  lightBlue10: "#FBFDFE",
  lightBlue20: "#F5F9FD",
  lightBlue40: "#ECF4FC",
  lightBlue60: "#D9E9F8",
  lightBlue80: "#CAE0F5",
  lightBlue100: "#BCD8F3",

  red10: "#FBF1F2",
  red20: "#F5D9DB",
  red30: "#EEBEC1",
  red40: "rgba(42, 18, 21, 0.40)",
  red50: "#E28E95",
  red60: "#DC7A81",
  red70: "#D6636B",
  red80: "#CF4953",
  red90: "#CC525F",
  red100: "#E84749",
  red110: "#B01924",
  red120: "#A8071A",
  red130: "#88141C",

  blue10: "#F5F8FB",
  blue20: "#DEE9F1",
  blue30: "#C6D9E7",
  blue40: "#B0CADD",
  blue50: "#99BAD4",
  blue60: "#81AACA",
  blue70: "#6A9BC0",
  blue80: "#538BB6",
  blue90: "#1668DC",
  blue100: "#236BA2",
  blue110: "#2B6896",
  blue120: "#265D86",
  blue130: "#225175",

  navy5: "#F3F4F6",
  navy25: "#5229CE",
  navy30: "#2F1775",
  navy40: "#3A1D92",
  navy50: "#4623AF",
  navy60: "#180B41",
  navy70: "#111A2C",
  navy80: "#201A31",
  navy90: "#1F163C",
  navy100: "#140E26",

  green10: "#c6dad4",
  green100: "#39DBB2",
  // green100: '#140E26',

  darkBlue20: "#C1CED7",
  darkBlue80: "#436A85",
  darkBlue90: "#275472",
  darkBlue100: "#003559",

  label1: "#C1121F",
  label1Text: "#FFFFFF",
  label2: "#1952A7",
  label2Text: "#FFFFFF",
  label3: "#199275",
  label3Text: "#FFFFFF",
  label4: "#DFA100",
  label4Text: "#FFFFFF",
  label5: "#6B1992",
  label5Text: "#FFFFFF",
  label6: "#FFDDDF",
  label6Text: "#333333",
  label7: "#C0F0FF",
  label7Text: "#333333",
  label8: "#ABF2D4",
  label8Text: "#333333",
  label9: "#FFED8C",
  label9Text: "#333333",
  label10: "#D3C3FF",
  label10Text: "#333333",

};
export const DarkTheme = {};

// eslint-disable-next-line no-mixed-operators
const GlobalStyles = createGlobalStyle<{
  theme: {
    black80: string;
    white40: string;
    white30: string;
    gray60: string;
    gray40: string;
    white100: string;
    navy100: string;
    gray80: string;
    gray70: string;
  };
}>`
    a {
        text-underline: none;
        text-decoration: none;
    }

    .grid-mobile {
        @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
            flex-direction: column !important;
        }
    }

    iframe#webpack-dev-server-client-overlay {
        display: none !important;
    }

    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
        font-family: Inter, sans-serif;
    }

    body {
        background: ${(props) => props.theme.navy100};
        font-family: Inter, sans-serif;
    }

    #root {
        margin: 0 auto;
    }

    .material-symbols-outlined {
        font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 48
    }

    ::-webkit-scrollbar {
        background: ${(props) => props.theme.gray70};
        width: 8px;
        margin-left: 10px;
    }

    /* Track */

    ::-webkit-scrollbar-track {
        border-radius: 10px;
    }

    /* Handle */

    ::-webkit-scrollbar-thumb {
        background: ${(props) => props.theme.gray80};
        border-radius: 10px;
    }

    h4 {
        color: ${(props) => props.theme.white100};
    }

    p.css-e784if-MuiTypography-root {
        color: ${(props) => props.theme.white100};
    }

    .datepicker {
        width: 100%;

        & p {
            color: ${(props) => props.theme.white100};
        }

        & input {
            color: ${(props) => props.theme.white100} !important;
        }

        & button {
            color: ${(props) => props.theme.gray60};
        }

        & .MuiOutlinedInput-root {
            color: ${(props) => props.theme.white100};
            background: ${(props) => props.theme.gray70};
            border: 1px solid ${(props) => props.theme.white30};
            border-radius: 8px;
            width: 100%;
            flex-direction: row-reverse;

            &:hover {
                border: 1px solid ${({ theme }) => theme.black80};
            }
        }

        & .MuiOutlinedInput-notchedOutline {
            border: 1px solid ${({ theme }) => theme.black80} !important;
        }

        & div:first-child {
            & div:first-child {
                width: 100%;
            }
        }
    }


    .accordion {
        background: ${(props) => props.theme.gray40} !important;

        span {
            color: ${(props) => props.theme.white100} !important;
        }
    }


    .ReactTags__tags {
        position: relative;
    }

    .ReactTags__clearAll {
        cursor: pointer;
        padding: 10px;
        margin: 10px;
        background: #f88d8d;
        color: #fff;
        border: none;
    }

    /* Styles for the input */
    .ReactTags__tagInput {
        border-radius: 12px;
        display: inline-block;
        width: 100%;
    }

    .ReactTags__tagInput input.ReactTags__tagInputField {
        margin: 0;
        font-size: 14px;
        font-family: Inter;
        background: ${(props) => props.theme.gray70};
        border: 1px solid ${({ theme }) => theme.white30};
        border-radius: 8px;
        font-weight: 500;
        color: ${({ theme }) => theme.white100};
        width: 100%;
        padding: 15px;
        min-width: 150px;

        &:hover {
            border: 1px solid ${({ theme }) => theme.black80};
        }

        &:focus {
            border: 1px solid ${({ theme }) => theme.white40};
        }
    }

    .ReactTags__editInput {
        border-radius: 1px;
    }

    .ReactTags__editTagInput {
        display: grid;
        justify-content: space-between;
        grid-gap: 15px;
    }


    .ReactTags__selected span.ReactTags__tag {
        border: 1px solid ${({ theme }) => theme.white30};
        background: ${(props) => props.theme.gray70};
        color: ${(props) => props.theme.white100};
        font-size: 14px;
        display: inline-flex;
        padding: 10px 24px;
        margin-right: 10px;
        margin-top: 10px;
        border-radius: 5px;
        justify-content: space-between;
    }

    .ReactTags__selected button.ReactTags__remove {
        color: ${({ theme }) => theme.white30};
        margin-left: 15px;
        cursor: pointer;
    }

    /* Styles for suggestions */
    .ReactTags__suggestions {
        position: absolute;
    }

    .ReactTags__suggestions ul {
        list-style-type: none;
        box-shadow: 0.05em 0.01em 0.5em rgba(0, 0, 0, 0.2);
        background: white;
        width: 200px;
    }

    .ReactTags__suggestions li {
        border-bottom: 1px solid #ddd;
        padding: 5px 10px;
        margin: 0;
    }

    .ReactTags__suggestions li mark {
        text-decoration: underline;
        background: none;
        font-weight: 600;
    }

    .ReactTags__suggestions ul li.ReactTags__activeSuggestion {
        background: #b7cfe0;
        cursor: pointer;
    }

    .ReactTags__remove {
        border: none;
        cursor: pointer;
        background: none;
        color: white;
    }

    .MuiListItem-root {
        padding: 0 !important;
    }

    .right-text {
        text-align: right;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .left-text {
        text-align: left;
        margin-top: 10px;
        margin-bottom: 10px;
    }

    .MuiPaper-root {
        box-shadow: none !important;
    }

    .quill {
        border: 1px solid ${({ theme }) => theme.white30};
        background: ${(props) => props.theme.gray70};
        color: ${(props) => props.theme.white100};
        font-size: 14px;
        height: 300px !important;
        border-radius: 5px;
        justify-content: space-between;

        &:hover {
            border: 1px solid ${({ theme }) => theme.black80};
        }

        &:focus {
            border: 1px solid ${({ theme }) => theme.white40};
        }

    }

    .w-100 {
        width: 100%;
        border-radius: 8px;
    }
`;

export default GlobalStyles;
