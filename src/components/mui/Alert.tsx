import { Alert } from '@mui/material'
import React, { type ReactElement } from 'react'
import styled from 'styled-components'

const AlertStyle = styled(Alert) <{ $backgroundColor: string, $color: string, $iconColor: string, $marginBottom: string }>`
  && {
    border-radius: 8px;
    background-color: ${({ $backgroundColor, theme }) => theme[$backgroundColor]};
    margin-bottom: ${({ $marginBottom }) => $marginBottom};

    > .MuiAlert-icon {
        margin-left: 12px;
        margin-right: 0;
        display: none;

        > svg {
            color: ${({ $iconColor, theme }) => theme[$iconColor]};
            fill: ${({ $iconColor, theme }) => theme[$iconColor]};
        }
    }

    > .MuiAlert-message {
        font-family: Inter;
        font-size: 14px;
        font-weight: 500;
        color: ${({ $color, theme }) => theme[$color]};
    }
  }
`

interface Props {
  children: string
  type?: 'success' | 'error' | 'warning' | 'info'
  marginBottom?: string
}

export function CAlert (props: Props): ReactElement {
  const { children, type = 'info', marginBottom = '0' } = props

  let backgroundColor = 'lightBlue20'
  let color = 'black80'
  let iconColor = 'blue100'

  if (type === 'error') {
    backgroundColor = 'red10'
    color = 'black80'
    iconColor = 'red100'
  }

  return (
        <AlertStyle
            severity={type}
            $backgroundColor={backgroundColor}
            $color={color}
            $iconColor={iconColor}
            $marginBottom={marginBottom}
        >
            {children}
        </AlertStyle>
  )
}
