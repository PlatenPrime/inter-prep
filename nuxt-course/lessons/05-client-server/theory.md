# Модуль 05 — Client vs Server

## Двойная среда выполнения

Код в `<script setup>` Nuxt может выполниться **дважды**:
1. На сервере (при SSR)
2. На клиенте (при hydration и навигации)

На сервере **нет**:
- `window`, `document`, `localStorage`
- `navigator`, геолокация
- DOM API

## Ошибка новичка

```ts
// ReferenceError на сервере!
const theme = localStorage.getItem('theme')
```

## Решения

### 1. onMounted (только клиент)

```ts
const theme = ref('light')

onMounted(() => {
  theme.value = localStorage.getItem('theme') ?? 'light'
})
```

### 2. import.meta.client / import.meta.server

```ts
if (import.meta.client) {
  // browser-only
}
```

### 3. ClientOnly component

```vue
<template>
  <ClientOnly>
    <ThemeToggle />
    <template #fallback>
      <span>Loading theme...</span>
    </template>
  </ClientOnly>
</template>
```

Сервер рендерит `#fallback`, клиент заменяет на `ThemeToggle`.

## SSR-страница vs SPA-страница

Admin dashboard не нужен в Google → отключите SSR:

```ts
// nuxt.config.ts
routeRules: {
  '/admin/**': { ssr: false },
}
```

Или на странице:

```ts
definePageMeta({ ssr: false })
```

Страница рендерится только в браузере — как ваш `vue-3-course`.

## Lab

- [app/components/ThemeToggle.vue](../nuxt-lab/app/components/ThemeToggle.vue) — `localStorage`
- [app/pages/admin/index.vue](../nuxt-lab/app/pages/admin/index.vue) — `ssr: false`

## Следующий модуль

[06-hybrid-rendering/theory.md](../06-hybrid-rendering/theory.md)
