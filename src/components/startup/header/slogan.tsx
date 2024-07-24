import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { StartupProfileModel } from '../../../models/startup/startup-profile.model'

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
  }

  > .icon {
    position: relative;
    left: 10px;
    cursor: pointer;
  }
`


export interface Props {
  startup: StartupProfileModel,
}

export function Slogan(props: Props) {
  const { startup } = props

  return (
    <>
      <SloganStyle textColor={'white100'}>
        <p>{startup.slogan}</p>
      </SloganStyle>
    </>
  )
}
