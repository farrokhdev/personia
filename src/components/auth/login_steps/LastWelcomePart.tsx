import { useEffect, useState } from 'react'
import { CModalTwo } from '../../mui/ModalTwo'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { CButton } from '../../mui'

interface Props {
  color?: string
  textColor?: string
  size?: 's' | 'm' | 'l'
}

export function LastWelcomePart(props: Props) {
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
      {/* <CModalTwo
        open={loginState}
        onClose={closeLoginModal}
        title="login modal"
        width="540"
      > */}
      <LoginChildSec>
        <div className="top-heading">
          <h3 className="title">Welcome To Personia!</h3>
          <div className="subtitle">
            You've successfully logged in. Your journey in Personia begins now.
            Let’s get started!
          </div>
        </div>
        <div className="loading preWelcome">
          <div
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              width: '100%',
              gap: '2rem',
            }}
          >
            <CButton
              fullWidth
              size={'s'}
              background={color}
              backgroundHover={color}
              color={textColor}
              loadingColor={textColor}
              onClick={startLogin}
            >
              <p style={{ marginLeft: '10px' }}>Start Exploring</p>
            </CButton>
            <CButton
              fullWidth
              size={'s'}
              background={color}
              backgroundHover={color}
              color={textColor}
              loadingColor={textColor}
              onClick={startLogin}
            >
              <p style={{ marginLeft: '10px' }}>Start Exploring</p>
            </CButton>
          </div>
        </div>
      </LoginChildSec>
      {/* </CModalTwo> */}
    </>
  )
}
