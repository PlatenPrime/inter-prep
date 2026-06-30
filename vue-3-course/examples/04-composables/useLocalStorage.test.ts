import { describe, it, expect, beforeEach } from 'vitest'
import { effectScope } from 'vue'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    localStorage.clear()
  })

  it('persists value to localStorage', () => {
    const scope = effectScope()
    scope.run(() => {
      const theme = useLocalStorage('theme', 'light')
      theme.value = 'dark'
      expect(localStorage.getItem('theme')).toBe(JSON.stringify('dark'))
    })
    scope.stop()
  })

  it('reads existing value from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'))
    const scope = effectScope()
    scope.run(() => {
      const theme = useLocalStorage('theme', 'light')
      expect(theme.value).toBe('dark')
    })
    scope.stop()
  })
})
