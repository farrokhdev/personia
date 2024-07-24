import React, { ReactElement } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import { useCeramicContext } from "../../contexts";
import { breakpoints } from "../../config/global-styles";
import moment from 'moment-timezone'
import { ArticleModel } from '../../models/article.model'

const Box = styled.div<{ $marginBottom: string }>`
  padding: 15px;
  border-radius: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: ${({ $marginBottom }) => $marginBottom};
  background: ${({ theme }) => theme.black30};

  > img {
    width: 130px;
  }

  .column {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-left: 15px;
    .part-one {
      > p > a {
        font-size: 14px;
        color: ${(props) => props.theme.white100};
        line-height: 1.3rem;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        overflow: hidden;
        margin-bottom: 20px;
        display: -webkit-box;
        -webkit-line-clamp: 2; /* number of lines to show */
        line-clamp: 2;
        -webkit-box-orient: vertical;
        text-decoration: none;
      }
      > p {
        font-size: 14px;
        color: ${(props) => props.theme.white100};
        line-height: 1.3rem;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        padding: 5px;
        border-radius: 8px;
        margin-right: 10px;
      }
    }
    > .part-two {
      display: inline-flex;

      > a {
        border: 1px solid ${(props) => props.theme.gray60};
        font-size: 14px;
        color: ${(props) => props.theme.white100};
        line-height: 1.3rem;
        display: block;
        text-overflow: ellipsis;
        word-wrap: break-word;
        padding: 5px;
        border-radius: 8px;
        margin-right: 10px;
        text-decoration: none;
        display: flex;
        align-items: center;
        justify-content: center;
        text-align: center;
        min-width: 40px;
      }
    }
  }

  @media only screen and ((max-width: ${breakpoints.tablet})) {
    > img {
      width: 60px;
      height: 60px;
      border-radius: 8px;
      object-fit: cover;
    }
    .column {
      .part-one {
        display: flex;
        flex-direction: column;
        gap: 5px;
        justify-content: center;
        /* height: 100%; */
        > p > a {
          font-size: 14px;
          color: ${(props) => props.theme.white100};
          line-height: 0.8rem;
        }
        > p {
          border: none;
          font-size: 10px;
          color: ${(props) => props.theme.gray50};
          line-height: 0.2rem;
        }
      }
      > .part-two {
        height: fit-content;
        > a {
          font-size: 12px;
        }
      }
    }
  }
`;

interface Props {
  article: ArticleModel;
}

export function SearchArticleResultBox(props: Props): ReactElement {
  const { article } = props;
  const { locale='de-DE', dateOption } = useCeramicContext();

  return (
    <Box $marginBottom={"5px"}>
      <img src={`https://greenia.infura-ipfs.io/ipfs/${article.attachment}`} />

      <div className={"column"}>
        <div className="part-one">
          <p>
            <Link to={"/articles/get/" + article.id}>
              {decodeURIComponent(article.abstract ?? "")}
            </Link>
          </p>
          <p>
            {moment(article?.createdAt).locale(locale).format('YYYY-MM-DD HH:mm')}
          </p>
        </div>
        <div className={"part-two"}>
          {article.profile?.displayName ? (
            <Link to={"/u/" + article.profile?.id}>
              <p>{article.profile?.displayName}</p>
            </Link>
          ) : (
            ""
          )}
        </div>
      </div>
    </Box>
  );
}
