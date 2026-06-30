# Blog Catalog — Nuxt 4 Capstone

SSR blog + SPA admin island. Part of [nuxt-course](../README.md).

## Routes

| URL | Mode | Description |
|-----|------|-------------|
| `/` | SSG (prerender) | Landing |
| `/blog` | SSR + SWR | Post list via `useFetch` |
| `/blog/:slug` | SSR + SWR | Post detail + `useSeoMeta` |
| `/admin` | SPA (`ssr: false`) | Client-only dashboard stub |

## Commands

```bash
npm run dev
npm run build
npm run preview
npm run test
npm run typecheck
```

## Key files

- `server/api/posts/` — Nitro REST API
- `app/composables/usePost.ts` — data fetching composable
- `app/components/ThemeToggle.vue` — ClientOnly + localStorage
- `nuxt.config.ts` — `routeRules` hybrid rendering
