import { ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(source: Ref<T>, delayMs: number) {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    source,
    (value) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = value
      }, delayMs)
    },
    { flush: 'sync' },
  )

  return debounced
}
