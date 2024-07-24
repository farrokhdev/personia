import React, { useState } from 'react'
import styled from 'styled-components'
import { StartupProfileModel } from '../../../models/startup/startup-profile.model'

const LogoStyle = styled.div<{ borderColor: string }>`
  height: 162px;
  width: 162px;
  background: ${({ theme }) => theme.gray100};
  position: relative;
  border-radius: 1000px;
  top: -80px;
  left: 16px;
  border: 1px solid ${({ theme, borderColor }) => theme[borderColor]};

  > p {
    font-size: 24px;
    font-weight: 600;
    font-family: Inter;
    color: ${({ theme }) => theme.white100};
    line-height: 32px;
    text-align: center;
    width: 300px;
    position: absolute;
    top: 50%;
    left: 50%;
    -ms-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
    cursor: pointer;
  }

  > img {
    height: 162px;
    width: 162px;
    border-radius: 1000px;
  }
`

export interface Props {
  startup: StartupProfileModel
}

export function Logo(props: Props) {
  const { startup } = props

  return (
    <>
      <LogoStyle borderColor={'black100'}>
        {startup.logo != null && startup.logo !== '' && (
          <img src={`https://greenia.infura-ipfs.io/ipfs/${startup.logo}`} />
        )}
      </LogoStyle>

    </>
  )
}
