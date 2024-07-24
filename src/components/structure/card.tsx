import React, { ReactElement, ReactNode } from "react";
import styled from "styled-components";
import { breakpoints } from "../../config/global-styles";

const Box = styled.div<{ $marginBottom: string; $footerAlignment: string }>`
  background: ${(props) => props.theme.navy80};
  border-radius: 8px;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  border: 1px solid #50505d;

  > .header {
    padding: 15px;
    display: flex;
    flex-direction: row;
    align-items: center;

    > h5 {
      font-size: 16px;
      font-weight: 500;
      color: ${(props) => props.theme.white100};
      flex-grow: 1;
      @media only screen and ((max-width: ${breakpoints.tablet})) {
        font-size: 14px;
      }
    }

    > .actions {
      display: flex;
      flex-direction: row;
      align-items: center;
    }
  }

  > .body {
    padding: 15px;

    & .border {
      width: 100%;
      height: 1px;
      background: ${(props) => props.theme.white100};
    }
  }

  > .footer {
    display: flex;
    flex-direction: ${({ $footerAlignment }) => $footerAlignment};
    align-items: center;
    padding: 15px;

    @media only screen and ((max-width: ${breakpoints.tablet})) {
      flex-direction: row !important;
      justify-content: flex-end;
    }
    > .item {
      margin: 5px;
      @media only screen and ((max-width: ${breakpoints.tablet})) {
        margin: 0;
      }
    }
  }
`;

interface Props {
  title?: string;
  children: ReactNode;
  footer?: ReactNode[];
  actions?: ReactNode[];
  marginBottom?: string;
  footerAlignment?: string;
}

export function Card(props: Props): ReactElement {
  const {
    title,
    children,
    footer,
    actions,
    marginBottom = "0",
    footerAlignment = "row",
  } = props;

  return (
    <Box $marginBottom={marginBottom} $footerAlignment={footerAlignment}>
      {title != null || (actions != null && actions.length > 0) ? (
        <div className={"header"}>
          <h5>{title}</h5>

          <div className={"actions"}>
            {actions?.map((item, i) => (
              <div className={"item"} key={i}>
                {item}
              </div>
            ))}
          </div>
        </div>
      ) : null}

      <div className={"body"}>{children}</div>

      {footer != null && footer.length > 0 ? (
        <div className={"footer"}>
          {footer?.map((item, i) => (
            <div className={"item"} key={i}>
              {item}
            </div>
          ))}
        </div>
      ) : null}
    </Box>
  );
}
