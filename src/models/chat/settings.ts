export interface UserSettingModel {
  userId: string
  displayName: string
  avatar: string
  playSoundOnNewMessage: boolean
  showNotificationOnNewMessage: boolean
  showActiveTypingStatus: boolean
  publicKey: CryptoKeyPair['publicKey']
  privateKey: CryptoKeyPair['privateKey']
}