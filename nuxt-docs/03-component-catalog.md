# 03 — Каталог компонентов

Практический справочник: какие компоненты есть, когда какой использовать и куда класть новый код.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Три слоя компонентов

```
┌─────────────────────────────────────────────────────┐
│  O* (organizms)  — целые секции страницы            │
│  OHomeBannerLight, OGamesCatalog, OModal/Game       │
├─────────────────────────────────────────────────────┤
│  M* (molecules)  — блоки UI                         │
│  MGameType, MHomeGuestPopularGames, MInput          │
├─────────────────────────────────────────────────────┤
│  A* (atoms)      — примитивы                        │
│  AButton, AText, APicture, ASlider                  │
└─────────────────────────────────────────────────────┘
```

| Слой | Shared (`packages/ui`) | App-local (`apps/spintime`) |
|------|------------------------|----------------------------|
| Atoms | `AButton`, `AText`, `AInput`, `APicture` | — (нет локальных atoms) |
| Molecules | `MInput`, `MGameCard`, `MTabs` | `MGameType`, `MHomeGuestPopularGames` |
| Organizms | `OLazyComponentNew` | `OHomeBannerLight`, `OGamesCatalog` |

---

## Decision tree: куда положить новый компонент

```
Нужен UI-элемент?
│
├─ Примитив (кнопка, текст, input)?
│   └─ Уже есть A* в packages/ui? → Используй его
│       Нет и нужен ВСЕМ брендам? → packages/ui/atoms/
│
├─ Блок из 2-5 элементов (форма, карточка, таб)?
│   └─ Уже есть M* в packages/ui? → Используй его
│       Нет и нужен ВСЕМ брендам? → packages/ui/molecules/
│       Специфичен для spintime? → molecules/M/<Domain>/
│
├─ Целая секция страницы (баннер, каталог, header)?
│   └─ organizms/O/<Domain>/
│
├─ Модальное окно?
│   └─ organizms/OModal/<Feature>/
│       + зарегистрировать в composables/useAppModals.ts
│
└─ Только логика, без UI?
    └─ composables/ (app) или packages/composables/ (shared)
```

---

## Shared atoms (A*) — топ компонентов

### Кнопки и действия

| Компонент | Когда использовать | Ключевые props |
|-----------|-------------------|----------------|
| `AButton` | Любая кнопка/CTA | `variant` (primary, ghost, outline), `size` (xl, lg, md, s, xs) |
| `AIconButton` | Кнопка-иконка | `icon`, `size` |
| `MButton` | Кнопка с loading-состоянием | `loading: boolean` → обёртка над `AButton` |

```vue
<AButton variant="primary" size="lg" data-tid="signup-cta" @click="handleSignup">
  Sign Up
</AButton>
```

> **Обязательно:** `data-tid` на `AButton` — ESLint rule `require-data-tid`.

### Текст и типографика

| Компонент | Когда использовать | Ключевые props |
|-----------|-------------------|----------------|
| `AText` | Любой текст с фирменным стилем | `variant` (tucson, tokio, tempe...), `modifiers` (bold, center, uppercase) |

```vue
<AText variant="tucson" :modifiers="['bold', 'center']">
  {{ t("home.guest.popular.games") }}
</AText>
```

В spintime также используется prop `type` (например `type="h1-light"`) — это app-level override через SCSS.

### Изображения

| Компонент | Когда использовать | Особенности |
|-----------|-------------------|-------------|
| `APicture` | Простой responsive `<picture>` (desktop/mobile) | `src`, `srcset`, `alt` — без CDN-оптимизации |
| `NuxtImg` | Оптимизированные картинки (webp, lazy, sizes) | Через `@nuxt/image-edge` |
| `ANuxtImgOptimized` | CDN-оптимизация через `getImgV2` | Для игровых/баннерных изображений |
| `ABanner` | Hero-баннер с overlay-контентом | `imgAttrs`, `sources`, slot для текста/кнопок |

```vue
<!-- Статический баннер (online-games.vue) -->
<APicture
  src="/nuxt-img/banners/online-games/banner-d.webp"
  srcset="/nuxt-img/banners/online-games/banner-m.webp"
  alt="Online games"
/>

<!-- Hero с контентом -->
<ABanner :img-attrs="{ src: '/img/banner-d.webp', format: 'webp' }"
         :sources="[{ srcset: mobileUrl, media: '(max-width: 767px)' }]">
  <AText variant="tucson">Welcome!</AText>
  <AButton variant="primary" data-tid="banner-cta">Play Now</AButton>
</ABanner>
```

### Слайдеры и скролл

