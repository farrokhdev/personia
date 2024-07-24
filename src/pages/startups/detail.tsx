import { useAppSelector } from '../../redux/hooks'
import React, { ReactElement, useEffect, useState } from 'react'
import { Page } from '../../components/structure'
import styled from 'styled-components'
import { useCeramicContext } from '../../contexts'
import '../../assets/editor.css'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { CSkeleton, CTab, CTabs } from '../../components/mui'
import { Banner, Logo, Name, Slogan } from '../../components/startup/header'
import { PlatformName } from '../../components/startup/header'
import { PlatformPostModel } from '../../models/platform/platform-post.model'
import { StartupProfileModel } from '../../models/startup/startup-profile.model'

const Box = styled.div`
  > .row-1 {
    width: 100%;
    height: 315px;
    border-radius: 8px;
    border: 1px solid ${({ theme }) => theme.white80};
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
    > .body {
      padding: 20px;
      background: ${props => props.theme.navy80};

      > .text {
        position: relative;

        > div:last-child {
          position: relative;
        }

        p,
        span {
          color: ${props => props.theme.white100};
        }

        > h1,
        h2,
        h3,
        h4,
        h5,
        h6,
        ul,
        li,
        ol {
          color: ${props => props.theme.white100};
        }

        > a {
          color: ${props => props.theme.green100};
        }

        > img {
          margin-top: 20px;
        }
      }
    }
  }
`

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-top: 15px;
  position: sticky;
  top: 0;
  z-index: 20;
  background: ${props => props.theme.navy80};
  border-radius: 16px;

  > span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.black80};
  }
`

export function StartupDetailPage(): ReactElement {

  const user = useAppSelector(state => state.user)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])
  const { id } = useParams()
  const [startup, setStartup] = useState<StartupProfileModel>(null)
  const [startupLoading, setStartupLoading] = useState<boolean>(true)
  const navigate = useNavigate()
  const [tab, setTab] = useState<'posts' | 'articles' | 'journey'>('journey')
  const [platform, setPlatform] = useState<PlatformPostModel>()

  // useEffect(() => {
  //   setStartupLoading(true)
  //   allostasisStartup
  //     .getStartupProfileByID(id ?? '')
  //     .then(result => {
  //       setStartup(result)
  //       if (result.platformID) {
  //         allostasisPlatform
  //           .getPlatformProfileByID(result.platformID)
  //           .then(result => {
  //             setPlatform(result)
  //             setStartupLoading(false)
  //           })
  //       } else setStartupLoading(false)
  //     })
  //     .catch(error => {
  //       setStartupLoading(false)
  //       navigate('/startups')
  //     })
  // }, [])

  return (
    <Page title="Startup">
      <Box>
        {startupLoading ? (
          <>
            <div className={'row-1'}>
              <CSkeleton width={'100%'} height={'202px'} borderRadius={'8px'} />
              <div className={'flex'}>
                <CSkeleton
                  width={'162px'}
                  height={'162px'}
                  borderRadius={'1000px'}
                  marginTop={'-80px'}
                  marginLeft={'16px'}
                />
                <div>
                  <CSkeleton
                    width={200}
                    height={10}
                    marginBottom={'5px'}
                    marginLeft={'16px'}
                    marginTop={'20px'}
                  />
                  <CSkeleton
                    width={200}
                    height={10}
                    marginBottom={'5px'}
                    marginLeft={'16px'}
                  />
                </div>
              </div>
            </div>
            <div className={'row-2'}>
              <TabBox>
                <CTabs
                  value={tab}
                  key={1}
                  $padding={'20px'}
                  $background={'navy60'}
                  $activeBG={'navy60'}
                >
                  <CTab
                    label={'Journey'}
                    id={'view-tab-journey'}
                    aria-controls={'view-tabpanel-journey'}
                    value={'journey'}
                    disableTouchRipple
                    $fullWidth
                  />
                </CTabs>
              </TabBox>
              <div className={'body'}>
                {tab === 'journey' ? (
                  <CSkeleton
                    width={'90%'}
                    height={10}
                    marginBottom={'20px'}
                    marginLeft={'16px'}
                    marginTop={'20px'}
                    marginRight={'16px'}
                  />
                ) : null}
              </div>
            </div>
          </>
        ) : (
          <>
            <div className={'row-1'}>
              <Banner startup={startup} height={'202'} />
              <div className={'flex'}>
                <Logo startup={startup} />
                <div>
                  <Name startup={startup} />
                  <Slogan startup={startup} />
                  <PlatformName startup={startup} platform={platform} />
                </div>
              </div>
            </div>
            <div className={'row-2'}>
              <TabBox>
                <CTabs
                  value={tab}
                  key={1}
                  $padding={'20px'}
                  $background={'navy60'}
                  $activeBG={'navy60'}
                >
                  <CTab
                    label={'Journey'}
                    id={'view-tab-journey'}
                    aria-controls={'view-tabpanel-journey'}
                    value={'journey'}
                    disableTouchRipple
                    $fullWidth
                  />
                </CTabs>
              </TabBox>

              <div className={'body'}>
                {tab === 'journey' ? (
                  <div className={'text'}>
                    <div className={'editor'}>
                      <div
                        className={'ql-container ql-snow'}
                        style={{ height: 'auto' }}
                      >
                        <div
                          className={'ql-editor'}
                          dangerouslySetInnerHTML={{
                            __html: decodeURIComponent(startup.projectVision),
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </>
        )}
      </Box>
    </Page>
  )
}
