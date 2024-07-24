import styled from 'styled-components';
import React, { ReactElement } from 'react';
import { ReactComponent as MetaMask } from '../../assets/svg/metamask.svg';
import { ReactComponent as Eth1 } from '../../assets/svg/eth-1.svg';
import { ReactComponent as Eth2 } from '../../assets/svg/eth-2.svg';
import { CButton } from '../mui';

const Box = styled.div`
  background: ${(props) => props.theme.navy90};
  border-radius: 8px;
  border: 0.5px solid ${(props) => props.theme.white30};
  margin-top: 10px;
  padding: 15px;

  > .header {
    position: relative;
    display: flex;

    > .title {
      flex: 1;
    }

    > .title > strong {
      font-size: 14px;
      font-weight: 500;
      color: ${(props) => props.theme.white100};
      margin-bottom: 5px;
      margin-left: 10px;
    }

    > .title > p {
      font-size: 14px;
      font-weight: 400;
      color: ${(props) => props.theme.white100};
      margin-left: 10px;
    }
  }

  > .body {
    border: 0.5px solid ${(props) => props.theme.white30};
    border-radius: 8px;
    padding: 10px;
    margin-top: 10px;

    > .row {
      display: flex;
      align-items: center;
      margin-bottom: 10px;

      > p {
        font-size: 14px;
        font-weight: 400;
        color: ${(props) => props.theme.white100};
        margin-left: 10px;
        flex: 1;
      }

      > p:last-child {
        font-size: 14px;
        font-weight: 400;
        color: ${(props) => props.theme.white100};
        margin-left: 10px;
        flex: 1;
        text-align: right;
      }
    }
  }

  > .footer {
    width: 100%;
    align-self: center;
    align-items: center;
    margin: 15px auto 0 auto;
    text-align: center;
  }
`;

// interface Props {
//   profile?: Profile;
// }

export function WalletBox(): ReactElement {
  // const user = useAppSelector((state) => state.user);

  return (
    <Box>
      <div className={'header'}>
        <MetaMask />
        <div className={'title'}>
          <strong>Ethereum</strong>
          <p>0x05a....c23</p>
        </div>
        <CButton
          backgroundHover={'transparent'}
          background={'transparent'}
          startIcon={'wifi_tethering_off'}
          color={'red100'}>
          <span style={{marginLeft: '10px'}}>Disconnect</span>
        </CButton>
      </div>
      <div className={'body'}>
        <div className={'row'}>
          <Eth1/>
          <p>0 ETH</p>
          <p>$0</p>
        </div>
        <div className={'row'}>
          <Eth2/>
          <p>0 ALS</p>
          <p>$0</p>
        </div>
        <div className={'row'}>
          <Eth2/>
          <p>0 wETH</p>
          <p>$0</p>
        </div>
      </div>

      <div className={'footer'}>
        <CButton
          backgroundHover={'gray80'}
          background={'gray80'}
          color={'white100'}>
          View Dashboard
        </CButton>
      </div>

    </Box>
  );
}
