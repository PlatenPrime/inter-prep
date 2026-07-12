# 02 — Монорепозиторий и пакеты

Как устроен монорепозиторий netgame, какие пакеты подключены к spintime и как они взаимодействуют.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Обзор монорепозитория

```
netgame/                         pnpm workspace, версия 2.117.0
├── apps/                        ~15 white-label приложений
│   ├── spintime/                ← наш бренд
│   ├── funrize/
│   ├── tao/
│   ├── vegasway/
│   └── ...
├── packages/                    shared-библиотеки
│   ├── ui/                      @netgame/ui
│   ├── composables/             @netgame/composables
│   ├── utils/                   @netgame/utils
│   ├── openapi/                 @netgame/openapi
│   ├── wheel/                   @netgame/wheel
│   ├── support-chat/            @netgame/support-chat
│   └── virtual-scroll-list/
├── cash/                        платёжный модуль
│   ├── cash-USA-new/            ядро (Vue 3 + Vuex)
│   ├── spintime/                брендовые override'ы
│   └── funrize/, tao/, ...
├── package.json                 корневые скрипты
└── pnpm-workspace.yaml
```

**Менеджер пакетов:** pnpm (не npm, не yarn). Workspace-ссылки позволяют apps импортировать packages без публикации в npm.

---

## Команды разработки

### Из корня репозитория

```bash
pnpm dev:spintime          # Запуск dev-сервера spintime
pnpm dev:funrize           # Другой бренд (для сравнения)
pnpm dev:ui                # Showcase UI-компонентов

pnpm build:packages        # Сборка всех packages (нужно после изменений в packages/)
pnpm build:spintime        # Production build spintime

pnpm lint                  # ESLint по всему монорепо
pnpm prettier              # Форматирование
pnpm typecheck             # TypeScript check всех apps
pnpm test                  # Тесты
pnpm generate              # Регенерация OpenAPI типов
```

### Из папки app/package

```bash
cd apps/spintime
pnpm test:vitest           # Тесты конкретного app
vitest run                 # Однократный запуск
```

> **Важно:** после изменений в `packages/ui`, `packages/composables` или `packages/utils` нужно выполнить `pnpm build:packages`, иначе apps могут не увидеть изменения.

---

## Nuxt modules spintime

Каждый app подключает shared-пакеты как Nuxt modules в `nuxt.config.ts`:

```typescript
modules: [
  "@netgame/ui",           // UI-компоненты (auto-import)
  "@netgame/utils",        // Утилиты (auto-import)
  "~/cashModule",          // App-local: Apple Pay routes
  "@netgame/composables",  // Composables + stores (auto-import)
  "@netgame/wheel",        // Колесо фортуны
  "@pinia/nuxt",           // State management
  "@nuxtjs/i18n",          // Переводы
  // ...
]
```

### Как module регистрирует код

**`@netgame/ui`** (`packages/ui/nuxt.ts`):

```typescript
addComponentsDir({ path: "atoms", global: true });
addComponentsDir({ path: "molecules", global: true });
// → AButton, MGameCard доступны в template без import
```

**`@netgame/composables`** (`packages/composables/nuxt.ts`):

```typescript
addImportsDir(join(__dirname, "src"));
// → useIsGuest, useOpenGame, useAsyncFetch доступны без import
```

**`@netgame/utils`** (`packages/utils/nuxt.ts`):

```typescript
addImportsDir(join(__dirname, "src"));
// → numberFormat, validateEmail, getImg доступны без import
```

---

## Path aliases

Определены в `nuxt.config.ts` spintime:

| Alias | Путь | Назначение |
|-------|------|------------|
| `~/` | `apps/spintime/` | Корень приложения |
| `@/` | `apps/spintime/` | То же |
| `@currentProject` | `cash/spintime/` | Брендовые cash-компоненты |
| `@modules/cash` | `cash/cash-USA-new/` | Ядро cash-модуля |
| `@modules` | `cash/` | Весь cash |

