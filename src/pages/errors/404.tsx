import React, { type ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { ROUTES } from '../../routes/route-path';
import styled from 'styled-components';
import { CButton } from '../../components/mui';

const Box = styled.div`
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-around;
  background: ${(props) => props.theme.black3};

  > .box {
    padding: 30px;
    border-radius: 8px;
    background: ${(props) => props.theme.white100};

    > h1 {
      font-size: 40px;
      font-weight: 600;
      color: ${(props) => props.theme.black80};
      text-align: center;
      display: block;
      margin-bottom: 30px;
      border-bottom: 1px solid ${(props) => props.theme.black12};
      padding-bottom: 30px;
    }

    > span {
      font-size: 20px;
      font-weight: 500;
      color: ${(props) => props.theme.black60};
      text-align: center;
      display: block;
      margin-bottom: 30px;
    }
  }
`;

export const NotFoundPage: React.FC = (): ReactElement => {


  return (
    <Box>
      <div className={'box'}>
        <h1>404 :(</h1>
        <span>Oops! Sorry! We couldn't find the page</span>
        <Link to={ROUTES.INDEX}>
          <CButton fullWidth>Back To Home</CButton>
        </Link>
      </div>
    </Box>
  );
};
