import React, { ReactElement, useContext, useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'
import { encryptionService, NotificationService } from '../../../services'
import { useAppSelector } from '../../../redux/hooks'
import { PasswordPrompt, Room, Shell } from '../../../components/room'

export function PrivateChatRoomPage(props: {currentWindow?: Window}): ReactElement {


  const { id } = useParams()
  const user = useAppSelector(state => state.user)
  const location = useLocation()
  const [secret, setSecret] = useState('')
  const [openModel, setOpenModal] = useState(false)

  const urlParams = new URLSearchParams(window.location.hash.substring(1))
  useEffect(() => {
    NotificationService.requestPermission()
  }, [])

  useEffect(() => {
    ;(async () => {
      if (location.state) {
        setPassword(location.state.password)
        setSecret(
          await encryptionService.encodePassword(id, location.state.password)
        )
      } else if (urlParams.get('secret') !== null) {
        setSecret(
          await encryptionService.encodePassword(id, urlParams.get('secret'))
        )
      } else {
        setOpenModal(true)
      }
    })()
  }, [location])

  const [password, setPassword] = useState('')
  const handlePasswordEntered = async (password: string) => {
    if (password.length !== 0) {
      setPassword(password)
      setSecret(await encryptionService.encodePassword(id, password))
      setOpenModal(false)
    }
  }

  return (
    <Shell appNeedsUpdate={false} userPeerId={user.id}>
      {secret.length > 0 ? (
        <Room currentWindow={props.currentWindow} roomId={id} userId={user.id} password={secret} rPass={password} />
      ) : (
        <PasswordPrompt
          isOpen={openModel}
          onPasswordEntered={handlePasswordEntered}
        />
      )}
    </Shell>
  )
}
