import React from 'react'
import styled from 'styled-components'
import { StartupProfileModel } from '../../../models/startup/startup-profile.model'

const NameStyle = styled.div<{ textColor: string }>`
    display: flex;
    position: relative;
    left: 32px;
    top: 20px;

    > p {
        font-size: 20px;
        font-weight: 600;
        font-family: Inter;
        color: ${({ theme, textColor }) => theme[textColor]};
        line-height: 28px;
        margin-bottom: 20px;
    }

    > .icon {
        position: relative;
        left: 10px;
        cursor: pointer;
    }
`


export interface Props {
  startup: StartupProfileModel
}

export function Name(props: Props) {
  const { startup } = props

  return (
    <>
      <NameStyle textColor={'white100'}>
        <p>{startup.name}</p>
      </NameStyle>
    </>
  )
}
