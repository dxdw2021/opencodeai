import { createContext, useContext, createSignal, onMount, ParentProps, createMemo } from 'solid-js'
import type { Accessor } from 'solid-js'
import type { Locale, Translations } from './types'
import { en } from './en'
import { zhCN } from './zh-CN'

const translations: Record<Locale, Translations> = {
  en,
  'zh-CN': zhCN
}

interface I18nContextType {
  locale: Accessor<Locale>
  setLocale: (locale: Locale) => void
  t: (key: string, options?: Record<string, string>) => string
  translations: Translations
}

const I18nContext = createContext<I18nContextType>()

export function useI18n() {
  const context = useContext(I18nContext)
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider')
  }
  return context
}

export function I18nProvider(props: ParentProps) {
  const [locale, setLocale] = createSignal<Locale>('en')

  // Load saved language from localStorage
  onMount(() => {
    console.log('I18nProvider mounted, initial locale:', locale())
    const savedLocale = localStorage.getItem('opencode-language') as Locale
    console.log('Saved locale from localStorage:', savedLocale)
    if (savedLocale && translations[savedLocale]) {
      console.log('Using saved locale:', savedLocale)
      setLocale(savedLocale)
    } else {
      // Detect browser language
      const browserLocale = navigator.language as Locale
      console.log('Browser locale:', browserLocale)
      if (translations[browserLocale]) {
        console.log('Using browser locale:', browserLocale)
        setLocale(browserLocale)
      } else {
        console.log('Using default locale: en')
      }
    }
  })

  // Save language to localStorage when changed
  const handleSetLocale = (newLocale: Locale) => {
    console.log('Setting locale to:', newLocale)
    setLocale(newLocale)
    localStorage.setItem('opencode-language', newLocale)
    console.log('Locale set successfully, current locale:', locale())
  }

  // Create a memoized context value
  const contextValue = createMemo(() => {
    console.log('Creating memoized context value for locale:', locale())
    // Create a new t function that uses the current locale
    const t = (key: string, options: Record<string, string> = {}) => {
      const keys = key.split('.')
      let result: any = translations[locale()]

      for (const k of keys) {
        if (result && typeof result === 'object' && k in result) {
          result = result[k]
        } else {
          return key
        }
      }

      if (typeof result !== 'string') {
        return key
      }

      return result.replace(/\{([^}]+)\}/g, (match, placeholder) => {
        return options[placeholder] || match
      })
    }

    return {
      locale: locale,
      setLocale: handleSetLocale,
      t,
      translations: translations[locale()]
    }
  })

  return (
    <I18nContext.Provider value={contextValue()}>
      {props.children}
    </I18nContext.Provider>
  )
}