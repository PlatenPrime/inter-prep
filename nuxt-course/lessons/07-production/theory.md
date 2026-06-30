# Модуль 07 — Production и Deploy

## Build

```bash
npm run build    # Nitro server bundle
npm run preview  # локальный preview prod-сборки
npm run generate # статический export (SSG)
```

`nuxt build` создаёт `.output/` — универсальный Nitro output для Node, serverless, edge.

## runtimeConfig (секреты)

```ts
// nuxt.config.ts
export default defineNuxtConfig({
  runtimeConfig: {
    apiSecret: process.env.NUXT_API_SECRET,
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE,
    },
  },
})
```

```ts
// server/api/secure.get.ts
export default defineEventHandler(() => {
  const config = useRuntimeConfig()
  // config.apiSecret — только на сервере
  return { ok: true }
})
```

## CI gates

```bash
npm run typecheck
npm run test
npm run build
```

Все три — зелёные перед merge.

## Deploy (обзор)

| Платформа | Как |
|-----------|-----|
| Vercel / Netlify | Git push, auto-detect Nuxt |
| Node VPS | `node .output/server/index.mjs` |
| Docker | Multi-stage build с `nuxt build` |
| Static CDN | `nuxt generate` для full SSG |

## Capstone — Blog Catalog

Полный пример в [nuxt-lab/](../nuxt-lab/):

- SSR blog с SEO
- Nitro API
- Hybrid routeRules
- ClientOnly theme toggle
- Admin SPA island
- Vitest tests

## Чеклист «готов к продакшену»

- [ ] Начальные данные через `useFetch` / `useAsyncData`
- [ ] `useSeoMeta` на публичных страницах
- [ ] Browser APIs только в `onMounted` / `<ClientOnly>`
- [ ] Секреты в `runtimeConfig`, не в `NUXT_PUBLIC_*`
- [ ] `routeRules` для admin/dashboard
- [ ] `nuxt typecheck` + `test` + `build` в CI

## Вернуться к Vue SPA курсу

[vue-3-course](../vue-3-course/) — модули 00–11 + capstone Task Board.
