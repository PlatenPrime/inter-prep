import { describe, it, expect, beforeEach } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTaskFiltersStore } from '@capstone/stores/taskFilters'

describe('useTaskFiltersStore', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('updates filter and search', () => {
    const store = useTaskFiltersStore()
    store.setFilter('done')
    store.setSearch('vue')
    expect(store.filter).toBe('done')
    expect(store.search).toBe('vue')
    expect(store.hasActiveFilters).toBe(true)
  })

  it('resets filters', () => {
    const store = useTaskFiltersStore()
    store.setFilter('active')
    store.setSearch('x')
    store.reset()
    expect(store.filter).toBe('all')
    expect(store.search).toBe('')
    expect(store.hasActiveFilters).toBe(false)
  })
})
