# Архитектура spintime — точка входа

Документация для разработчиков, которые работают над приложением **spintime** в монорепозитории netgame. Особенно полезна, если вы новичок во Vue/Nuxt: здесь объясняется не только «что где лежит», но и **как думать** при добавлении новых страниц и функционала.

> Команды сборки, lint и тестов — в корневом [`CLAUDE.md`](../../CLAUDE.md).

---

## Содержание

| Документ | О чём |
|----------|-------|
| [01 — Vue/Nuxt в этом проекте](docs/01-vue-nuxt-in-this-project.md) | Базовые концепции Vue 3 и Nuxt 3 в контексте репозитория |
| [02 — Монорепозиторий и пакеты](docs/02-monorepo-and-packages.md) | Структура `apps/`, `packages/`, `cash/`, модули, алиасы |
| [03 — Каталог компонентов](docs/03-component-catalog.md) | `A*` / `M*` / `O*`, shared UI, app-local компоненты |
| [04 — Гайд по созданию страниц](docs/04-page-development-guide.md) | Workflow от макета до готовой страницы |
| [05 — Данные и состояние](docs/05-data-fetching-and-state.md) | API, composables, stores, sockets |
| [06 — Auth, модалки, cash](docs/06-auth-modals-cash.md) | Авторизация, модальные окна, платежи |
| [07 — Стили и адаптив](docs/07-styling-and-responsive.md) | SCSS, breakpoints, изображения |
| [08 — i18n и SEO](docs/08-i18n-and-seo.md) | Переводы, meta-теги |

---

## Быстрый старт

```bash
# Из корня монорепозитория
pnpm dev:spintime    # dev-сервер spintime (обычно localhost:3000)
pnpm build:packages  # если меняли shared-пакеты
pnpm typecheck       # проверка типов во всех apps
pnpm lint            # ESLint
```

**Showcase UI-библиотеки** (живые примеры кнопок, баннеров, карточек игр):

```bash
pnpm dev:ui   # packages/ui — внутренний каталог компонентов
```

---

## Что такое spintime в этом репозитории

Spintime — один из **white-label** сайтов социального казино. Все бренды (funrize, tao, vegasway, spintime и др.) разделяют:

- общую UI-библиотеку (`@netgame/ui`)
- общую бизнес-логику (`@netgame/composables`)
- общий платёжный модуль (`cash/`)
- типизированный API-клиент (`@netgame/openapi`)

При этом у каждого бренда свой набор **страниц**, **organizms**, **molecules**, **composables** и **тема оформления**.

```
netgame/                          ← корень монорепозитория
├── apps/
│   └── spintime/                 ← ВЫ РАБОТАЕТЕ ЗДЕСЬ
│       ├── pages/                ← маршруты (file-based routing)
│       ├── layouts/              ← оболочки страниц
│       ├── organizms/            ← крупные секции (O*)
│       ├── molecules/            ← блоки UI (M*)
│       ├── composables/          ← логика spintime
│       ├── middleware/           ← route middleware
│       ├── server/               ← Nitro API (прокси, кеш)
│       ├── public/nuxt-img/      ← статические картинки
│       └── nuxt.config.ts
├── packages/
│   ├── ui/                       ← A*, M* (shared)
│   ├── composables/              ← useIsGuest, useOpenGame, ...
│   ├── utils/                    ← numberFormat, validateEmail, ...
│   └── openapi/                  ← типы API
└── cash/
    ├── cash-USA-new/             ← ядро платежей
    └── spintime/                 ← брендовые override'ы
```

---

## Структура папок spintime

| Папка | Назначение | Пример |
|-------|------------|--------|
| `pages/` | Одна страница = один файл = один URL | `pages/online-games.vue` → `/online-games/` |
| `layouts/` | Общая оболочка: header, footer, slot | `default.vue`, `auth.vue` |
| `organizms/` | Крупные самостоятельные блоки | `O/Home/BannerLight.vue` |
| `molecules/` | Меньшие переиспользуемые блоки | `M/Home/Guest/PopularGames.vue` |
| `composables/` | Логика, привязанная к spintime | `useHomePage.ts`, `useAppModals.ts` |
| `middleware/` | Код до рендера страницы | `request-handle-v2.global.ts` |
| `server/` | Серверные API-роуты Nitro | `api/rest/[...].ts` |
| `types.ts` | TypeScript-типы приложения | OpenAPI-derived |
| `public/` | Статика без обработки | баннеры, favicon |

