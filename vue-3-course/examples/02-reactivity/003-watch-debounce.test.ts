import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { nextTick } from 'vue'
import { ref } from 'vue'
import { useDebouncedRef } from './003-watch-debounce'

describe('003-watch-debounce', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('debounces source updates', async () => {
    const source = ref('a')
    const debounced = useDebouncedRef(source, 300)

    source.value = 'ab'
    await nextTick()
    vi.advanceTimersByTime(300)
    expect(debounced.value).toBe('ab')
  })
})
