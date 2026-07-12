# 01 — Vue/Nuxt в этом проекте

Гайд для тех, кто только входит в Vue 3 и Nuxt 3. Все примеры — из реального кода spintime.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Vue 3: основы на примерах spintime

### Single File Component (SFC)

Каждый `.vue` файл состоит из трёх секций:

```vue
<script lang="ts" setup>
// JavaScript/TypeScript — логика
</script>

<template>
  <!-- HTML-разметка -->
</template>

<style lang="scss" scoped>
/* Стили, scoped = только для этого компонента */
</style>
```

В spintime почти все компоненты используют `<script lang="ts" setup>` — это **Composition API** в сокращённом синтаксисе.

### `<script setup>` — что это

Вместо старого стиля:

```vue
<!-- Старый Options API (в проекте НЕ используется) -->
<script>
export default {
  data() { return { count: 0 } },
  methods: { increment() { this.count++ } }
}
</script>
```

Используется:

```vue
<script lang="ts" setup>
const count = ref(0);
const increment = () => count.value++;
</script>
```

Всё, объявленное в `<script setup>`, автоматически доступно в `<template>`.

---

## Реактивность: ref, computed, watch

### `ref` — реактивная переменная

```typescript
const isOpen = ref(false);
isOpen.value = true;  // в script — через .value
```

```vue
<template>
  <div v-if="isOpen">Открыто</div>  <!-- в template — без .value -->
</template>
```

### `computed` — вычисляемое значение

Пересчитывается автоматически при изменении зависимостей:

```typescript
// pages/index.vue
const popularGames = computed(() => games.value?.payload?.games);
```

### `watch` / `watchEffect` — реакция на изменения

```typescript
watch(isGuest, (newVal) => {
  if (!newVal) router.push("/lobby/");
});
```

> **Неочевидно:** `computed` — для **производных** данных (фильтрация, маппинг). `watch` — для **побочных эффектов** (навигация, API-вызов, localStorage).

---

## Props и emits

### Получение данных от родителя (props)

```vue
<!-- molecules/M/Home/Guest/PopularGames.vue -->
<script lang="ts" setup>
interface Props {
  popularGames: any[];
  popularGamesSection?: GameItem;
}
defineProps<Props>();
</script>
```

Использование:

```vue
<MHomeGuestPopularGames
  :popular-games="popularGames"
  :popular-games-section="popularGamesSection"
/>
```

### Отправка событий родителю (emits)

```typescript
const emit = defineEmits<{ toggleFavorite: [gameId: number] }>();
emit("toggleFavorite", game.id);
```

---

## Директивы в template

| Директива | Назначение | Пример |
|-----------|------------|--------|
| `v-if` / `v-else` | Условный рендер | `v-if="isGuest"` |
| `v-for` | Цикл | `v-for="game in games" :key="game.id"` |
| `v-model` | Двусторонняя привязка | `v-model="email"` на `MInput` |
| `v-show` | Показать/скрыть (CSS) | `v-show="!isSkeleton"` |
| `:prop` | Передать значение prop | `:game="item"` |
| `@event` | Обработчик события | `@click="handleOpen"` |
| `#slot` | Именованный слот | `#default="{ slider }"` |

---

## Composables — переиспользуемая логика

**Composable** — функция с префиксом `use`, которая инкапсулирует логику и может использовать другие composables.

```typescript
// composables/useHomePage.ts — упрощённо
export const useHomePage = ({ immediate = false } = {}) => {
  const { data: homePageData, refresh } = useHomeData({ immediate });
  const { banners } = useHomeBanners();

  const seoData = computed(() => homePageData.value?.seo);

  return { homePageData, banners, seoData, refresh };
};
```

Использование на странице:

```typescript
const { homePageData, seoData } = useHomePage({ immediate: true });
```

### Auto-import composables

Nuxt автоматически импортирует:

- composables из `apps/spintime/composables/`
- composables из `packages/composables/src/` (через module `@netgame/composables`)

Писать `import { useIsGuest } from '@netgame/composables'` **не нужно** — функция доступна глобально.

---

## useState vs Pinia vs ref

| Инструмент | Когда использовать | Пример |
|------------|-------------------|--------|
| `ref` / `computed` | Локальное состояние компонента | `const isOpen = ref(false)` |
| `useState` | Shared state между компонентами **в рамках одного запроса/сессии** | `useState("show-catalog-games", () => false)` |
| Pinia store | Глобальное состояние, переживает навигацию, обновляется из API/sockets | `useAppInitStore()` |

```typescript
// useState — SSR-safe, ключ уникален по строке
const isCatalogGames = useState<boolean>("show-catalog-games", () => false);

// Pinia — данные приложения
const appInitStore = useAppInitStore();
const player = computed(() => appInitStore.data?.player);
```

> **Неочевидно:** `useState` в Nuxt — это не React useState. Это **shared ref**, который сериализуется при SSR и гидратируется на клиенте. Используйте его для UI-флагов, которые нужны в разных компонентах (например, `isShowGameModal`).

---

## Nuxt 3: ключевые концепции

### File-based routing

Файл в `pages/` = маршрут:

