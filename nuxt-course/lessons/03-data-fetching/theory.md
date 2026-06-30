# Модуль 03 — Data Fetching (сердце SSR)

## Главная ошибка новичка

```vue
<!-- НЕ ТАК в Nuxt SSR -->
<script setup lang="ts">
const posts = ref([])

onMounted(async () => {
  posts.value = await $fetch('/api/posts')
})
</script>
```

**Почему плохо:**
1. `onMounted` **не выполняется на сервере**
2. HTML уйдёт пустым → SEO и UX сломаны
3. Пользователь увидит loading, потом контент (как в SPA)

В CSR (`vue-3-course`) это нормально. В Nuxt — антипаттерн для начальных данных.

## Правильно: useFetch

```vue
<script setup lang="ts">
const { data: posts, pending, error } = await useFetch('/api/posts')
</script>

<template>
  <p v-if="pending">Loading...</p>
  <ul v-else>
    <li v-for="post in posts" :key="post.slug">{{ post.title }}</li>
  </ul>
</template>
```

**Что происходит:**
1. На сервере: Nuxt вызывает `/api/posts`, рендерит HTML с постами
2. Данные встраиваются в страницу (payload)
3. На клиенте при hydration: данные уже есть, повторный fetch не нужен

## useAsyncData — больший контроль

```ts
const { data } = await useAsyncData('posts', () => $fetch('/api/posts'))
```

- Первый аргумент — **уникальный ключ** кэша
- Второй — функция загрузки

Используйте, когда нужен кастомный ключ или несколько источников.

## Server API (Nitro)

`server/api/posts.get.ts`:

```ts
export default defineEventHandler(() => {
  return getAllPosts()
})
```

Автоматически доступен как `GET /api/posts`.

Динамический: `server/api/posts/[slug].get.ts` → `GET /api/posts/:slug`

**Важно:** код в `server/` выполняется **только на сервере**. Можно обращаться к БД, секретам, файловой системе.

## Composable для переиспользования

`app/composables/usePost.ts`:

```ts
export function usePost(slug: string) {
  return useFetch(`/api/posts/${slug}`)
}
```

Auto-import — импорт не нужен.

## React-bridge

| React / Next | Nuxt |
|--------------|------|
| `useEffect` + `fetch` | `useFetch` (для initial data) |
| TanStack Query SSR | `useAsyncData` + payload |
| `getServerSideProps` | `await useFetch()` в `<script setup>` |
| API Routes `/api/*` | `server/api/*.ts` |

## Lab

- [server/utils/posts.ts](../nuxt-lab/server/utils/posts.ts)
- [server/api/posts/index.get.ts](../nuxt-lab/server/api/posts/index.get.ts)
- [app/pages/blog/[slug].vue](../nuxt-lab/app/pages/blog/[slug].vue)

## Следующий модуль

[04-seo-meta/theory.md](../04-seo-meta/theory.md)
