import { CButton } from '../mui'
import { useEffect, useState } from 'react'
import { CModalTwo } from '../mui/ModalTwo'
import { LoginChildSec } from '../newStructures/LoginChild.style'
import { LoginWalletConnect } from './login-wallet-connect'
import { LoginButtonQr } from './login-qr'

interface Props {
  color: string
  textColor: string
  size: 's' | 'm' | 'l'
}

export function LoginButton(props: Props) {
  const { color, textColor, size } = props
  const [loginState, setLoginState] = useState<boolean>(false)
  const closeLoginModal = () => {
    setLoginState(false)
  }

  const startLogin = () => {
    setLoginState(true)
  }

  return (
    <>
      <CModalTwo
        open={loginState}
        onClose={closeLoginModal}
        title="login modal"
        width="540"
      >
        <LoginChildSec>
          <div className="top-heading">
            <h3 className="title">Get Started With Personia!</h3>
            <div className="subtitle">
              Choose your preferred method to securely log in.
            </div>
          </div>
          <div  className="loading preWelcome">
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems:"center",
                justifyContent:"center",
                width:"100%",
                maxWidth:"296px",
                gap:"2rem"
              }}
            >
              <LoginWalletConnect
                setMainLoginState={(state: boolean) => setLoginState(state)}
                color={'green100'}
                textColor={'black100'}
                size={'s'}
              />

              <LoginButtonQr
                color={'green100'}
                textColor={'black100'}
                size={'s'}
              />
            </div>
          </div>
        </LoginChildSec>
      </CModalTwo>

      <CButton
        fullWidth
        size={size}
        background={color}
        backgroundHover={color}
        color={textColor}
        startIcon={'login'}
        loadingColor={'green100'}
        onClick={async () => {
          startLogin()
        }}
      >
        <p style={{ marginLeft: '10px' }}>Login</p>
      </CButton>
    </>
  )
}
