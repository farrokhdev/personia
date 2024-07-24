import { useAppSelector } from '../../redux/hooks'
import React, { ReactElement, useEffect, useState } from 'react'
import { Page } from '../../components/structure'
import { ProfileBox } from '../../components/profile'
import styled from 'styled-components'
import { useCeramicContext } from '../../contexts'
import { NothingFound } from '../../components/custom'
import { PlatformBox } from '../../components/platform'
import { PlatformProfileModel } from '../../models/platform/platform-profile.model.'

const Box = styled.div`
  padding: 16px;
  background: ${props => props.theme.navy80};
  border-radius: 16px;
`

export function PlatformsPage(): ReactElement {


  const user = useAppSelector(state => state.user)

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const [platforms, setPlatforms] = useState<Array<PlatformProfileModel>>([])
  const [cursor, setCursor] = useState<string>('')
  const [platformLoading, setPlatformLoading] = useState<boolean>(true)

  // useEffect(() => {
  //
  //   setPlatformLoading(true)
  //   allostasisPlatform
  //     .getPlatformProfiles({ cursor: '', numberPerPage: 30 })
  //     .then(result => {
  //       setPlatforms(result.users)
  //       setCursor(result.cursor)
  //       setPlatformLoading(false)
  //     })
  //     .catch(error => {
  //       setPlatformLoading(false)
  //     })
  // }, [])

  return (
    <Page
      title="Platforms"
      sidebar={<ProfileBox />}
      sidebar2={
        <>
          {/*{user.did !== '' ? (*/}
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
        {platformLoading ? (
          [1, 2, 3, 4].map(i => (
            <PlatformBox loading={platformLoading} key={i} />
          ))
        ) : platforms.length === 0 ? (
          <NothingFound
            icon="hourglass_disabled"
            title="No Platform Found"
            padding={'30px'}
          />
        ) : (
          <div>
            {[...platforms.filter(item => item.name !== '')]
              .sort(
                (x: any, y: any) =>
                  new Date(y.createdAt).getTime() -
                  new Date(x.createdAt).getTime()
              )
              .map((platform, i) => {
                return (
                  <PlatformBox
                    loading={platformLoading}
                    platform={platform}
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
