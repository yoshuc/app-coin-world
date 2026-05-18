import { useState, useCallback } from 'react'
import { STRINGS } from '../i18n/strings.js'

function detectLang() {
  const stored = localStorage.getItem('cw_lang')
  if (stored === 'en' || stored === 'es') return stored
  const nav = navigator.language || navigator.userLanguage || 'en'
  return nav.toLowerCase().startsWith('es') ? 'es' : 'en'
}

export function useLang() {
  const [lang, setLangState] = useState(detectLang)

  const setLang = useCallback((l) => {
    const next = l === 'es' ? 'es' : 'en'
    localStorage.setItem('cw_lang', next)
    setLangState(next)
  }, [])

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === 'en' ? 'es' : 'en'
      localStorage.setItem('cw_lang', next)
      return next
    })
  }, [])

  const t = useCallback(
    (key) => STRINGS[lang]?.[key] ?? STRINGS['en']?.[key] ?? key,
    [lang]
  )

  return { lang, setLang, toggleLang, t }
}
