import type { Translations } from './types'

export const en: Translations = {
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    cancel: 'Cancel',
    confirm: 'Confirm',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    new: 'New',
    back: 'Back',
    next: 'Next',
    finish: 'Finish'
  },
  navigation: {
    home: 'Home',
    session: 'Session',
    settings: 'Settings',
    help: 'Help',
    about: 'About'
  },
  session: {
    newSession: 'New Session',
    enterPrompt: 'Enter your prompt here...',
    send: 'Send',
    clear: 'Clear',
    saveSession: 'Save Session',
    renameSession: 'Rename Session',
    deleteSession: 'Delete Session',
    forkSession: 'Fork Session',
    model: 'Model',
    provider: 'Provider',
    temperature: 'Temperature',
    maxTokens: 'Max Tokens',
    topP: 'Top P',
    renderEarlier: 'Render earlier messages',
    loadingEarlier: 'Loading earlier messages...',
    loadEarlier: 'Load earlier messages',
    filesChanged: 'Files Changed'
  },
  file: {
    openFile: 'Open File',
    openDirectory: 'Open Directory',
    saveFile: 'Save File',
    saveAs: 'Save As',
    rename: 'Rename',
    delete: 'Delete',
    newFile: 'New File',
    newDirectory: 'New Directory',
    reload: 'Reload',
    search: 'Search'
  },
  settings: {
    language: 'Language',
    theme: 'Theme',
    darkMode: 'Dark Mode',
    lightMode: 'Light Mode',
    systemTheme: 'System Theme',
    server: 'Server',
    apiKey: 'API Key',
    model: 'Model',
    provider: 'Provider'
  },
  sidebar: {
    connectProvider: 'Connect provider',
    openProject: 'Open project',
    shareFeedback: 'Share feedback',
    gettingStarted: 'Getting started',
    gettingStartedText1: 'OpenCode includes free models so you can start immediately.',
    gettingStartedText2: 'Connect any provider to use models, inc. Claude, GPT, Gemini etc.'
  },
  command: {
    title: 'Commands',
    searchPlaceholder: 'Search commands',
    emptyMessage: 'No commands found',
    category: {
      session: 'Session',
      file: 'File',
      view: 'View',
      terminal: 'Terminal',
      model: 'Model',
      mcp: 'MCP',
      agent: 'Agent',
      permissions: 'Permissions'
    },
    session: {
      new: {
        title: 'New session',
        description: 'Create a new session'
      },
      undo: {
        title: 'Undo',
        description: 'Undo the last message'
      },
      redo: {
        title: 'Redo',
        description: 'Redo the last undone message'
      },
      compact: {
        title: 'Compact session',
        description: 'Summarize the session to reduce context size',
        toast: {
          title: 'No model selected',
          description: 'Connect a provider to summarize this session'
        }
      },
      fork: {
        title: 'Fork from message',
        description: 'Create a new session from a previous message'
      }
    },
    file: {
      open: {
        title: 'Open file',
        description: 'Search and open a file'
      }
    },
    terminal: {
      toggle: {
        title: 'Toggle terminal',
        description: 'Show or hide the terminal'
      },
      new: {
        title: 'New terminal',
        description: 'Create a new terminal tab'
      }
    },
    review: {
      toggle: {
        title: 'Toggle review',
        description: 'Show or hide the review panel'
      },
      description: 'review changes [commit|branch|pr], defaults to uncommitted'
    },
    init: {
      description: 'create/update AGENTS.md'
    },
    steps: {
      toggle: {
        title: 'Toggle steps',
        description: 'Show or hide steps for the current message'
      }
    },
    message: {
      previous: {
        title: 'Previous message',
        description: 'Go to the previous user message'
      },
      next: {
        title: 'Next message',
        description: 'Go to the next user message'
      }
    },
    model: {
      choose: {
        title: 'Choose model',
        description: 'Select a different model'
      },
      variant: {
        cycle: {
          title: 'Cycle thinking effort',
          description: 'Switch to the next effort level',
          toast: {
            title: 'Thinking effort changed',
            description: 'The thinking effort has been changed to {{level}}',
            default: 'Default'
          }
        }
      }
    },
    mcp: {
      toggle: {
        title: 'Toggle MCPs',
        description: 'Toggle MCPs'
      }
    },
    agent: {
      cycle: {
        title: 'Cycle agent',
        description: 'Switch to the next agent',
        reverse: {
          title: 'Cycle agent backwards',
          description: 'Switch to the previous agent'
        }
      }
    },
    permissions: {
      autoaccept: {
        start: 'Auto-accept edits',
        stop: 'Stop auto-accepting edits',
        toast: {
          start: {
            title: 'Auto-accepting edits',
            description: 'Edit and write permissions will be automatically approved'
          },
          stop: {
            title: 'Stopped auto-accepting edits',
            description: 'Edit and write permissions will require approval'
          }
        }
      }
    }
  },
  error: {
    fileNotFound: 'File not found',
    directoryNotFound: 'Directory not found',
    permissionDenied: 'Permission denied',
    networkError: 'Network error',
    serverError: 'Server error',
    unknownError: 'Unknown error'
  },
  provider: {
    dialog: {
      title: 'Connect provider',
      searchPlaceholder: 'Search providers',
      category: {
        popular: 'Popular',
        other: 'Other'
      },
      recommended: 'Recommended',
      anthropic: {
        description: 'Connect with Claude Pro/Max or API key'
      }
    }
  }
}