# Q030. Что такое асинхронные компоненты?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Асинхронный компонент** — это компонент, загружаемый лениво (lazy loading) только тогда, когда он нужен, а не при загрузке всего приложения. В Vue 3 создаётся через `defineAsyncComponent(() => import('./MyComp.vue'))`. Это ключевой инструмент **code splitting** — разбиения бандла на chunks для ускорения начальной загрузки.

---

## Развёрнутый ответ

### Суть и определение

Без lazy loading все компоненты попадают в один JS-бандл. При большом приложении это замедляет Time to Interactive. `defineAsyncComponent` позволяет загружать компонент только при первом его использовании.

### Как это работает

#### Базовый синтаксис

```typescript
import { defineAsyncComponent } from 'vue'

// Минимальный вариант
const HeavyChart = defineAsyncComponent(
  () => import('@/components/HeavyChart.vue')
)
```

#### Расширенный вариант с загрузочным состоянием

```typescript
import { defineAsyncComponent } from 'vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import ErrorMessage from '@/components/ErrorMessage.vue'

const HeavyChart = defineAsyncComponent({
  // Фабрика, возвращающая промис с компонентом
  loader: () => import('@/components/HeavyChart.vue'),

  // Компонент на время загрузки
  loadingComponent: LoadingSpinner,

  // Задержка перед показом loadingComponent (мс)
  // Предотвращает мелькание лоадера при быстрой загрузке
  delay: 200,

  // Компонент при ошибке загрузки
  errorComponent: ErrorMessage,

  // Таймаут — если загрузка превысит это время, показывается error
  timeout: 5000,

  // Callback при ошибке — можно retry
  onError(error, retry, fail, attempts) {
    if (attempts <= 3) {
      retry() // автоматическая повторная попытка
    } else {
      fail()
    }
  },
})
```

#### Использование в шаблоне

```vue
<script setup lang="ts">
import { defineAsyncComponent } from 'vue'

// Загружается только когда AdminPanel станет видимым
const AdminPanel = defineAsyncComponent(
  () => import('@/views/AdminPanel.vue')
)
</script>

<template>
  <AdminPanel v-if="user.isAdmin" />
</template>
```

#### `<Suspense>` — декларативная обработка загрузки

```vue
<!-- Родительский компонент с Suspense -->
<template>
  <Suspense>
    <!-- Контент после загрузки -->
    <template #default>
      <AsyncDashboard />
    </template>

    <!-- Пока идёт загрузка -->
    <template #fallback>
      <div class="loading">Загрузка дашборда...</div>
    </template>
  </Suspense>
</template>

<script setup lang="ts">
// Компонент с async setup тоже работает с Suspense
const AsyncDashboard = defineAsyncComponent(
  () => import('@/views/Dashboard.vue')
)
</script>
```

#### Практика с Vue Router — route-level code splitting

```typescript
// router/index.ts — стандартный паттерн для всех страниц
const routes = [
  {
    path: '/',
    component: () => import('@/views/HomePage.vue'),
  },
  {
    path: '/admin',
    component: () => import('@/views/AdminPage.vue'),
    // Имя chunk для webpack/vite
    // webpackChunkName: "admin"
  },
  {
    path: '/settings',
    component: () => import('@/views/SettingsPage.vue'),
  },
]
```

### Практика и применение

**Стратегии загрузки:**

```typescript
// 1. По условию — загружать только если нужно
const HeavyModal = defineAsyncComponent(
  () => import('@/components/HeavyModal.vue')
)
// Рендерить только при открытии модалки

// 2. Prefetch — предзагрузка при простое браузера
// В Vite: /* @vite-ignore */ + requestIdleCallback
const prefetchComponent = () => {
  if ('requestIdleCallback' in window) {
    requestIdleCallback(() => import('@/views/SettingsPage.vue'))
  }
}
```

### Важные нюансы и краеугольные камни

- **`defineAsyncComponent` ≠ `import()`**: `import()` возвращает промис с модулем; `defineAsyncComponent` оборачивает его в Vue-компонент с обработкой состояний
- **`delay: 200`** — не откладывает загрузку, а откладывает показ `loadingComponent`. Без delay спиннер мелькает при быстрой загрузке
- **SSR**: асинхронные компоненты с `<Suspense>` поддерживают SSR в Nuxt — сервер дожидается загрузки перед отправкой HTML
- **Глобальная регистрация** асинхронного компонента тоже возможна: `app.component('HeavyComp', defineAsyncComponent(...))`
- Если компонент используется часто и повторно — `defineAsyncComponent` его кэширует и загружает только один раз

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `defineAsyncComponent` отличается от динамического импорта `import()`?** — `import()` это промис; `defineAsyncComponent` создаёт Vue-компонент с управлением состоянием загрузки/ошибки
- **Что такое `<Suspense>` и когда он нужен?** — декларативная обёртка для показа fallback пока async-компонент или async setup грузится
- **Как реализован code splitting в Vue Router?** — через динамический `import()` в определении маршрута; Vite/webpack автоматически создаёт отдельный chunk

### Красные флаги (чего не говорить)

- «Асинхронные компоненты всегда лучше» — слишком много маленьких chunks создаёт overhead на сеть; нужен баланс
- «`delay` откладывает загрузку» — нет, `delay` откладывает показ `loadingComponent`, сама загрузка начинается немедленно

### Связанные темы

- `029-chto-takoe-dinamicheskie-keep-alive-komponenty.md`
- `028-chto-takoe-render-funkciya-preimushchestva.md`
- `031-chto-takoe-vue-router-nazvajte-ego-osobennosti.md`
