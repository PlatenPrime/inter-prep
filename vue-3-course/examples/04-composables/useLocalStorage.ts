import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const initial = stored !== null ? (JSON.parse(stored) as T) : defaultValue
  const data = ref(initial) as Ref<T>

  watch(
    data,
    (value) => {
      localStorage.setItem(key, JSON.stringify(value))
    },
    { deep: true, flush: 'sync' },
  )

  return data
}
