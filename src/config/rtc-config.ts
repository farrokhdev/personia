export const rtcConfig: RTCConfiguration = {
  iceServers: [
    {
      urls: 'stun:stun.allostasis.io',
    },
    {
      urls: 'turn:turn.allostasis.io',
      username: 'HaNEP3EuzWu6e6vsdfsayRB4C1khCLgsTsP',
      credential: 'HaNEP3EuzWu6e6vyRB4C1khCLgsTsP',
    },
    {
      urls: 'turn:turn.allostasis.io',
      username: '0e2f563eacfd4c4a82ea239b04d1d494',
      credential: '0e2f563eacfd4c4a82ea239b04d1asdfas',
    },
    {
      urls: 'turn:turn.allostasis.io',
      username: 'feab95c3fcd147a2a96a3d3590bf9cda',
      credential: '654cafd885424b7fb974e65f631f25f9',
    },
  ],
}
