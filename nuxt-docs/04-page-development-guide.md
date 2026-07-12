# 04 — Гайд по созданию страниц

Универсальный workflow: от макета в Figma до готовой страницы в spintime.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Общий процесс

```
Figma макет
    │
    ▼
1. Декомпозиция на секции
    │
    ▼
2. Поиск существующих компонентов
    │
    ▼
3. Определение: guest / auth / all
    │
    ▼
4. Создание pages/<route>.vue (скелет)
    │
    ▼
5. Подключение данных (composables, API)
    │
    ▼
6. Создание недостающих M*/O* компонентов
    │
    ▼
7. SEO + i18n
    │
    ▼
8. Адаптив + стили
    │
    ▼
9. Тестирование (guest/auth, mobile/desktop)
```

---

## Шаг 1: Декомпозиция макета

Разбейте макет на **независимые секции**. Каждая секция — потенциальный компонент.

Пример декомпозиции типичной guest-страницы:

```
┌─────────────────────────────┐
│  Header (OHeaderGuest)      │  ← layout, не страница
├─────────────────────────────┤
│  Hero Banner                │  → APicture / ABanner / OHomeBannerLight
├─────────────────────────────┤
│  Popular Games Grid         │  → MHomeGuestPopularGames (уже есть!)
├─────────────────────────────┤
│  Why Us Section             │  → MHomeGuestWhyUs (уже есть!)
├─────────────────────────────┤
│  Sign Up CTA Banner         │  → MHomeGuestBannerSignUp (уже есть!)
├─────────────────────────────┤
│  SEO Text                   │  → MHomeSeoText (уже есть!)
├─────────────────────────────┤
│  Footer (OFooterGuest)      │  ← layout, не страница
└─────────────────────────────┘
```

**Правило:** если секция уже есть на другой странице — **переиспользуйте** компонент, не копируйте.

---

## Шаг 2: Поиск существующих компонентов

### Чеклист поиска

- [ ] Grep по `apps/spintime/organizms/` и `molecules/`
- [ ] Grep по `packages/ui/molecules/` и `atoms/`
- [ ] Проверить аналогичную страницу в funrize/tao/vegasway
- [ ] Посмотреть UI showcase (`pnpm dev:ui`)

### Типичные соответствия макет → компонент

| Элемент макета | Компонент | Где |
|----------------|-----------|-----|
| Hero баннер (статичный) | `APicture` или `ABanner` | `packages/ui/atoms/` |
| Hero баннер (слайдер) | `OHomeBannerLight` | `organizms/O/Home/` |
| Сетка игр | `MHomeGuestPopularGames` + `MGameType` | `molecules/M/Home/Guest/` |
| Каталог с табами | `OGamesCatalog` | `organizms/O/Games/` |
| Кнопка CTA | `AButton` | `packages/ui/atoms/` |
| Текстовый блок | `AText` | `packages/ui/atoms/` |
| Форма (email, password) | `MEmailInput`, `MPasswordInput` | `packages/ui/molecules/` |
| Промо-карточки | `ACard` в `ASlider` | `packages/ui/atoms/` |
| SEO-текст | `MHomeSeoText` | `molecules/M/Home/` |
| Табы | `MTabs` | `packages/ui/molecules/` |

---

## Шаг 3: Определение аудитории

| Тип страницы | Паттерн | Пример |
|-------------|---------|--------|
| **Guest only** | Редирект залогиненных на `/lobby/` | `pages/index.vue` |
| **Auth only** | `useRouteGuard()` в `<script setup>` | `pages/lobby.vue`, `pages/library.vue` |
| **Все пользователи** | Без guard'ов | `pages/online-games.vue` |
| **Auth layout** | `<NuxtLayout name="auth">` | `pages/signin.vue` |
| **Feature flag** | `useRouteGuard({ condition: !flag })` | `pages/vip.vue` |

