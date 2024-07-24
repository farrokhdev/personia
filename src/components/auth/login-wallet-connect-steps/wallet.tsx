import styled from 'styled-components'
import { breakpoints } from '../../../config/global-styles'

export const WalletLog = styled.div<{}>`
  width: 300px;
  min-height: 420px;
  background: #140e26;
  display: flex;
  flex-direction: column;
  color: #fff;
  padding: 0 !important;
  overflow: hidden;
    justify-content: center;
    align-content: center;

  .iframe-class {
    border: none;
    width: 100% !important;
    height: 300px;
    color: #fff;
      
    @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
      width: 100%;
      height: 100%;
      position: absolute;
      top: 60px;
      left: 0;
    }
  }
`
