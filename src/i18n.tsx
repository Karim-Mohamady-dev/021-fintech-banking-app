import { createContext, useContext, useEffect, useState } from 'react'
import type { ReactNode } from 'react'
import en from '../locales/en/common.json'
import ar from '../locales/ar/common.json'

export type Dict = typeof en
export type Lang = 'en' | 'ar'

const dicts: Record<Lang, Dict> = { en, ar: ar as unknown as Dict }

type I18nValue = { lang: Lang; setLang: (l: Lang) => void; t: Dict; dir: 'ltr' | 'rtl' }

const I18nContext = createContext<I18nValue>({ lang: 'en', setLang: () => undefined, t: en, dir: 'ltr' })

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>(() => {
    try {
      const saved = localStorage.getItem('lang')
      return saved === 'ar' ? 'ar' : 'en'
    } catch {
      return 'en'
    }
  })
  const setLang = (l: Lang) => {
    setLangState(l)
    try {
      localStorage.setItem('lang', l)
    } catch {
      /* storage unavailable */
    }
  }
  useEffect(() => {
    document.documentElement.lang = lang
    document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr'
  }, [lang])
  return (
    <I18nContext.Provider value={{ lang, setLang, t: dicts[lang], dir: lang === 'ar' ? 'rtl' : 'ltr' }}>
      {children}
    </I18nContext.Provider>
  )
}

export function useI18n() {
  return useContext(I18nContext)
}
