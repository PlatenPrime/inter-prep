# Модуль 01 — Nuxt Setup

## Цель

Понять структуру Nuxt 4 проекта и отличия от `vue-3-course`.

## Создание проекта

```bash
npm create nuxt@latest nuxt-lab -- --template minimal
cd nuxt-lab
npm install
npm run dev
```

Dev-сервер: `http://localhost:3000` (не 5173 как Vite).

## Структура Nuxt 4

```
nuxt-lab/
├── app/                 # Весь frontend-код
│   ├── app.vue          # Корневой компонент (обёртка)
│   ├── pages/           # File-based routes
│   ├── layouts/         # Общие оболочки страниц
│   ├── components/      # Auto-import компонентов
│   └── composables/     # Auto-import composables
├── server/              # Backend (Nitro)
│   └── api/             # REST endpoints → /api/*
├── public/              # Статика as-is
└── nuxt.config.ts       # Центральная конфигурация
```

**Ключевое отличие от vue-3-course:** нет `src/main.ts`, нет ручного `createApp` — Nuxt bootstrap делает всё сам.

## app.vue

```vue
<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
```

- `NuxtLayout` — подключает layout из `app/layouts/`
- `NuxtPage` — рендерит текущую страницу из `app/pages/`

## Auto-imports

В Nuxt не нужно импортировать:

```vue
<script setup lang="ts">
// ref, computed, useFetch — уже доступны
const count = ref(0)
</script>

<template>
  <MyButton />  <!-- app/components/MyButton.vue — auto-import -->
</template>
```

## nuxt.config.ts

```ts
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
})
```

Сюда же: `routeRules`, `runtimeConfig`, modules.

## Переменные окружения

| vue-3-course | nuxt-lab |
|--------------|----------|
| `VITE_API_URL` | `NUXT_PUBLIC_API_URL` (клиент) |
| — | `NUXT_API_SECRET` (только сервер, runtimeConfig) |

Публичные (`NUXT_PUBLIC_*`) попадают в клиентский бандл. Секреты — только через `runtimeConfig` без `public`.

## React-bridge

| vue-3-course | Nuxt |
|--------------|------|
| `createApp(App).mount('#app')` | автоматически |
| `app.use(router)` | file-based `pages/` |
| `app.use(pinia)` | `@pinia/nuxt` module (опционально) |
| `vite.config.ts` aliases | `nuxt.config` `alias` |

## Lab

Откройте [nuxt-lab/app/app.vue](../nuxt-lab/app/app.vue) — после capstone там будет layout + pages.

## Следующий модуль

[02-routing-layouts/theory.md](../02-routing-layouts/theory.md)