```typescript
// Guest only — редирект залогиненных
const isGuest = useIsGuest();
if (!isGuest.value) router.push("/lobby/");

// Auth only — редирект гостей
useRouteGuard();

// Feature-gated
const { rankLeagueIsActive } = useFeaturesIsActiveV2();
useRouteGuard({ condition: !rankLeagueIsActive.value });
```

---

## Шаг 4: Скелет страницы

### Шаблон: guest landing

```vue
<script lang="ts" setup>
import type { GameItem } from "~/types";

// --- Данные ---
const { homePageData, seoData } = useHomePage({ immediate: true });
const { t } = useT();

// --- SEO ---
useHead({
  title: () => seoData.value?.seoTitle || "Spintime",
  meta: [
    { name: "description", content: () => seoData.value?.seoDescription }
  ]
});

// --- API ---
const { data: games } = useAsyncFetch({
  path: "/rest/page/issues/popular-games/",
  method: "get",
  options: {
    immediate: true,
    server: true,
    cached: true,
    key: "guestGames"
  }
});

const popularGames = computed(() => games.value?.payload?.games);
</script>

<template>
  <NuxtLayout>
    <!-- Секции из макета -->
    <APicture
      class="my-banner"
      src="/nuxt-img/banners/my-page/banner-d.webp"
      srcset="/nuxt-img/banners/my-page/banner-m.webp"
      alt="Page banner"
    />

    <MHomeGuestPopularGames :popular-games="popularGames" />
  </NuxtLayout>
</template>

<style lang="scss" scoped>
.my-banner {
  display: block;
  width: 100%;
  margin-bottom: 32px;
  border-radius: 24px;
  overflow: hidden;

  @include media-breakpoint-down(md) {
    border-radius: 16px;
    margin-bottom: 24px;
  }
}
</style>
```

### Шаблон: auth-only page

```vue
<script lang="ts" setup>
useRouteGuard();
const { t } = useT();

useHead({
  title: () => t("seoInfo.myPage.title"),
  meta: [
    { name: "description", content: () => t("seoInfo.myPage.description") }
  ]
});
</script>

<template>
  <NuxtLayout>
  </NuxtLayout>
</template>
```

### Шаблон: auth page (signin/signup)

```vue
<script lang="ts" setup>
const { t } = useT();
const { email, password, handleLogin, loading } = useLoginData();

useHead({ title: () => t("signin.page.title") });
</script>

<template>
  <NuxtLayout name="auth" :title="t('signin.page.title')">
    <MEmailInput v-model="email" location-tid="signin-email" />
    <MPasswordInput v-model="password" location-tid="signin-password" />
    <MButton :loading="loading" data-tid="signin-submit" @click="handleLogin">
      {{ t("signin.submit") }}
    </MButton>
    <MSocialAuth />
  </NuxtLayout>
</template>
```

---

## Шаг 5: Подключение данных

### Какой composable использовать

| Нужные данные | Composable | API |
|---------------|------------|-----|
| SEO + scheme главной | `useHomePage({ immediate: true })` | `/rest/page/home/` |
| Популярные игры (guest) | `useAsyncFetch` | `/rest/page/issues/popular-games/` |
| Каталог игр | `useGamesLoadMoreV1()` | `/rest/games/` |
| Кеш игр (lobby sections) | `useGamesCached()` | `/rest/games/cached/` |
| Данные игрока | `useAppInitData()` / `useAppInitStore` | `/rest/app/init/` |
| Баннеры | `useHomeBanners()` | `/rest/banners/home/` |
| Статическая info | `useGetStaticInfoCached()` | `/rest/static-info/` |
| CMS-страница | `useAsyncFetch` | `/rest/page/:name/` |

### Паттерн useAsyncFetch

```typescript
const { data, pending, refresh } = useAsyncFetch({
  path: "/rest/page/issues/popular-games/",
  method: "get",
  options: {
    immediate: true,   // загрузить сразу
    server: true,      // загрузить на сервере (SSR)
    cached: true,      // кешировать результат
    key: "uniqueKey"   // уникальный ключ кеша
  }
});
```

