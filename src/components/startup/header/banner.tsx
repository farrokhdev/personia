import React, { useState } from 'react'
import styled from 'styled-components'
import { StartupProfileModel } from '../../../models/startup/startup-profile.model'

const BannerStyle = styled.div<{ height: string }>`
    height: ${({ height }) => height}px;
    background: ${({ theme }) => theme.gray100};
    position: relative;
    border-top-left-radius: 8px;
    border-top-right-radius: 8px;

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
        width: 100%;
        height: ${({ height }) => height}px;
        border-top-left-radius: 8px;
        border-top-right-radius: 8px;
    }
`

export interface Props {
  startup: StartupProfileModel,
  height?:string
}

export function Banner(props: Props) {
  const { startup, height='202' } = props

  return (
    <>
      <BannerStyle height={height}>
        {startup.cover != null && startup.cover !== '' && (
          <img src={`https://greenia.infura-ipfs.io/ipfs/${startup.cover}`} />
        )}
      </BannerStyle>
    </>
  )
}
