# Q022. Как можно защищаться от CSRF-атак (Cross-Site Request Forgery)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**CSRF** (Подделка межсайтовых запросов) — атака, при которой злоумышленник вынуждает браузер жертвы выполнить нежелательный запрос к сайту, где та аутентифицирована. Основные методы защиты: **`SameSite=Strict/Lax` cookies** (современный и наиболее эффективный), **CSRF-токены** (синхронизированный паттерн), проверка **`Origin`/`Referer` заголовков**, **Double Submit Cookie** паттерн. Для статeless API с JWT в Authorization header CSRF обычно неприменим.

---

## Развёрнутый ответ

### Механизм CSRF-атаки

```html
<!-- evil.com — злоумышленник размещает на своём сайте: -->
<html>
  <body onload="document.forms[0].submit()">
    <form action="https://bank.com/transfer" method="POST">
      <input name="to" value="attacker-account" />
      <input name="amount" value="10000" />
    </form>
  </body>
</html>
<!-- 
  Жертва открывает evil.com, находясь в сессии bank.com
  Браузер автоматически отправляет куки bank.com с запросом
  Перевод выполняется от имени жертвы
-->
```

```
CSRF возможен потому что:
1. Браузер автоматически прикрепляет куки к запросам
2. SOP блокирует ЧТЕНИЕ ответа, но не отправку запроса
3. Сервер видит легитимную сессионную куку → доверяет запросу
```

### Метод 1: SameSite Cookies (рекомендуемый)

```typescript
// Современный и наиболее простой подход
res.cookie('sessionId', sessionId, {
  httpOnly: true,
  secure: true,
  sameSite: 'strict',  // кука не отправляется ни с одного cross-site запроса
  // ИЛИ:
  sameSite: 'lax',     // отправляется при top-level navigation (GET), но не POST
});
```

```
SameSite=Strict: Абсолютная защита от CSRF
  evil.com → bank.com/transfer: кука НЕ отправляется
  Недостаток: пользователь, перешедший с другого сайта на bank.com, 
  не будет залогинен сразу

SameSite=Lax: Баланс UX и безопасности (дефолт в Chrome 80+)
  evil.com → bank.com POST: кука НЕ отправляется ✅ защита
  email_link → bank.com GET: кука отправляется ✅ UX
  Недостаток: 120-секундный window после создания куки (Chrome quirk)
```

### Метод 2: CSRF-токены (Synchronizer Token Pattern)

```typescript
// Сервер: генерируем уникальный токен для каждой сессии
import crypto from 'crypto';

function generateCsrfToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

// При рендеринге страницы — вставляем токен в форму И в куку (или сессию)
app.get('/transfer', (req, res) => {
  const csrfToken = generateCsrfToken();
  req.session.csrfToken = csrfToken; // сохраняем в сессии

  res.render('transfer', { csrfToken });
});
```

```html
<!-- HTML форма — токен в hidden поле -->
<form action="/transfer" method="POST">
  <input type="hidden" name="_csrf" value="<%= csrfToken %>" />
  <input name="to" type="text" />
  <input name="amount" type="number" />
  <button type="submit">Transfer</button>
</form>
```

```typescript
// Сервер: проверяем токен из формы с токеном из сессии
app.post('/transfer', (req, res) => {
  const { _csrf, to, amount } = req.body;
  
  if (!_csrf || _csrf !== req.session.csrfToken) {
    return res.status(403).json({ error: 'Invalid CSRF token' });
  }
  
  // Regenerate token после использования (one-time use)
  req.session.csrfToken = generateCsrfToken();
  
  // Выполняем перевод
  processTransfer({ to, amount, userId: req.session.userId });
  res.redirect('/success');
});
```

### Метод 3: Double Submit Cookie

Не требует хранения токена на сервере:

```typescript
// Клиент читает CSRF-токен из JS-доступной куки и добавляет в запрос
// Сервер сравнивает значение в запросе с кукой

// Сервер: устанавливаем CSRF-токен в обычную куку (не httpOnly)
res.cookie('csrfToken', generateCsrfToken(), {
  secure: true,
  sameSite: 'strict',
  // НЕ httpOnly — клиент должен читать
});

// Клиент: читает куку и добавляет в заголовок
function getCsrfToken(): string {
  return document.cookie
    .split('; ')
    .find(row => row.startsWith('csrfToken='))
    ?.split('=')[1] ?? '';
}

fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-CSRF-Token': getCsrfToken(), // из куки → в заголовок
  },
  credentials: 'include',
  body: JSON.stringify({ to: 'account', amount: 100 }),
});

// Сервер: проверяем, что заголовок совпадает с кукой
app.post('/api/transfer', (req, res) => {
  const headerToken = req.headers['x-csrf-token'];
  const cookieToken = req.cookies['csrfToken'];
  
  if (!headerToken || headerToken !== cookieToken) {
    return res.status(403).json({ error: 'CSRF validation failed' });
  }
  // ... обработка
});

// Почему работает: evil.com не может читать куки bank.com через JS (SOP)
```

