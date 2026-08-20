'use client'

import { useCallback, useEffect, useState } from 'react'

export function useSessionStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prev: T) => T)) => void, () => void] {
  // Start with the same value on the server and the first client render.
  // Browser storage is restored after hydration to prevent markup mismatches.
  const [storedValue, setStoredValue] = useState<T>(initialValue)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      try {
        const item = window.sessionStorage.getItem(key)
        if (item !== null) {
          setStoredValue(JSON.parse(item) as T)
        }
      } catch {
        // Invalid or unavailable session storage: retain the initial value.
      }

    })

    return () => window.cancelAnimationFrame(frame)
  }, [key])

  const setValue = useCallback(
    (value: T | ((prev: T) => T)) => {
      setStoredValue((prev) => {
        const next = value instanceof Function ? value(prev) : value
        if (typeof window !== 'undefined') {
          try {
            window.sessionStorage.setItem(key, JSON.stringify(next))
          } catch {
            // Quota exceeded or private browsing — silently degrade
          }
        }
        return next
      })
    },
    [key]
  )

  const removeValue = useCallback(() => {
    setStoredValue(initialValue)
    if (typeof window !== 'undefined') {
      try {
        window.sessionStorage.removeItem(key)
      } catch {
        // ignore
      }
    }
  }, [key, initialValue])

  return [storedValue, setValue, removeValue]
}
