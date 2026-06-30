import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export type TaskFilter = 'all' | 'active' | 'done'

export const useTaskFiltersStore = defineStore('taskFilters', () => {
  const filter = ref<TaskFilter>('all')
  const search = ref('')

  const hasActiveFilters = computed(
    () => filter.value !== 'all' || search.value.trim().length > 0,
  )

  function setFilter(value: TaskFilter) {
    filter.value = value
  }

  function setSearch(value: string) {
    search.value = value
  }

  function reset() {
    filter.value = 'all'
    search.value = ''
  }

  return { filter, search, hasActiveFilters, setFilter, setSearch, reset }
})
