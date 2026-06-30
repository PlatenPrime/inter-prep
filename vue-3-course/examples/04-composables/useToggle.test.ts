import { describe, it, expect } from 'vitest'
import { effectScope } from 'vue'
import { useToggle } from './useToggle'

describe('useToggle', () => {
  it('toggles open state', () => {
    const scope = effectScope()
    scope.run(() => {
      const { isOpen, toggle, open, close } = useToggle()
      expect(isOpen.value).toBe(false)
      toggle()
      expect(isOpen.value).toBe(true)
      close()
      expect(isOpen.value).toBe(false)
      open()
      expect(isOpen.value).toBe(true)
    })
    scope.stop()
  })
})