**Важно:** в spintime **нет** локальной папки `atoms/`. Атомы (`AButton`, `AText`, `APicture`) приходят из `@netgame/ui` и auto-import'ятся глобально.

---

## Atomic Design: A → M → O

Проект использует модифицированный [Atomic Design](https://bradfrost.com/blog/post/atomic-web-design/):

```
A* (atoms)      — примитивы: кнопка, текст, input, картинка
    ↓
M* (molecules)  — связка атомов: поле email, карточка игры, табы
    ↓
O* (organizms)  — целые секции: баннер-слайдер, каталог игр, header
```

| Префикс | Где живёт | Кто использует |
|---------|-----------|----------------|
| `A*` | `packages/ui/atoms/` | Все бренды |
| `M*` (shared) | `packages/ui/molecules/` | Все бренды (`MGameCard`, `MInput`) |
| `M*` (app) | `apps/spintime/molecules/` | Только spintime |
| `O*` (app) | `apps/spintime/organizms/` | Только spintime |

### Куда класть новый код

```
Нужен примитив для ВСЕХ брендов?     → packages/ui/atoms/
Нужна форма/карточка для ВСЕХ?       → packages/ui/molecules/
Блок UI, специфичный для spintime?   → apps/spintime/molecules/M/<Domain>/
Целая секция страницы?               → apps/spintime/organizms/O/<Domain>/
Модальное окно?                      → apps/spintime/organizms/OModal/<Feature>/
Логика без UI?                       → apps/spintime/composables/
```

Подробнее: [03 — Каталог компонентов](docs/03-component-catalog.md).

---

## Auto-import имён компонентов

Nuxt **сам** регистрирует компоненты из `organizms/` и `molecules/` — писать `import` в шаблоне не нужно.

Путь файла определяет имя тега:

| Файл | Тег в template |
|------|----------------|
| `organizms/O/Home/BannerLight.vue` | `<OHomeBannerLight />` |
| `molecules/M/Home/Guest/PopularGames.vue` | `<MHomeGuestPopularGames />` |
| `organizms/OModal/Game/index.vue` | `<LazyOModalGame />` (с префиксом `Lazy`) |

> **Неочевидно:** папка `molecules/M/` — это **домен** (Home, Game, Promotion), а **не** «mobile». Мобильная вёрстка делается через SCSS breakpoints, а не через отдельные папки.

---

## Жизненный цикл запроса страницы

```
Браузер запрашивает URL
        │
        ▼
middleware/request-handle-v2.global.ts   ← SSR: проверка auth, isGuest
        │
        ▼
middleware/translations.global.ts          ← загрузка переводов
        │
        ▼
app.vue                                  ← глобальная инициализация, модалки, sockets
        │
        ▼
layouts/default.vue (или auth)           ← header, footer, main slot
        │
        ▼
pages/<route>.vue                        ← тонкий контроллер: данные + композиция O*/M*
        │
        ▼
organizms / molecules / @netgame/ui      ← UI-блоки
```

### Типичная страница — «тонкий контроллер»

Страница **не** содержит разметку целиком. Она:

1. Проверяет доступ (`useRouteGuard`, `useIsGuest`)
2. Загружает данные (composables)
3. Настраивает SEO (`useHead`)
4. Собирает готовые компоненты в `<template>`

Пример — `pages/online-games.vue`:

```vue
<script lang="ts" setup>
const { homePageData } = useHomePage({ immediate: true });

const { data: games } = useAsyncFetch({
  path: "/rest/page/issues/popular-games/",
  method: "get",
  options: { immediate: true, server: true, cached: true, key: "guestGames" }
});

const popularGames = computed(() => games.value?.payload?.games);
</script>

<template>
  <NuxtLayout>
    <APicture src="..." srcset="..." alt="Online games" />
    <MHomeGuestPopularGames :popular-games="popularGames" />
  </NuxtLayout>
</template>
```

---

## Основные маршруты spintime

| URL | Файл | Для кого |
|-----|------|----------|
| `/` | `pages/index.vue` | Guest home (редирект на `/lobby/` если залогинен) |
| `/lobby/` | `pages/lobby.vue` | Авторизованный home |
| `/online-games/` | `pages/online-games.vue` | Guest landing |
| `/library/` | `pages/library.vue` | Каталог игр (`?category=`) |
| `/signin/`, `/signup/` | `pages/signin.vue`, `signup.vue` | Auth (layout `auth`) |
| `/promotions/` | `pages/promotions.vue` | Промо-акции |
| `/game/` | `pages/game/index.vue` | **Аккаунт**, не геймплей! |
| `/page/[name]/` | `pages/page/[name].vue` | CMS-страницы (terms, privacy) |
| `/rubric/[name]/` | `pages/rubric/[name].vue` | SEO-статьи для гостей |

> **Частая ошибка:** `pages/game/` — это страница **профиля/аккаунта**, а не запуск игры. Игры открываются через модалку `OModal/Game` и composable `useOpenGame()`.

---

## Nuxt modules spintime

Из `nuxt.config.ts`:

| Module | Что даёт |
|--------|----------|
| `@netgame/ui` | Все `A*` и shared `M*` компоненты |
| `@netgame/composables` | `useIsGuest`, `useOpenGame`, `useAsyncFetch`, stores |
| `@netgame/utils` | `numberFormat`, `validateEmail`, `getImg`, ... |
| `~/cashModule` | Серверные роуты Apple Pay |
| `@netgame/wheel` | Колесо фортуны |
| `@pinia/nuxt` | Pinia stores |
| `@nuxtjs/i18n` | Интернационализация |
| `@nuxtjs/device` | `useDevice()` — isMobile, isDesktop |
| `@nuxt/image-edge` | `NuxtImg`, оптимизация картинок |

---

## Чеклист: новая страница за 10 шагов

1. **Найти похожую страницу** в spintime или другом бренде (`funrize`, `tao`)
2. **Декомпозировать макет** на секции → искать готовые `O*` / `M*` компоненты
3. **Создать** `pages/<route>.vue` по шаблону из [04 — Гайд](docs/04-page-development-guide.md)
4. **Определить аудиторию:** guest / auth-only / все → `useRouteGuard()` или редирект
5. **Подключить данные:** `useAsyncFetch`, `useHomePage` или app-composable
6. **Настроить SEO:** `useHead({ title, meta })` — API или `t("seoInfo.*")`
7. **Вынести UI** в `molecules/` или `organizms/`, если блок переиспользуемый
8. **Стили:** `<style lang="scss" scoped>` + breakpoints; картинки в `public/nuxt-img/`
9. **Переводы:** `t("ключ")` через `useT()`; ключи добавляются в backend translations
10. **Проверить:** guest + logged-in, mobile + desktop, ESLint (`data-tid` на кнопках и ссылках)

---

## Частые ошибки новичка

| Ошибка | Правильно |
|--------|-----------|
| Думать, что `molecules/M/` = mobile | `M/` = домен (Home, Game). Адаптив — через SCSS |
| Искать геймплей в `pages/game/` | Геймплей — модалка `useOpenGame()` → `OModal/Game` |
| Писать `import AButton from ...` | Компоненты auto-import'ятся, import не нужен |
| Использовать `useFetch` из Nuxt | В проекте — `useAsyncFetch` из `@netgame/composables` |
| Класть всю вёрстку в `pages/*.vue` | Страница = контроллер; UI → `molecules/` / `organizms/` |
| Создавать новый компонент без поиска | Сначала grep по `organizms/` и `packages/ui/` |
| Забыть `data-tid` на `AButton` и `NuxtLink` | ESLint rule `require-data-tid` |
| Дублировать логику в странице | Вынести в composable (`composables/` или shared) |

---

## Где искать примеры

| Задача | Смотреть |
|--------|----------|
| Guest landing | `pages/index.vue`, `pages/online-games.vue` |
| Auth home | `pages/lobby.vue` |
| Каталог игр | `pages/library.vue`, `organizms/O/Games/` |
| Авторизация | `pages/signin.vue`, `composables/useLoginData.ts` |
| Баннер-слайдер | `organizms/O/Home/BannerLight.vue` |
| Карточка игры | `molecules/M/Game/Type.vue` → shared `MGameCard` |
| Модалки | `composables/useAppModals.ts`, `organizms/OModals.vue` |
| Shared UI showcase | `packages/ui/pages/` (после `pnpm dev:ui`) |

---

## Связь с другими брендами

Spintime следует тем же паттернам, что funrize, tao, vegasway. Отличия — в визуале (`organizms/`, `molecules/`, SCSS-тема `spintime-config.scss`) и наборе фич. При разработке новой страницы полезно **свериться с аналогом** в другом бренде:

```bash
# Найти promotions.vue во всех apps
ls apps/*/pages/promotions.vue
```

---

## Дальше

Начните с [01 — Vue/Nuxt в этом проекте](docs/01-vue-nuxt-in-this-project.md), если Vue/Nuxt вам новы. Если уже знакомы — переходите сразу к [04 — Гайд по созданию страниц](docs/04-page-development-guide.md).