| Компонент | Engine | Когда |
|-----------|--------|-------|
| `ASlider` | Keen Slider | Промо-карусель, баннер-слайдер |
| `MHorizontalScrollV1` | Native scroll + JS | Ряд игр с auto-scroll |
| `MCarousel` | Custom 3D CSS | Cover-flow карусель |
| `AHorizontalScroll` | Drag/momentum | Низкоуровневый горизонтальный скролл |

```vue
<ASlider v-slot="{ slider }" :options="{ loop: true, slides: { perView: 'auto' } }">
  <div v-for="item in banners" :key="item.id" class="keen-slider__slide">
    ...
  </div>
</ASlider>
```

> **Неочевидно:** дочерние элементы `ASlider` **обязаны** иметь класс `keen-slider__slide`.

### Feedback

| Компонент | Назначение |
|-----------|------------|
| `ASkeleton` / `ASkeletonAdaptive` | Placeholder при загрузке |
| `ABadge` | Метки на баннерах/карточках |
| `AOverlay` | Backdrop для модалок/drawer |
| `APopper` | Tooltip, dropdown |

---

## Shared molecules (M*) — топ компонентов

### Формы

| Компонент | Назначение | Особенности |
|-----------|------------|-------------|
| `MInput` | Текстовое поле | `v-model`, `location-tid` → `data-tid` |
| `MEmailInput` | Email с иконкой | Обёртка `MInput` |
| `MPasswordInput` | Пароль с show/hide | Обёртка `MInput` |
| `MTelInput` | Телефон US (+1) | Обёртка `MInput` |
| `MCheckbox` | Чекбокс с анимацией | `dataTid` prop |
| `MDropdown` | Select/dropdown | `APopper` + `AInput` |
| `MPromocodeInput` | Промокод с кнопкой Apply | Состояния valid/invalid |
| `MCodeInput` | 4-значный OTP/SMS код | Auto-advance между полями |
| `MTabs` | Переключатель табов | `v-model`, animated backdrop |

**Паттерн `locationTid`:**

```vue
<MInput v-model="email" location-tid="login-email" />
<!-- Рендерит: data-tid="login-email-input" -->
```

### Игры

| Компонент | Назначение | Ключевые props |
|-----------|------------|----------------|
| `MGameCard` | Вертикальная карточка игры | `game`, `theme` (обязательный!), `isFavorite` |
| `MGameCardV2` | Рефакторинг MGameCard | Тот же API, чище sizing |
| `MGameCardHorizontal` | Горизонтальная карточка | Для списков |
| `MGameFavorite` | Иконка «сердечко» | `emit: toggleFavorite` |
| `MGamesNavigation` | Табы категорий игр | Для lobby navigation |

```vue
<MGameCard
  :game="game"
  theme="spintime"
  :is-favorite="isFavorite"
  data-tid="gcard-123"
  @toggle-favorite="handleToggle"
/>
```

> **Обязательно:** `theme` prop — определяет CDN-маршрутизацию изображений и pattern background.

---

## App-local spintime components

### Organizms — ключевые секции

| Компонент | Путь | Назначение |
|-----------|------|------------|
| `OHomeBannerLight` | `organizms/O/Home/BannerLight.vue` | Главный баннер-слайдер (Keen Slider) |
| `OGamesCatalog` | `organizms/O/Games/Catalog.vue` | Табы категорий игр |
| `OHomeSectionGames` | `organizms/O/Home/SectionGames.vue` | Секция игр на lobby (по scheme) |
| `OGames` | `organizms/O/Games/index.vue` | CSS Grid с карточками игр |
| `OHeader` / `OHeaderGuest` | `organizms/O/Header/` | Шапка (auth / guest) |
| `OFooter` / `OFooterGuest` | `organizms/OFooter*.vue` | Подвал |
| `OPromotionsDefault` | `organizms/O/Promotions/` | Страница промо-акций |

### Molecules — ключевые блоки

| Компонент | Путь | Назначение |
|-----------|------|------------|
| `MGameType` | `molecules/M/Game/Type.vue` | Обёртка `MGameCard` + loginGuard + openGame |
| `MHomeGuestPopularGames` | `molecules/M/Home/Guest/PopularGames.vue` | Секция популярных игр для гостей |
| `MHomeGuestWhyUs` | `molecules/M/Home/Guest/WhyUs.vue` | Блок «Why Us» |
| `MHomeGuestBannerSignUp` | `molecules/M/Home/Guest/BannerSignUp.vue` | CTA баннер регистрации |
| `MHomeSectionWrapper` | `molecules/M/Home/SectionWrapper.vue` | Обёртка секции с заголовком и «Show All» |
| `MHomeSeoText` | `molecules/M/Home/SeoText.vue` | SEO-текстовый блок |
| `MGamesMenu` | `molecules/M/Games/Menu.vue` | Меню категорий на library |
| `MSocialAuth` | `molecules/MSocialAuth.vue` | Кнопки Google/Facebook/Apple |

