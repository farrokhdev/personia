import { Popper, Tooltip } from '@mui/material'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'

const CTooltipStyle = styled(Tooltip)`
`

const CTooltipPopperStyle = styled(Popper)`
  && {
    z-index: 110 !important;

    > .MuiTooltip-tooltip {
      background: ${props => props.theme[props.style?.backgroundColor ?? 'black80']} !important;
      font-family: Inter !important;
      font-size: 12px !important;
      color: ${({ theme }) => theme.white100} !important;
      border-radius: 8px !important;
      padding: 5px 10px !important;

      > span {
        color: ${props => props.theme[props.style?.backgroundColor ?? 'black80']} !important;
      }
    }
  }
`

interface Props {
  title: string
  placement?: 'top' | 'right' | 'bottom' | 'left'
  children: ReactElement
  direction?: 'ltr' | 'rtl'
  backgroundColor?: string
  open?: boolean
}

export function CTooltip (props: Props): ReactElement {
  const { children, placement = 'top', direction = 'rtl', backgroundColor = 'black80', ...other } = props

  return (
        <CTooltipStyle
            placement={placement}
            arrow
            PopperComponent={(popperProps) => {
              return <CTooltipPopperStyle {...popperProps} />
            }}
            PopperProps={{
              disablePortal: true,
              style: {
                direction,
                backgroundColor
              }
            }}
            {...other}
        >
            {children}
        </CTooltipStyle>
  )
}
