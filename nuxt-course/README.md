# Nuxt 4 и SSR — производственный модуль

Продолжение курса [vue-3-course](../vue-3-course/). Для разработчика с опытом **React/Vite SPA**, который **не понимает SSR**.

## Предпосылки

Пройдите модули **00–04** из vue-3-course (Composition API, composables). Модули 05–08 желательны.

## Стек

| Слой | Технология |
|------|------------|
| Framework | Nuxt 4 + Vue 3.5 |
| Server | Nitro |
| Data | `useFetch` / `useAsyncData` |
| SEO | `useSeoMeta` / `useHead` |
| Testing | Vitest + `@nuxt/test-utils` |

## Команды

```bash
cd nuxt-course/nuxt-lab
npm install
npm run dev          # http://localhost:3000
npm run build
npm run preview
npm run test
npm run typecheck
```

## Roadmap

| # | Модуль | Файл |
|---|--------|------|
| 00 | **SSR с нуля** (начни здесь) | [lessons/00-ssr-basics/theory.md](lessons/00-ssr-basics/theory.md) |
| 01 | Nuxt setup | [lessons/01-nuxt-setup/theory.md](lessons/01-nuxt-setup/theory.md) |
| 02 | Routing & layouts | [lessons/02-routing-layouts/theory.md](lessons/02-routing-layouts/theory.md) |
| 03 | Data fetching | [lessons/03-data-fetching/theory.md](lessons/03-data-fetching/theory.md) |
| 04 | SEO & meta | [lessons/04-seo-meta/theory.md](lessons/04-seo-meta/theory.md) |
| 05 | Client vs server | [lessons/05-client-server/theory.md](lessons/05-client-server/theory.md) |
| 06 | Hybrid rendering | [lessons/06-hybrid-rendering/theory.md](lessons/06-hybrid-rendering/theory.md) |
| 07 | Production | [lessons/07-production/theory.md](lessons/07-production/theory.md) |

**Capstone:** Blog Catalog в [nuxt-lab/](nuxt-lab/) — `/`, `/blog`, `/blog/:slug`, `/admin`.

**Оценка времени:** ~16–20 часов.

## Golden Rules (Nuxt)

1. Начальные данные страницы — `useFetch` / `useAsyncData`, не `onMounted` + fetch.
2. Browser APIs — только на клиенте (`onMounted`, `<ClientOnly>`, `import.meta.client`).
3. Секреты — `runtimeConfig` (server), не `NUXT_PUBLIC_*`.
4. SEO-страницы — `useSeoMeta` на каждой публичной route.
5. Не весь app в SSR — `routeRules` для admin/dashboard.
6. Server logic — `server/api/` (Nitro).
7. `nuxt typecheck` в CI.

## CSR vs SSR — шпаргалка

| | Vite SPA (vue-3-course) | Nuxt SSR (nuxt-lab) |
|---|-------------------------|----------------------|
| Первый HTML | Пустой `<div id="app">` | Контент уже в HTML |
| Данные на старте | `onMounted` + fetch | `useFetch` на сервере |
| Роутинг | `src/router/index.ts` | `app/pages/*.vue` |
| API | Внешний backend | `server/api/*.ts` (Nitro) |
| SEO | Плохо без SSR | `<title>` в исходном HTML |

## Упражнение «увидеть SSR»

1. `cd vue-3-course && npm run dev` → View Page Source на `/`
2. `cd nuxt-course/nuxt-lab && npm run dev` → View Page Source на `/blog`
3. Сравни: в Nuxt контент постов виден **до** выполнения JavaScript.
