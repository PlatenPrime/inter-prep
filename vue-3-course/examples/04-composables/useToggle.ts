import { ref } from 'vue'

export function useToggle(initial = false) {
  const isOpen = ref(initial)

  function toggle() {
    isOpen.value = !isOpen.value
  }

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  return { isOpen, toggle, open, close }
}
