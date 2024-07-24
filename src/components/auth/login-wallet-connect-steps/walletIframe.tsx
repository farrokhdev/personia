import React from 'react'
import { WalletLog } from './wallet'
import { isDesktop } from '../../../utils/detect-screen'
interface Props {
  randomString: string
}

const WalletIframe: React.FC<Props> = (props: Props) => {
  const baseURL = process.env.REACT_APP_API_BASE_URL_SOCKET || ''
  const src = `${baseURL}/static/login/login-${props.randomString}`

  return (
    <WalletLog>
      <iframe
        src={src}
        className='iframe-class'
        title="Wallet Iframe"
        style={{height: isDesktop() ? '420px' : '93%'}}
      ></iframe>
    </WalletLog>
  )
}

export default WalletIframe
