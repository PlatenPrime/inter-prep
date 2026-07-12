# 06 — Auth, модалки, cash

Авторизация, модальные окна и интеграция платёжного модуля.

[← ARCHITECTURE.md](../ARCHITECTURE.md)

---

## Модель авторизации

### Guest vs Logged-in

```
┌─────────────┐     login/signup     ┌──────────────┐
│   Guest     │ ──────────────────►  │  Logged-in   │
│  isGuest=true│ ◄──────────────────  │  isGuest=false│
└─────────────┘     logout           └──────────────┘
```

Состояние `isGuest` определяется на **двух уровнях**:

1. **SSR (сервер):** middleware `request-handle-v2.global.ts` вызывает `/rest/request/handle/` и устанавливает cookie + `useState("isGuest")`
2. **Client:** `useIsGuest()` — composable, читающий это состояние

```typescript
const isGuest = useIsGuest();
// isGuest.value === true  → неавторизован
// isGuest.value === false → залогинен
```

---

## Защита страниц

### useRouteGuard — основной способ

```typescript
// Страница только для залогиненных (редирект гостей на /)
useRouteGuard();

// Страница с условием (feature flag)
useRouteGuard({ condition: !featureIsActive.value });

// Показать и гостям, и залогиненным, но скрыть при condition
useRouteGuard({ condition: someCondition, hideFromGuest: false });
```

Реализация (`packages/composables/src/useRouteGuard.ts`):

```typescript
const useRouteGuard = ({ condition = false, hideFromGuest = true } = {}) => {
  const isGuest = useIsGuest();
  if ((isGuest.value && hideFromGuest) || condition) {
    navigateTo("/");
  }
};
```

### Редирект залогиненных с guest-страниц

```typescript
// pages/index.vue
const isGuest = useIsGuest();
if (!isGuest.value) {
  router.push("/lobby/");
}
```

### definePageMeta middleware (альтернатива)

```typescript
definePageMeta({ middleware: ["route-guard"] });
```

Используется реже в spintime — предпочитают `useRouteGuard()` в script.

---

## Auth-страницы

### Sign In (`pages/signin.vue`)

```
Layout: auth
Composable: useLoginData()
Flow: email/password → captcha → API login → refresh appInit → redirect /lobby/
```

```typescript
// composables/useLoginData.ts — упрощённо
const { email, password, handleLogin, loading, error } = useLoginData();
```

### Sign Up (`pages/signup.vue`)

```
Layout: auth
Composables: useSignupData(), useSignupPromoCode()
Components: MSocialAuth (Google, Facebook, Apple)
Flow: form → terms acceptance → API register → captcha → complete profile
```

### Social Auth

```typescript
// Shared composable
const { socialButtons } = useAuthSocialButtons();
// hrefs: /login/Google/, /login/facebook/
```

Компонент `MSocialAuth` рендерит кнопки социальных сетей. После OAuth-редиректа layout обрабатывает query params:

```typescript
// layouts/default.vue
// ?action=register&social=Google → GA event + redirect
```

### Deeplink / Referral

```typescript
// layouts/default.vue
// ?refcode=XXX → navigateTo("/signup/?refcode=XXX")
// ?invited_by=YYY → navigateTo("/signup/?invited_by=YYY")
```

---

## Layouts для auth

### `auth.vue` — минимальная оболочка

- Без header/footer
- Кнопка «назад» (на `/` для гостя, на `/lobby/` для залогиненного)
- Центрированный slot (max-width 440px)

```vue
<NuxtLayout name="auth" :title="t('signin.page.title')">
  <!-- форма -->
</NuxtLayout>
```

---

## Система модалок

### Архитектура

```
app.vue
  └── <LazyOModals />           ← рендерит все зарегистрированные модалки
        └── organizms/OModals.vue
              └── vue-final-modal (для каждой модалки)

composables/useAppModals.ts     ← реестр ~90 модалок
  └── open("LazyOModalGame")
  └── close("LazyOModalGame")
```

### Открытие модалки

```typescript
const { open, close } = useAppModals();

// Открыть
open("LazyOModalGame");

// Закрыть
close("LazyOModalGame");
```

### Открытие игры

```typescript
const { open } = useAppModals();
const { handleOpenGame } = useOpenGame(open);

// При клике на карточку игры
handleOpenGame(game);
// → если guest: redirect на /signup/
// → если logged-in: open("LazyOModalGame") с iframe
```

### Категории модалок

| Категория | Путь | Примеры |
|-----------|------|---------|
| Game | `OModal/Game/` | index, Search, ActionRequired, SwitchToSweeps |
| Account | `OModal/Account/` | ChangePassword, SelfExclusion, PurchaseLimit |
| Auth | `OModal/` | CheckEmail, EmailConfirm, PhoneConfirmation |
| Features | `OModal/DailyWheel/`, `Bingo/`, `Tournament/` | Welcome, Play, Congrats |
| Cash | `OModal/Cash.vue` | Монтирует cash micro-app |
| Promo | `OModal/` | PresetPackage, PrizeDropsWin, InviteFriends |

