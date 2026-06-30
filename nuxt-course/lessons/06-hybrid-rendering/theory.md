# Модуль 06 — Hybrid Rendering (routeRules)

## Идея

Не всё приложение должно работать в одном режиме. Nuxt позволяет задать правила **per-route**.

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  routeRules: {
    '/': { prerender: true },
    '/blog/**': { swr: 3600 },
    '/admin/**': { ssr: false },
  },
})
```

## Режимы

| Правило | Поведение | Когда |
|---------|-----------|-------|
| `prerender: true` | HTML при build (SSG) | Главная, about — редко меняется |
| `ssr: true` (default) | HTML на каждый запрос | Персонализированный контент |
| `swr: 3600` | Кэш 1 час, фоновое обновление | Блог, каталог |
| `ssr: false` | Чистый SPA | Admin, canvas, WebGL |

## Blog Catalog в lab

- `/` — prerender (быстрая главная)
- `/blog/**` — SSR + SWR
- `/admin/**` — SPA island

См. [nuxt-lab/nuxt.config.ts](../nuxt-lab/nuxt.config.ts).

## Следующий модуль

[07-production/theory.md](../07-production/theory.md)
