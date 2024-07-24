import { breakpoints, breakpointSizes } from '../config/global-styles'

export function isDesktop(){
  return window.innerWidth > breakpointSizes.minDesktop;
}

export function isTablet(){
  return window.innerWidth < breakpointSizes.minDesktop && window.innerWidth > breakpointSizes.mobile;
}

export function isMobile(){
  return window.innerWidth < breakpointSizes.mobile;
}