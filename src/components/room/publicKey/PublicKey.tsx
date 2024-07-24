import { useEffect, useState } from 'react'
import { materialDark } from 'react-syntax-highlighter/dist/esm/styles/prism'
import { PrismAsyncLight as SyntaxHighlighter } from 'react-syntax-highlighter'
import { CopyableBlock } from '../copy'
import { encryptionService } from '../../../services'

interface PeerPublicKeyProps {
  publicKey: CryptoKey
}

export const PublicKey = ({ publicKey }: PeerPublicKeyProps) => {
  const [publicKeyString, setPublicKeyString] = useState('')

  useEffect(() => {
    ;(async () => {
      setPublicKeyString(await encryptionService.stringifyCryptoKey(publicKey))
    })()
  }, [publicKey])

  return (
    <CopyableBlock>
      <SyntaxHighlighter
        language="plaintext"
        style={materialDark}
        PreTag="div"
        lineProps={{
          style: {
            wordBreak: 'break-all',
            whiteSpace: 'pre-wrap',
          },
        }}
        wrapLines={true}
      >
        {publicKeyString}
      </SyntaxHighlighter>
    </CopyableBlock>
  )
}
