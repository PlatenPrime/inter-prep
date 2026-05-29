# Q033. Что такое Vuex?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Vuex** — это официальный стейт-менеджер для Vue 2/3, реализующий паттерн Flux/Redux: централизованное хранилище с `state`, `getters`, `mutations` (синхронные изменения), `actions` (асинхронные операции) и `modules` для разделения на модули. В экосистеме **Vue 3 Vuex заменён Pinia** — более простым, TypeScript-дружественным стейт-менеджером без бойлерплейта mutations.

---

## Развёрнутый ответ

### Суть и определение

Vuex решает проблему «prop drilling» и разрозненного состояния: когда несвязанные компоненты должны разделять и изменять одни данные. Единый store — единый источник правды.

### Как это работает (Vuex 4 — совместим с Vue 3)

```typescript
// store/index.ts (Vuex 4)
import { createStore } from 'vuex'

interface State {
  count: number
  users: User[]
  isLoading: boolean
}

export const store = createStore<State>({
  state: () => ({
    count: 0,
    users: [],
    isLoading: false,
  }),

  // Getters — вычисляемые значения из state
  getters: {
    doubleCount: (state) => state.count * 2,
    activeUsers: (state) => state.users.filter(u => u.isActive),
  },

  // Mutations — ТОЛЬКО синхронные изменения state
  mutations: {
    INCREMENT(state) {
      state.count++
    },
    SET_USERS(state, users: User[]) {
      state.users = users
    },
    SET_LOADING(state, value: boolean) {
      state.isLoading = value
    },
  },

  // Actions — асинхронные операции, вызывают mutations
  actions: {
    async fetchUsers({ commit }) {
      commit('SET_LOADING', true)
      try {
        const users = await api.getUsers()
        commit('SET_USERS', users)
      } finally {
        commit('SET_LOADING', false)
      }
    },

    incrementAsync({ commit }) {
      setTimeout(() => commit('INCREMENT'), 1000)
    },
  },

  // Modules — разбивка на модули
  modules: {
    auth: authModule,
    cart: cartModule,
  },
})
```

**Использование в компоненте:**

```vue
<script setup lang="ts">
import { useStore } from 'vuex'
import { computed } from 'vue'

const store = useStore()

// Читать из state/getters
const count = computed(() => store.state.count)
const doubleCount = computed(() => store.getters.doubleCount)
const users = computed(() => store.getters.activeUsers)

// Вызвать mutation
const increment = () => store.commit('INCREMENT')

// Вызвать action
const loadUsers = () => store.dispatch('fetchUsers')
</script>
```

### Pinia — современная замена Vuex для Vue 3

```typescript
// stores/useCounterStore.ts (Pinia)
import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export const useCounterStore = defineStore('counter', () => {
  // state
  const count = ref(0)
  const users = ref<User[]>([])
  const isLoading = ref(false)

  // getters (computed)
  const doubleCount = computed(() => count.value * 2)
  const activeUsers = computed(() => users.value.filter(u => u.isActive))

  // actions (нет разделения mutation/action!)
  function increment() {
    count.value++
  }

  async function fetchUsers() {
    isLoading.value = true
    try {
      users.value = await api.getUsers()
    } finally {
      isLoading.value = false
    }
  }

  return { count, users, isLoading, doubleCount, activeUsers, increment, fetchUsers }
})

// Использование — чище, нет store.commit/dispatch
const counterStore = useCounterStore()
counterStore.increment()
await counterStore.fetchUsers()
console.log(counterStore.doubleCount)
```

### Практика и применение

**Когда нужен глобальный стейт:**
- Данные пользователя (auth): доступны в навбаре, профиле, настройках
- Корзина: обновляется из разных частей приложения
- Уведомления/тосты: показываются из любого компонента
- Кэш API-данных: чтобы не делать повторные запросы

**Когда НЕ нужен стейт-менеджер:**
- Данные нужны только в одном компоненте → `ref`/`reactive`
- Данные нужны в нескольких уровнях одной ветки → `provide/inject`

### Важные нюансы и краеугольные камни

- **Vuex vs Pinia**: Pinia — официальная рекомендация для Vue 3. Нет mutations (упрощение), отличная TypeScript-поддержка, devtools интеграция, SSR-совместимость
- **Vuex Modules**: позволяют разделить store; `namespaced: true` изолирует действия/мутации: `store.dispatch('cart/addItem')`
- Мутировать `state` **напрямую** вне mutations — антипаттерн в Vuex (в Pinia это норма)
- **Vue DevTools** показывает историю мутаций — time-travel debugging

---

## Сравнение

| Критерий | Vuex 4 | Pinia |
|----------|--------|-------|
| Mutations | Обязательны для изменения state | Нет |
| TypeScript | Сложно типизировать | Отлично «из коробки» |
| Boilerplate | Много (state/getters/mutations/actions) | Минимально |
| Devtools | Да | Да |
| SSR | Да | Да |
| Статус | Legacy | Рекомендован для Vue 3 |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем в Vuex разделены mutations и actions?** — mutations синхронны, что позволяет devtools записывать каждый снапшот state; actions могут быть async
- **Почему Pinia лучше Vuex для Vue 3?** — нет mutations-бойлерплейта, нативный TypeScript, нет магических строк (`commit('SET_USER')` → `store.setUser(user)`)
- **Как работает namespaced module в Vuex?** — `store.dispatch('moduleName/actionName')`, `store.getters['moduleName/getterName']`

### Красные флаги (чего не говорить)

- «Vuex — единственный стейт-менеджер для Vue» — Pinia, Zustand, Valtio тоже работают с Vue 3
- «Vuex актуален для новых Vue 3 проектов» — официально Pinia заменяет Vuex; новые проекты должны использовать Pinia
- «Мутировать state напрямую вне mutation — нормально» — в Vuex это нарушает принцип предсказуемости (хотя технически работает)

### Связанные темы

- `014-perechislite-varianty-kommunikacii-komponentov-vo-vue-js.md`
- `001-chto-takoe-vue-js.md`
