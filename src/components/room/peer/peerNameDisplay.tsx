import Typography, { TypographyProps } from '@mui/material/Typography'
import { usePeerNameDisplay } from '../../../hook'
import { useContext, useEffect } from 'react'
import { ShellContext } from '../../../contexts/shell'
import styled from 'styled-components'

const PeerName = styled.div`
  font-size: 14px;
  font-weight: 400;
  color: ${props => props.theme.white100};
  display: block;
  line-height: 28px;
  color: ${props => props.theme.white};
`

export interface PeerNameDisplayProps extends TypographyProps {
  children: string
}

export const PeerNameDisplay = ({
  children: userId,
  ...rest
}: PeerNameDisplayProps) => {
  const { peerList, displayName: selfdisplayName } =
    useContext(ShellContext)
  const { getdisplayName } = usePeerNameDisplay()
  const displayName = getdisplayName(userId)

  return <PeerName>{displayName}</PeerName>
}
