import { describe, it, expect, beforeEach } from 'vitest'
import { ref } from 'vue'
import { useFilteredTasks } from '@capstone/composables/useFilteredTasks'
import type { Task } from '@capstone/schemas/task'

describe('useFilteredTasks', () => {
  const tasks = ref<Task[]>([
    { id: '1', title: 'Vue course', done: true, createdAt: '' },
    { id: '2', title: 'React app', done: false, createdAt: '' },
  ])
  const filter = ref<'all' | 'active' | 'done'>('all')
  const search = ref('')

  beforeEach(() => {
    filter.value = 'all'
    search.value = ''
  })

  it('filters by status', () => {
    filter.value = 'active'
    const result = useFilteredTasks(tasks, filter, search)
    expect(result.value).toHaveLength(1)
    expect(result.value[0]?.title).toBe('React app')
  })

  it('filters by search query', () => {
    search.value = 'vue'
    const result = useFilteredTasks(tasks, filter, search)
    expect(result.value).toHaveLength(1)
    expect(result.value[0]?.title).toBe('Vue course')
  })
})
