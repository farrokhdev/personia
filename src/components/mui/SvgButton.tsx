import { Badge, IconButton } from '@mui/material'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'
import { CLoader } from '../custom'

interface Props {
  customColor?: string
  customColorHover?: string
  backgroundColor?: string
  borderColor?: string
  backgroundColorHover?: string
  icon: any
  customSvg?: boolean
  disabled?: boolean
  loading?: boolean
  badgeBackground?: string
  badgeColor?: string
  badgeType?: 'dot' | 'standard'
  counter?: number
  onClick?: any
  loadingColor?:string
}

export const CIconButtonStyle = styled(IconButton) <{ $borderColor: string, $customColor: string, $backgroundColor: string, $customSvg: boolean, $backgroundColorHover: string, $customColorHover: string }>`
  & {
    background-color: ${({ theme, $backgroundColor }) => theme[$backgroundColor]} !important;
    border: 1px solid ${({ theme, $borderColor }) => $borderColor === 'transparent' ? 'transparent' : theme[$borderColor]} !important;
    border-radius: 8px !important;
    padding: 10px !important;
    transition: all 50ms ease-in-out;
    span{

      color: ${({ theme, $customColor }) => $customColor ? $customColor : theme[$customColor] };
    }
    color: ${({ theme, $customColor }) => $customColor ? $customColor : theme[$customColor] };

    & span>svg {
      stroke: ${({ theme, $customColor }) => $customColor ? $customColor : theme[$customColor] };
      fill: ${({ theme, $customColor }) => $customColor ? $customColor : theme[$customColor]};
    }

    &:hover {
      background-color: ${({ theme, $backgroundColorHover }) => theme[$backgroundColorHover]} !important;
      transition: all 50ms ease-in-out;

      & span>svg {
        stroke: ${({ theme, $customColorHover }) => theme[$customColorHover]};
        fill: ${({ theme, $customColorHover }) => theme[$customColorHover]}; 
      }
    }
  }  
`

const BadgeTmp = (props: any): ReactElement => {
  return (<Badge {...props} />)
}

const CBadgeStyle = styled(BadgeTmp) <{ $badgeBackground: string, $badgeColor: string }>`
  && .MuiBadge-badge {
    min-width: 6px !important;
    width: 6px !important;
    height: 6px !important;
    min-height: 6px !important;
    border-radius: 3px !important;
    top: 0px;
    right: 0px;
    background: ${props => props.theme[props.$badgeBackground]};
    color: ${props => props.theme[props.$badgeColor]};
    font-size: 7px;
    font-weight: 500;
  }
`

export function CSvgButton (props: Props): ReactElement {
  const {
    customSvg = true,
    disabled = false,
    loading = false,
    icon,
    customColor = 'black60',
    customColorHover = 'blue100',
    backgroundColor = 'white100',
    backgroundColorHover = 'lightBlue20',
    badgeBackground = 'red100',
    badgeColor = 'white100',
    borderColor = 'transparent',
    badgeType = 'dot',
    counter = 0,
    loadingColor='green100',
    ...other
  } = props

  return (
    <CIconButtonStyle
      disabled={disabled}
      $customSvg={customSvg}
      $customColor={customColor}
      $customColorHover={customColorHover}
      $backgroundColor={backgroundColor}
      $backgroundColorHover={backgroundColorHover}
      $borderColor={borderColor}
      disableTouchRipple
      {...other}
    >
      {loading
        ? <CLoader width={20} height={20}  color={loadingColor} />
        : <CBadgeStyle $badgeBackground={badgeBackground} $badgeColor={badgeColor} variant={badgeType} badgeContent={counter} invisible={counter === 0}>
          {icon}
        </CBadgeStyle>
      }
    </CIconButtonStyle>
  )
}
