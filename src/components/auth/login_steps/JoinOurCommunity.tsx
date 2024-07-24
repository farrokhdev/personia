import React from 'react'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { CLoader } from '../../custom'
import QrCode from '../../../assets/images/qrcode.png'
import { CButton } from '../../mui'
import { CButtonTwo } from '../../mui/ButtonTwo'

type Props = {
  loading: boolean
  setLoginStep: (
    step:
      | 'initial'
      | 'loading'
      | 'qr-scan'
      | 'welcome-back'
      | 'join'
      | 'create-acc'
      | 'welcome-final'
  ) => void
  onClose: () => void

  setExpired: (expired: boolean) => void
}

export const JoinOurCommunity = ({
  loading,
  setLoginStep,
  onClose,
  setExpired,
}: Props) => {
  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Join Our Community!</h3>
        <div className="subtitle">
          Welcome! It looks like you don’t have an account with this wallet.
          Let's get you set up."
        </div>
      </div>
      <div className="items-box-row">
        <CButtonTwo
          color={'#39DBB2'}
          background={'#140E26'}
          hoverColor={'#fff'}
          backgroundHover={'#2aaa8a'}
          variant={'filled'}
          fullWidth={true}
          type={'button'}
          size="s"
          loading={loading}
          border={'#39DBB2'}
          fontWeight={600}
          fontSize={'12px'}
          onClick={onClose}
          height={'40px'}
        >
          Cancel
        </CButtonTwo>
        <CButtonTwo
          color={'#140E26'}
          background={'#39DBB2'}
          backgroundHover={'#2aaa8a'}
          variant={'filled'}
          fullWidth={true}
          type={'button'}
          size="s"
          fontWeight={600}
          fontSize={'14px'}
          maxWidth={'296px'}
          loading={loading}
          onClick={() => setLoginStep('create-acc')}
          height={'40px'}
        >
          Continue with current wallet
        </CButtonTwo>
      </div>
      <div className="link-box">
        Try another wallet?{' '}
        <span
          onClick={() => {
            setLoginStep('loading')
            setExpired(true)
            localStorage.removeItem('token')
          }}
        >
          Login
        </span>
      </div>
    </LoginChildSec>
  )
}
