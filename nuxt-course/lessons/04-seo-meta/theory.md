# Модуль 04 — SEO и Meta

## Зачем SSR для SEO

Поисковый бот запрашивает страницу и читает **исходный HTML**. В CSR там пустой `<div id="app">`. В SSR — реальный `<title>`, `<meta description>`, текст статьи.

То же для Open Graph (превью в Telegram, Slack, Twitter).

## useSeoMeta

```vue
<script setup lang="ts">
const { data: post } = await useFetch('/api/posts/my-slug')

useSeoMeta({
  title: () => post.value?.title ?? 'Blog',
  description: () => post.value?.excerpt ?? '',
  ogTitle: () => post.value?.title,
  ogDescription: () => post.value?.excerpt,
})
</script>
```

Getter-функции (`() => ...`) — когда данные реактивны и приходят асинхронно.

## useHead

Для произвольных тегов:

```ts
useHead({
  title: 'My Page',
  link: [{ rel: 'canonical', href: 'https://example.com/blog' }],
})
```

## Проверка

1. `npm run dev`
2. Откройте `/blog/some-slug`
3. View Page Source — найдите `<title>` и `og:title` в HTML **до** JS

## Lab

Каждая статья в Blog Catalog задаёт уникальные meta через `useSeoMeta` в [app/pages/blog/[slug].vue](../nuxt-lab/app/pages/blog/[slug].vue).

## Следующий модуль

[05-client-server/theory.md](../05-client-server/theory.md)
