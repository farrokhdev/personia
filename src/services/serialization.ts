import { UserSettingModel } from '../models'
import { AllowedKeyType, encryptionService } from './encryption'

export interface SerializedUserSettings
  extends Omit<UserSettingModel, 'publicKey' | 'privateKey'> {
  publicKey: string
  privateKey: string
}

export const isSerializedUserSettings = (
  data: any
): data is SerializedUserSettings => {
  return (
    typeof data === 'object' &&
    data !== null &&
    'userId' in data &&
    typeof data.userId === 'string' &&
    'playSoundOnNewMessage' in data &&
    typeof data.playSoundOnNewMessage === 'boolean' &&
    'showNotificationOnNewMessage' in data &&
    typeof data.showNotificationOnNewMessage === 'boolean' &&
    'showActiveTypingStatus' in data &&
    typeof data.showActiveTypingStatus === 'boolean' &&
    'publicKey' in data &&
    typeof data.publicKey === 'string' &&
    'privateKey' in data &&
    typeof data.privateKey === 'string'
  )
}

export class SerializationService {
  serializeUserSettings = async (
    userSettings: UserSettingModel
  ): Promise<SerializedUserSettings> => {
    const {
      publicKey: publicCryptoKey,
      privateKey: privateCryptoKey,
      ...userSettingsRest
    } = userSettings

    const publicKey = await encryptionService.stringifyCryptoKey(
      publicCryptoKey
    )

    const privateKey = await encryptionService.stringifyCryptoKey(
      privateCryptoKey
    )

    return {
      ...userSettingsRest,
      publicKey,
      privateKey,
    }
  }

  deserializeUserSettings = async (
    serializedUserSettings: SerializedUserSettings
  ): Promise<UserSettingModel> => {
    const {
      publicKey: publicCryptoKeyString,
      privateKey: privateCryptoKeyString,
      ...userSettingsForIndexedDbRest
    } = serializedUserSettings

    const publicKey = await encryptionService.parseCryptoKeyString(
      publicCryptoKeyString,
      AllowedKeyType.PUBLIC
    )
    const privateKey = await encryptionService.parseCryptoKeyString(
      privateCryptoKeyString,
      AllowedKeyType.PRIVATE
    )

    return {
      ...userSettingsForIndexedDbRest,
      publicKey,
      privateKey,
    }
  }
}

export const serializationService = new SerializationService()
