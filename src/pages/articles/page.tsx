import { useAppSelector } from '../../redux/hooks'
import React, { ReactElement, useEffect, useState } from 'react'
import { Page } from '../../components/structure'
import { PostBox } from '../../components/post/box'
import { NothingFound } from '../../components/custom'
import { CButton, CTab, CTabs } from '../../components/mui'
import { ProfileBox } from '../../components/profile'
import styled from 'styled-components'
import { Link } from 'react-router-dom'
import { UsersBox } from '../../components/user'
import { ArticleBox } from '../../components/article/box'
import { ProfileModel } from '../../models/profile.model'
import { SearchAllUsers, searchUsers } from '../../apis/user.api'
import { findAllArticles } from '../../apis/article.apis'
import { ArticleModel } from '../../models/article.model'
import { isDesktop } from '../../utils/detect-screen'

const breakpoints = {
  mobile: '320px',
  tablet: '1130px',
  desktop: '1024px',
}

const TabBox = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 15px;
  position: sticky;
  top: 0;
  z-index: 20;
 

  > span {
    margin-right: 15px;
    font-size: 14px;
    font-weight: 500;
    color: ${props => props.theme.black80};
  }
`

const AdvertiseBox = styled.div`
  padding: 16px;
  background: ${props => props.theme.navy90};
  border-radius: 8px;
  width: 100%;
  margin-bottom: 15px;

  @media (max-width: ${breakpoints.tablet}) {
    display: none;
  }

  > img {
    display: block;
    width: 100%;
    border-radius: 8px;
  }

  > h5 {
    font-size: 22px;
    font-weight: 500;
    color: ${props => props.theme.white100};
    text-align: center;
    display: block;
    margin-bottom: 30px;
    margin-top: 30px;
  }

  > p {
    font-size: 14px;
    font-weight: 400;
    color: ${props => props.theme.white100};
    text-align: justify;
    display: block;
    margin-bottom: 30px;
    line-height: 28px;
    margin-top: 30px;
  }
