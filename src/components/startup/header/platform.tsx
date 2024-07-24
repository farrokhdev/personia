import React, { useEffect, useState } from 'react'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { StartupProfileModel } from '../../../models/startup/startup-profile.model'
import { PlatformProfileModel } from '../../../models/platform/platform-profile.model.'

const NameStyle = styled.div<{ textColor: string }>`
  display: flex;
  position: relative;
  left: 32px;

  > a {
    text-decoration: none;

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
  }
`

export interface Props {
  startup: StartupProfileModel
  platform: PlatformProfileModel
}

export function PlatformName(props: Props) {
  const { startup, platform } = props
  return platform ? (
    <>
      <NameStyle textColor={'white100'}>
        <Link to={'/platforms/get/' + platform.id}>
          <p>{platform.name}</p>
        </Link>
      </NameStyle>
    </>
  ) : (
    <></>
  )
}
