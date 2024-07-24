import React, { ReactElement, useEffect, useState } from 'react'
import styled from 'styled-components'
import { Banner, Logo, Name, PlatformName, Slogan } from './header'
import { Link } from 'react-router-dom'
import { CSkeleton } from '../mui'
import { StartupProfileModel } from '../../models/startup/startup-profile.model'
import { PlatformProfileModel } from '../../models/platform/platform-profile.model.'

const breakpoints = {
  mobile: '320px',
  tablet: '1130px',
  desktop: '1024px',
}

const Box = styled.div`
  background: ${props => props.theme.navy80};
  margin-bottom: 15px;
  border-radius: 8px;
  display: block;
  text-decoration: none;
  border: 1px solid ${({ theme }) => theme.white30};

  > a {
    text-decoration: none;

    > .row-1 {
      width: 100%;
      height: 250px;
      border-radius: 16px;
      top: 60px;

      > .flex {
        display: flex;
        position: relative;

        > .right {
          position: absolute;
          right: 20px;
          top: 20px;
          float: right;
          vertical-align: center;
        }
      }
    }

    > .row-2 {
      > p {
        font-size: 16px;
        color: ${props => props.theme.white100};
        line-height: 24px;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        white-space: pre-line;
        overflow: hidden;
        margin-bottom: 20px;
        text-align: justify;
        margin-left: 16px;
        margin-right: 16px;
      }
    }
  }
`

interface Props {
  startup?: StartupProfileModel
  platform?: PlatformProfileModel
  loading?: boolean
}

export function StartupBox(props: Props): ReactElement {

  return (
    <Box>
      {props.loading ? (
        <Link to={'#'}>
          <div className={'row-1'}>
            <CSkeleton width={'100%'} height={'144px'} borderRadius={'8px'} />
            <div className={'flex'}>
              <CSkeleton width={'162px'} height={'162px'} borderRadius={'1000px'} marginTop={'-80px'} marginLeft={'16px'}  />
              <div>
                <CSkeleton width={200} height={10} marginBottom={'5px'} marginLeft={'16px'} marginTop={'20px'}/>
                <CSkeleton width={200} height={10} marginBottom={'5px'} marginLeft={'16px'}/>
              </div>
            </div>
          </div>
          <div className={'row-2'}>
            <CSkeleton width={'90%'} height={10} marginBottom={'20px'} marginLeft={'16px'} marginTop={'20px'} marginRight={'16px'} />
          </div>
        </Link>
      ) : (
        <Link to={'/startups/get/' + props.startup.id}>
          <div className={'row-1'}>
            <Banner startup={props.startup} height={'144'} />
            <div className={'flex'}>
              <Logo startup={props.startup} />
              <div>
                <Name startup={props.startup} />
                <Slogan startup={props.startup} />
                <PlatformName startup={props.startup} platform={props.platform} />
              </div>
            </div>
          </div>
          <div className={'row-2'}>
            <p dangerouslySetInnerHTML={{__html: decodeURIComponent(props.startup.projectMission)}}></p>
          </div>
        </Link>
      )}
    </Box>
  )
}
