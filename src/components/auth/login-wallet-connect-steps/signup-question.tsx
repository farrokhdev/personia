import React from 'react'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { CButtonTwo } from '../../mui/ButtonTwo'

type Props = {
  loading: boolean
  setLoginStep: (
    step: 'welcome' | 'signup-question' | 'signup' | 'none'
  ) => void
  onClose: () => void
  setNewLogin: (newLogin: boolean) => void
}

export const SignupQuestion = ({
  loading,
  setLoginStep,
  setNewLogin,
  onClose,
}: Props) => {
  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Sign up!</h3>
        <div className="subtitle">
          You don’t have an account with this wallet on Personia.
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
          fontSize={'12px'}
          maxWidth={'296px'}
          loading={loading}
          onClick={() => setLoginStep('signup')}
          height={'40px'}
        >
          Sign up with current wallet
        </CButtonTwo>
      </div>
      <div className="link-box">
        Try another wallet?{' '}
        <span
          onClick={() => {
            setNewLogin(true)
            localStorage.removeItem('token')
          }}
        >
          Login
        </span>
      </div>
    </LoginChildSec>
  )
}
