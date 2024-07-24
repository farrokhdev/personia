/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useAppSelector } from "../redux/hooks";
import {
  isConfigMessageEvent,
  PersistedStorageKeys,
  PostMessageEvent,
  PostMessageEventName,
  QueryParamKeys,
  UserSettingModel,
} from "../models";
import {
  encryptionService,
  serializationService,
  SerializedUserSettings,
} from "../services";
import localforage from "localforage";
import * as serviceWorkerRegistration from "../serviceWorkerRegistration";
import { StorageContext } from "./storage";
import { SettingsContext } from "./setting";
import { GlobalContext } from "./global";
import moment from 'moment-timezone'
import { ChatModel } from '../models/chatProxy/chatProxy'

const CeramicContext = createContext({
  hasNewChat: false,
  setHasNewChat: (val: boolean) => {
    //null
  },
  chatUserId: "",
  setChatUserId: (val: string) => {
    //null
  },
  chat: null,
  setChat: (chat: ChatModel) => {
    //null
  },
  chatSetting: null,
  setChatSetting: (setting: UserSettingModel) => {
    //null
  },
  appNeedUpdate: false,
  timeZone: "",
  locale: "",
  dateOption: null,
});

const configListenerTimeout = 3000;
const getChatConfigFromSdk = () => {
  const queryParams = new URLSearchParams(window.location.search);

  const { origin: parentFrameOrigin } = new URL(
    decodeURIComponent(queryParams.get(QueryParamKeys.PARENT_DOMAIN) ?? "")
  );

  return new Promise<Partial<UserSettingModel>>((resolve, reject) => {
    let expireTimout: NodeJS.Timeout = null;

    const expireListener = () => {
      window.removeEventListener("message", handleMessage);
      clearTimeout(expireTimout);
      reject();
    };

    expireTimout = setTimeout(expireListener, configListenerTimeout);

    const handleMessage = (event: MessageEvent) => {
      if (!isConfigMessageEvent(event)) return;

      resolve(event.data.payload);
      expireListener();
    };

    window.addEventListener("message", handleMessage);

    const postMessageEvent: PostMessageEvent["data"] = {
      name: PostMessageEventName.CONFIG_REQUESTED,
      payload: {},
    };

    window.parent.postMessage(postMessageEvent, parentFrameOrigin);
  });
};

