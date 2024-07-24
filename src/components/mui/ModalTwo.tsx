import Modal from '@mui/material/Modal'
import Fade from '@mui/material/Fade'
import styled from 'styled-components'
import React, { type ReactElement } from 'react'
import { breakpoints } from '../../config/global-styles'
import { isDesktop } from 'react-device-detect'

const ModalPaper = styled.div<{ width: string; background: string }>`
    width: ${({ width }) => width + 'px'};
    background: ${({ background }) => background || '#140E26'};
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    outline: none;

    @media only screen and (min-width: ${breakpoints.mobile}) and (max-width: ${breakpoints.tablet}) {
        width: 100%;
        height: 100%;
        display: flex;
        align-content: center;
        justify-content: center;
        flex-wrap: wrap;
        > .header {
            font-size: 0px;
        }
    }

    > .header {
        width: 100%;
        align-items: center;
        justify-content: flex-end;
        padding: 15px;
        display: flex;

        .close {
            cursor: pointer;
            background: transparent;
            border: 2px solid #fff;
            transition: 0.3s ease;
            display: flex;
            align-items: center;
            text-align: center;
            justify-content: center;
            border-radius: 10px;
            padding: 6px;
            /* position: relative;
            z-index: 10; */

            &:hover {
                background: #fff;

                > svg {
                    path {
                        fill: #000;
                    }
                }
            }
        }

        .back-mobile {
            width: 100%;
            display: flex;
            align-items: start;
            justify-content: start;
            position: absolute;
            top: 0;
            left: 0;
            padding: 10px;
            margin-left: 10px;
            margin-top: 10px;
        }
    }

    > .body {
        padding: 15px;

        div > div > h3 {
            font-size: 38px !important;
            font-weight: 600 !important;
        }

        .subtitle {
            margin-top: 20px;
            font-size: 20px !important;
        }
    }
`

interface Props {
  open: boolean
  onClose: (event: any, reason: 'backdropClick' | 'escapeKeyDown') => void
  title: string
  children: React.ReactNode
  width?: string
  background?: string
}

export function CModalTwo(props: Props): ReactElement {
  const {
    open,
    onClose,
    title,
    children,
    width = '600',
    background = '#140E26',
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
      style={{ overflowY: 'scroll' }}
    >
      <Fade in={open}>
        <ModalPaper width={width} background={background}>
          {title ? (
            <div className="header">
              {isDesktop ? (
                <div className="close" onClick={handleClose}>
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M2.45525 19.5465C1.94858 19.5465 1.44191 19.3598 1.04191 18.9598C0.268581 18.1865 0.268581 16.9065 1.04191 16.1332L16.1352 1.03984C16.9086 0.266506 18.1886 0.266506 18.9619 1.03984C19.7352 1.81317 19.7352 3.09317 18.9619 3.8665L3.86858 18.9598C3.49525 19.3598 2.96191 19.5465 2.45525 19.5465Z"
                      fill="white"
                    />
                    <path
                      d="M17.5486 19.5465C17.0419 19.5465 16.5352 19.3598 16.1352 18.9598L1.04191 3.8665C0.268581 3.09317 0.268581 1.81317 1.04191 1.03984C1.81525 0.266506 3.09525 0.266506 3.86858 1.03984L18.9619 16.1332C19.7352 16.9065 19.7352 18.1865 18.9619 18.9598C18.5619 19.3598 18.0552 19.5465 17.5486 19.5465Z"
                      fill="white"
                    />
                  </svg>
                </div>
              ) : (
                <div className="back-mobile">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="28"
                    viewBox="0 0 14 28"
                    fill="none"
                    onClick={handleClose}
                  >
                    <path
                      d="M14.0008 29.4505C13.6841 29.4505 13.3674 29.3339 13.1174 29.0839L2.25078 18.2172C0.484115 16.4505 0.484115 13.5505 2.25078 11.7839L13.1174 0.917188C13.6008 0.433854 14.4008 0.433854 14.8841 0.917188C15.3674 1.40052 15.3674 2.20052 14.8841 2.68385L4.01745 13.5505C3.21745 14.3505 3.21745 15.6505 4.01745 16.4505L14.8841 27.3172C15.3674 27.8005 15.3674 28.6005 14.8841 29.0839C14.6341 29.3172 14.3174 29.4505 14.0008 29.4505Z"
                      fill="white"
                    />
                  </svg>
                </div>
              )}
            </div>
          ) : null}
          <div className="body">{children}</div>
        </ModalPaper>
      </Fade>
    </Modal>
  )
}