`

export function ArticlePage(): ReactElement {
  const user = useAppSelector(state => state.user)

  const [loading, setLoading] = useState<boolean>(true)
  const [usersLoading, setUsersLoading] = useState<boolean>(true)
  const [noMoreData, setNoMoreDate] = useState<boolean>(false)
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false)
  const [cursor, setCursor] = useState<string>('')
  const [tab, setTab] = useState<
    'allArticles' | 'followingArticles' | 'mineArticles'
  >('allArticles')
  const [users, setUsers] = useState<Array<ProfileModel>>([])
  const [Articles, setArticles] = useState<Array<ArticleModel>>([])

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })
  }, [])

  const fetchAllArticles = (_cursor: string, profiles?: any) => {
    setPaginationLoading(true)
    findAllArticles({
      numberPerPage: 5,
      cursor: '',
      search: {
        q: '',
        profileIDs: profiles ?? '',
      },
    })
      .then(res => {
        setLoading(false)
        setPaginationLoading(false)
        if (res) {
          setArticles(res.data.articles)
        }
      })
      .catch(error => {
        setLoading(false)
        setPaginationLoading(false)
        console.log(error)
      })
  }

  const loadMoreHandler = () => {
    if (tab == 'allArticles') {
      fetchAllArticles(cursor)
    } else if (tab == 'followingArticles') {
      fetchAllArticles(
        cursor,
        user?.followings.map(item => item.targetProfile.id)
      )
    } else if (tab == 'mineArticles') {
      fetchAllArticles(cursor, [user.id])
    }
  }

  const handleChangeViewType = (event: any, newValue: any): void => {
    setTab(newValue)
    setArticles([])
    setNoMoreDate(false)
    if (newValue == 'allArticles') {
      setCursor('')
      fetchAllArticles('')
    } else if (newValue == 'followingArticles') {
      setCursor('')
      fetchAllArticles(
        '',
        user?.followings?.map(item => item.targetProfile.id)
      )
    } else if (newValue == 'mineArticles') {
      fetchAllArticles('', [user.id])
    }
  }

  useEffect(() => {
    setUsersLoading(true)

    SearchAllUsers({
      q: '',
      cursor: '',
      perPage: 30,
    })
      .then(res => {
        console.log('all')
        if (res.data.users) {
          setUsersLoading(false)
          setUsers(res.data.users)
        }
      })
      .catch(err => {
        setUsersLoading(false)
        console.log(err)
      })

    if (tab == 'allArticles') {
      setArticles([])
      setCursor('')
      fetchAllArticles('')
    }
  }, [])

  return (
    <Page
      title="Decentralized Social Media"
      sidebar={isDesktop() ? <ProfileBox /> : <></>}
      sidebar2={
        isDesktop() ? (
          <>
            {user.did !== '' ? (
              <UsersBox
                background={'navy90'}
                users={users}
                loading={usersLoading}
                setLoading={loading => {
                  //setUsersLoading(loading);
                }}
                title={'People You May Know'}
              />
            ) : null}
            <AdvertiseBox>
              <img src={require('../../assets/images/create-article.png')} />
              <p>
                By sharing you content on allostasis ecosystem, You can monetize
                your assets and make money from them. Just start sharing your
                interesting content and let the ecosystem make money for you!
              </p>
              <Link to={'/articles/new'}>
                <CButton
                  fullWidth
                  background={'transparent'}
                  color={'green100'}
                  variant={'outlined'}
                  hoverColor={'navy100'}
                  backgroundHover={'green10'}
                >
                  Create Article
                </CButton>
              </Link>
            </AdvertiseBox>
            <AdvertiseBox>
              <img src={require('../../assets/images/wallet.png')} />
              <h5>Allostasis!</h5>
              <p>
                Unlock the world of NFTs and embrace a universe of creativity,
                uniqueness, and meaningful assets. Your journey to collectibles,
                art, and more begins here. Click now to explore, own, and make a
                difference!
              </p>
              <a href={'https://centeria.io'} target={'_blank'}>
                <CButton
                  fullWidth
                  background={'transparent'}
                  color={'green100'}
                  variant={'outlined'}
                  hoverColor={'navy100'}
                  backgroundHover={'green10'}
                >
                  Visit Centeria
                </CButton>
              </a>
            </AdvertiseBox>
            <div style={{ marginTop: '60px' }}></div>
          </>
        ) : (
          <></>
        )
      }
    >
      {user.did === '' ? null : (
        <TabBox>
          <CTabs
            value={tab}
            onChange={handleChangeViewType}
            key={1}
            $background={'navy60'}
            $activeBG={'navy60'}
          >
            <CTab
              label={'All'}
              id={'view-tab-all-Articles'}
              aria-controls={'view-tabpanel-all-Articles'}
              value={'allArticles'}
              disableTouchRipple
              $fullWidth
            />
            <CTab
              label={"Following's"}
              id={'view-tab-following-Articles'}
              aria-controls={'view-tabpanel-following-post'}
              value={'followingArticles'}
              disableTouchRipple
              $fullWidth
            />
            <CTab
              label={'Mine'}
              id={'view-tab-mine-Articles'}
              aria-controls={'view-tabpanel-mine-Articles'}
              value={'mineArticles'}
              disableTouchRipple
              $fullWidth
            />
          </CTabs>
        </TabBox>
      )}

      {loading ? (
        [1, 2, 3, 4].map(i => <PostBox loading={loading} key={i} type={2} />)
      ) : Articles.length === 0 ? (
        <NothingFound
          icon="hourglass_disabled"
          title="No Articles Found"
          padding={'30px'}
        />
      ) : (
        <div>
          {[...Articles]
            .sort(
              (x: any, y: any) =>
                new Date(y.createdAt).getTime() -
                new Date(x.createdAt).getTime()
            )
            .map((article, i) => {
              return (
                <ArticleBox
                  loading={loading}
                  article={article}
                  key={i}
                  type={2}
                />
              )
            })}
          {!noMoreData ? (
            <CButton
              fullWidth
              background={'navy80'}
              color={'white100'}
              backgroundHover={'navy100'}
              loading={paginationLoading}
              onClick={loadMoreHandler}
            >
              Load More
            </CButton>
          ) : (
            <CButton
              fullWidth
              background={'black5'}
              color={'black80'}
              backgroundHover={'black3'}
              disabled
            >
              No More Articles
            </CButton>
          )}
        </div>
      )}
    </Page>
  )
}
