import { describe, it, expect } from 'vitest'
import { ref } from 'vue'
import { useFilteredTodos } from './002-computed-filter'

describe('002-computed-filter', () => {
  const todos = ref([
    { id: '1', title: 'A', done: false },
    { id: '2', title: 'B', done: true },
    { id: '3', title: 'C', done: true },
  ])
  const showDoneOnly = ref(false)

  it('filters active todos by default', () => {
    const { filtered, count } = useFilteredTodos(todos, showDoneOnly)
    expect(count.value).toBe(1)
    expect(filtered.value[0]?.title).toBe('A')
  })

  it('filters done todos when toggled', () => {
    showDoneOnly.value = true
    const { count } = useFilteredTodos(todos, showDoneOnly)
    expect(count.value).toBe(2)
  })
})
