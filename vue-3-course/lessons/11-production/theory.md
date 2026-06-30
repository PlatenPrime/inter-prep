# Модуль 11 — Production & Architecture

## Цель

Структура проекта, CI gates, error handling, когда выбирать Nuxt.

## Feature-based structure

```
src/
  features/
    tasks/
      components/
      composables/
      stores/
      api/
      index.ts          # public API слайса
  shared/
    ui/
    lib/
```

Каждый feature экспортирует только нужное через `index.ts` — внутренности приватны.

## CI gates (обязательные)

```bash
npm run typecheck   # vue-tsc — шаблоны + script
npm run lint        # eslint-plugin-vue
npm run test        # vitest
npm run build       # vite build
```

Все четыре должны быть зелёными перед merge.

## Error handling

```vue
<script setup lang="ts">
import { onErrorCaptured, ref } from 'vue'

const error = ref<Error | null>(null)

onErrorCaptured((err) => {
  error.value = err as Error
  return false // не всплывать дальше
})
</script>
```

Для route-level: error component в router или boundary-компонент.

## Env и секреты

- `VITE_*` — только публичные значения
- API keys на сервере, не в клиенте
- `.env.local` в `.gitignore`

## Nuxt — когда нужен

| SPA (Vite) | Nuxt |
|------------|------|
| Dashboard, admin | SEO, marketing, blog |
| Client-only auth | SSR/SSG |
| Простой deploy static | File-based routing + SSR |

**Полный курс по Nuxt 4 и SSR с нуля:** [nuxt-course](../../nuxt-course/README.md) — отдельный модуль 12 с объяснением SSR для тех, кто знает только SPA.

## Production checklist

- [ ] `<script setup lang="ts">` everywhere
- [ ] `defineProps` / `defineEmits` / `defineModel` typed
- [ ] Pinia setup stores по доменам
- [ ] Server state в Pinia Colada
- [ ] Lazy routes для тяжёлых страниц
- [ ] `vue-tsc` + eslint + vitest в CI
- [ ] Zod на границах (forms, API parse)

## Capstone

Финальный проект: [capstone/README.md](../../capstone/README.md)

Запуск: `npm run dev` → `/tasks`
