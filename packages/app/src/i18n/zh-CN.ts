import type { Translations } from './types'

export const zhCN: Translations = {
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    cancel: '取消',
    confirm: '确认',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    new: '新建',
    back: '返回',
    next: '下一步',
    finish: '完成'
  },
  navigation: {
    home: '首页',
    session: '会话',
    settings: '设置',
    help: '帮助',
    about: '关于'
  },
  session: {
    newSession: '新建会话',
    enterPrompt: '在此输入您的提示...',
    send: '发送',
    clear: '清空',
    saveSession: '保存会话',
    renameSession: '重命名会话',
    deleteSession: '删除会话',
    forkSession: '复制会话',
    model: '模型',
    provider: '提供商',
    temperature: '温度',
    maxTokens: '最大 tokens',
    topP: 'Top P'
  },
  file: {
    openFile: '打开文件',
    openDirectory: '打开目录',
    saveFile: '保存文件',
    saveAs: '另存为',
    rename: '重命名',
    delete: '删除',
    newFile: '新建文件',
    newDirectory: '新建目录',
    reload: '重新加载',
    search: '搜索'
  },
  settings: {
    language: '语言',
    theme: '主题',
    darkMode: '深色模式',
    lightMode: '浅色模式',
    systemTheme: '系统主题',
    server: '服务器',
    apiKey: 'API 密钥',
    model: '模型',
    provider: '提供商'
  },
  sidebar: {
    connectProvider: '连接提供商',
    openProject: '打开项目',
    shareFeedback: '分享反馈',
    gettingStarted: '开始使用',
    gettingStartedText1: 'OpenCode 包含免费模型，您可以立即开始使用。',
    gettingStartedText2: '连接任何提供商以使用模型，包括 Claude、GPT、Gemini 等。'
  },
  command: {
    title: '命令',
    searchPlaceholder: '搜索命令',
    emptyMessage: '未找到命令',
    category: {
      session: '会话',
      file: '文件',
      view: '视图',
      terminal: '终端',
      model: '模型',
      mcp: 'MCP',
      agent: '智能体',
      permissions: '权限'
    },
    session: {
      new: {
        title: '新建会话',
        description: '创建一个新会话'
      },
      undo: {
        title: '撤销',
        description: '撤销最后一条消息'
      },
      redo: {
        title: '重做',
        description: '重做最后一条被撤销的消息'
      },
      compact: {
        title: '压缩会话',
        description: '总结会话以减少上下文大小',
        toast: {
          title: '未选择模型',
          description: '连接提供商以总结此会话'
        }
      },
      fork: {
        title: '从消息分叉',
        description: '从之前的消息创建新会话'
      }
    },
    file: {
      open: {
        title: '打开文件',
        description: '搜索并打开文件'
      }
    },
    terminal: {
      toggle: {
        title: '切换终端',
        description: '显示或隐藏终端'
      },
      new: {
        title: '新建终端',
        description: '创建一个新的终端标签'
      }
    },
    review: {
      toggle: {
        title: '切换审查',
        description: '显示或隐藏审查面板'
      },
      description: '审查更改 [commit|branch|pr]，默认为未提交的更改'
    },
    init: {
      description: '创建/更新 AGENTS.md'
    },
    steps: {
      toggle: {
        title: '切换步骤',
        description: '显示或隐藏当前消息的步骤'
      }
    },
    message: {
      previous: {
        title: '上一条消息',
        description: '转到上一条用户消息'
      },
      next: {
        title: '下一条消息',
        description: '转到下一条用户消息'
      }
    },
    model: {
      choose: {
        title: '选择模型',
        description: '选择不同的模型'
      },
      variant: {
        cycle: {
          title: '循环思考努力',
          description: '切换到下一个努力级别',
          toast: {
            title: '思考努力已更改',
            description: '思考努力已更改为 {{level}}',
            default: '默认'
          }
        }
      }
    },
    mcp: {
      toggle: {
        title: '切换 MCP',
        description: '切换 MCP'
      }
    },
    agent: {
      cycle: {
        title: '循环智能体',
        description: '切换到下一个智能体',
        reverse: {
          title: '反向循环智能体',
          description: '切换到上一个智能体'
        }
      }
    },
    permissions: {
      autoaccept: {
        start: '自动接受编辑',
        stop: '停止自动接受编辑',
        toast: {
          start: {
            title: '自动接受编辑',
            description: '编辑和写入权限将被自动批准'
          },
          stop: {
            title: '已停止自动接受编辑',
            description: '编辑和写入权限需要批准'
          }
        }
      }
    }
  },
  error: {
    fileNotFound: '文件未找到',
    directoryNotFound: '目录未找到',
    permissionDenied: '权限被拒绝',
    networkError: '网络错误',
    serverError: '服务器错误',
    unknownError: '未知错误'
  },
  provider: {
    dialog: {
      title: '连接提供商',
      searchPlaceholder: '搜索提供商',
      category: {
        popular: '热门',
        other: '其他'
      },
      recommended: '推荐',
      anthropic: {
        description: '使用 Claude Pro/Max 或 API 密钥连接'
      }
    }
  }
}