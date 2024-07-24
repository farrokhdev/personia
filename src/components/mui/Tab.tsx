import React, { type ReactElement } from 'react'
import styled from 'styled-components'
import { Tabs, Tab } from '@mui/material'

interface Props {
  constTitle: string
  children: React.ReactNode
  value: number
  index: number
}

export const CTabs = styled(props => {
  return <Tabs {...props} classes={{ indicator: 'indicator' }}></Tabs>
})<{
  $padding?: string
  $marginTop?: string
  $hasBorder?: boolean
  $activeBG?: string
  $activeColor?: string
  $indicatorLine?: boolean
  $height?: string;
  $background?:string
}>`
  && {
    background: ${({ theme, $background }) => theme[$background]};
    margin-top: ${({ $marginTop }) => $marginTop ?? '0'};
    flex: 1;
    min-height: 30px;
    border-bottom: ${({ $hasBorder, theme }) => $hasBorder === true ? `1px solid ${theme.green100 as string}` : 'none'};
    padding-bottom: ${({ $hasBorder }) => $hasBorder === true ? '15px' : '5px'};
    border-radius: ${({ $hasBorder, $indicatorLine }) => $hasBorder === true ? '0' : ($indicatorLine != null && $indicatorLine === true ? '0' : '8px')};
    padding: ${({ $padding }) => $padding ?? '5px'};
    height: ${({ $height }) => $height ?? 'auto'};

    & .MuiTab-root {
      &:hover {
        color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.white100};
        
        > .MuiTab-wrapper {
          color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.white100};
          > .MuiSvgIcon-root {
            color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.white100};
          }
        }
      }

      &.Mui-selected {
        color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.green100};
        border-bottom: 1px solid ${({ theme }) => theme.green100};
        font-weight: 500;
        
        > .MuiTab-wrapper {
          color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.green100};
          > .MuiSvgIcon-root {
            color: ${({ theme, $activeColor }) => $activeColor != null ? theme[$activeColor] : theme.green100};
          }
        }
      }
    }
  }

  && .indicator {
    background: ${({ theme, $activeBG }) => $activeBG != null ? theme[$activeBG] : theme.navy60};
    height: ${({ $indicatorLine }) => $indicatorLine != null && $indicatorLine === true ? '3px' : '100%'};
    border-radius: 8px;
    z-index: 0;
    bottom: -1px;
  }

  &&.MuiTabs-vertical > .MuiTabs-scroller {
    > .indicator {
      background: ${({ theme }) => theme.lightBlue40};
      width: 100%;
      border-radius: 8px;
      z-index: 0;
    }
    > .MuiTabs-flexContainerVertical {
      align-items: center;
      align-content: center;
      > .MuiButtonBase-root {
        width: 100%;
        max-width: 100%;
        min-height: auto;
        padding-top: 13px !important;
        padding-bottom: 10px !important;
        line-height: unset;
        text-align: right;
        font-size: 14px;
        font-weight: 500;
        letter-spacing: 0;
        > .MuiTab-wrapper {
          width: 100%;
          display: inline-flex;
          align-items: start;
          flex-direction: row;
          justify-content: start;
        }
      }
    }
  }
`

export const CTab = styled(Tab) <{ $fullWidth?: boolean, $size?: 'm' | 'l' }>`
  && {
    font-family: Inter;
    font-weight: 500;
    font-size: 14px;
    color: ${({ theme }) => theme.white100};
    text-transform: none;
    z-index: 1;
    ${({ $fullWidth }) => ($fullWidth ?? false) && `
      padding: 0;
      flex-basis: 0;
      flex-grow: 1;
    `}
    ${({ $fullWidth, $size }) => !($fullWidth ?? false) && `
      padding: ${$size === 'l' ? '15px 30px' : '0 15px'};
    `}
    min-width: 50px;
    min-height: 30px;
    
    > .MuiTab-wrapper {
      > .MuiSvgIcon-root {
        margin-bottom: 0;
        margin-left: 20px;
        color: ${({ theme }) => theme.white100};
      }
    }
  }
  > .MuiTouchRipple-root {
    border-radius: 8px;
  }
`

export const CTabIcon = styled(Tab) <{ $fullWidth: boolean }>`
  && {
    font-family: Inter;
    font-weight: 500;
    font-size: 12px;
    color: ${({ theme }) => theme.black80};
    text-transform: none;
    z-index: 1;
    ${({ $fullWidth }) => $fullWidth && `
      padding: 0;
      flex-basis: 0;
      flex-grow: 1;
    `}
    ${({ $fullWidth }) => !$fullWidth && `
      padding: 0 15px 0 15px;
    `}
    min-width: 50px;

    > .MuiSvgIcon-root {
      margin-bottom: 10px;
      color: ${({ theme }) => theme.black60};
    }
  }
  &&.Mui-selected {
    color: ${({ theme }) => theme.blue100};

    > .MuiSvgIcon-root {
      color: ${({ theme }) => theme.blue100};
    }
  }
  > .MuiTouchRipple-root {
    border-radius: 12px;
  }
`

export function CTabPanel (props: Props): ReactElement {
  const { constTitle, children, value, index, ...other } = props

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`${constTitle}-tabpanel-${index}`}
      aria-labelledby={`${constTitle}-tab-${index}`}
      {...other}
    >
      {value === index && (
        children
      )}
    </div>
  )
}
