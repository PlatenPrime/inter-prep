# Модуль 06 — Pinia (client state)

## Цель

Управление клиентским состоянием через setup stores — domain-driven, типобезопасно.

## Setup store (production standard)

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useAuthStore = defineStore('auth', () => {
  const token = ref<string | null>(null)
  const isLoggedIn = computed(() => token.value !== null)

  function login(newToken: string) {
    token.value = newToken
  }

  function logout() {
    token.value = null
  }

  return { token, isLoggedIn, login, logout }
})
```

## Использование в компонентах

```ts
import { storeToRefs } from 'pinia'
import { useAuthStore } from '@/stores/auth'

const auth = useAuthStore()
const { isLoggedIn } = storeToRefs(auth) // реактивная деструктуризация
auth.login('jwt-token')                     // actions — без storeToRefs
```

**Правило:** деструктурируйте state/getters через `storeToRefs`, actions — напрямую с store.

## Один store = один домен

```
stores/
  auth.ts      # сессия, токен
  ui.ts        # sidebar, theme
  cart.ts      # корзина
```

Не создавайте `useAppStore` со всем подряд.

## Примеры

- `examples/06-pinia/useCartStore.ts`

## React-bridge

Pinia setup store ≈ Zustand slice с `ref`/`computed` внутри.

## Следующий модуль

[07-forms/theory.md](../07-forms/theory.md)
