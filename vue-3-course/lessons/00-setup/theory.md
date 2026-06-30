# Модуль 00 — Setup и ментальная модель

## Цель

Понять, как Vue-приложение запускается, из чего состоит SFC, и чем ментальная модель отличается от React.

## Progressive framework

Vue можно:
- подключить к существующей HTML-странице (`createApp().mount('#el')`);
- построить полноценный SPA с Router + Pinia.

Это «прогрессивность»: вы добавляете слои по мере роста проекта.

## createApp vs React createRoot

```ts
// React 19
import { createRoot } from 'react-dom/client'
createRoot(document.getElementById('root')!).render(<App />)

// Vue 3
import { createApp } from 'vue'
import App from './App.vue'
const app = createApp(App)
app.use(router)
app.use(pinia)
app.mount('#app')
```

Ключевое отличие: в Vue **плагины** (`app.use`) регистрируются на экземпляре приложения, а не через Context-провайдеры.

## Single File Component (SFC)

```vue
<script setup lang="ts">
import { ref } from 'vue'
const count = ref(0)
</script>

<template>
  <button @click="count++">{{ count }}</button>
</template>

<style scoped>
button { font-weight: 600; }
</style>
```

Три блока в одном файле: логика, разметка, стили. Vite компилирует `.vue` в JS на этапе сборки (runtime-compiler не нужен в продакшене).

## Vite и переменные окружения

В Vue 3 + Vite публичные env-переменные начинаются с `VITE_`:

```env
VITE_API_URL=https://api.example.com
```

```ts
const url = import.meta.env.VITE_API_URL
```

Никогда не кладите секреты в `VITE_*` — они попадают в клиентский бандл.

## Структура этого проекта

| Путь | Назначение |
|------|------------|
| `src/main.ts` | Точка входа |
| `src/App.vue` | Корневой компонент |
| `src/router/` | Маршрутизация |
| `src/stores/` | Pinia stores (playground) |
| `lessons/` | Теория |
| `examples/` | Изолированные примеры + тесты |
| `capstone/` | Финальный проект |

## React-bridge

| Концепция | React | Vue |
|-----------|-------|-----|
| Единица UI | Function component | SFC / `defineComponent` |
| Состояние | `useState` → re-render | `ref` → точечное обновление DOM |
| Шаблон | JSX в JS | HTML-подобный `<template>` |
| Стили | CSS modules / styled | `<style scoped>` |

Vue **не перерисовывает весь subtree** при каждом изменении ref — реактивный движок обновляет только затронутые узлы DOM.

## Упражнение

1. Запустите `npm run dev`.
2. Откройте `src/main.ts` — проследите цепочку `createApp` → `use(router)` → `use(pinia)` → `mount`.
3. Измените `src/App.vue` — убедитесь в HMR.

## Следующий модуль

[01-fundamentals/theory.md](../01-fundamentals/theory.md) — шаблоны и директивы.