### Метод 4: Проверка Origin/Referer

```typescript
app.post('/api/transfer', (req, res, next) => {
  const origin = req.headers.origin;
  const referer = req.headers.referer;
  
  const allowedOrigins = ['https://mybank.com', 'https://app.mybank.com'];
  
  const sourceOrigin = origin ?? (referer ? new URL(referer).origin : null);
  
  if (!sourceOrigin || !allowedOrigins.includes(sourceOrigin)) {
    return res.status(403).json({ error: 'Forbidden: invalid origin' });
  }
  
  next();
});
// Слабость: некоторые браузеры/прокси могут не отправлять Origin/Referer
// Использовать как дополнительный слой, не основной
```

### Метод 5: Custom Request Headers (для AJAX/SPA)

```typescript
// Браузер не позволяет cross-origin POST с кастомным заголовком без preflight
// Preflight (OPTIONS) блокируется сервером → CSRF невозможен

fetch('/api/transfer', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'X-Requested-With': 'XMLHttpRequest', // нестандартный заголовок → preflight
  },
  credentials: 'include',
});

// Сервер: проверяем кастомный заголовок
app.post('/api/transfer', (req, res, next) => {
  if (req.headers['x-requested-with'] !== 'XMLHttpRequest') {
    return res.status(403).json({ error: 'Direct form submission not allowed' });
  }
  next();
});
```

### CSRF и JWT (когда защита не нужна)

```typescript
// Если аутентификация через Authorization header (Bearer token), а не куки:
fetch('/api/transfer', {
  headers: { 'Authorization': `Bearer ${accessToken}` },
  // credentials: 'omit' — куки не отправляются
});

// CSRF невозможен: браузер не может добавить Authorization заголовок
// автоматически из другого сайта (SOP блокирует)
// Злоумышленник не знает accessToken (хранится в памяти, не в куке)
```

### Библиотека csurf (Express)

```typescript
import csrf from 'csurf';

const csrfProtection = csrf({
  cookie: { httpOnly: true, secure: true, sameSite: 'strict' },
});

// Для форм
app.get('/form', csrfProtection, (req, res) => {
  res.render('form', { csrfToken: req.csrfToken() });
});

app.post('/form', csrfProtection, (req, res) => {
  // csurf автоматически проверяет токен
  res.json({ success: true });
});
```

### Важные нюансы

- **SameSite=Lax — дефолт в Chrome 80+** — большинство сайтов получили защиту «бесплатно», но не стоит на это полагаться как на единственную меру
- **CSRF токены и SPA** — в SPA удобнее Double Submit Cookie или meta-тег с токеном: `<meta name="csrf-token" content="...">`
- **Re-authentication для критических действий** — смена пароля, email, банковский перевод: запрашивать пароль повторно независимо от CSRF-защиты
- **Logout через GET — антипаттерн** — logout должен быть POST с CSRF-токеном; иначе `<img src="/logout">` разлогинит пользователя

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему SameSite=Strict иногда ломает UX?** — При переходе по внешней ссылке (email, поисковик) кука не отправится → пользователь не залогинен; нужен повторный вход.
- **Можно ли обойти SameSite=Lax?** — Chrome quirk: cookies без SameSite (legacy) допускают отправку в первые 120 секунд после создания. Явно указывать SameSite=Lax.
- **CSRF vs XSS — что опаснее?** — XSS позволяет сделать CSRF без ограничений (запрос идёт из контекста страницы, обходя CSRF-защиту); поэтому XSS-защита критичнее.
- **Как SPA отличается от MPA в контексте CSRF?** — SPA обычно использует JWT в Authorization header → нет CSRF. MPA с куками → нужны CSRF-токены.

### Красные флаги (чего не говорить)

- «HTTPS защищает от CSRF» — нет, CSRF работает и по HTTPS.
- «SOP защищает от CSRF» — SOP блокирует чтение ответа, но не отправку запроса с куками.
- «Достаточно проверять Referer» — некоторые браузеры/прокси не отправляют Referer; это ненадёжный единственный метод защиты.

### Связанные темы

- `010-chto-takoe-same-origin-policy.md`
- `011-secure-i-httponly-cookies.md`
- `015-chto-takoe-cors.md`
- `009-chto-takoe-tokeny-jwt.md`
