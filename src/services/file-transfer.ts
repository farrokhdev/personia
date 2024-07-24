import { FileTransfer, setStreamSaverMitm } from 'secure-file-transfer'

import { trackerUrls, streamSaverUrl, rtcConfig } from '../config'

setStreamSaverMitm(streamSaverUrl)

export const fileTransfer = new FileTransfer({
  torrentOpts: {
    announce: trackerUrls,
  },
  webtorrentInstanceOpts: {
    tracker: {
      rtcConfig,
    },
  },
})
