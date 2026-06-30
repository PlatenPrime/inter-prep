# Модуль 04 — Composables

## Цель

Переиспользуемая логика через composables — главный инструмент Composition API (аналог custom hooks в React).

## Правила composables

1. **Префикс `use*`** — `useToggle`, `useFetch`.
2. **Lifecycle только на top level** composable (не внутри `if`).
3. **Return plain object of refs** — удобно деструктурировать с `toRefs` при необходимости.
4. **Один composable = одна ответственность.**

```ts
export function useToggle(initial = false) {
  const isOpen = ref(initial)
  const toggle = () => { isOpen.value = !isOpen.value }
  const open = () => { isOpen.value = true }
  const close = () => { isOpen.value = false }
  return { isOpen, toggle, open, close }
}
```

## Lifecycle hooks

```ts
import { onMounted, onUnmounted } from 'vue'

export function useEventListener(target: EventTarget, event: string, handler: EventListener) {
  onMounted(() => target.addEventListener(event, handler))
  onUnmounted(() => target.removeEventListener(event, handler))
}
```

## useTemplateRef (Vue 3.5)

```vue
<script setup lang="ts">
const inputRef = useTemplateRef<HTMLInputElement>('inputEl')
onMounted(() => inputRef.value?.focus())
</script>
<template>
  <input ref="inputEl" />
</template>
```

Заменяет `ref<HTMLInputElement | null>(null)` + ручное связывание.

## Тестирование composables

```ts
import { effectScope } from 'vue'
import { useToggle } from './useToggle'

it('toggles', () => {
  const scope = effectScope()
  scope.run(() => {
    const { isOpen, toggle } = useToggle()
    expect(isOpen.value).toBe(false)
    toggle()
    expect(isOpen.value).toBe(true)
  })
  scope.stop()
})
```

## Примеры

- `examples/04-composables/useToggle.ts`
- `examples/04-composables/useLocalStorage.ts`
- `examples/04-composables/useClickOutside.ts`

## React-bridge

| React | Vue |
|-------|-----|
| `useState` + custom hook | `ref` в composable |
| `useEffect` cleanup | `onUnmounted` |
| Rules of Hooks | те же — не вызывать условно |

## Следующий модуль

[05-routing/theory.md](../05-routing/theory.md)