### Добавление новой модалки

1. Создать `organizms/OModal/MyFeature/index.vue`
2. Добавить import в `composables/useAppModals.ts`:

```typescript
import LazyOModalMyFeature from "~/organizms/OModal/MyFeature/index.vue";

// В объект modals:
LazyOModalMyFeature,
```

3. Открывать: `open("LazyOModalMyFeature")`

### vue-final-modal

Модалки используют библиотеку `vue-final-modal` (подключена через `@vue-final-modal/nuxt`).

Основные опции:

| Опция | Назначение |
|-------|------------|
| `clickToClose` | Закрытие по клику на overlay |
| `escToClose` | Закрытие по Escape |
| `lockScroll` | Блокировка скролла body |
| `teleportTo` | Куда teleport'ить (default: body) |

> **Неочевидно:** `AModal` в `packages/ui/atoms/` — **deprecated stub**. Реальные модалки — через `vue-final-modal` и `useAppModals`.

---

## Login Guard — блокировка действий для гостей

```typescript
const { loginGuard } = useLoginGuard();

// Обернуть действие: если guest → redirect на /signup/
loginGuard(() => {
  open("LazyOModalGame");
});
```

Используется в `MGameType` — при клике на игру гостем → `/signup/`.

---

## Cash-модуль (платежи)

### Что это

Cash — **отдельное Vue-приложение** (Vue 3 + Vuex + vue-router), встроенное в Nuxt через модалку. Отвечает за deposit, redeem, transaction history.

### Архитектура

```
┌──────────────────────────────────────────────┐
│  Nuxt App (spintime)                         │
│                                              │
│  OModal/Cash.vue                             │
│    └── createCash() → mount("#vueCash")      │
│                                              │
│  useSTRCash() ← sockets                      │
│  useCashHelper() ← window.$cash.$store       │
└──────────────┬───────────────────────────────┘
               │
┌──────────────▼───────────────────────────────┐
│  cash/cash-USA-new/ (ядро)                   │
│    router: /cash/deposit, /cash/redeem, ...  │
│    store: deposit, redeem, history, ...      │
│                                              │
│  cash/spintime/ (бренд)                      │
│    components/Deposit.vue, Redeem.vue, ...   │
│    CSS, assets                               │
└──────────────────────────────────────────────┘
```

### Как открыть cash

```typescript
// Из любого места приложения
window?.$cash?.$router?.push?.("/cash/deposit-by-money/");

// Или через модалку
open("LazyOModalCash");
```

### Мост Nuxt ↔ Cash

| Composable | Роль |
|------------|------|
| `useSTRCash()` | Слушает socket-события `cash`, `deposit` → обновляет Vuex |
| `useCashHelper()` | Читает getters из `window.$cash.$store` |
| `useGlobalBalance()` | Синхронизирует баланс: Pinia ↔ Vuex ↔ sockets |
| `useQuickCash()` | App-local: быстрый доступ к deposit |

### Cash routes

Hash-based routing под `/cash/`:

| Route | Назначение |
|-------|------------|
| `/cash/deposit` | Выбор метода депозита |
| `/cash/deposit-by-money` | Депозит картой |
| `/cash/redeem` | Вывод средств |
| `/cash/history` | История транзакций |
| `/cash/verification` | KYC верификация |
| `/cash/success` / `failed` / `pending` | Статус транзакции |

### Aliases

```typescript
// nuxt.config.ts
"@currentProject" → cash/spintime/     // брендовые компоненты
"@modules/cash"   → cash/cash-USA-new/ // ядро
```

---

## Event bus (layout → modals)

`useLayoutEventHandlers` — слушает кастомные DOM-события и открывает модалки:

```typescript
// Пример: кнопка в sidebar → событие → модалка
window.dispatchEvent(new CustomEvent("OPEN_PROFILE_MODAL"));
// → useLayoutEventHandlers → open("LazyOModalProfile")
```

---

## Потоки авторизации (диаграмма)

### Login flow

```
/signin/ → useLoginData → API /rest/login/
    → success: refresh appInit, games, home
    → redirect /lobby/
    → fail: show error, refresh captcha
```

### Signup flow

```
/signup/ → useSignupData → API /rest/register/
    → success: /registration-complete/
    → social: /login/Google/ → callback → app.vue refresh
```

### Logout flow

```
Account → handleLogout → API /rest/logout/
    → clear cookies, isGuest = true
    → redirect /signin/ or /
```

---

## Следующий раздел

[07 — Стили и адаптив](07-styling-and-responsive.md)