### Как MGameType связывает shared и app-local

`MGameType` — хороший пример композиции:

```
MGameType (app molecule)
  ├── MGameCard (shared) — визуал карточки
  ├── useLoginGuard() — блокировка для гостей
  ├── useOpenGame() — открытие игры в модалке
  └── useAddGameToFavorite() — toggle favorite
```

---

## Модальные окна (OModal/)

Все модалки живут в `organizms/OModal/` и регистрируются в `composables/useAppModals.ts`.

| Категория | Примеры |
|-----------|---------|
| Game | `OModal/Game/index.vue` — iframe игры |
| Auth | `OModal/CheckEmail.vue`, `OModal/EmailConfirm.vue` |
| Account | `OModal/Account/ChangePassword.vue`, `SelfExclusion.vue` |
| Features | `OModal/DailyWheel/`, `OModal/Bingo/`, `OModal/Tournament/` |
| Cash | `OModal/Cash.vue` — монтирует cash micro-app |
| Promo | `OModal/PresetPackage.vue`, `OModal/PrizeDropsWin.vue` |

**Открытие модалки:**

```typescript
const { open, close } = useAppModals();
open("LazyOModalGame");  // имя из useAppModals.ts
```

**Добавление новой модалки:**

1. Создать `organizms/OModal/MyFeature/index.vue`
2. Импортировать в `composables/useAppModals.ts`
3. Добавить в объект modals
4. Модалка автоматически доступна через `<LazyOModals />` в `app.vue`

---

## data-tid — тестовые идентификаторы

ESLint rule `local-rules/require-data-tid` требует `data-tid` на:

| Компонент | Правило |
|-----------|---------|
| `AButton` | `data-tid="описание-действия"` (обязательный атрибут) |
| `NuxtLink` | `data-tid="описание-ссылки"` |
| `MGameCard` | Auto: `gcard-{game.id}`, `gplay-{game.id}` |
| `MCheckbox` | Через prop `dataTid` |

**Формат:** kebab-case, без пробелов.

```vue
<AButton data-tid="header-signup-btn" variant="primary">Sign Up</AButton>
<NuxtLink to="/library/" data-tid="nav-library-link">Games</NuxtLink>
```

Для input-полей используется `location-tid`:

```vue
<MInput v-model="email" location-tid="signup-email" />
<!-- → data-tid="signup-email-input" -->
```

---

## Lazy loading компонентов

| Подход | Когда | Как |
|--------|-------|-----|
| `Lazy` prefix | Code splitting (уменьшение initial bundle) | `<LazyOGamesCatalog />` |
| `OLazyComponentV1` | Рендер при появлении в viewport + skeleton | Обёртка вокруг тяжёлой секции |
| `OLazyComponentNew` | То же (shared, из packages/ui) | `id`, `isDataLoaded`, slot `skeleton` |

```vue
<OLazyComponentV1 id="home-jackpot" v-slot="{ isSkeleton }">
  <LazyOHomeJackpot :isSkeleton="isSkeleton" />
</OLazyComponentV1>
```

---

## Как искать существующий компонент

```bash
# Найти компонент по имени
rg "MHomeGuest" apps/spintime/

# Найти использование shared компонента
rg "MGameCard" apps/spintime/ packages/ui/

# Найти все модалки
ls apps/spintime/organizms/OModal/

# Showcase shared UI
pnpm dev:ui
# → packages/ui/pages/atoms/buttons.vue
# → packages/ui/pages/showcase/gameCards.vue
```

### Алгоритм перед созданием нового компонента

1. **Grep** по `organizms/` и `molecules/` spintime
2. **Grep** по `packages/ui/molecules/` и `packages/ui/atoms/`
3. **Проверить** другие бренды: `rg "PopularGames" apps/*/molecules/`
4. **Посмотреть** UI showcase: `pnpm dev:ui`
5. Только если ничего не подходит — создавать новый

---

## Showcase UI-библиотеки

После `pnpm dev:ui` доступны живые примеры:

| Страница | Путь в packages/ui |
|----------|-------------------|
| Кнопки | `pages/atoms/buttons.vue` |
| Инпуты | `pages/molecules/inputs.vue` |
| Баннеры | `pages/atoms/banners.vue` |
| Слайдеры | `pages/atoms/sliders.vue` |
| Game cards | `pages/showcase/gameCards.vue` |
| Типографика | `pages/typography.vue` |
| Анимации | `pages/atoms/animations.vue` |
| Модалки | `pages/atoms/modals.vue` |

---

## Следующий раздел

[04 — Гайд по созданию страниц](04-page-development-guide.md)
