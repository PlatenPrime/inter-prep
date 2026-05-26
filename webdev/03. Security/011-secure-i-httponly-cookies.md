# Q011. Что такое безопасные (Secure) и `HttpOnly` cookies?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**`Secure`** — атрибут cookie, разрешающий браузеру отправлять его только по **HTTPS**-соединению, защищая от перехвата по незащищённым сетям (MitM-атаки). **`HttpOnly`** — атрибут, запрещающий доступ к cookie из JavaScript (`document.cookie`), что делает его невидимым для XSS-атак. Вместе они образуют базовый минимум защиты для аутентификационных cookies.

---

## Развёрнутый ответ

### Атрибуты cookies для безопасности

#### `Secure`

```http
Set-Cookie: sessionId=abc123; Secure
```

- Cookie отправляется браузером **только** по HTTPS
- При HTTP-запросе браузер не включает куку в заголовок `Cookie`
- Защищает от перехвата трафика в открытых сетях (кафе, аэропорт)
- **Не защищает** от XSS — JS всё ещё может прочитать через `document.cookie`

#### `HttpOnly`

```http
Set-Cookie: sessionId=abc123; HttpOnly
```

- Cookie **недоступна** через `document.cookie`, `window.localStorage`, любые JS API
- Браузер всё равно автоматически отправляет её в запросах
- Защищает от **XSS**: даже если атакующий выполнил скрипт на странице, он не может украсть куку
- **Не защищает** от CSRF — кука всё равно отправляется автоматически

```javascript
// XSS-скрипт на странице:
document.cookie; // '' — HttpOnly куки не видны!
// Украсть sessionId не получится
```

#### `SameSite`

```http
Set-Cookie: sessionId=abc123; SameSite=Strict
Set-Cookie: sessionId=abc123; SameSite=Lax
Set-Cookie: sessionId=abc123; SameSite=None; Secure
```

| Значение | Поведение | Защита от CSRF |
|----------|-----------|---------------|
| `Strict` | Кука отправляется только при навигации с того же сайта | Максимальная |
| `Lax` | Кука отправляется при top-level navigation (переход по ссылке) | Умеренная |
| `None` | Кука отправляется всегда (кросс-сайтовые запросы) | Нет (нужен CSRF-токен) |

```
SameSite=Strict: Пользователь на evil.com → клик по ссылке → bank.com
  → браузер НЕ отправляет sessionId от bank.com

SameSite=Lax: Та же ситуация при переходе по ссылке (GET) → кука отправится
  Но POST/PUT/DELETE с другого сайта → кука НЕ отправится
```

### Полная конфигурация безопасной куки

```typescript
// Express
res.cookie('sessionId', sessionId, {
  httpOnly: true,           // недоступна из JS
  secure: true,             // только HTTPS
  sameSite: 'strict',       // не отправлять cross-site
  maxAge: 24 * 60 * 60 * 1000, // 24 часа в ms
  path: '/',
  domain: 'myapp.com',      // только для myapp.com (не поддоменов)
});

// Для поддоменов:
// domain: '.myapp.com' — работает для sub.myapp.com тоже
```

```http
Set-Cookie: sessionId=abc123; 
  HttpOnly; 
  Secure; 
  SameSite=Strict; 
  Max-Age=86400; 
  Path=/; 
  Domain=myapp.com
```

### `__Secure-` и `__Host-` префиксы

```http
/* Браузер принимает только если выполнены условия: */

Set-Cookie: __Secure-sessionId=abc123; Secure
/* Требует: Secure атрибут */

Set-Cookie: __Host-sessionId=abc123; Secure; Path=/; (без Domain)
/* Требует: Secure + Path=/ + NO Domain атрибут */
/* Защита: нельзя подменить через поддомен */
```

### Что каждый атрибут НЕ защищает

| Угроза | Secure | HttpOnly | SameSite=Strict |
|--------|--------|----------|-----------------|
| MitM (перехват трафика) | ✅ | ❌ | ❌ |
| XSS (кража куки через JS) | ❌ | ✅ | ❌ |
| CSRF (межсайтовые запросы) | ❌ | ❌ | ✅ |

Нужны **все три** в combination для комплексной защиты.

### Важные нюансы

- `SameSite=None` требует `Secure` — Chrome с 2020 года отказывает `SameSite=None` без `Secure`
- **Cookie Tossing Attack** — поддомен может установить куку для родительского домена, перезаписав легитимную; `__Host-` префикс защищает от этого
- **Cookie Overflow** — браузеры имеют лимиты (~50 кук на домен, ~4096 байт на куку)
- В HTTPS-среде `localhost` считается «безопасным» origin, поэтому `Secure` cookie работает там без TLS

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **HttpOnly cookie vs localStorage — что безопаснее для токена?** — HttpOnly cookie: защищена от XSS, автоматически отправляется браузером. localStorage: уязвима к XSS, но нет CSRF-риска (не отправляется автоматически). Для session/refresh tokens — httpOnly cookie.
- **Как SameSite=Lax защищает, но не полностью?** — Lax разрешает отправку при top-level navigation (переход по ссылке через GET), что достаточно для многих CSRF-сценариев, но не для POST-форм.
- **Что произойдёт, если убрать Secure в production?** — Кука может быть отправлена по HTTP, если пользователь зайдёт на http://myapp.com (до редиректа на HTTPS); HSTS решает это.
- **Как удалить куку?** — Установить `Max-Age=0` или `Expires` в прошлое; нельзя удалить `HttpOnly` куку из JS.

### Красные флаги (чего не говорить)

- «HttpOnly защищает от CSRF» — нет, только от XSS-кражи.
- «Secure защищает от XSS» — нет, только от MitM.
- «Достаточно одного из атрибутов» — для сессионных кук нужны все три: HttpOnly + Secure + SameSite.

### Связанные темы

- `012-mery-bezopasnosti-cookie-na-storone-klienta.md`
- `010-chto-takoe-same-origin-policy.md`
- `022-zashchita-ot-csrf.md`
- `021-zashchita-ot-xss.md`
