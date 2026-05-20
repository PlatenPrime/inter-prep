# Q017. Механизм установки сеанса между клиентом и сервером?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

HTTP **сам по себе stateless** — «сеанс» строят **поверх** протокола. Типичная схема: после логина сервер создаёт **session id**, отдаёт в **`Set-Cookie`**, хранит данные на сервере (Redis) или в **подписанном токене (JWT)**; клиент при каждом запросе отправляет cookie или `Authorization: Bearer`. Альтернативы: **OAuth** access/refresh tokens, **sessionStorage** + API (SPA). Транспортный уровень (TCP/TLS) — отдельное «соединение», не путать с пользовательской сессией.

---

## Развёрнутый ответ

### Суть и определение

**Session (пользовательский сеанс)** — состояние аутентифицированного пользователя между запросами: корзина, роли, CSRF secret. **Connection session** — TCP/TLS keep-alive.

### Как это работает

**Server-side session (классика):**

1. `POST /login` с credentials
2. Сервер проверяет, создаёт `sessionId`, сохраняет в Redis `{ sessionId: { userId, roles } }`
3. `Set-Cookie: sid=...; HttpOnly; Secure; SameSite=Lax`
4. Каждый запрос: middleware читает cookie → загружает сессию → `req.user`
5. Logout: удалить из store + `Set-Cookie` с Max-Age=0

**JWT stateless:**

- Сервер подписывает payload (HMAC/RSA); хранилище не нужно; отзыв сложнее (blacklist, short TTL + refresh).

**OAuth 2.0 / OIDC:**

- Redirect на IdP, authorization code, обмен на tokens, session в BFF.

**SPA:**

- Access token в memory, refresh в HttpOnly cookie (BFF pattern) — снижает XSS риск.

### Практика и применение

- Express + `express-session` + Redis store.
- Next.js Auth.js / Passport.
- **Sticky sessions** на L7 LB при in-memory store (anti-pattern — лучше Redis).
- **Rolling session** — продление Max-Age при активности.

### Важные нюансы и краеугольные камни

- **Session fixation** — выдавать новый id после login.
- **Concurrent logout** на всех устройствах — server-side invalidation.
- **JWT в localStorage** — XSS = полный захват.
- Путать **TCP connection pooling** с user session.
- **CSRF** на cookie-based sessions.

### Примеры

```javascript
// Псевдо-middleware после cookie-session
async function sessionMiddleware(req, res, next) {
  const sid = req.cookies.sid;
  if (!sid) return next();
  const session = await redis.get(`sess:${sid}`);
  if (!session) {
    res.clearCookie('sid');
    return next();
  }
  req.user = JSON.parse(session).user;
  next();
}

// Login
app.post('/login', async (req, res) => {
  const user = await authenticate(req.body);
  const sid = crypto.randomUUID();
  await redis.setex(`sess:${sid}`, 86400, JSON.stringify({ userId: user.id }));
  res.cookie('sid', sid, { httpOnly: true, secure: true, sameSite: 'lax' });
  res.json({ ok: true });
});
```

```http
POST /login HTTP/1.1
Content-Type: application/json
{"email":"u@x.com","password":"***"}

HTTP/1.1 200 OK
Set-Cookie: sid=7b2c...; HttpOnly; Secure; SameSite=Lax
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Stateful vs stateless JWT?** — trade-offs отзыва и масштабирования.
- **Где хранить refresh token?** — HttpOnly cookie + rotation.
- **Session fixation attack?** — regenerate id on login.
- **Как масштабировать сессии?** — central store, не in-memory per node.
- **SameSite и OAuth redirect?** — Lax/None нюансы.

### Красные флаги (чего не говорить)

- «HTTP хранит сессию» — HTTP stateless; сессия в приложении.
- «JWT не нужен refresh» — без TTL/refresh — долгий риск при утечке.
- Хранить **секреты сессии** в URL query.

### Связанные темы

- `010-http-cookie.md`, `001-chto-takoe-http.md`
- `018-chto-takoe-rest.md`, `003-kakie-metody-http-zapros.md`
