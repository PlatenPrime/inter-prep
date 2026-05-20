# Q010. Что такое `HTTP` cookie? Для чего они используются?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**HTTP cookie** — небольшой фрагмент данных, который сервер отправляет клиенту в заголовке **`Set-Cookie`**, а браузер автоматически прикрепляет к последующим запросам на тот же домен в заголовке **`Cookie`**. Используют для **сессий**, персонализации, корзины, A/B-тестов, «запомнить меня». Атрибуты **`HttpOnly`**, **`Secure`**, **`SameSite`**, **`Domain`**, **`Path`**, **`Max-Age`/`Expires`** задают безопасность и область действия. Не замена серверному хранилищу для чувствительных данных — cookie легко украсть при XSS без HttpOnly.

---

## Развёрнутый ответ

### Суть и определение

Механизм state management поверх stateless HTTP (RFC 6265). Сервер не «помнит» клиента — клиент предъявляет cookie как билет. Размер ~4 KB на cookie, лимит числа cookies на домен в браузерах.

### Как это работает

1. Ответ: `Set-Cookie: sessionId=abc; Path=/; HttpOnly; Secure; SameSite=Lax`
2. Браузер сохраняет в cookie jar с привязкой к domain/path.
3. Запрос: `Cookie: sessionId=abc` (если URL match, не истёк, SameSite правила).
4. **Session cookie** — без Expires → до закрытия браузера.
5. **Persistent** — `Max-Age=604800` (7 дней).
6. **Поддомены** — `Domain=.example.com` шарит на `api.example.com` (осторожно с scope).

**SameSite:**

- `Strict` — не шлёт при cross-site navigation
- `Lax` — шлёт при top-level GET (дефолт в Chrome)
- `None` — cross-site, требует `Secure`

### Практика и применение

- **Server-side session** — в cookie только opaque id, данные в Redis.
- **JWT в cookie** — возможно с HttpOnly (не в localStorage от XSS).
- **CSRF** — SameSite + anti-CSRF token для state-changing POST.
- **GDPR** — consent banner для non-essential cookies.
- **Partitioned cookies (CHIPS)** — third-party context с изоляцией.

### Важные нюансы и краеугольные камни

- **XSS + document.cookie** — без HttpOnly токен утечёт.
- **CSRF** — cookie автоматически уходят; нужны токены / SameSite.
- **Размер** — огромный JWT в cookie → 431, медленные запросы на каждый hit.
- **Subdomain takeover** — широкий Domain= опасен.
- **Не хранить** пароли и PCI в cookie.
- **__Host-** prefix — жёсткие правила (Secure, Path=/, no Domain).

### Примеры

```http
HTTP/1.1 200 OK
Set-Cookie: session=8f3a2b; Path=/; HttpOnly; Secure; SameSite=Lax
Set-Cookie: theme=dark; Path=/; Max-Age=31536000

GET /dashboard HTTP/1.1
Cookie: session=8f3a2b; theme=dark
```

```javascript
// Express — установка cookie
res.cookie('session', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'lax',
  maxAge: 24 * 60 * 60 * 1000,
});

// document.cookie — только не-HttpOnly (избегайте для токенов)
document.cookie = 'prefs=grid; path=/; max-age=3600';
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Cookie vs localStorage?** — размер, автоотправка, HttpOnly, CSRF.
- **Что делает SameSite=None?** — third-party embeds, OAuth, нужен Secure.
- **Как работает CSRF с cookie?** — браузер шлёт cookie без ведома JS.
- **Signed/encrypted cookies?** — HMAC (express cookie-parser signed).
- **Third-party cookies deprecation?** — Privacy Sandbox, Storage Access API.

### Красные флаги (чего не говорить)

- «JWT в localStorage безопаснее cookie» — XSS читает оба; HttpOnly cookie лучше для session.
- Хранить **пароль** в cookie.
- «SameSite отключает CSRF полностью» — defense in depth нужен.

### Связанные темы

- `017-mekhanizm-seansa.md`, `004-raznica-get-i-post.md`
- (будущие) `cookie vs sessionStorage` в теме 01. Web Q32
