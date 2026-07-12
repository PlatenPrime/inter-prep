# 05 — Данные и состояние

Как загружать данные, управлять состоянием и работать с API в spintime.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Обзор потока данных

```
                    ┌──────────────────┐
                    │  /rest/app/init/ │
                    └────────┬─────────┘
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       useAsyncFetch    useAppInitStore   useTheme
              │              │
              ▼              ▼
         SSR payload    Pinia (player,
         (cached)       features, balance)
                             │
              ┌──────────────┼──────────────┐
              ▼              ▼              ▼
       useGlobalBalance  useSockets    window.$cash
       (computed)        (real-time)   (Vuex cash)
```

---

## useAsyncFetch — основной способ загрузки

В проекте **не используется** стандартный Nuxt `useFetch`. Вместо него — `useAsyncFetch` из `@netgame/composables`, обёртка над кастомным `useAsync` с OpenAPI-типизацией.

### Базовое использование

```typescript
const { data, pending, refresh, error } = useAsyncFetch({
  path: "/rest/page/issues/popular-games/",
  method: "get",
  options: {
    immediate: true,    // начать загрузку сразу
    server: true,       // выполнить на сервере (SSR)
    cached: true,       // кешировать между запросами
    key: "guestGames"  // уникальный ключ кеша
  }
});
```

### Опции

| Опция | Тип | Назначение |
|-------|-----|------------|
| `immediate` | `boolean` | Загрузить при создании (default: `true`) |
| `server` | `boolean` | Выполнить на сервере при SSR |
| `cached` | `boolean` | Дедупликация и кеширование запросов |
| `key` | `string` | Уникальный ключ для кеша (обязателен с `cached`) |
| `watch` | `array` | Перезагрузить при изменении зависимостей |

### С параметрами и POST

```typescript
const { data } = useAsyncFetch({
  path: "/rest/player/favorites/add/",
  method: "post",
  options: {
    body: { gameId: 123 },
    immediate: false  // вызвать вручную через execute()
  }
});
```

### fetchOptions — колбэки

```typescript
const { data } = useAsyncFetch({
  path: "/rest/app/init/",
  method: "get",
  options: { cached: true },
  fetchOptions: {
    onResponse: ({ response }) => {
      // обработка ответа
    },
    onResponseError: ({ response }) => {
      // обработка ошибки
    }
  }
});
```

> **Неочевидно:** `data` — это `Ref`, доступ через `data.value`. В template Vue разворачивает ref автоматически: `{{ data.payload }}`.

---

## apiClient — императивные запросы

Для запросов вне реактивного контекста (в обработчиках, stores):

```typescript
import { apiClient } from "@netgame/openapi";

const response = await apiClient({
  path: "/rest/available-sets/check/",
  method: "get",
  options: { query: { limit: 5 } }
});
```

Используется в Pinia stores и app-composables (например, `useAppGetTournamentsData.ts`).

---

## Ключевые composables для данных

### useAppInitData — инициализация приложения

Центральный запрос. Загружает данные игрока, feature flags, config.

```typescript
const { data: appInit, refresh: fetchAppInit } = useAppInitData({
  immediate: true
});
```

Данные синхронизируются в `useAppInitStore` (Pinia). Доступ:

```typescript
const appInitStore = useAppInitStore();
const player = computed(() => appInitStore.data?.player);
const balance = computed(() => appInitStore.data?.balance);
```

Вызывается в `app.vue` при старте и после login/logout.

### useHomePage — данные главной (spintime)

App-local composable, обёртка над shared `useHomeData`:

```typescript
const { homePageData, banners, seoData, jackpotGames, refresh } = useHomePage({
  immediate: true
});
```

| Поле | Содержимое |
|------|------------|
| `homePageData` | Scheme sections, конфигурация секций |
| `banners` | Баннеры (home + preset package) |
| `seoData` | SEO title, description, keywords |
| `jackpotGames` | Игры для jackpot-секции |

### useGamesCached — кеш игр

```typescript
const { data: gamesCached, select } = useGamesCached();
```

- `gamesCached.schemeSections` — секции игр для lobby (`OHomeSectionGames`)
- `select(gameIds)` — получить объекты игр по ID

### useGamesLoadMoreV1 — пагинация каталога

```typescript
const { games, loadMore, hasMore, pending } = useGamesLoadMoreV1({
  category: "all-games",
  limit: 24
});
```

Используется на `pages/library.vue` и в `OGamesCatalog`.

### useHomeBanners — баннеры

```typescript
const { banners, allBanners, refresh } = useHomeBanners();
```

Данные из Pinia `useHomeBannersStore` → `GET /rest/banners/home/`.

---

## Pinia stores

### Когда использовать store vs useState vs ref

| Инструмент | Когда | Пример |
|------------|-------|--------|
| `ref` / `computed` | Локальное состояние компонента | `const isOpen = ref(false)` |
| `useState` | Shared UI-флаг между компонентами | `useState("show-catalog-games")` |
| Pinia store | Данные из API, переживают навигацию | `useAppInitStore()` |

### Основные stores

