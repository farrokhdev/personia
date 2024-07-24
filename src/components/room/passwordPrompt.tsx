import { ChangeEvent, useState, SyntheticEvent } from 'react'
import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { useNavigate } from 'react-router-dom'
import { CButton, CTextField } from '../mui'

interface PasswordPromptProps {
  isOpen: boolean
  onPasswordEntered: (password: string) => void
}

export const PasswordPrompt = ({
  isOpen,
  onPasswordEntered,
}: PasswordPromptProps) => {
  const [password, setPassword] = useState('')
  const navigate = useNavigate()

  const handleFormSubmit = (event: SyntheticEvent<HTMLFormElement>) => {
    event.preventDefault()
    onPasswordEntered(password)
  }

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value)
  }

  const handleCancel = () => {
    navigate(`/`)
  }

  return (
    <Dialog open={isOpen}>
      <form onSubmit={handleFormSubmit}>
        <DialogTitle>Room Password</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Please enter room password.
          </DialogContentText>
          <DialogContentText>
            If there is a mismatch, you will be in the room but be unable to
            connect to others. An error will not be shown.
          </DialogContentText>

          <div style={{marginTop: '20px'}}></div>
          <CTextField
            label="Password"
            type="password"
            value={password}
            background={'navy100'}
            onChange={handlePasswordChange}
            placeholder={'Room password'}
          />
        </DialogContent>
        <DialogActions>
          <CButton
            type="button"
            color={'error'}
            background={'red100'}
            backgroundHover={'red130'}
            onClick={handleCancel}
          >
            Cancel
          </CButton>

          <CButton
            type={'submit'}
            disabled={password.length === 0}
            background={'navy60'}
            backgroundHover={'navy100'}
            color={password.length === 0 ? 'navy100' : 'white100'}
            backgroundDisabled={'gray80'}
          >
            Submit
          </CButton>
        </DialogActions>
      </form>
    </Dialog>
  )
}
