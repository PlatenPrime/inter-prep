# 07 — Стили и адаптив

SCSS, CSS-переменные, breakpoints, изображения и responsive-паттерны в spintime.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Общий подход

| Аспект | Решение в проекте |
|--------|-------------------|
| CSS-фреймворк | **SCSS** (не Tailwind, не CSS Modules) |
| Темизация | CSS custom properties + SCSS mixins per brand |
| Адаптив | SCSS breakpoints (основной), `useDevice()` (JS), `*Mob` компоненты (редко) |
| Scoped styles | `<style lang="scss" scoped>` — стандарт |
| Utility classes | Shared helpers: `flex-column`, `flex-center`, `hidden-down-lg` |

---

## SCSS pipeline

### Глобальная инъекция

В `nuxt.config.ts` Vite `additionalData` автоматически подключает SCSS partials в **каждый** компонент:

```scss
@use "@netgame/ui/assets/scss/spintime-config" as *;
@use "@netgame/ui/assets/scss/cash" as *;
@use "@netgame/ui/assets/scss/mixins" as *;
@use "@netgame/ui/assets/scss/variables" as *;
@use "@netgame/ui/assets/scss/breakpoints" as *;
@use "@netgame/ui/assets/scss/gutter" as *;
```

Поэтому в компонентах можно сразу писать `@include media-breakpoint-down(md)` без `@import`.

### Глобальные CSS-файлы

Подключаются в `nuxt.config.ts` → `css`:

| Файл | Содержимое |
|------|------------|
| `normalize.css` | CSS reset |
| `root.scss` | CSS variables root |
| `typography.scss` | Типографика |
| `colors.scss` | Цветовая палитра |
| `utilities.scss` | Utility classes |
| `theme-spintime.scss` | Брендовые CSS variables |

---

## CSS Variables (custom properties)

Цвета и размеры — через CSS variables, не хардкод:

```scss
.my-block {
  background: var(--neutral-5);
  color: var(--neutral-100);
  border: 1px solid var(--overlay-light-008);
}

.error-text {
  color: var(--error-40);
}
```

### Темизация компонентов

Каждый `A*` компонент определяет CSS variables с fallback:

```scss
// AButton.vue
:root {
  --a-button-primary-background: var(--chimoio);
  --a-button-primary-color: var(--neutral-100);
}

// spintime-config.scss переопределяет через mixin:
@mixin AButton {
  --a-button-primary-background: #FF6B00;
}
```

Это позволяет менять внешний вид компонентов per brand без дублирования кода.

---

## Breakpoints

### Доступные breakpoints

| Mixin | Экран |
|-------|-------|
| `media-breakpoint-up(sm)` | ≥ 576px |
| `media-breakpoint-up(md)` | ≥ 768px |
| `media-breakpoint-up(lg)` | ≥ 1024px |
| `media-breakpoint-up(xl)` | ≥ 1280px |
| `media-breakpoint-down(sm)` | < 576px |
| `media-breakpoint-down(md)` | < 768px |
| `media-breakpoint-down(lg)` | < 1024px |
| `media-breakpoint-down(xl)` | < 1280px |

### Паттерн использования

Desktop-first (стили по умолчанию = desktop, затем override для mobile):

```scss
.section-item {
  padding: 32px 0;
  gap: 24px;

  @include media-breakpoint-down(md) {
    padding: 24px 0;
    gap: 16px;
  }
}
```

### Utility classes для видимости

```html
<div class="hidden-down-lg">Видно только на desktop</div>
<div class="hidden-up-md">Видно только на mobile</div>
```

Определены в `packages/ui/assets/scss/helpers/classes.scss`.

---

## useDevice() — JS-адаптив

Когда CSS недостаточно (разная логика, не вёрстка):

```typescript
const { isMobile, isDesktop, isTablet } = useDevice();
```

Примеры в spintime:

```typescript
// Toast position: desktop top-right, mobile top-center
position: isDesktop ? toast.POSITION.TOP_RIGHT : toast.POSITION.TOP_CENTER

// Lobby: скрыть h1 на mobile
<AText v-if="isDesktop" type="h1-light">...</AText>
```

> **Правило:** сначала пробуйте SCSS breakpoints. `useDevice()` — только когда нужна разная **логика**, а не просто вёрстка.

---

## Отдельные mobile-компоненты (*Mob)

Используются **редко**, только когда layout принципиально разный (grid vs horizontal scroll):

```
organizms/O/Home/Originals.vue      ← desktop grid
organizms/O/Home/OriginalsMob.vue   ← mobile horizontal scroll
```

В spintime таких пар мало. Не создавайте `*Mob` компонент, если достаточно SCSS.

---

## Изображения

### Три способа

| Способ | Когда | Пример |
|--------|-------|--------|
| `APicture` | Статические баннеры (desktop/mobile) | `online-games.vue` |
| `NuxtImg` | Оптимизированные изображения (webp, lazy, sizes) | Игровые превью |
| `ANuxtImgOptimized` | CDN-оптимизация через `getImgV2` | Баннеры некоторых тем |
| `<img>` / `public/` | Favicon, мелкие иконки | `public/nuxt-img/` |

