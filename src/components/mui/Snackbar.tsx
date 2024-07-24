/* eslint-disable @typescript-eslint/restrict-plus-operands */
import { Snackbar } from '@mui/material'
import styled from 'styled-components'
import React from 'react'
import MuiAlert, { type AlertColor, type AlertProps } from '@mui/material/Alert'
import Fade from '@mui/material/Fade'

export interface CSnackbarType {
  open: boolean
  handleClose: (status: boolean) => void
  severity: AlertColor | undefined
  label: string
}

export interface CSnackbarStyleType extends AlertProps {
  background: string
  textColor: string
}

const CSnackbarStyle = styled(Snackbar)``

const CMuiAlertStyle = styled(MuiAlert)<CSnackbarStyleType>`
  && {
    background: ${({ theme, background }) => theme[background]};
    border-radius: 8px;
    display: flex;
    align-items: center;
    padding: 10px 15px;
  }

  && .MuiAlert-icon {
    margin-left: 0;
    margin-right: 15px;
    color: ${({ theme, textColor }) => theme[textColor]};
    display: none;
  }

  && .MuiAlert-action {
    margin-left: 15px;
    margin-right: 0;
    margin-bottom: 0;
    padding: 0 !important;
    color: ${({ theme }) => theme.black80};
    
    > .MuiButtonBase-root {
      border-radius: 50%;
      width: 25px;
      height: 25px;
      background-color: ${({ theme }) => theme.white100};

      > svg {
        transform: scale(0.7);
      }
    }
  }

  && .MuiAlert-message {
    font-family: Inter;
    line-height: 12px;
    font-weight: 500;
    color: ${({ theme, textColor }) => theme[textColor]};
    padding: 0 !important;
  }
`

const Alert = React.forwardRef<HTMLDivElement, CSnackbarStyleType>(function Alert (
  props,
  ref
) {
  return <CMuiAlertStyle elevation={6} ref={ref} variant="filled" {...props} />
})

export const CSnackbar: React.ComponentType<CSnackbarType> = (props: CSnackbarType) => {
  const { open, handleClose, severity, label } = props

  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  const handleSelfClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return
    }

    handleClose(false)
  }

  let colors = { background: 'lightBlue', textColor: 'lightBluetext' }

  if (severity === 'error') {
    colors = { background: 'red', textColor: 'redText' }
  }

  if (severity === 'success') {
    colors = { background: 'green100', textColor: 'white100' }
  }

  return (
    <CSnackbarStyle
      open={open}
      autoHideDuration={6000}
      onClose={handleSelfClose}
      TransitionComponent={Fade}
    >
      <Alert onClose={handleSelfClose} severity={severity} {...colors}>
        {label}
      </Alert>
    </CSnackbarStyle>
  )
}
