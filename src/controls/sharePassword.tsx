import React, { useState } from 'react'
import { AlertColor } from '@mui/material'
import { useLocation } from 'react-router-dom'
import { ReactComponent as Share } from '../assets/svg/share.svg'
import styled from 'styled-components'
import { CButton, CModal } from '../components/mui'
import { ReactComponent as Link } from '../assets/svg/link.svg'


export interface ShareProps {
  roomId: string
  showAlert: any
  password: string
}

const Button = styled.div<{ background: string; border: string, padding: string }>`
    justify-content: center;
    align-items: center;
    cursor: pointer;
    text-align: center;

    > .border {
        background: ${({ theme, background }) => theme[background]};
        border: 1px solid ${({ theme, border }) => theme[border]};
        display: flex;
        margin-bottom: 10px;
        padding: ${({ padding }) => padding};
        border-radius: 12px;

        > .icon-active {
            color: ${props => props.theme.white100};
            height: 18px;
            margin-top: 2px;
        }

        > .icon {
            color: ${props => props.theme.white100};
            height: 18px;
            text-align: center;
        }
    }

    > span {
        color: ${props => props.theme.white100};
        text-align: center;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        letter-spacing: 0.5px;
        cursor: text;
        margin-top: 30px;
    }
`

const ModalBody = styled.div`
  width: 100%;
  margin: 0 auto 0 auto;
    
    >.title{
        display: inline-flex;
        
        > p {
            color: ${({ theme }) => theme.white100};
            font-family: Inter;
            font-size: 20px;
            font-weight: 600;
            line-height: 28px;
            text-align: justify;
            margin-left: 20px;
        }
    }

    > p {
        color: ${({ theme }) => theme.white100};
        font-family: Inter;
        font-size: 12px;
        font-weight: 500;
        line-height: 20px;
        text-align: justify;
        margin-top: 20px;
    }

    > .link {
        margin: 15px 0 15px 0;
        background: transparent;
        border: 1px solid ${(props) => props.theme.gray60};
        padding: 10px;
        border-radius: 8px;
        display: flex;
        text-align: center;
        align-items: center;

        > input {
            width: 100%;
            display: block;
            height: 40px;
            font-family: Inter;
            font-size: 14px;
            font-weight: 400;
            color: ${(props) => props.theme.white100};
            border: none;
            background: transparent;
            padding: 0 15px;
            cursor: pointer;
        }

        > .material-symbols-outlined {
            color: ${(props) => props.theme.white100};
            background: transparent;
        }
    }
`


export function SharePasswordControls(props: ShareProps) {
  const { roomId, showAlert, password } = props
  const [isRoomShareDialogOpen, setIsRoomShareDialogOpen] = useState(false)

  const copyToClipboard = async () => {
    const url = window.location.href.split('#')[0]
    const params = new URLSearchParams()
    params.set('secret', props.password)
    await navigator.clipboard.writeText(`${url}#${params}`)
    showAlert('Private URL copied to clipboard', 'success')
    setIsRoomShareDialogOpen(false)
  }


  return (
    <>
      <Button
        background={isRoomShareDialogOpen ? 'navy60' : 'transparent'}
        border={isRoomShareDialogOpen ? 'navy40' : 'gray50'}
        padding={isRoomShareDialogOpen ? '14px' : '14px'}
        onClick={() => setIsRoomShareDialogOpen(true)}
      >
        <div className={'border'}>
          <div className={isRoomShareDialogOpen ? 'icon-active' : 'icon'}>
            <div style={{ cursor: 'pointer' }}>
              <Share />
            </div>
          </div>
        </div>

        <span>{'Share'}</span>
      </Button>

      <CModal
        open={isRoomShareDialogOpen}
        onClose={() => {
          setIsRoomShareDialogOpen(false)
        }}
        title=""
        width={'400'}
        background={'navy90'}
      >
        <ModalBody>
          <div className={'title'}>
            <Link />
            <p>Share via Link</p>
          </div>

          <p>
            Copy URL to this private room containing an indecipherable hash of
            the password. When using this URL, users will not need to enter the
            password themselves.
          </p>

          <div className={'link'}>
            <Link />
            <input readOnly value={window.location.href} />
          </div>

          <CButton
            onClick={copyToClipboard}
            background={'navy25'}
            backgroundHover={'navy25'}
            fullWidth={true}
            startIconSvg={<Link />}
            size={'s'}
          >
            Understand Risks and Copy Link
          </CButton>
        </ModalBody>
      </CModal>
    </>

  )
}
