import React, { useEffect, useMemo, useState } from 'react'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { QRCode } from 'react-qrcode-logo'
import Logo from '../../../assets/svg/logo.svg'

type Props = {
  metamaskLink: string
  expTime: number
}

export const QrCodeStep = (props: Props) => {
  const [renderQrCode, setRenderQrCode] = useState(
    <QRCode value={props.metamaskLink} size={250} logoImage={Logo} />
  )

  useMemo(() => {
    setRenderQrCode(
      <QRCode value={props.metamaskLink} size={250} logoImage={Logo} />
    )
  }, [props.metamaskLink])

  const handleOpenLink = () => {
    window.location.href = props.metamaskLink
  }

  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Scan To Log In</h3>
        <div className="Loading">
          Use MetaMask app on your mobile deviceto scan the QR code below for
          secure access.
        </div>
      </div>
      <div className="loading" onClick={handleOpenLink}>
        {renderQrCode}
      </div>

      {/* {props.expTime !== 0&& (
        <div className="top-heading">
          <h3 className="title">Re-Generate Metamask link automatically after:</h3>
          <div className="subtitle">
            {props.expTime} Second
          </div>
        </div>
      )} */}
    </LoginChildSec>
  )
}
