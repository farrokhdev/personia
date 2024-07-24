import { Badge, IconButton } from '@mui/material'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'
import { CLoader } from '../custom'

interface Props {
  customColor?: string
  customColorHover?: string
  backgroundColor?: string
  backgroundColorHover?: string
  icon?: string
  customSvg?: boolean
  disabled?: boolean
  loading?: boolean
  badgeBackground?: string
  badgeColor?: string
  badgeType?: 'dot' | 'standard'
  counter?: number
  onClick?: any
}

export const CIconButtonStyle = styled(IconButton) <{ $customColor: string, $backgroundColor: string, $customSvg: boolean, $backgroundColorHover: string, $customColorHover: string }>`
  & {
    background-color: ${({ theme, $backgroundColor }) => theme[$backgroundColor]} !important;
    border-radius: 8px !important;
    padding: 10px !important;
    transition: all 50ms ease-in-out;

    & span.material-symbols-outlined {
      color: ${({ theme, $customColor }) => theme[$customColor]};
    }

    &:hover {
      background-color: ${({ theme, $backgroundColorHover }) => theme[$backgroundColorHover]} !important;
      transition: all 50ms ease-in-out;

      & span.material-symbols-outlined {
        color: ${({ theme, $customColorHover }) => theme[$customColorHover]};
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

export function CIconButton (props: Props): ReactElement {
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
    badgeType = 'dot',
    counter = 0,
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
      disableTouchRipple
      {...other}
    >
      {loading
        ? <CLoader width={20} height={20} />
        : <CBadgeStyle $badgeBackground={badgeBackground} $badgeColor={badgeColor} variant={badgeType} badgeContent={counter} invisible={counter === 0}>
          <span className='material-symbols-outlined'>{icon}</span>
        </CBadgeStyle>
      }
    </CIconButtonStyle>
  )
}
