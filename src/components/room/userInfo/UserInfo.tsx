import { useState, useContext} from 'react'
import Button from '@mui/material/Button'
import Box from '@mui/material/Box'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import { SettingsContext } from '../../../contexts/setting'
import { PeerNameDisplay } from '../peer'
import { PublicKey } from '../publicKey'

interface UserInfoProps {
  userId: string
}

export const UserInfo = ({ userId }: UserInfoProps) => {

  const { getUserSettings } = useContext(SettingsContext)

  const [isInfoDialogOpen, setIsInfoDialogOpen] = useState(false)
  const { publicKey } = getUserSettings()
  const handleInfoButtonClick = () => {
    setIsInfoDialogOpen(true)
  }
  const handleInfoDialogClose = () => {
    setIsInfoDialogOpen(false)
  }


  return (
    <>

      <Dialog open={isInfoDialogOpen} onClose={handleInfoDialogClose}>
        <DialogTitle>
          <Box component="span">
            <PeerNameDisplay sx={{ fontSize: 'inherit' }}>
              {userId}
            </PeerNameDisplay>
          </Box>
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your public key (generated locally):
          </DialogContentText>
          <PublicKey publicKey={publicKey} />
          <DialogContentText>
            Your private key, which was also generated locally, is hidden and
            only exists on your device.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleInfoDialogClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </>
  )
}
