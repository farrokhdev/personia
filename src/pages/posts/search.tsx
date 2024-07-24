import { useNavigate, useParams } from 'react-router-dom'
import React, { ReactElement, useEffect, useState } from 'react'
import { Card, Page } from '../../components/structure'
import { CButton } from '../../components/mui'
import { PostBox } from '../../components/post/box'
import { NothingFound } from '../../components/custom'
import { findAllPosts } from '../../apis/post.apis'
import { PostModel } from '../../models/post.model'

export function SearchPostPage(): ReactElement {

  const { tag } = useParams()
  const [loading, setLoading] = useState<boolean>(true)
  const [posts, setPosts] = useState<Array<PostModel>>([])
  const [noMoreData] = useState<boolean>(false)
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false)
  const navigate = useNavigate()
  const [cursor, setCursor] = useState<string>('')

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth',
    })

    fetchAllPosts()
  }, [])

  const fetchAllPosts = () => {
    setLoading(true)

    findAllPosts({
      numberPerPage: 5,
      cursor: cursor,
      search: { q: tag },
    })
      .then(res => {
        if (res) {
          if (res.data.posts.length > 0) {
            setCursor(res.data.cursor)
            setPosts(posts => [...posts, ...res.data.posts])
          }
        }

        setPaginationLoading(false)
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }

  const loadMoreHandler = () => {
    setPaginationLoading(true)
    fetchAllPosts()
  }

  return (
    <Page
      title={'Post By Tag Page'}
      sidebar={
        <>
          <div className={'back'}>
            <CButton
              size={'s'}
              background={'navy100'}
              backgroundHover={'navy100'}
              backgroundDisabled={'navy100'}
              color={'white100'}
              onClick={() => navigate(-1)}
              startIcon={'keyboard_arrow_left'}
            >
              <span style={{ marginLeft: '5px' }}>Back</span>
            </CButton>
          </div>
        </>
      }
      sidebar2={<></>}
    >
      <Card title={'Posts by tag: ' + tag}>
        {loading ? (
          [1, 2, 3, 4].map(i => <PostBox loading={loading} key={i} type={2} />)
        ) : posts.length === 0 ? (
          <NothingFound
            icon="hourglass_disabled"
            title="No Posts Found"
            padding={'30px'}
          />
        ) : (
          <div>
            {posts.map((post, i) => {
              return <PostBox loading={loading} post={post} key={i} type={2} />
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
                No More Posts
              </CButton>
            )}
          </div>
        )}
      </Card>
    </Page>
  )
}
