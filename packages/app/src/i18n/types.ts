export type Locale = 'en' | 'zh-CN'

export interface Translations {
  common: {
    loading: string
    error: string
    success: string
    cancel: string
    confirm: string
    save: string
    delete: string
    edit: string
    new: string
    back: string
    next: string
    finish: string
  }
  navigation: {
    home: string
    session: string
    settings: string
    help: string
    about: string
  }
  session: {
    newSession: string
    enterPrompt: string
    send: string
    clear: string
    saveSession: string
    renameSession: string
    deleteSession: string
    forkSession: string
    model: string
    provider: string
    temperature: string
    maxTokens: string
    topP: string
    renderEarlier: string
    loadingEarlier: string
    loadEarlier: string
    filesChanged: string
  }
  file: {
    openFile: string
    openDirectory: string
    saveFile: string
    saveAs: string
    rename: string
    delete: string
    newFile: string
    newDirectory: string
    reload: string
    search: string
  }
  settings: {
    language: string
    theme: string
    darkMode: string
    lightMode: string
    systemTheme: string
    server: string
    apiKey: string
    model: string
    provider: string
  }
  sidebar: {
    connectProvider: string
    openProject: string
    shareFeedback: string
    gettingStarted: string
    gettingStartedText1: string
    gettingStartedText2: string
  }
  command: {
    title: string
    searchPlaceholder: string
    emptyMessage: string
    category: {
      session: string
      file: string
      view: string
      terminal: string
      model: string
      mcp: string
      agent: string
      permissions: string
    }
    session: {
      new: {
        title: string
        description: string
      }
      undo: {
        title: string
        description: string
      }
      redo: {
        title: string
        description: string
      }
      compact: {
        title: string
        description: string
        toast: {
          title: string
          description: string
        }
      }
      fork: {
        title: string
        description: string
      }
    }
    file: {
      open: {
        title: string
        description: string
      }
    }
    terminal: {
      toggle: {
        title: string
        description: string
      }
      new: {
        title: string
        description: string
      }
    }
    review: {
      toggle: {
        title: string
        description: string
      }
      description: string
    }
    init: {
      description: string
    }
    steps: {
      toggle: {
        title: string
        description: string
      }
    }
    message: {
      previous: {
        title: string
        description: string
      }
      next: {
        title: string
        description: string
      }
    }
    model: {
      choose: {
        title: string
        description: string
      }
      variant: {
        cycle: {
          title: string
          description: string
          toast: {
            title: string
            description: string
            default: string
          }
        }
      }
    }
    mcp: {
      toggle: {
        title: string
        description: string
      }
    }
    agent: {
      cycle: {
        title: string
        description: string
        reverse: {
          title: string
          description: string
        }
      }
    }
    permissions: {
      autoaccept: {
        start: string
        stop: string
        toast: {
          start: {
            title: string
            description: string
          }
          stop: {
            title: string
            description: string
          }
        }
      }
    }
  }
  error: {
    fileNotFound: string
    directoryNotFound: string
    permissionDenied: string
    networkError: string
    serverError: string
    unknownError: string
  }
  provider: {
    dialog: {
      title: string
      searchPlaceholder: string
      category: {
        popular: string
        other: string
      }
      recommended: string
      anthropic: {
        description: string
      }
    }
  }
}