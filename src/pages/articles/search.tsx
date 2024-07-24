import { useNavigate, useParams } from 'react-router-dom';
import React, { ReactElement, useEffect, useState } from 'react';
import { Card, Page } from '../../components/structure';
import {
  CButton
} from '../../components/mui';
import { PostBox } from '../../components/post/box';
import { NothingFound } from '../../components/custom';
import { ArticleBox } from '../../components/article/box'
import { ArticleModel } from '../../models/article.model'
import { findAllArticles } from '../../apis/article.apis'

export function SearchArticlePage(): ReactElement {


  const { tag } = useParams();
  const [loading, setLoading] = useState<boolean>(true);
  const [articles, setArticles] = useState<Array<ArticleModel>>([]);
  const [noMoreData] = useState<boolean>(false);
  const [paginationLoading, setPaginationLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const [cursor, setCursor] = useState<string>('');

  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });

    fetchAllPosts();
  }, []);

  const fetchAllPosts = () => {
    setLoading(true);
    findAllArticles({ numberPerPage: 5, cursor: cursor, search: { q: tag } })
      .then(res => {
        if (res) {
          if (res.data.articles.length > 0) {
            setCursor(res.data.cursor);
            setArticles(articles => [...articles, ...res.data.articles]);
          }
        }

        setPaginationLoading(false);
        setLoading(false);
      }).catch(() => {
      setLoading(false);
    });
  };

  const loadMoreHandler = () => {
    setPaginationLoading(true);
    fetchAllPosts();
  };

  return (
    <Page
      title={'Article By Tag Page'}
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
      <Card
        title={'Posts by tag: ' + tag}>
        {loading ? (
          [1, 2, 3, 4].map((i) => (
            <PostBox loading={loading} key={i} type={2} />
          ))
        ) : articles.length === 0 ? (
          <NothingFound
            icon='hourglass_disabled'
            title='No Posts Found'
            padding={'30px'}
          />
        ) : (
          <div>
            {articles.map((article, i) => {
              return (
                <ArticleBox
                  loading={loading}
                  article={article}
                  key={i}
                  type={2}
                />
              );
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
      </Card>

    </Page>
  );
}
