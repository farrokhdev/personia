import { createContext } from 'react'

import { UserSettingModel } from '../models'
import { encryptionService } from '../services'

export interface SettingsContextProps {
  updateUserSettings: (settings: Partial<UserSettingModel>) => Promise<void>
  getUserSettings: () => UserSettingModel
}

export const SettingsContext = createContext<SettingsContextProps>({
  updateUserSettings: () => Promise.resolve(),
  getUserSettings: () => ({
    userId: '',
    avatar: '',
    displayName: '',
    playSoundOnNewMessage: true,
    showNotificationOnNewMessage: true,
    showActiveTypingStatus: true,
    publicKey: encryptionService.cryptoKeyStub,
    privateKey: encryptionService.cryptoKeyStub,
  }),
})
