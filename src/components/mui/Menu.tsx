import { Menu, type MenuProps } from '@mui/material'
import styled from 'styled-components'
import Fade from '@mui/material/Fade'
import MenuItem from '@mui/material/MenuItem'
import React, { type ReactElement } from 'react'
import { isDesktop } from '../../utils/detect-screen'
import { breakpoints } from '../../config/global-styles'

const CMenuStyle = styled(Menu)<{
  $padding: string
  $minWidth: string | undefined
  left: string
}>`
  && .MuiPaper-root {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
    border-bottom-right-radius: 8px;
    background: ${({ theme }) => theme.navy100};
    box-shadow: 0 10px 20px 0 rgb(0 0 0 / 5%);
    min-width: ${({ $minWidth }) => ($minWidth != null ? $minWidth : 'auto')};
    border: 0.5px solid ${({ theme }) => theme.white30};
    margin-left: -${({ left }) => left}px;
    margin-top: 10px;
  }

  && .MuiList-root {
    margin: 0;
    padding: ${props => props.$padding};
  }

  && a {
    color: ${({ theme }) => theme.black80};
    font-family: 'Yekan Bakh';
    text-decoration: none !important;
  }

  @media only screen and ((max-width: ${breakpoints.tablet})) {
    && .MuiPaper-root {
      margin-left: 0px;
    }
  }
`

const CMenuItemStyle = styled(MenuItem)<MenuItemStyleProps>`
  && {
    border-radius: 8px;
    color: ${({ theme, $color }) => theme[$color]} !important;
    font-size: 14px;
    font-weight: 500;
    font-family: Inter;
    transition: all 0.05s ease-in-out;
    text-decoration: none !important;

    &:hover {
      transition: all 0.05s ease-in-out;
    }
  }

  & a {
    text-decoration: none;
  }
`

const MenuItemWithIcon = styled(MenuItem)<{
  $color?: string
  $colorIcon?: string
}>`
  display: flex;
  flex-direction: row;
  align-items: center;
  text-decoration: none !important;

  > span.title {
    ${props =>
      props.theme.dir === 'rtl' ? 'margin-right: 15px' : 'margin-left: 15px'};
    font-size: 14px;
    font-weight: 600;
    color: ${({ theme, $color }) =>
      $color != null ? theme[$color] : theme.black80};
    flex-grow: 1;
    margin-left: 0 !important;
    text-decoration: none !important;
  }

  > .icon {
    color: ${({ theme, $colorIcon }) =>
      $colorIcon != null ? theme[$colorIcon] : theme.black50};
    margin-left: 15px;
    font-size: 16px;
    text-decoration: none !important;
  }
`

interface CMenuProps extends MenuProps {
  anchorOriginVertical?: 'top' | 'bottom'
  transformOriginVertical?: 'top' | 'bottom'
  anchorOriginHorizontal?: 'left' | 'right'
  transformOriginHorizontal?: 'left' | 'right'
  padding?: string
  minWidth?: string
  left?: string
  leftMobile?: string
}

export function CMenu(props: CMenuProps): ReactElement {
  const {
    id,
    anchorOriginVertical = 'bottom',
    anchorOriginHorizontal = 'right',
    transformOriginVertical = 'top',
    transformOriginHorizontal = 'right',
    padding = '5px',
    left = '100',
    leftMobile = '20',
    minWidth,
    ...other
  } = props

  return (
    <CMenuStyle
      $padding={padding}
      $minWidth={minWidth}
      left={isDesktop() ? left : leftMobile}
      id={id}
      {...other}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
      TransitionComponent={Fade}
      anchorOrigin={{
        vertical: anchorOriginVertical,
        horizontal: anchorOriginHorizontal,
      }}
      transformOrigin={{
        vertical: transformOriginVertical,
        horizontal: transformOriginHorizontal,
      }}
    >
      {props.children}
    </CMenuStyle>
  )
}

interface MenuItemProps {
  children: React.ReactNode
  color?: string
  onClick?: (event?: any) => void
}

type MenuItemType = typeof MenuItem

interface MenuItemStyleProps extends MenuItemType {
  onClick?: (event?: any) => void
  $color: string
}

export function CMenuItem(props: MenuItemProps): ReactElement {
  const { children, color = 'black80', ...other } = props

  return (
    <CMenuItemStyle disableTouchRipple={true} $color={color} {...other}>
      {children}
    </CMenuItemStyle>
  )
}

interface MenuItemWithIconProps {
  icon: string
  title: string
  color?: string
  colorIcon?: string
  onClick?: (event?: any) => void
}

export function CMenuItemWithIcon(props: MenuItemWithIconProps): ReactElement {
  const { icon, title, color, colorIcon, ...other } = props

  return (
    <MenuItemWithIcon
      disableTouchRipple={true}
      $color={color}
      $colorIcon={colorIcon}
      {...other}
    >
      <span className="icon material-symbols-outlined">{icon}</span>
      <span className="title">{title}</span>
    </MenuItemWithIcon>
  )
}