Подробнее: [05 — Данные и состояние](05-data-fetching-and-state.md).

---

## Шаг 6: Создание новых компонентов

Если готового компонента нет — создайте по правилам из [03 — Каталог](03-component-catalog.md).

### Пример: новая molecule

```
molecules/M/MyFeature/MyBlock.vue  →  <MMyFeatureMyBlock />
```

```vue
<script lang="ts" setup>
interface Props {
  title: string;
  items: SomeType[];
}
defineProps<Props>();
const { t } = useT();
</script>

<template>
  <div class="my-block flex-column">
    <AText type="h2-light" :modifiers="['center']">{{ title }}</AText>
    <div class="my-block__grid">
      <MGameType
        v-for="(item, i) in items"
        :key="item.id"
        :game="item"
        :index-game="i"
        theme="spintime"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.my-block {
  padding: 32px 0;
  gap: 24px;

  @include media-breakpoint-down(md) {
    padding: 24px 0;
    gap: 16px;
  }

  &__grid {
    display: grid;
    grid-template-columns: repeat(9, 1fr);
    gap: 8px;

    @include media-breakpoint-down(lg) {
      grid-template-columns: repeat(4, 1fr);
    }
    @include media-breakpoint-down(md) {
      grid-template-columns: repeat(3, 1fr);
    }
  }
}
</style>
```

---

## Шаг 7: SEO и i18n

### SEO

Три паттерна (подробнее в [08 — i18n и SEO](08-i18n-and-seo.md)):

```typescript
// 1. API-driven (home, lobby)
const { seoData } = useHomePage({ immediate: true });
useHead({ title: () => seoData.value?.seoTitle });

// 2. i18n keys (library, issues)
useHead({ title: () => t("seoInfo.library.title") });

// 3. Static fallback
useHead({ title: "My Page | Spintime" });
```

### i18n

```vue
<AText>{{ t("myPage.section.title") }}</AText>
```

Ключи переводов хранятся на бэкенде и загружаются через `/api/rest/translations/en`. Добавление новых ключей — задача backend/контента.

---

## Шаг 8: Адаптив и стили

1. **Mobile-first не используется** — пишите desktop-стили, затем `@include media-breakpoint-down(md)`
2. Картинки: desktop/mobile в `public/nuxt-img/`, подключение через `APicture`
3. Для JS-логики (не CSS): `const { isMobile, isDesktop } = useDevice()`

Подробнее: [07 — Стили и адаптив](07-styling-and-responsive.md).

---

## Шаг 9: Тестирование

### Чеклист перед PR

- [ ] Страница открывается без ошибок в консоли
- [ ] Guest flow: страница корректна для неавторизованного
- [ ] Auth flow: редиректы работают (guest → `/`, user → `/lobby/`)
- [ ] Mobile (375px) и desktop (1440px) — вёрстка не ломается
- [ ] `data-tid` на всех `AButton` и `NuxtLink`
- [ ] SEO: title и description в `<head>`
- [ ] Переводы: нет захардкоженных строк (всё через `t()`)
- [ ] `pnpm lint` — нет ошибок

---

## Референсные страницы spintime

| Задача | Смотреть файл |
|--------|---------------|
| Минимальная guest landing | `pages/online-games.vue` |
| Полная guest home | `pages/index.vue` |
| Auth home с секциями | `pages/lobby.vue` |
| Каталог с фильтрами | `pages/library.vue` |
| Auth форма | `pages/signin.vue` |
| Промо-страница | `pages/promotions.vue` |
| CMS-контент | `pages/page/[name].vue` |
| SEO-статья (guest) | `pages/rubric/[name].vue` |

---

## Следующий раздел

[05 — Данные и состояние](05-data-fetching-and-state.md)
