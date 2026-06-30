import { computed, type Ref } from 'vue'
import type { Task } from '@capstone/schemas/task'
import type { TaskFilter } from '@capstone/stores/taskFilters'

export function useFilteredTasks(
  tasks: Ref<Task[] | undefined>,
  filter: Ref<TaskFilter>,
  search: Ref<string>,
) {
  return computed(() => {
    const list = tasks.value ?? []
    const q = search.value.trim().toLowerCase()

    return list.filter((task) => {
      const matchesFilter =
        filter.value === 'all' ||
        (filter.value === 'active' && !task.done) ||
        (filter.value === 'done' && task.done)

      const matchesSearch = q.length === 0 || task.title.toLowerCase().includes(q)

      return matchesFilter && matchesSearch
    })
  })
}
