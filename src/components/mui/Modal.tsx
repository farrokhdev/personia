import Backdrop from '@mui/material/Backdrop'
import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'
import { CIconButton } from './IconButton'

const ModalPaper = styled.div<{ width: string; background: string }>`
  width: ${({ width }) => width + 'px'};
  background: ${({ theme, background }) => theme[background]};
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  outline: none;

  > .header {
    padding: 15px;
    text-align: left;
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    align-content: center;
    border-bottom: 1px solid ${props => props.theme.black12};

    > h5 {
      font-size: 16px;
      font-weight: 500;
      color: ${props => props.theme.black80};
    }

    > * {
      &:first-child {
        flex-grow: 1;
      }
    }

    .close {
      margin-left: 15px;
    }
  }

  > .body {
    padding: 15px;

    & .border {
      width: 100%;
      height: 1px;
      background-color: ${props => props.theme.black12};
    }
  }

  > .footer {
    padding: 15px;
    display: flex;
    flex-direction: row;
    flex: 1;
    align-items: center;
    align-content: center;
    border-top: 1px solid ${props => props.theme.black12};

    > .item {
      margin-right: 10px;

      &.grow {
        flex-grow: 1;
      }

      &:last-child {
        margin-right: 0;
      }
    }
  }
`

interface Props {
  open: boolean
  onClose: (event: any, reason: 'backdropClick' | 'escapeKeyDown') => void
  title: string
  children: React.ReactNode
  width?: string
  footerRight?: ReactElement[]
  footerLeft?: ReactElement[]
  background?: string
}

export function CModal(props: Props): ReactElement {
  const {
    open,
    onClose,
    title,
    children,
    width = '600',
    footerRight,
    footerLeft,
    background = 'white100',
  } = props

  const handleClose = (): void => {
    onClose({}, 'backdropClick')
  }

  return (
    <Modal
      aria-labelledby="modal"
      aria-describedby="modal"
      open={open}
      onClose={onClose}
      closeAfterTransition
      // slots={{
      //   backdrop: Backdrop,
      // }}
      // slotProps={{
      //   backdrop: 500,
      // }}
      style={{ overflowY: 'scroll' }}
    >
      <Fade in={open}>
        <ModalPaper width={width} background={background}>
          {title ? (
            <div className="header">
              <h5>{title}</h5>

              <CIconButton onClick={handleClose} icon="close" />
            </div>
          ) : null}
          <div className="body">{children}</div>

          {footerRight != null || footerLeft != null ? (
            <div className={'footer'}>
              {footerLeft?.map((item, index) => (
                <div className="item" key={index}>
                  {item}
                </div>
              ))}

              <div className={'item grow'} />

              {footerRight?.map((item, index) => (
                <div className="item" key={index}>
                  {item}
                </div>
              ))}
            </div>
          ) : null}
        </ModalPaper>
      </Fade>
    </Modal>
  )
}