### APicture — статический responsive

```vue
<APicture
  src="/nuxt-img/banners/my-page/banner-d.webp"
  srcset="/nuxt-img/banners/my-page/banner-m.webp"
  alt="Description"
/>
```

- `src` = desktop (default)
- `srcset` = mobile (`media="(max-width: 1023px)"`)
- Картинки кладутся в `public/nuxt-img/`

### NuxtImg — оптимизированные

```vue
<NuxtImg
  :src="game.image"
  format="webp"
  :width="200"
  :height="200"
  loading="lazy"
  :quality="80"
/>
```

Настроен Cloudflare provider в `nuxt.config.ts`.

### ABanner — hero с overlay

```vue
<ABanner
  :img-attrs="{ src: '/img/banner-d.webp', format: 'webp', width: 550, height: 310 }"
  :sources="[{ srcset: mobileUrl, media: '(max-width: 767px)' }]"
>
  <AText>Overlay content</AText>
  <AButton data-tid="hero-cta">Play</AButton>
</ABanner>
```

### Размещение файлов

```
public/nuxt-img/
├── banners/
│   ├── online-games/
│   │   ├── banner-d.webp    ← desktop
│   │   └── banner-m.webp    ← mobile
│   └── home/
├── favicon-32x32.png
└── ...
```

---

## Scoped vs Unscoped styles

### Scoped (стандарт)

```vue
<style lang="scss" scoped>
.my-class { ... }
</style>
```

Стили применяются только к этому компоненту. `:deep()` для вложенных:

```scss
.online-games-banner {
  :deep(img) {
    display: block;
    width: 100%;
  }
}
```

### Unscoped (для page-level overrides)

Используется для стилей, завязанных на `body#page-*`:

```vue
<!-- pages/index.vue -->
<style lang="scss">
#page-lobby-guest .wrapper-nuxt-page {
  overflow: clip;
  max-width: 100%;
}
#page-lobby-guest .page-content {
  overflow: initial;
}
</style>
```

Устанавливается через `useHead`:

```typescript
useHead({
  bodyAttrs: { id: "page-lobby-guest" }
});
```

---

## Layout и контейнеры

### Page content

```scss
// layouts/default.vue
.page-content {
  max-width: 1440px;
  margin: 0 auto;
  padding: 0 16px;

  @include media-breakpoint-up(md) {
    padding: 0 24px;
  }
}
```

### Grid для игр

```scss
// organizms/O/Games/index.vue — упрощённо
.games-grid {
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
```

---

## Utility classes

Доступны глобально из `packages/ui/assets/scss/helpers/classes.scss`:

| Class | Эффект |
|-------|--------|
| `flex-column` | `display: flex; flex-direction: column` |
| `flex-center` | `display: flex; align-items: center; justify-content: center` |
| `flex-between` | `display: flex; justify-content: space-between` |
| `hidden-down-lg` | Скрыть на экранах < lg |
| `hidden-up-md` | Скрыть на экранах ≥ md |
| `color-neutral-100` | `color: var(--neutral-100)` |
| `text-center` | `text-align: center` |

```vue
<div class="section-item flex-column">
  <AText class="color-neutral-100">...</AText>
</div>
```

---

## Типографика

### AText variants

```vue
<AText variant="tucson" :modifiers="['bold', 'center']">Title</AText>
<AText variant="tokio" :modifiers="['uppercase']">Subtitle</AText>
```

В spintime также используется prop `type` (app-level):

```vue
<AText type="h1-light" :modifiers="['center']">Heading</AText>
<AText type="p2-medium">Body text</AText>
```

Варианты типографики определяются в SCSS-теме бренда. Showcase: `pnpm dev:ui` → `pages/typography.vue`.

---

## Анимации

Shared анимации в `packages/ui/atoms/animations/`:

| Компонент | Эффект |
|-----------|--------|
| `AAnimationSpin` | Спиннер загрузки (в `MButton`) |
| `AAnimationPulse` | Пульсация (в `MCheckbox` validation) |
| `AAnimationFadeIn` | Fade-in появление |
| `AAnimationConfetti` | Конфетти (победа) |
| `AAnimationSkeleton` | Skeleton shimmer |
| `AAnimationNumberCounter` | Анимация чисел |

```vue
<AAnimationSpin v-if="loading" />
<AAnimationFadeIn>
  <div>Content</div>
</AAnimationFadeIn>
```

---

## Чеклист стилей для новой страницы

- [ ] `<style lang="scss" scoped>` в каждом компоненте
- [ ] Цвета через `var(--neutral-*)`, не hex
- [ ] Адаптив через `@include media-breakpoint-down(md)`
- [ ] Баннеры: desktop/mobile webp в `public/nuxt-img/`
- [ ] Отступы секций: `padding: 32px 0` (desktop), `24px 0` (mobile) — как в существующих секциях
- [ ] `border-radius: 24px` (desktop), `16px` (mobile) — для карточек и баннеров
- [ ] Page-scoped стили через `bodyAttrs.id` + unscoped `<style>` (если нужно)

---

## Следующий раздел

[08 — i18n и SEO](08-i18n-and-seo.md)