| Файл | URL |
|------|-----|
| `pages/index.vue` | `/` |
| `pages/online-games.vue` | `/online-games/` |
| `pages/library.vue` | `/library/` |
| `pages/page/[name].vue` | `/page/terms/`, `/page/privacy/` |
| `pages/rubric/[name].vue` | `/rubric/slots/` |

Динамический сегмент `[name]` доступен через `useRoute()`:

```typescript
const route = useRoute();
const pageName = route.params.name; // "terms"
```

### Layouts

Layout — обёртка вокруг страницы. Spintime имеет три layout'а:

| Layout | Файл | Когда |
|--------|------|-------|
| `default` | `layouts/default.vue` | Большинство страниц (header + footer) |
| `auth` | `layouts/auth.vue` | signin, signup (минимальная оболочка) |
| `geoblock` | `layouts/geoblock.vue` | Гео-блокировка |

```vue
<!-- Страница с default layout (можно не указывать — он default) -->
<template>
  <NuxtLayout>
    ...
  </NuxtLayout>
</template>

<!-- Страница с auth layout -->
<template>
  <NuxtLayout name="auth">
    ...
  </NuxtLayout>
</template>
```

### `app.vue` — корневой компонент

`app.vue` оборачивает **все** страницы. В spintime он отвечает за:

- глобальную инициализацию (`useAppInitData`)
- рендер `<LazyOModals />` (все модалки)
- captcha, welcome modals, sockets

Страница рендерится **внутри** `app.vue` → layout → page.

### Auto-import компонентов

Nuxt регистрирует компоненты из путей, указанных в `nuxt.config.ts`:

```typescript
components: [
  { path: "~/organizms", global: true },
  { path: "~/molecules", global: true }
]
```

Плюс все компоненты из `@netgame/ui` (atoms, molecules).

**Имя компонента** формируется из пути папок:

```
organizms/O/Home/BannerLight.vue  →  OHomeBannerLight
molecules/M/Game/Type.vue         →  MGameType
packages/ui/atoms/AButton.vue     →  AButton
```

### Lazy-компоненты

Префикс `Lazy` в template включает **code splitting** — компонент загружается только когда нужен:

```vue
<LazyOGamesCatalog :show-catalog="isCatalogGames" />
<LazyOHomeJackpot :isSkeleton="isSkeleton" />
```

Это не «ленивый рендер по viewport», а **ленивая загрузка JS-бандла**. Для viewport-lazy используйте `OLazyComponentV1` / `OLazyComponentNew`.

### SSR и hydration

Nuxt рендерит HTML на сервере (SSR), затем «оживляет» его на клиенте (hydration).

Практические следствия:

1. **`onMounted`** — выполняется только на клиенте (безопасно для `window`, `document`)
2. **`useAsyncFetch` с `server: true`** — данные загружаются на сервере и вшиваются в HTML
3. **`process.client`** — проверка, что код на клиенте:

```typescript
if (process.client) {
  toast.success("...");
}
```

> **Частая ошибка:** обращение к `window` или `localStorage` вне `onMounted` / `process.client` ломает SSR.

### `useHead` — управление `<head>`

```typescript
useHead({
  title: () => seoData.value?.seoTitle || "Spintime",
  meta: [
    { name: "description", content: () => seoData.value?.seoDescription }
  ],
  bodyAttrs: {
    id: "page-lobby-guest"  // для page-scoped глобальных стилей
  }
});
```

Функции `() => ...` нужны для **реактивных** meta-тегов.

### `definePageMeta`

Мета-информация страницы (middleware, layout):

```typescript
definePageMeta({
  middleware: ["route-guard"],
  layout: "auth"
});
```

В spintime чаще используют composable `useRouteGuard()` прямо в `<script setup>`.

---

## Middleware

Middleware выполняется **до** рендера страницы.

| Файл | Тип | Что делает |
|------|-----|------------|
| `request-handle-v2.global.ts` | global | SSR auth check, устанавливает `isGuest` |
| `translations.global.ts` | global | Загружает переводы |
| `stripMobileApp.global.ts` | global | `/mobile-app/*` → `?webview=true` |
| `route-guard.ts` | named | Редирект гостей (legacy, заменён `useRouteGuard`) |

`.global` в имени = выполняется на **каждом** маршруте.

---

## Плагины

Плагины (`plugins/`) инициализируют что-то один раз при старте приложения:

- `ga.client.ts` — Google Analytics
- `toastify.ts` — уведомления
- `supportChat.client.ts` — чат поддержки

Суффикс `.client.ts` = только на клиенте. `.server.ts` = только на сервере.

---

## Типичный flow разработки компонента

```
1. Создать .vue файл в нужной папке (molecules/ или organizms/)
2. Написать <script setup> с props, composables, computed
3. Собрать template из A*/M* компонентов
4. Добавить <style lang="scss" scoped>
5. Использовать в pages/*.vue без import (auto-import)
6. Проверить в браузере: pnpm dev:spintime
```

---

## Полезные ссылки

- [Vue 3 docs](https://vuejs.org/guide/introduction.html)
- [Nuxt 3 docs](https://nuxt.com/docs)
- Следующий раздел: [02 — Монорепозиторий и пакеты](02-monorepo-and-packages.md)
