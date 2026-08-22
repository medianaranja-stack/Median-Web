import { createContext, useContext, useEffect, useState, useCallback } from 'react'

const StyleContext = createContext({ version: '1', setVersion: () => {} })
const KEY = 'mn-style-version'
const VALID = ['1', '2', '3', '4', '5']

export function StyleProvider({ children }) {
  const [version, setVersionState] = useState(() => {
    const v = typeof localStorage !== 'undefined' && localStorage.getItem(KEY)
    return VALID.includes(v) ? v : '1'
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-sv', version)
  }, [version])

  const setVersion = useCallback((v) => {
    if (!VALID.includes(String(v))) return
    setVersionState(String(v))
    try { localStorage.setItem(KEY, String(v)) } catch { /* noop */ }
  }, [])

  return <StyleContext.Provider value={{ version, setVersion }}>{children}</StyleContext.Provider>
}

export const useStyle = () => useContext(StyleContext)

export const STYLE_META = {
  1: { label: 'Editorial', hint: 'Claro · técnico' },
  2: { label: 'Neubrutal', hint: 'Bloques · pop' },
  3: { label: 'Retro 75', hint: 'Papel · vintage' },
  4: { label: 'Clásico+', hint: 'Sitio original modernizado' },
  5: { label: 'Limpieza', hint: 'Solo limpieza · fabril · flotante' },
}
