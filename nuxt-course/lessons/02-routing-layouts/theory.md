# Модуль 02 — Routing, Layouts, Middleware

## File-based routing

Файл в `app/pages/` = маршрут. Роутер писать не нужно.

| Файл | URL |
|------|-----|
| `app/pages/index.vue` | `/` |
| `app/pages/blog/index.vue` | `/blog` |
| `app/pages/blog/[slug].vue` | `/blog/:slug` |
| `app/pages/admin/index.vue` | `/admin` |

Динамический сегмент: `[slug].vue` → `const route = useRoute(); route.params.slug`

**React-bridge:** как Next.js Pages Router или React Router file-based plugins.

## Layouts

`app/layouts/default.vue`:

```vue
<template>
  <div class="layout">
    <header>...</header>
    <main>
      <slot />
    </main>
    <footer>...</footer>
  </div>
</template>
```

Страница автоматически оборачивается в `default` layout.

Другой layout:

```vue
<script setup lang="ts">
definePageMeta({ layout: 'admin' })
</script>
```

## Navigation

```vue
<NuxtLink to="/blog">Blog</NuxtLink>
```

`NuxtLink` — как `<RouterLink>`, с prefetch и active class.

Программная навигация: `const router = useRouter(); router.push('/blog')`

## Route middleware

`app/middleware/auth.ts`:

```ts
export default defineNuxtRouteMiddleware(() => {
  const loggedIn = false // заменить на реальную проверку
  if (!loggedIn) return navigateTo('/')
})
```

На странице:

```ts
definePageMeta({ middleware: 'auth' })
```

**React-bridge:** как loader guards в React Router или Next.js middleware.

## Lab (Blog Catalog)

- [nuxt-lab/app/layouts/default.vue](../nuxt-lab/app/layouts/default.vue)
- [nuxt-lab/app/pages/blog/index.vue](../nuxt-lab/app/pages/blog/index.vue)
- [nuxt-lab/app/pages/blog/[slug].vue](../nuxt-lab/app/pages/blog/[slug].vue)

## Следующий модуль

[03-data-fetching/theory.md](../03-data-fetching/theory.md)
