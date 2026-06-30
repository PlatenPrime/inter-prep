import { computed, ref, type Ref } from 'vue'

export interface Todo {
  id: string
  title: string
  done: boolean
}

export function useFilteredTodos(todos: Ref<Todo[]>, showDoneOnly: Ref<boolean>) {
  const filtered = computed(() => {
    if (showDoneOnly.value) {
      return todos.value.filter((t) => t.done)
    }
    return todos.value.filter((t) => !t.done)
  })

  const count = computed(() => filtered.value.length)

  return { filtered, count }
}
