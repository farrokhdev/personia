import { joinRoom, Room, BaseRoomConfig } from 'trystero'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import { TorrentRoomConfig } from 'trystero/torrent'
import { sleep } from '../utils'

export enum PeerHookType {
  NEW_PEER = 'NEW_PEER',
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SCREEN = 'SCREEN',
  FILE_SHARE = 'FILE_SHARE',
}

export enum PeerStreamType {
  AUDIO = 'AUDIO',
  VIDEO = 'VIDEO',
  SCREEN = 'SCREEN',
}

export enum PeerConnectionType {
  DIRECT = 'DIRECT',
  RELAY = 'RELAY',
}

const streamQueueAddDelay = 1000

export class PeerRoom {
  private room: Room

  private roomConfig: TorrentRoomConfig & BaseRoomConfig

  private peerJoinHandlers: Map<
    PeerHookType,
    Parameters<Room['onPeerJoin']>[0]
  > = new Map()

  private peerLeaveHandlers: Map<
    PeerHookType,
    Parameters<Room['onPeerLeave']>[0]
  > = new Map()

  private peerRecordingHandlers: Map<
    PeerHookType,
    Parameters<Room['onPeerStream']>[0]
  > = new Map()

  private peerStreamHandlers: Map<
    PeerStreamType,
    Parameters<Room['onPeerStream']>[0]
  > = new Map()

  private streamQueue: (() => Promise<any>)[] = []

  private isProcessingPendingStreams = false

  constructor(config: TorrentRoomConfig & BaseRoomConfig, roomId: string) {
    this.roomConfig = config
    this.room = joinRoom(this.roomConfig, roomId)

    this.room.onPeerJoin((...args) => {
      for (const [, peerJoinHandler] of this.peerJoinHandlers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        peerJoinHandler(...args)
      }
    })

    this.room.onPeerLeave((...args) => {
      for (const [, peerLeaveHandler] of this.peerLeaveHandlers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        peerLeaveHandler(...args)
      }
    })

    this.room.onPeerStream((...args) => {
      for (const [, peerStreamHandler] of this.peerStreamHandlers) {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        peerStreamHandler(...args)
      }
    })
  }

  flush = () => {
    this.onPeerJoinFlush()
    this.onPeerLeaveFlush()
    this.onPeerStreamFlush()
  }

  leaveRoom = () => {
    this.room.leave()
    this.flush()
  }

  onPeerJoin = (
    peerHookType: PeerHookType,
    fn: Parameters<Room['onPeerJoin']>[0]
  ) => {
    this.peerJoinHandlers.set(peerHookType, fn)
  }

  onPeerJoinFlush = () => {
    this.peerJoinHandlers = new Map()
  }

  onPeerLeave = (
    peerHookType: PeerHookType,
    fn: Parameters<Room['onPeerLeave']>[0]
  ) => {
    this.peerLeaveHandlers.set(peerHookType, fn)
  }

  onPeerLeaveFlush = () => {
    this.peerLeaveHandlers = new Map()
  }

  onPeerStream = (
    peerStreamType: PeerStreamType,
    fn: Parameters<Room['onPeerStream']>[0]
  ) => {
    this.peerStreamHandlers.set(peerStreamType, fn)
  }

  onPeerStreamFlush = () => {
    this.peerStreamHandlers = new Map()
  }

  getPeers = () => {
    const peers = this.room.getPeers()

    return Object.keys(peers)
  }

  getPeerConnectionTypes = async () => {
    const peers = this.room.getPeers()

    const peerConnections: Record<string, PeerConnectionType> = {}

    await Promise.all(
      Object.entries(peers).map(async ([peerId, rtcPeerConnection]) => {
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        const stats = await rtcPeerConnection.getStats()
        let selectedLocalCandidate

        // https://stackoverflow.com/a/61571171/470685
        for (const { type, state, localCandidateId } of stats.values())
          if (
            type === 'candidate-pair' &&
            state === 'succeeded' &&
            localCandidateId
          ) {
            selectedLocalCandidate = localCandidateId
            break
          }

        const isRelay =
          !!selectedLocalCandidate &&
          stats.get(selectedLocalCandidate)?.candidateType === 'relay'

        peerConnections[peerId] = isRelay
          ? PeerConnectionType.RELAY
          : PeerConnectionType.DIRECT
      })
    )

    return peerConnections
  }

  makeAction = <T>(namespace: string) => {
    return this.room.makeAction<T>(namespace)
  }

  addStream = (...args: Parameters<Room['addStream']>) => {
    // New streams need to be added as a delayed queue to prevent race
    // conditions on the receiver's end where streams and their metadata get
    // mixed up.
    this.streamQueue.push(
      () => Promise.all(this.room.addStream(...args)),
      () => sleep(streamQueueAddDelay)
    )

    this.processPendingStreams()
  }

  private processPendingStreams = async () => {
    if (this.isProcessingPendingStreams) return

    this.isProcessingPendingStreams = true

    while (this.streamQueue.length > 0) {
      await this.streamQueue.shift()?.()
    }

    this.isProcessingPendingStreams = false
  }

  removeStream: Room['removeStream'] = (stream, targetPeers) => {
    return this.room.removeStream(stream, targetPeers)
  }
}
