# Модуль 10 — Тестирование

## Цель

Unit-тесты composables/stores, component tests с @vue/test-utils — production-подход.

## Пирамида тестов для Vue

1. **Composables** — `effectScope` + прямые вызовы
2. **Pinia stores** — `setActivePinia(createPinia())`
3. **Components** — mount + user interactions
4. E2E (Playwright/Cypress) — вне scope курса

## Component testing

```ts
import { mount } from '@vue/test-utils'
import MyForm from './MyForm.vue'

const wrapper = mount(MyForm, {
  props: { initial: 'value' },
  global: { plugins: [router, pinia] },
})

await wrapper.get('[data-testid="submit"]').trigger('click')
expect(wrapper.emitted('submit')).toBeTruthy()
```

## Query priority (как RTL)

1. `getByRole`, `getByLabelText`
2. `getByText`
3. `data-testid` — последний resort

## flushPromises

```ts
import { flushPromises } from '@vue/test-utils'
await flushPromises() // после async operations
```

## Mock router

```ts
import { createRouter, createMemoryHistory } from 'vue-router'
const router = createRouter({
  history: createMemoryHistory(),
  routes: [{ path: '/', component: { template: '<div />' } }],
})
```

## Что тестировать

- Поведение пользователя (клик → emit / DOM change)
- Валидация форм
- Store actions меняют state
- Guards редиректят

## Что НЕ тестировать

- Implementation details (внутренние ref)
- Snapshot каждого компонента без причины

## Примеры

Все `examples/**/*.test.ts` в курсе — эталонные паттерны.

## Следующий модуль

[11-production/theory.md](../11-production/theory.md)
