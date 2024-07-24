import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { PlatformProfileModel } from '../../../models/platform/platform-profile.model.'

const SloganStyle = styled.div<{ textColor: string }>`
  display: flex;
  position: relative;
  left: 32px;

  > p {
    font-size: 16px;
    font-weight: 400;
    font-family: Inter;
    color: ${({ theme, textColor }) => theme[textColor]};
    line-height: 24px;
    margin-bottom: 20px;
  }

  > .icon {
    position: relative;
    left: 10px;
    cursor: pointer;
  }
`


export interface Props {
  platform: PlatformProfileModel,
}

export function Slogan(props: Props) {
  const { platform } = props

  return (
    <>
      <SloganStyle textColor={'white100'}>
        <p>{platform.slogan}</p>
      </SloganStyle>
    </>
  )
}
