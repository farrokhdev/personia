export const definition = {
  models: {
    Profile: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
      accountRelation: {type: 'single'}
    },
    Chat: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
      accountRelation: {type: 'list'}
    },
    ChatMessage: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c63dpbbw6l6gtvdt8nz1si9qhtqaczcr19oxp37l4nm47wl751t',
      accountRelation: {type: 'list'}
    },
    Experience: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c58z8dw4un1kyltwc7hhdocp3bn7v6rho6vx1wm7j9esmcry0kb',
      accountRelation: {type: 'list'}
    },
    Education: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c60l8cm6t4giekvxnmtap39dh2itdnio1yv35osc9097rtf5pew',
      accountRelation: {type: 'list'}
    },
    Asset: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c69cmc2p36xjenapxl5bph5644l806fksrqao7bx1yk0vicjh36',
      accountRelation: {type: 'list'}
    },
    Article: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c7i0cj3bb9xiw6jfr0tcyk54b659ty02mb85ikiw18m0l6oz1jr',
      accountRelation: {type: 'list'}
    },
    Follow: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c9zl5s9o1es3a7mtb2c5f7jimzcwp06s5jmzmkhpf4xk2muoxqu',
      accountRelation: {type: 'list'}
    },
    Post: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c7j4t4etyoe31gad5q2bmk0lwzpftt19553elwvm6y0p825lpzx',
      accountRelation: {type: 'list'}
    },
    PostComment: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c5jv69wrwhhl2ssy1b8mxddayo8isxzm9aohsl5pe4xzja7b3a5',
      accountRelation: {type: 'list'}
    },
    PostLike: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6cax7p3r99rnisniz3ly5ua2h8v2dnzbawvkv682g6opisd4fce1',
      accountRelation: {type: 'list'}
    },
    ArticleLike: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c85nmk9549n40268nrns3dbg4tunojn8senek96ox792hvjguv8',
      accountRelation: {type: 'list'}
    },
    ArticleComment: {
      interface: false,
      implements: [],
      id: 'kjzl6hvfrbw6c9z89gl2qbs4sigjxyswi2auscbjpf5pzomhs9qh18uqbf98h23',
      accountRelation: {type: 'list'}
    }
  },
  objects: {
    Profile: {
      age: {type: 'integer', required: false, indexed: true},
      bio: {type: 'string', required: false},
      cover: {type: 'string', required: false},
      email: {type: 'string', required: false},
      avatar: {type: 'string', required: false},
      gender: {type: 'string', required: false, indexed: true},
      skills: {
        type: 'list',
        required: false,
        item: {type: 'string', required: false}
      },
      address: {type: 'string', required: false},
      nakamaID: {type: 'string', required: false},
      accountType: {type: 'string', required: false, indexed: true},
      displayName: {type: 'string', required: false, indexed: true},
      phoneNumber: {type: 'string', required: false},
      socialLinks: {
        type: 'list',
        required: false,
        item: {type: 'string', required: false}
      },
      publicEncryptionDID: {type: 'did', required: false},
      creator: {type: 'view', viewType: 'documentAccount'},
      chats: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
          property: 'profileID'
        }
      },
      chatsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
          property: 'profileID'
        }
      },
      receivedChats: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
          property: 'recipientProfileID'
        }
      },
      receivedChatsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
          property: 'recipientProfileID'
        }
      },
      experiences: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c58z8dw4un1kyltwc7hhdocp3bn7v6rho6vx1wm7j9esmcry0kb',
          property: 'profileID'
        }
      },
      educations: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c60l8cm6t4giekvxnmtap39dh2itdnio1yv35osc9097rtf5pew',
          property: 'profileID'
        }
      },
      followings: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c9zl5s9o1es3a7mtb2c5f7jimzcwp06s5jmzmkhpf4xk2muoxqu',
          property: 'profileID'
        }
      },
      followingsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c9zl5s9o1es3a7mtb2c5f7jimzcwp06s5jmzmkhpf4xk2muoxqu',
          property: 'profileID'
        }
      },
      followers: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c9zl5s9o1es3a7mtb2c5f7jimzcwp06s5jmzmkhpf4xk2muoxqu',
          property: 'targetProfileID'
        }
      },
      followersCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c9zl5s9o1es3a7mtb2c5f7jimzcwp06s5jmzmkhpf4xk2muoxqu',
          property: 'targetProfileID'
        }
      },
      posts: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c7j4t4etyoe31gad5q2bmk0lwzpftt19553elwvm6y0p825lpzx',
          property: 'profileID'
        }
      },
      postsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c7j4t4etyoe31gad5q2bmk0lwzpftt19553elwvm6y0p825lpzx',
          property: 'profileID'
        }
      },
      assets: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c69cmc2p36xjenapxl5bph5644l806fksrqao7bx1yk0vicjh36',
          property: 'profileID'
        }
      },
      assetsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c69cmc2p36xjenapxl5bph5644l806fksrqao7bx1yk0vicjh36',
          property: 'profileID'
        }
      },
      articles: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c7i0cj3bb9xiw6jfr0tcyk54b659ty02mb85ikiw18m0l6oz1jr',
          property: 'profileID'
        }
      },
      articlesCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c7i0cj3bb9xiw6jfr0tcyk54b659ty02mb85ikiw18m0l6oz1jr',
          property: 'profileID'
        }
      }
    },
    Chat: {
      channelID: {type: 'string', required: false, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      relationID: {type: 'string', required: false},
      recipientProfileID: {type: 'streamid', required: true, indexed: true},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      },
      recipientProfile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'recipientProfileID'
        }
      },
      messages: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c63dpbbw6l6gtvdt8nz1si9qhtqaczcr19oxp37l4nm47wl751t',
          property: 'chatID'
        }
      },
      messagesCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c63dpbbw6l6gtvdt8nz1si9qhtqaczcr19oxp37l4nm47wl751t',
          property: 'chatID'
        }
      }
    },
    ChatMessage: {
      body: {type: 'string', required: true},
      chatID: {type: 'streamid', required: true, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      messageType: {type: 'string', required: true},
      encryptedSymmetricKey: {type: 'string', required: false},
      unifiedAccessControlConditions: {type: 'string', required: false},
      chat: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6can2q4fxmbacgdekr077c6k2vs9o46uynb4h081bv7yfp7ltbzw',
          property: 'chatID'
        }
      },
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    Experience: {
      city: {type: 'string', required: true, indexed: true},
      title: {type: 'string', required: true, indexed: true},
      company: {type: 'string', required: true, indexed: true},
      endDate: {type: 'date', required: false},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      startDate: {type: 'date', required: true},
      description: {type: 'string', required: true, indexed: true},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    Education: {
      city: {type: 'string', required: true, indexed: true},
      title: {type: 'string', required: true, indexed: true},
      school: {type: 'string', required: true, indexed: true},
      endDate: {type: 'date', required: false},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      startDate: {type: 'date', required: true},
      description: {type: 'string', required: true, indexed: true},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    Asset: {
      tags: {
        type: 'list',
        required: false,
        item: {type: 'string', required: false}
      },
      image: {type: 'string', required: false},
      title: {type: 'string', required: true},
      isDeleted: {type: 'boolean', required: true},
      profileID: {type: 'streamid', required: true},
      description: {type: 'string', required: true},
      externalURL: {type: 'string', required: false},
      animationURL: {type: 'string', required: false},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    Article: {
      body: {type: 'string', required: true, indexed: true},
      tag1: {type: 'string', required: false, indexed: true},
      tag2: {type: 'string', required: false, indexed: true},
      tag3: {type: 'string', required: false, indexed: true},
      tag4: {type: 'string', required: false, indexed: true},
      tag5: {type: 'string', required: false, indexed: true},
      tag6: {type: 'string', required: false, indexed: true},
      tag7: {type: 'string', required: false, indexed: true},
      tag8: {type: 'string', required: false, indexed: true},
      tag9: {type: 'string', required: false, indexed: true},
      price: {type: 'integer', required: true, indexed: true},
      tag10: {type: 'string', required: false, indexed: true},
      abstract: {type: 'string', required: true, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      attachment: {type: 'string', required: false, indexed: true},
      externalURL: {type: 'string', required: false, indexed: true},
      isEncrypted: {type: 'boolean', required: true, indexed: true},
      visualAbstract: {type: 'string', required: false, indexed: true},
      encryptedSymmetricKey: {type: 'string', required: false},
      unifiedAccessControlConditions: {type: 'string', required: false},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      },
      comments: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c9z89gl2qbs4sigjxyswi2auscbjpf5pzomhs9qh18uqbf98h23',
          property: 'articleID'
        }
      },
      commentsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c9z89gl2qbs4sigjxyswi2auscbjpf5pzomhs9qh18uqbf98h23',
          property: 'articleID'
        }
      },
      likes: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c85nmk9549n40268nrns3dbg4tunojn8senek96ox792hvjguv8',
          property: 'articleID'
        }
      },
      likesCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c85nmk9549n40268nrns3dbg4tunojn8senek96ox792hvjguv8',
          property: 'articleID'
        }
      }
    },
    Follow: {
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      targetProfileID: {type: 'streamid', required: true, indexed: true},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      },
      targetProfile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'targetProfileID'
        }
      }
    },
    Post: {
      body: {type: 'string', required: true, indexed: true},
      tag1: {type: 'string', required: false, indexed: true},
      tag2: {type: 'string', required: false, indexed: true},
      tag3: {type: 'string', required: false, indexed: true},
      tag4: {type: 'string', required: false, indexed: true},
      tag5: {type: 'string', required: false, indexed: true},
      tag6: {type: 'string', required: false, indexed: true},
      tag7: {type: 'string', required: false, indexed: true},
      tag8: {type: 'string', required: false, indexed: true},
      tag9: {type: 'string', required: false, indexed: true},
      tag10: {type: 'string', required: false, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      attachment: {type: 'string', required: false},
      externalURL: {type: 'string', required: false},
      isEncrypted: {type: 'boolean', required: true},
      encryptedSymmetricKey: {type: 'string', required: false},
      unifiedAccessControlConditions: {type: 'string', required: false},
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      },
      comments: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6c5jv69wrwhhl2ssy1b8mxddayo8isxzm9aohsl5pe4xzja7b3a5',
          property: 'postID'
        }
      },
      commentsCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6c5jv69wrwhhl2ssy1b8mxddayo8isxzm9aohsl5pe4xzja7b3a5',
          property: 'postID'
        }
      },
      likes: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryConnection',
          model: 'kjzl6hvfrbw6cax7p3r99rnisniz3ly5ua2h8v2dnzbawvkv682g6opisd4fce1',
          property: 'postID'
        }
      },
      likesCount: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'queryCount',
          model: 'kjzl6hvfrbw6cax7p3r99rnisniz3ly5ua2h8v2dnzbawvkv682g6opisd4fce1',
          property: 'postID'
        }
      }
    },
    PostComment: {
      postID: {type: 'streamid', required: true, indexed: true},
      content: {type: 'string', required: true, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      replyingToID: {type: 'streamid', required: false, indexed: true},
      post: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c7j4t4etyoe31gad5q2bmk0lwzpftt19553elwvm6y0p825lpzx',
          property: 'postID'
        }
      },
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    PostLike: {
      postID: {type: 'streamid', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      post: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c7j4t4etyoe31gad5q2bmk0lwzpftt19553elwvm6y0p825lpzx',
          property: 'postID'
        }
      },
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    ArticleLike: {
      articleID: {type: 'streamid', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      article: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c7i0cj3bb9xiw6jfr0tcyk54b659ty02mb85ikiw18m0l6oz1jr',
          property: 'articleID'
        }
      },
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    },
    ArticleComment: {
      content: {type: 'string', required: true, indexed: true},
      articleID: {type: 'streamid', required: true, indexed: true},
      createdAt: {type: 'datetime', required: true, indexed: true},
      isDeleted: {type: 'boolean', required: true, indexed: true},
      profileID: {type: 'streamid', required: true, indexed: true},
      replyingToID: {type: 'streamid', required: false, indexed: true},
      article: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c7i0cj3bb9xiw6jfr0tcyk54b659ty02mb85ikiw18m0l6oz1jr',
          property: 'articleID'
        }
      },
      creator: {type: 'view', viewType: 'documentAccount'},
      profile: {
        type: 'view',
        viewType: 'relation',
        relation: {
          source: 'document',
          model: 'kjzl6hvfrbw6c8xq2qc4alvi5q2jsqp9f7gqlhp36obt7lkht9eo852m5kdluod',
          property: 'profileID'
        }
      }
    }
  },
  enums: {},
  accountData: {
    profile: {type: 'node', name: 'Profile'},
    chatList: {type: 'connection', name: 'Chat'},
    chatMessageList: {type: 'connection', name: 'ChatMessage'},
    experienceList: {type: 'connection', name: 'Experience'},
    educationList: {type: 'connection', name: 'Education'},
    assetList: {type: 'connection', name: 'Asset'},
    articleList: {type: 'connection', name: 'Article'},
    followList: {type: 'connection', name: 'Follow'},
    postList: {type: 'connection', name: 'Post'},
    postCommentList: {type: 'connection', name: 'PostComment'},
    postLikeList: {type: 'connection', name: 'PostLike'},
    articleLikeList: {type: 'connection', name: 'ArticleLike'},
    articleCommentList: {type: 'connection', name: 'ArticleComment'}
  }
};
