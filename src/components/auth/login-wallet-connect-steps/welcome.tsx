import React from 'react'
import { LoginChildSec } from '../../newStructures/LoginChild.style'
import { CButtonTwo } from '../../mui/ButtonTwo'
import { UserModel } from '../../../models/user.model'
import { useAppDispatch } from '../../../redux/hooks'
import { set } from '../../../redux/slices/user'

type Props = {
  loading: boolean
  onClose: () => void
  user: UserModel
  wallet: string
  did: string
}

export const Welcome = ({ loading, onClose, user, wallet, did }: Props) => {
  const dispatch = useAppDispatch()
  const handleOnClick = () => {
    dispatch(set({ ...user, wallet: wallet, did: did }))
    onClose()
  }

  return (
    <LoginChildSec>
      <div className="top-heading">
        <h3 className="title">Welcome back!</h3>
        <div className="loading">You've successfully logged in. Start exploring your personalized social network.</div>
      </div>
      <div className="loading">
        <CButtonTwo
          color={'#140E26'}
          background={'#39DBB2'}
          backgroundHover={'#2aaa8a'}
          variant={'filled'}
          type={'button'}
          size="s"
          maxWidth={'296px'}
          loading={loading}
          fullWidth={true}
          onClick={handleOnClick}
          height={'40px'}
        >
          OK
        </CButtonTwo>
      </div>
    </LoginChildSec>
  )
}