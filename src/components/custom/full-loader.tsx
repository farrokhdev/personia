import React, { Component } from 'react';
import styled from 'styled-components';
import { ThreeDots } from 'react-loader-spinner';
import { LinearProgress } from '@mui/material';

const TheDiv = styled.div<{ loaderStatus: boolean, background: string }>`
  position: fixed;
  top: 0;
  right: 0;
  width: 100vw;
  height: 100vh;
  background: #140E26 !important;
  z-index: 99999999999;
  display: flex;
  flex-direction: row;
  align-items: center;
  align-content: center;
  visibility: ${({ loaderStatus }) => (loaderStatus ? 'visible' : 'hidden')};
  opacity: ${({ loaderStatus }) => (loaderStatus ? 1 : 0)};
  transition: all 0.05s ease-in-out;
  flex: 1;

  > div {
    margin: 0 auto;
  }
`;

const TheLoader = styled(ThreeDots)`
  && {
    & svg {
      fill: ${({ theme }) => theme.green100} !important;
    }
  }
`;

const BorderLinearProgress = styled(LinearProgress)`
  && {
    height: 6px;
    border-radius: 3px;
    width: 250px;
    margin: 0 auto;
    background: ${({ theme }) => theme.navy100};
  }

  && .MuiLinearProgress-bar {
    background-color: ${({ theme }) => theme.navy100};
  }
`;

interface FullLoaderIconProps {
  loaderStatus: boolean;
}

class FullLoaderIcon extends Component<FullLoaderIconProps> {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  componentDidMount() {
    const body = document.querySelector('body');
    if (body !== null) {
      body.classList.add('full-loader-shown');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  componentWillUnmount() {
    const body = document.querySelector('body');
    if (body !== null) {
      body.classList.remove('full-loader-shown');
    }
  }

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  render() {
    return (
      <TheLoader height={100} width={100} visible={this.props.loaderStatus} />
    );
  }
}

interface FullLoaderProps {
  loaderStatus: boolean;
  loaderProgressStatus?: boolean;
  loaderProgressValue?: number;
}

export function FullLoader(props: FullLoaderProps): JSX.Element {
  const {
    loaderStatus,
    loaderProgressStatus = false,
    loaderProgressValue = 0
  } = props;

  return (
    <TheDiv loaderStatus={loaderStatus} background={'navy100'}>
      {
        loaderStatus ?
          (
            <div>
              <FullLoaderIcon loaderStatus={loaderStatus} />
              {loaderProgressStatus
                ? (
                  <BorderLinearProgress
                    variant='determinate'
                    value={loaderProgressValue}
                  />
                )
                : null}
            </div>
          )
          : null
      }
    </TheDiv>
  );
}
