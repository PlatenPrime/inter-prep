# Модуль 09 — Performance

## Цель

Оптимизация рендеринга без преждевременной оптимизации: знать инструменты и когда их применять.

## v-memo

```vue
<div v-for="item in list" :key="item.id" v-memo="[item.id, item.selected]">
  <!-- перерендер только если id или selected изменились -->
</div>
```

Аналог «memo» для поддерева шаблона. Используйте для длинных списков с редкими изменениями.

## defineAsyncComponent

```ts
const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
```

Lazy load + можно задать loading/error компоненты.

## KeepAlive

```vue
<KeepAlive>
  <component :is="activeTab" />
</KeepAlive>
```

Кэширует неактивные компоненты (состояние сохраняется). Для табов с формами.

## shallowRef

Для больших immutable-структур (например, chart data):

```ts
const chartData = shallowRef(largeDataset)
chartData.value = newDataset // реактивно
// chartData.value.nested.x = 1 — НЕ отслеживается
```

## Code splitting

- Lazy routes: `() => import('./View.vue')`
- Dynamic import компонентов

## Когда НЕ оптимизировать

1. Сначала измерьте (Vue DevTools Performance).
2. Не оборачивайте всё в `computed` «на всякий случай».
3. Предпочитайте правильную архитектуру (разбиение stores, derived state).

## Примеры

- `examples/09-performance/001-v-memo-list.vue`

## Следующий модуль

[10-testing/theory.md](../10-testing/theory.md)
