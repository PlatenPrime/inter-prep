# Vue 3 — производственный туториал (июнь 2026)

Изолированный курс для разработчика с сильным **JavaScript + React** бэкграундом. Цель — уверенно работать с Vue 3 в продакшене: Composition API, Pinia, Router, тесты, архитектура.

## Стек

| Слой | Технология |
|------|------------|
| Framework | Vue 3.5+ |
| API | Composition API + `<script setup lang="ts">` |
| Build | Vite 8 |
| Router | Vue Router 5 |
| Client state | Pinia (setup stores) |
| Server state | Pinia Colada |
| Validation | Zod |
| Testing | Vitest + @vue/test-utils |
| Types | vue-tsc |

## Команды

```bash
cd vue-3-course
npm install
npm run dev          # dev-сервер + playground
npm run test         # все тесты (src + examples + capstone)
npm run test:examples
npm run typecheck    # vue-tsc — проверяет шаблоны
npm run lint
npm run build
```

## Структура

```
vue-3-course/
├── lessons/          # Теория по модулям (theory.md)
├── examples/         # Изолированные примеры + Vitest
├── capstone/         # Финальный SPA «Task Board»
└── src/              # Playground и точка входа
```

## Roadmap (12 модулей)

| # | Модуль | Файл | Примеры |
|---|--------|------|---------|
| 00 | Setup и ментальная модель | [lessons/00-setup/theory.md](lessons/00-setup/theory.md) | `src/` |
| 01 | Шаблоны и директивы | [lessons/01-fundamentals/theory.md](lessons/01-fundamentals/theory.md) | [examples/01-fundamentals/](examples/01-fundamentals/) |
| 02 | Реактивность | [lessons/02-reactivity/theory.md](lessons/02-reactivity/theory.md) | [examples/02-reactivity/](examples/02-reactivity/) |
| 03 | Компоненты | [lessons/03-components/theory.md](lessons/03-components/theory.md) | [examples/03-components/](examples/03-components/) |
| 04 | Composables | [lessons/04-composables/theory.md](lessons/04-composables/theory.md) | [examples/04-composables/](examples/04-composables/) |
| 05 | Vue Router | [lessons/05-routing/theory.md](lessons/05-routing/theory.md) | [examples/05-routing/](examples/05-routing/) |
| 06 | Pinia | [lessons/06-pinia/theory.md](lessons/06-pinia/theory.md) | [examples/06-pinia/](examples/06-pinia/) |
| 07 | Формы и Zod | [lessons/07-forms/theory.md](lessons/07-forms/theory.md) | [examples/07-forms/](examples/07-forms/) |
| 08 | Server state (Colada) | [lessons/08-server-state/theory.md](lessons/08-server-state/theory.md) | [examples/08-server-state/](examples/08-server-state/) |
| 09 | Performance | [lessons/09-performance/theory.md](lessons/09-performance/theory.md) | [examples/09-performance/](examples/09-performance/) |
| 10 | Тестирование | [lessons/10-testing/theory.md](lessons/10-testing/theory.md) | тесты в `examples/` |
| 11 | Production | [lessons/11-production/theory.md](lessons/11-production/theory.md) | чеклист |
| 12 | **Nuxt 4 + SSR** | [../nuxt-course/README.md](../nuxt-course/README.md) | Blog Catalog |
| — | **Capstone (Vue SPA)** | [capstone/README.md](capstone/README.md) | `/tasks` в dev-сервере |

**Оценка времени:** ~40–50 часов (модули 0–4 ≈ 12–16 ч для быстрого старта на работе).

## React → Vue шпаргалка

| React | Vue 3 |
|-------|-------|
| `useState` | `ref` |
| `useMemo` | `computed` |
| `useEffect` | `watch` / `watchEffect` / `onMounted` |
| Custom hook | Composable (`use*`) |
| `children` | default slot |
| Context | `provide`/`inject` или Pinia |
| Zustand | Pinia setup store |
| TanStack Query | Pinia Colada |
| `React.memo` | `v-memo`, `shallowRef`, архитектура |
| JSX | template (+ optional JSX plugin) |

## Golden Rules (продакшен)

1. **Только** Composition API + `<script setup lang="ts">`. Options API — для чтения легаси.
2. **`ref` по умолчанию**; `reactive` — для стабильных объектов без переприсваивания.
3. **Не деструктурировать `reactive`** без `toRefs` / `storeToRefs`.
4. **Props:** `defineProps<T>()` + Vue 3.5 destructure; emits — `defineEmits<T>()`.
5. **Two-way:** `defineModel<T>()`, не ручной `modelValue` + emit.
6. **Composables:** префикс `use*`, lifecycle только на top level.
7. **Pinia:** setup stores, один store = один домен.
8. **Server data:** Pinia Colada, не дублировать API-ответы в Pinia без причины.
9. **Типы:** `vue-tsc --noEmit` в CI; alias `@/`.
10. **Тесты:** composables + stores в приоритете над snapshot каждого компонента.

## Как учиться

1. Читай `lessons/NN-*/theory.md`.
2. Открывай примеры в браузере: `npm run dev` → **Examples** (`/examples`) — живой рендер + исходник с подсветкой.
3. Запускай тесты: `npx vitest run examples/02-reactivity/001-ref-counter.test.ts`.
4. В конце — capstone: `npm run dev` → раздел **Task Board** (`/tasks`).

## Связь с inter-prep

Курс автономен. Для собеседований см. [webdev/16. vue-js/](../webdev/16.%20vue-js/) в родительском репозитории.
