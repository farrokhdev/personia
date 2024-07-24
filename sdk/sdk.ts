import {
  ChatEmbedAttributes,
  PostMessageEvent,
  PostMessageEventName,
  isPostMessageEvent,
  QueryParamKeys,
  UserSettingModel
} from '../src/models'
import { iframeFeatureAllowList } from '../src/config'

export const defaultRoot = 'https://personia.io/'


const iframeAttributes = [
  'height',
  'referrerpolicy',
  'sandbox',
  'style',
  'width',
]

const configRequestTimeout = 10_000

// @ts-ignore
class ChatEmbed implements HTMLElement {
  private configRequestExpirationTimout: NodeJS.Timeout | null = null

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private iframe = document.createElement('iframe')

  static get observedAttributes() {
    const chatAttributes = Object.values(ChatEmbedAttributes)

    return [...chatAttributes, ...iframeAttributes]
  }

  get chatConfig() {
    const chatConfig: Partial<UserSettingModel> = {}

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.hasAttribute(ChatEmbedAttributes.USER_ID)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chatConfig.userId = this.getAttribute(ChatEmbedAttributes.USER_ID) ?? ''
    }

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (this.hasAttribute(ChatEmbedAttributes.USER_NAME)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chatConfig.displayName = this.getAttribute(ChatEmbedAttributes.USER_NAME)!
    }

    chatConfig.playSoundOnNewMessage = Boolean(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.hasAttribute(ChatEmbedAttributes.PLAY_MESSAGE_SOUND)
    )

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const colorMode = this.getAttribute(ChatEmbedAttributes.COLOR_MODE) ?? ''

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    if (isColorMode(colorMode)) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      chatConfig.colorMode = colorMode
    }

    return chatConfig
  }

  get rootUrl() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    return this.getAttribute(ChatEmbedAttributes.ROOT_URL) ?? defaultRoot
  }

  private sendConfigToChat = () => {
    const { iframe, rootUrl } = this
    const { origin: rootUrlOrigin } = new URL(rootUrl)

    const postMessageEventData: PostMessageEvent['data'] = {
      name: PostMessageEventName.CONFIG,
      payload: this.chatConfig,
    }

    iframe.contentWindow?.postMessage(postMessageEventData, rootUrlOrigin)
  }

  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  private handleConfigRequestedMessage = (event: MessageEvent) => {
    const { rootUrl } = this
    const { origin: rootUrlOrigin } = new URL(rootUrl)

    if (rootUrlOrigin !== event.origin) return
    if (!isPostMessageEvent(event)) return
    if (event.data.name !== PostMessageEventName.CONFIG_REQUESTED) return

    this.sendConfigToChat()
    this.stopListeningForConfigRequest()
  }

  private stopListeningForConfigRequest = () => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.removeEventListener('message', this.handleConfigRequestedMessage)

    if (this.configRequestExpirationTimout !== null) {
      clearInterval(this.configRequestExpirationTimout)
      this.configRequestExpirationTimout = null
    }
  }

  private async listenForConfigRequest() {
    // NOTE: This cancels any pending config request listeners
    this.stopListeningForConfigRequest()

    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    window.addEventListener('message', this.handleConfigRequestedMessage)

    this.configRequestExpirationTimout = setTimeout(() => {
      console.error(`[chitchatter-sdk] configuration was not sent successfully`)
      this.stopListeningForConfigRequest()
    }, configRequestTimeout)
  }

  private updateIframeAttributes() {
    const { iframe } = this

    const roomName = encodeURIComponent(
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      this.getAttribute(ChatEmbedAttributes.ROOM_NAME) ?? window.location.href
    )

    const urlParams = new URLSearchParams({
      [QueryParamKeys.IS_EMBEDDED]: '',
      [QueryParamKeys.GET_SDK_CONFIG]: '',
      [QueryParamKeys.PARENT_DOMAIN]: encodeURIComponent(
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore
        window.location.origin
      ),
    })

    const iframeSrc = new URL(this.rootUrl)
    iframeSrc.pathname = `public/${roomName}`
    iframeSrc.search = urlParams.toString()
    const { href: src } = iframeSrc

    // NOTE: Only update src if the value has changed to avoid reloading the
    // iframe unnecessarily.
    if (src !== iframe.getAttribute('src')) {
      iframe.setAttribute('src', src)
    }

    for (let attributeName of iframeAttributes) {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-ignore
      const attributeValue = this.getAttribute(attributeName)

      if (attributeValue !== null) {
        iframe.setAttribute(attributeName, attributeValue)
      }
    }
  }

  connectedCallback() {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const shadow = this.attachShadow({ mode: 'open' })
    const { iframe } = this

    iframe.style.border = 'none'
    iframe.setAttribute('allow', iframeFeatureAllowList.join(';'))
    shadow.appendChild(iframe)

    iframe.addEventListener('load', () => {
      this.listenForConfigRequest()
    })
  }

  disconnectedCallback() {
    this.stopListeningForConfigRequest()
  }

  attributeChangedCallback(name: string) {
    this.updateIframeAttributes()

    const isChatEmbedAttribute = Object.values(ChatEmbedAttributes)
      .map(String) // NOTE: Needed to avoid type warnings.
      .includes(name)

    if (isChatEmbedAttribute) {
      this.sendConfigToChat()
    }
  }
}

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
window.customElements.define('chat-room', ChatEmbed)