Примеры использования:

```typescript
import type { GameItem } from "~/types";
import LazyOModalGame from "~/organizms/OModal/Game/index.vue";
// В cash-модуле:
import Deposit from "@currentProject/components/Deposit.vue";
import { createCash } from "@modules/cash";
```

---

## Пакет `@netgame/ui`

**Путь:** `packages/ui/`

| Папка | Содержимое |
|-------|------------|
| `atoms/` | ~55 примитивов: `AButton`, `AText`, `AInput`, `ASlider`, `APicture` |
| `atoms/animations/` | ~40 анимаций: `AAnimationSpin`, `AAnimationConfetti` |
| `molecules/` | ~31 молекула: `MInput`, `MGameCard`, `MTabs`, `MCarousel` |
| `organizms/` | 4 shared: `OLazyComponentNew`, `ODynamicAdModal` |
| `assets/scss/` | Темы брендов, breakpoints, mixins |
| `assets/icons/` | SVG-иконки по брендам |
| `pages/` | Showcase (живой каталог компонентов) |

**Темизация:** каждый бренд переопределяет CSS-переменные через SCSS mixin:

```scss
// packages/ui/assets/scss/spintime-config.scss
@mixin AButton {
  --a-button-primary-background: var(--chimoio);
}
```

Подключается в `nuxt.config.ts` через Vite `additionalData`.

---

## Пакет `@netgame/composables`

**Путь:** `packages/composables/src/` — ~294 composables, 48 Pinia stores.

### Категории composables

| Категория | Примеры | Назначение |
|-----------|---------|------------|
| Auth | `useIsGuest`, `useLogin`, `useLogout`, `useLoginGuard` | Авторизация |
| Games | `useOpenGame`, `useGamesCached`, `useGamesLoadMoreV1` | Игры |
| Home | `useHomeData`, `useHomeBanners`, `useHomePage` (app-level) | Главная |
| Cash | `useCashHelper`, `useQuickBuy`, `useGlobalBalance` | Платежи |
| Features | `useTournamentData`, `useDailyWheelModule`, `useBingoData` | Фичи |
| Sockets | `useSockets`, `useCentrifuge` | Real-time |
| Bootstrap | `useAppInitData`, `useTheme`, `useGeoBlock` | Инициализация |
| Data fetching | `useAsyncFetch`, `useRestEndpoint` | API |

### Pinia stores

| Store | Данные |
|-------|--------|
| `useAppInitStore` | Player, features, balance, config |
| `useHomeBannersStore` | Баннеры главной |
| `useQuickBuyStore` | Quick-buy пакеты |
| `useGeoBlockStoreV2` | Гео-блокировка |
| `useTermsStore` | Принятие terms |

Полный список: `packages/composables/src/stores/`.

### App-local composables spintime

`apps/spintime/composables/` — логика, специфичная для spintime:

| Composable | Назначение |
|------------|------------|
| `useHomePage` | Обёртка над `useHomeData` + banners + SEO |
| `useAppModals` | Реестр ~90 модалок |
| `useLoginData` / `useSignupData` | Auth-формы |
| `useT` | i18n wrapper |
| `useSTRCash` | Мост sockets → cash Vuex |
| `useLayoutEventHandlers` | Event bus → модалки |

---

## Пакет `@netgame/utils`

**Путь:** `packages/utils/src/` — чистые функции без Vue-зависимостей.

| Категория | Функции |
|-----------|---------|
| Validation | `validateEmail`, `validatePasswordMatch`, `validateUrl` |
| Numbers | `numberFormat`, `numberFormatWithSpaces`, `shortNumberFormatter` |
| Dates | `convertDateTimeFormat`, `secondsToDate`, `prepareDate` |
| Strings | `truncate`, `toPascalCase`, `toKebabCase` |
| Images | `getImg`, `getImgV2` |
| Analytics | `dispatchGAEvent`, `dispatchFBEvents` |
| Objects | `pick`, `omit`, `compact`, `chunkArray` |

