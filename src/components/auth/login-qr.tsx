import { useEffect, useState } from 'react'
import { useGlobalContext } from '../../contexts'
import { set } from '../../redux/slices/user'
import { useAppDispatch, useAppSelector } from '../../redux/hooks'
import { CButton } from '../mui'
import {
  closeModalHandler,
  openModalHandler,
} from '../../providers/modalProvider'
import { CModalTwo } from '../mui/ModalTwo'
import { QrCodeStep } from './login_steps/QrCodeStep'
import { WelocmeBack } from './login_steps/WelocmeBack'
import { JoinOurCommunity } from './login_steps/JoinOurCommunity'
import { CreateUserAccount } from './login_steps/CreateUserAccount'
import { loginCheck } from '../../apis/auth.apis'
import { ApiErrorData } from '../../apis/http.api'
import { v4 as uuid } from 'uuid'
import { CButtonTwo } from '../mui/ButtonTwo'
import { UserModel } from '../../models/user.model'
import { QrLoading } from './login_steps/QrLoading'
import { LastWelcomePart } from './login_steps/LastWelcomePart'
import { NormalLoading } from './login_steps/NormalLoading'

export function LoginButtonQr({ color, textColor, size }: any) {
  const { makeAlert } = useGlobalContext()
  const [loading, setLoading] = useState(false)

  const [loginState, setLoginState] = useState(false)
  const [loginStep, setLoginStep] = useState<
    | 'initial'
    | 'loading'
    | 'normal-loading'
    | 'qr-scan'
    | 'welcome-back'
    | 'join'
    | 'create-acc'
    | 'welcome-final'
  >('loading')

  const [metaMaskLink, setMetamaskLink] = useState<string>('')
  const [did, setDid] = useState<string>('')
  const [session, setSession] = useState<string>('')
  const [wallet, setWallet] = useState<string>('')

  const [expired, setExpired] = useState<boolean>(false)
  const [expTime, setExpTime] = useState<number>(120)

  let timeInterval = null
  // useEffect(() => {
  //     if(loginState) {
  //         timeInterval = setTimeout(() => {
  //             if (expTime > 0) {
  //                 setExpTime(expTime - 1);
  //             }
  //             if (expTime === 0) {
  //                 setExpTime(120);
  //                 setExpired(true);
  //             }
  //         }, 1000);
  //         return () => {
  //             clearInterval(timeInterval);
  //         };
  //     }
  // });

  let eventSource: EventSource = new EventSource(
    process.env['REACT_APP_API_BASE_URL'] + `auth/login/metamask/${uuid()}`
  )
  useEffect(() => {
    if (loginState || expired) {
      setLoading(true)
      if (eventSource === null)
        eventSource = new EventSource(
          process.env['REACT_APP_API_BASE_URL'] +
            `auth/login/metamask/${uuid()}`
        )
      eventSource.onmessage = event => {
        console.log(event)
        if (JSON.parse(event.data).link) {
          setExpTime(120)
          setMetamaskLink(JSON.parse(event.data).link)
          setLoginStep('qr-scan')
        } else if (JSON.parse(event.data).connectionStatus === 'ok') {
        } else if (JSON.parse(event.data).connectionStatus === 'linked') {
          setLoading(true)
          setLoginStep('normal-loading')
          //   clearInterval(timeInterval);
          setExpTime(0)
        } else if (JSON.parse(event.data).did !== null) {
          setDid(JSON.parse(event.data).did)
          setSession(JSON.parse(event.data).session)
          setWallet(JSON.parse(event.data).wallet)
          eventSource.close()
        }
      }
    }
  }, [loginState, expired])

  const openLoginModal = () => {
    openModalHandler(setLoginState, setLoginStep)
  }

  const closeLoginModal = () => {
    // clearInterval(timeInterval);
    eventSource.close()
    closeModalHandler(setLoginState, setLoginStep)
  }

  const [user, setUser] = useState<UserModel>()
  useEffect(() => {
    if (session) {
      localStorage.setItem('token', session)
      setLoading(true)
      loginCheck()
        .then(result => {
          setLoading(false)
          if (result.data.user) {
            setLoginStep('welcome-back')
            setUser(result.data.user)
          } else {
            setLoginStep('join')
          }
        })
        .catch((error: ApiErrorData) => {
          setLoading(false)
        })
    }
  }, [session])

  return (
    <>
      {/* login modal  */}
      {loginState && (
        <CModalTwo
          open={loginState}
          onClose={closeLoginModal}
          title="login modal"
          width="540"
        >
          {loginStep === 'loading' && <QrLoading />}
          {loginStep === 'normal-loading' && <NormalLoading />}
          {loginStep === 'qr-scan' && (
            <QrCodeStep metamaskLink={metaMaskLink} expTime={expTime} />
          )}
          {loginStep === 'welcome-back' && (
            <WelocmeBack
              loading={loading}
              user={user}
              onClose={closeLoginModal}
              wallet={wallet}
              did={did}
            />
          )}
          {loginStep === 'join' && (
            <JoinOurCommunity
              loading={loading}
              setLoginStep={setLoginStep}
              setExpired={setExpired}
              onClose={closeLoginModal}
            />
          )}
          {loginStep === 'create-acc' && (
            <CreateUserAccount setLoginStep={setLoginStep} wallet={wallet} />
          )}

          {loginStep === 'welcome-final' && <LastWelcomePart />}
        </CModalTwo>
      )}
      <CButton
        fullWidth
        size={size}
        background={color}
        backgroundHover={color}
        color={textColor}
        loadingColor={'green100'}
        onClick={async () => {
          openLoginModal()
        }}
      >
        <p style={{ marginLeft: '10px' }}>Scan QR with Metamask</p>
      </CButton>
    </>
  )
}
