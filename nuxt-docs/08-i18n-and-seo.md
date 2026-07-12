# 08 — i18n и SEO

Переводы, интернационализация и SEO-метаданные в spintime.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## i18n (интернационализация)

### Конфигурация

В `nuxt.config.ts`:

```typescript
i18n: {
  strategy: "no_prefix",    // URL без /en/, /de/ — язык определяется иначе
  defaultLocale: "en",
  locales: ["en"]
}
```

`strategy: "no_prefix"` означает, что URL **не содержит** префикс языка. Все маршруты одинаковы для всех локалей.

### useT() — обёртка над vue-i18n

```typescript
// composables/useT.ts
export const useT = () => useI18n();
```

Использование:

```typescript
const { t } = useT();
```

```vue
<AText>{{ t("home.guest.popular.games") }}</AText>
<AButton>{{ t("signin.submit") }}</AButton>
```

### Загрузка переводов

Переводы **не хранятся в коде**. Они загружаются с бэкенда:

```
middleware/translations.global.ts
    → loadTranslations("en", i18n)
        → $fetch("/api/rest/translations/en")
            → Redis / backend
```

Функция `loadTranslations` определена в `composables/useT.ts`.

> **Неочевидно:** если вы добавили новый ключ `t("myPage.title")` в код, перевод появится только после добавления ключа в backend translations. До этого в UI будет отображаться сам ключ.

### Форматы ключей

Ключи организованы по namespace (точечная нотация):

| Namespace | Примеры | Где используется |
|-----------|---------|------------------|
| `home.guest.*` | `home.guest.popular.games` | Guest home секции |
| `page.home.seo` | SEO-текст главной | `MHomeSeoText` |
| `page.lobby.seo` | SEO-текст lobby | `MHomeSeoText` |
| `seoInfo.library.*` | title, description | `pages/library.vue` |
| `seoInfo.issues.*` | title, description | `pages/issues/[pageName].vue` |
| `signin.*` / `signup.*` | Формы авторизации | Auth pages |
| `account.page.*` | Аккаунт | `pages/game/index.vue` |
| `promoPage.*` | Промо-акции | `pages/promotions.vue` |
| `guestPage.*` | Guest-страницы | Другие бренды |

### i18n-t — переводы с вложенным HTML

Для текстов с ссылками, bold и т.д.:

```vue
<i18n-t keypath="lobby.welcome.message" tag="p">
  <template #link>
    <NuxtLink to="/promotions/" data-tid="lobby-promo-link">
      {{ t("lobby.welcome.link") }}
    </NuxtLink>
  </template>
</i18n-t>
```

### Правила

1. **Все** пользовательские строки — через `t()`. Никакого хардкода текста в template.
2. Исключение: `alt` для декоративных изображений, технические `data-tid`.
3. Новые ключи — согласовать с backend/контент-командой.

---

## SEO (meta-теги)

### useHead — управление `<head>`

```typescript
useHead({
  title: () => "...",
  meta: [
    { name: "description", content: () => "..." },
    { name: "keywords", content: () => "..." }
  ],
  bodyAttrs: {
    id: "page-my-page"
  }
});
```

Функции `() => ...` делают meta **реактивными** — обновляются при изменении данных.

### Три паттерна SEO

#### Паттерн 1: API-driven (home, lobby)

Данные приходят с бэкенда через `useHomePage`:

```typescript
const { seoData } = useHomePage({ immediate: true });

useHead({
  title: () => seoData.value?.seoTitle || "Spintime",
  meta: [
    {
      hid: "description",
      name: "description",
      content: () => seoData.value?.seoDescription
    },
    {
      name: "keywords",
      content: () => seoData.value?.seoKeywords || ""
    }
  ]
});
```

Используется в: `pages/index.vue`, `pages/lobby.vue`.

#### Паттерн 2: i18n keys (library, issues, account)

Переводы из backend translations:

```typescript
const { t } = useT();

useHead({
  title: () => t("seoInfo.library.title"),
  meta: [
    { hid: "og:title", name: "og:title", content: () => t("seoInfo.library.title") },
    { hid: "description", name: "description", content: () => t("seoInfo.library.description") },
    { hid: "og:description", name: "og:description", content: () => t("seoInfo.library.description") },
    { hid: "twitter:title", name: "twitter:title", content: () => t("seoInfo.library.title") },
    { hid: "twitter:description", name: "twitter:description", content: () => t("seoInfo.library.description") }
  ]
});
```