Все auto-import'ятся — `import` не нужен.

---

## Пакет `@netgame/openapi`

**Путь:** `packages/openapi/`

Генерирует TypeScript-типы из OpenAPI-схемы бэкенда:

```bash
pnpm generate   # из корня — регенерация types
```

Использование:

```typescript
import type { v1, ExtractFromAPI } from "@netgame/openapi";
import { apiClient } from "@netgame/openapi";

const response = await apiClient({
  path: "/rest/app/init/",
  method: "get"
});
```

Типы приложения: `apps/spintime/types.ts` — обёртки над OpenAPI paths.

---

## Cash-модуль

Платежи — **отдельное Vue-приложение** (Vuex + vue-router), которое монтируется в DOM при открытии cash-модалки.

```
apps/spintime
    └── organizms/OModal/Cash.vue    ← монтирует cash app
            │
            ▼
cash/cash-USA-new/                   ← ядро (router, store, API)
    └── использует @currentProject → cash/spintime/  ← брендовые компоненты
```

**Конфиг в nuxt.config.ts:**

```typescript
cash: { baseFolder: "spintime" }
```

**Мост Nuxt ↔ Cash:**

- `window.$cash` — глобальный объект cash-приложения
- `useCashHelper()` — читает Vuex state
- `useSTRCash()` — слушает sockets, обновляет cash

Подробнее: [06 — Auth, модалки, cash](06-auth-modals-cash.md).

---

## API proxy

Клиентские запросы к `/rest/**` проксируются через Nitro:

```
Browser:  GET /rest/app/init/
    ↓
Nitro:    server/api/rest/[...].ts  →  useRestEndpoint  →  backend apiUrl
```

Настроено в `nuxt.config.ts` через `routeRules`:

```typescript
"/rest/**": { proxy: "/api/rest/**" }
```

Также проксируются: `/uploads/**`, `/login/**`, `/payments/**`, `/cash/payment/**`.

### Server-side caching

Некоторые эндпоинты кешируются на сервере (Redis / filesystem):

- `server/api/rest/static-info/` — статическая информация
- `server/api/rest/games/` — кеш игр
- `server/plugins/cache-home-page-html.ts` — HTML главной

---

## Layer: `@netgame/layer-raygun`

Spintime extends shared Nuxt layer:

```typescript
extends: ["@netgame/layer-raygun"]
```

Layer предоставляет error monitoring (Raygun) и общие server utilities. Конфиг layer'а наследуется автоматически.

---

## Runtime config

Секреты и настройки окружения — в `runtimeConfig` (`nuxt.config.ts`):

```typescript
runtimeConfig: {
  apiUrl: process.env.NUXT_API_URL,       // server-only
  public: {
    theme: "spintime",                     // доступно на клиенте
    gaId: "GTM-...",
    name: "Spintime"
  }
}
```

Доступ:

```typescript
const config = useRuntimeConfig();
config.public.theme;  // "spintime"
```

---

## Как white-label бренды отличаются

| Что общее | Что уникально per brand |
|-----------|------------------------|
| `packages/ui` atoms/molecules | SCSS-тема (`spintime-config.scss`) |
| `packages/composables` | `organizms/`, `molecules/` |
| `cash/cash-USA-new` ядро | `cash/spintime/` override'ы |
| Структура pages (index, lobby, library) | Конкретные компоненты и визуал |
| Auth flow, game modal, data fetching | Feature pages (tao: quest, funrize: races) |
| API endpoints | `nuxt.config.ts` (GA, chat keys) |

При разработке новой фичи: **сначала ищите в shared packages**, создавайте app-local только если фича уникальна для spintime.

---

## Следующий раздел

[03 — Каталог компонентов](03-component-catalog.md)