export const CeramicWrapper = ({ children }: any) => {
  const [userSetting, setUserSetting] = useState<UserSettingModel | null>(null);

  const makeChatUserSetting = async () => {
    if (userSetting !== null) return;
    try {
      const {
        publicKey,
        privateKey,
      } = await encryptionService.generateKeyPair();
      setUserSetting({
        displayName: user.displayName ?? "New Face",
        avatar: `https://greenia.infura-ipfs.io/ipfs/${user.avatar}` ?? "",
        userId: user.id,
        playSoundOnNewMessage: true,
        showNotificationOnNewMessage: true,
        showActiveTypingStatus: true,
        publicKey,
        privateKey,
      });
    } catch (error) {
      console.error(error, "chat-error");
    }
  };

  const [hasNewChat, setHasNewChat] = useState<boolean>(false);
  const [chatUserId, setChatUserId] = useState<string>("");
  const [chat, setChat] = useState<ChatModel>();

  const user = useAppSelector((state) => state.user);


  useEffect(() => {
    if (user.did !== "") {
      makeChatUserSetting();
    }
  }, [user]);


  const queryParams = useMemo(
    () => new URLSearchParams(window.location.search),
    []
  );

  const [persistedStorage, setPersistedStorage] = useState(null);
  useEffect(() => {
    setPersistedStorage(
      localforage.createInstance({
        name: "personia-chat",
        description: "Persisted settings data for personia chat",
      })
    );
  }, []);

  const [appNeedsUpdate, setAppNeedsUpdate] = useState(false);
  const [hasLoadedSettings, setHasLoadedSettings] = useState(false);
  const handleServiceWorkerUpdate = () => {
    setAppNeedsUpdate(true);
  };

  const persistUserSettings = useCallback(
    async (newUserSettings: UserSettingModel) => {
      if (userSetting) {
        if (queryParams.has(QueryParamKeys.IS_EMBEDDED)) {
          return Promise.resolve(userSetting);
        }

        const userSettingsForIndexedDb = await serializationService.serializeUserSettings(
          userSetting
        );

        persistedStorage.removeItem(PersistedStorageKeys.USER_SETTINGS);
        return persistedStorage.setItem(
          PersistedStorageKeys.USER_SETTINGS,
          userSettingsForIndexedDb
        );
      }
    },
    [persistedStorage, queryParams, serializationService, userSetting]
  );

  useEffect(() => {
    serviceWorkerRegistration.register({ onUpdate: handleServiceWorkerUpdate });
  }, []);

  useEffect(() => {
    (async () => {
      if (userSetting) {
        if (hasLoadedSettings) return;

        const serializedUserSettings = {
          // NOTE: This migrates persisted user settings data to latest version
          ...(await serializationService.serializeUserSettings(userSetting)),
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          ...(await persistedStorage.getItem<SerializedUserSettings>(
            PersistedStorageKeys.USER_SETTINGS
          )),
        };

        const persistedUserSettings = await serializationService.deserializeUserSettings(
          serializedUserSettings
        );

        const computeUserSettings = async (): Promise<UserSettingModel> => {
          if (queryParams.has(QueryParamKeys.GET_SDK_CONFIG)) {
            try {
              const configFromSdk = await getChatConfigFromSdk();

              return {
                ...userSetting,
                ...persistedUserSettings,
                ...configFromSdk,
              };
            } catch (e) {
              console.error(
                "Personia chat configuration from parent frame could not be loaded"
              );
            }
          }
          return {
            ...userSetting,
            ...persistedUserSettings,
          };
        };

        const computedUserSettings = await computeUserSettings();
        setUserSetting(computedUserSettings);
        setHasLoadedSettings(true);

        await persistUserSettings(computedUserSettings);
      }
    })();
  }, [
    hasLoadedSettings,
    persistedStorage,
    userSetting,
    queryParams,
    persistUserSettings,
    serializationService,
  ]);

  useEffect(() => {
    if (userSetting) {
      const queryParams = new URLSearchParams(window.location.search);
      if (!queryParams.has(QueryParamKeys.IS_EMBEDDED)) return;
      const handleConfigMessage = (event: MessageEvent) => {
        if (!hasLoadedSettings) return;
        if (!isConfigMessageEvent(event)) return;
        const overrideConfig: Partial<UserSettingModel> = event.data.payload;
        setUserSetting({
          ...userSetting,
          ...overrideConfig,
        });
      };
      window.addEventListener("message", handleConfigMessage);
      return () => {
        window.removeEventListener("message", handleConfigMessage);
      };
    }
  }, [hasLoadedSettings, userSetting]);

  const settingsContextValue = {
    updateUserSettings: async (changedSettings: Partial<UserSettingModel>) => {
      const newSettings = {
        ...userSetting,
        ...changedSettings,
      };

      await persistUserSettings(newSettings);

      setUserSetting(newSettings);
    },
    getUserSettings: () => ({ ...userSetting }),
  };

  const storageContextValue = {
    getPersistedStorage: () => persistedStorage,
  };

  const [timeZone, setTimeZone] = useState<string>("Euro/Germany");
  const [locale, setLocale] = useState<string>("de");
  const [dateOption, setDateOption] = useState<any>(null);
  useEffect(() => {
    const timezone = moment.tz.guess()
    const locale = moment.locale()

    setTimeZone(timezone);
    setLocale(locale);

    const options: any = {
      day: "numeric",
      month: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      timezone: timezone
    };
    setDateOption(options);
  }, []);

  return (
    <CeramicContext.Provider
      value={{
        hasNewChat: hasNewChat,
        setHasNewChat: setHasNewChat,
        chatUserId: chatUserId,
        setChatUserId: setChatUserId,
        chat: chat,
        setChat: setChat,
        chatSetting: userSetting,
        setChatSetting: setUserSetting,
        appNeedUpdate: appNeedsUpdate,
        timeZone: timeZone,
        locale: locale,
        dateOption: dateOption,
      }}
    >
      <StorageContext.Provider value={storageContextValue}>
        <SettingsContext.Provider value={settingsContextValue}>
          {children}
        </SettingsContext.Provider>
      </StorageContext.Provider>
    </CeramicContext.Provider>
  );
};

export const useCeramicContext = () => useContext(CeramicContext);