Используется в: `pages/library.vue`, `pages/issues/[pageName].vue`.

#### Паттерн 3: Static fallback

Для простых страниц без динамических данных:

```typescript
useHead({ title: "Promotions | Spintime" });
```

Используется в: `pages/promotions.vue`.

### Какой паттерн выбрать

| Ситуация | Паттерн |
|----------|---------|
| Home / Lobby | API-driven (`seoData` из `useHomePage`) |
| Каталог, issues, account | i18n keys (`seoInfo.*`) |
| Простая статическая страница | Static fallback |
| CMS-страница (`page/[name]`) | API-driven (данные из `/rest/page/:name/`) |

---

## Open Graph и Twitter Cards

### Глобальные defaults

В `nuxt.config.ts` → `app.head.meta` заданы defaults для всего сайта:

```typescript
meta: [
  { name: "og:url", content: "https://spintime.com/" },
  { name: "og:type", content: "website" },
  { name: "og:site_name", content: "Spintime" },
  { name: "og:image", content: "https://spintime.com/uploads/media/OgImageSTR.jpg" },
  { name: "twitter:card", content: "summary_large_image" },
  { name: "twitter:image", content: "https://spintime.com/uploads/media/OgImageSTR.jpg" }
]
```

### Per-page override

На уровне страницы переопределяются `title`, `description` и их OG/Twitter варианты:

```typescript
useHead({
  title: () => t("seoInfo.library.title"),
  meta: [
    { hid: "og:title", name: "og:title", content: () => t("seoInfo.library.title") },
    { hid: "og:description", name: "og:description", content: () => t("seoInfo.library.description") },
    { hid: "twitter:title", name: "twitter:title", content: () => t("seoInfo.library.title") },
    { hid: "twitter:description", name: "twitter:description", content: () => t("seoInfo.library.description") }
  ]
});
```

`hid` (unique id) нужен для корректной замены глобальных meta при навигации.

---

## SEO-текстовые блоки

На guest-страницах внизу размещается SEO-текст:

```vue
<MHomeSeoText :content="t('page.home.seo')" />
```

- `pages/index.vue` → `t('page.home.seo')`
- `pages/lobby.vue` → `t('page.lobby.seo')`

Компонент `MHomeSeoText` рендерит HTML-контент из перевода.

---

## bodyAttrs для page-scoped стилей

```typescript
useHead({
  bodyAttrs: {
    id: "page-lobby-guest"
  }
});
```

Позволяет писать unscoped стили, привязанные к конкретной странице:

```scss
#page-lobby-guest .wrapper-nuxt-page {
  overflow: clip;
}
```

---

## Чеклист SEO для новой страницы

- [ ] `useHead({ title })` — уникальный title
- [ ] `meta description` — уникальное описание
- [ ] OG tags: `og:title`, `og:description` (если страница шарится в соцсетях)
- [ ] Twitter tags: `twitter:title`, `twitter:description`
- [ ] Все тексты через `t()`, не хардкод
- [ ] SEO-текстовый блок внизу (если guest landing)
- [ ] `bodyAttrs.id` (если нужны page-scoped стили)

---

## Полный пример: SEO для новой страницы

```typescript
const { t } = useT();

useHead({
  title: () => t("seoInfo.myPage.title"),
  meta: [
    {
      hid: "description",
      name: "description",
      content: () => t("seoInfo.myPage.description")
    },
    {
      hid: "og:title",
      name: "og:title",
      content: () => t("seoInfo.myPage.title")
    },
    {
      hid: "og:description",
      name: "og:description",
      content: () => t("seoInfo.myPage.description")
    },
    {
      hid: "twitter:title",
      name: "twitter:title",
      content: () => t("seoInfo.myPage.title")
    },
    {
      hid: "twitter:description",
      name: "twitter:description",
      content: () => t("seoInfo.myPage.description")
    }
  ],
  bodyAttrs: {
    id: "page-my-page"
  }
});
```

---

## Навигация по документации

| ← Назад | Документ |
|---------|----------|
| [07 — Стили и адаптив](07-styling-and-responsive.md) | Предыдущий раздел |
| [ARCHITECTURE.md](../ARCHITECTURE.md) | Главная точка входа |
| [04 — Гайд по созданию страниц](04-page-development-guide.md) | Workflow разработки |
