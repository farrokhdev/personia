import { useAppSelector } from '../../redux/hooks'
import React, { ReactElement, useEffect, useState } from 'react'
import { Page } from '../../components/structure'
import { ProfileBox } from '../../components/profile'
import styled from 'styled-components'
import { NothingFound } from '../../components/custom'
import { StartupBox } from '../../components/startup'
import { StartupProfileModel } from '../../models/startup/startup-profile.model'
import { PlatformProfileModel } from '../../models/platform/platform-profile.model.'

const Box = styled.div`
  padding: 16px;
  background: ${props => props.theme.navy80};
  border-radius: 16px;
`

export function StartupsPage(): ReactElement {
  const user = useAppSelector(state => state.user)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const [startUps, setStartups] = useState<Array<StartupProfileModel>>([])
  const [platforms, setPlatforms] = useState<Array<PlatformProfileModel>>([])
  const [cursor, setCursor] = useState<string>('')
  const [startupLoading, setStartupLoading] = useState<boolean>(true)

  // useEffect(() => {
  //   setStartupLoading(true)
  //   allostasisStartup
  //     .getStartupProfiles({ cursor: '', numberPerPage: 30 })
  //     .then(result => {
  //       setStartups(result.users)
  //       setCursor(result.cursor)
  //
  //       allostasisPlatform
  //         .getPlatformProfiles({ cursor: '', numberPerPage: 30 })
  //         .then(result2 => {
  //           setPlatforms(result2.users)
  //           setStartupLoading(false)
  //         })
  //     })
  //     .catch(error => {
  //       setStartupLoading(false)
  //     })
  // }, [])

  return (
    <Page
      title="Startups"
      sidebar={<ProfileBox />}
      sidebar2={
        <>
          {/*{ user.did !== '' ? (*/}
          {/*  <UsersBox*/}
          {/*    background={'navy90'}*/}
          {/*    users={users}*/}
          {/*    loading={usersLoading}*/}
          {/*    setLoading={loading => {*/}
          {/*      //setUsersLoading(loading);*/}
          {/*    }}*/}
          {/*    title={'People You May Know'}*/}
          {/*  />*/}
          {/*) : null}*/}
        </>
      }
    >
      <Box>
        {startupLoading ? (
          [1, 2, 3, 4].map(i => <StartupBox loading={startupLoading} key={i} />)
        ) : startUps.length === 0 ? (
          <NothingFound
            icon="hourglass_disabled"
            title="No Startup Found"
            padding={'30px'}
          />
        ) : (
          <div>
            {[...startUps.filter(item => item.name !== '')]
              .sort(
                (x: any, y: any) =>
                  new Date(y.createdAt).getTime() -
                  new Date(x.createdAt).getTime()
              )
              .map((startup, i) => {
                return (
                  <StartupBox
                    loading={startupLoading}
                    startup={startup}
                    platform={
                      platforms.filter(item => item.id === startup.platformID)
                        ? platforms.filter(
                            item => item.id === startup.platformID
                          )[0]
                        : null
                    }
                    key={i}
                  />
                )
              })}
          </div>
        )}
      </Box>
    </Page>
  )
}
