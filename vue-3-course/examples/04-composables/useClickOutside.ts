import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(
  target: Ref<HTMLElement | null>,
  handler: () => void,
) {
  function onClick(event: MouseEvent) {
    const el = target.value
    if (!el) return
    if (!el.contains(event.target as Node)) {
      handler()
    }
  }

  onMounted(() => {
    document.addEventListener('click', onClick)
  })

  onUnmounted(() => {
    document.removeEventListener('click', onClick)
  })
}
