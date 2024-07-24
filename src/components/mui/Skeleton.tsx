import React, { type ReactElement } from 'react'
import styled from 'styled-components'
import { Skeleton } from '@mui/material'

interface Props {
  variant?: 'circular' | 'rectangular' | 'text'
  width?: number | string
  height?: number | string
  marginTop?: string
  marginRight?: string
  marginBottom?: string
  marginLeft?: string
  borderRadius?: string
}

export const CSkeletonGroup = styled.div<{ $width?: string, $rows?: number, $gap?: number, $marginTop?: string }>`
  width: ${props => props.$width ?? '100%'};
  margin-top: ${props => props.$marginTop ?? '0'};
  display: grid;
  grid-template-columns: ${props => (props.$rows != null) ? `repeat(${props.$rows}, 1fr)` : 'repeat(3, 1fr)'};
  gap: ${props => props.$gap ?? '10px'};
`

const CSkeletonStyle = styled(Skeleton) <Props>`
  && {
    transform: none;
    width: ${props => props.width ?? '100%'};
    height: ${props => props.height ?? 'auto'};
    margin-top: ${props => props.marginTop ?? '0'};
    margin-right: ${props => props.marginRight ?? '0'};
    margin-bottom: ${props => props.marginBottom ?? '0'};
    margin-left: ${props => props.marginLeft ?? '0'};
    border-radius: ${props => props.borderRadius ?? '8px'};
    background-color: ${props => props.theme.navy100};
  }
`

export function CSkeleton (props: Props): ReactElement {
  return (
        <CSkeletonStyle
            animation={'wave'}
            {...props}
        />
  )
}