| Store | Данные | Обновляется из |
|-------|--------|----------------|
| `useAppInitStore` | Player, balance, features, config | `useAppInitData`, sockets |
| `useHomeBannersStore` | Home banners | `useHomeBanners` |
| `useQuickBuyStore` | Quick-buy packages | API + sockets |
| `useGeoBlockStoreV2` | Geo block state | `useGeoBlock` |
| `useTermsStore` | Terms acceptance | API |
| `useTournamentsStore` | Tournaments cache | API + sockets |
| `useUserProfileStore` | Profile data | API |

### Пример работы со store

```typescript
import { useAppInitStore } from "@netgame/composables/src/stores/useAppInitStore";

const appInitStore = useAppInitStore();

// Чтение
const isLoggedIn = computed(() => !appInitStore.data?.isGuest);
const playerName = computed(() => appInitStore.data?.player?.name);

// Запись (обычно через composable, не напрямую)
await appInitStore.setAppInitData(response.data);
```

---

## useState — shared UI state

```typescript
// Объявление (в любом компоненте/composable)
const isCatalogGames = useState<boolean>("show-catalog-games", () => false);

// Использование в другом компоненте (тот же ключ)
const isCatalogGames = useState<boolean>("show-catalog-games");
```

### Распространённые useState ключи в spintime

| Ключ | Назначение |
|------|------------|
| `show-catalog-games` | Показать каталог игр на home |
| `isShowGameModal` | Game modal открыта |
| `isCaptchaLoaded` | Captcha SDK загружен |
| `popUpAds` | Очередь popup-рекламы |
| `refCode` | Реферальный код из URL |
| `headerHeight` | Высота header (для sticky) |
| `isFixedNavGames` | Sticky навигация каталога |

---

## API proxy и server routes

### Клиентский запрос

```
Browser: GET /rest/app/init/
    ↓ (routeRules proxy)
Nitro:   GET /api/rest/app/init/
    ↓ (useRestEndpoint)
Backend: GET {apiUrl}/rest/app/init/
```

### Server-side caching

Некоторые эндпоинты кешируются на уровне Nitro:

| Route | Файл | Кеш |
|-------|------|-----|
| `/api/rest/static-info/` | `server/api/rest/static-info/index.ts` | Redis SWR |
| `/api/rest/games/` | `server/games/get-cached-games.ts` | Redis |
| Home page HTML | `server/plugins/cache-home-page-html.ts` | Filesystem |

---

## WebSocket / Real-time

### useSockets — центральная шина событий

```typescript
const { add } = useSockets();

add("balance", (detail) => {
  // обновить баланс
});

add("invite", (detail) => {
  // показать toast
});
```

### Основные socket-события

| Событие | Что происходит |
|---------|----------------|
| `balance` | Обновление баланса (coins/sweeps) |
| `cash` | Cash-транзакция завершена |
| `deposit` | Депозит обработан |
| `invite` | Реферальное уведомление |
| `popupAds` | Серверная реклама |
| `terms` | Обновление terms |
| `tournament` | Турнирные события |

### useCentrifuge

WebSocket-клиент для real-time каналов. Подключается на основе данных из `appInit`.

---

## OpenAPI типы

### Генерация

```bash
pnpm generate   # из корня монорепозитория
```

Схема: `packages/openapi/src/schemas/v1.json` → `v1.generated.ts`.

### Использование типов

```typescript
// apps/spintime/types.ts — app-level types
import type { v1, ExtractFromAPI } from "@netgame/openapi";

type GameItem = ExtractFromAPI<v1.paths, "/rest/games/", "get">;
```

В компонентах:

```typescript
import type { GameItem } from "~/types";
```

---

## Паттерны по типу страницы

### Guest home (index.vue)

```typescript
useHomePage({ immediate: true });          // SEO + scheme
useAsyncFetch({ path: "/rest/page/issues/popular-games/" });  // игры
useIsGuest() → redirect to /lobby/         // guard
```

### Lobby (lobby.vue)

```typescript
useRouteGuard();                           // auth only
useHomePage();                             // sections data
useGamesCached();                          // game sections
// OHomeSectionGames :itemSection="0..6"  // dynamic sections
```

### Library (library.vue)

```typescript
useRouteGuard();
useGamesLoadMoreV1({ category });          // paginated games
// query param: ?category=all-games|favorites|providers
```

### CMS page (page/[name].vue)

```typescript
const route = useRoute();
useAsyncFetch({
  path: `/rest/page/${route.params.name}/`,
  method: "get"
});
```

---

## Частые ошибки

| Ошибка | Правильно |
|--------|-----------|
| `useFetch` из Nuxt | `useAsyncFetch` из composables |
| Забыть `key` при `cached: true` | Всегда указывать уникальный `key` |
| Читать API в `onMounted` без SSR | `server: true` + `immediate: true` |
| Дублировать данные из store в ref | Использовать `computed` от store |
| Мутировать store напрямую | Через actions/composables |

---

## Следующий раздел

[06 — Auth, модалки, cash](06-auth-modals-cash.md)
