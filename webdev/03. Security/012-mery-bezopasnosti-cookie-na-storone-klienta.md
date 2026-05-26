# Q012. Какие меры безопасности следует принять при работе с cookie на стороне клиента?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

На стороне клиента возможности прямого управления безопасностью кук ограничены — большинство мер принимаются на **сервере** (атрибуты `HttpOnly`, `Secure`, `SameSite`). Со стороны JS: не хранить sensitive данные в доступных кукax, проверять origin при postMessage, не читать и не передавать куки third-party скриптам, использовать CSP для ограничения выполняемого кода. Также важно правильно управлять жизненным циклом кук и избегать их передачи в URL.

---

## Развёрнутый ответ

### Что клиент может и должен делать

#### 1. Не хранить sensitive данные в доступных JS кукax

```javascript
// ❌ Кука доступна из JS — любой XSS-скрипт прочитает
document.cookie = 'authToken=eyJhbGciOiJIUzI1NiJ9...'; 
// (без HttpOnly — доступна через document.cookie)

// ✅ Sensitive данные — только в httpOnly кукax (устанавливаются сервером)
// Если нужна JS-доступная кука — храним только не-sensitive данные
document.cookie = 'theme=dark; SameSite=Lax; Secure';
document.cookie = 'locale=ru; SameSite=Lax; Secure';
// НЕ храним: токены, sessionId, userId, email
```

#### 2. Правильная установка кук из JS

```javascript
// Если всё-таки нужно установить куку из JS (не-sensitive данные):
function setSecureCookie(name: string, value: string, days: number): void {
  const expires = new Date(Date.now() + days * 864e5).toUTCString();
  // SameSite=Lax — минимальная защита от CSRF
  // Secure — только HTTPS
  document.cookie = `${name}=${encodeURIComponent(value)}; expires=${expires}; path=/; SameSite=Lax; Secure`;
}

// Чтение куки по имени (с декодированием)
function getCookie(name: string): string | null {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return decodeURIComponent(parts.pop()!.split(';').shift()!);
  }
  return null;
}

// Удаление куки (устанавливаем в прошлое)
function deleteCookie(name: string): void {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Lax`;
}
```

#### 3. Не передавать куки в URL

```javascript
// ❌ Никогда не передавать session token в URL
window.location.href = `/dashboard?session=${document.cookie}`;
// URL логируется в history, referer заголовках, CDN-логах, аналитике

// ✅ Куки передаются браузером автоматически в HTTP-заголовках
fetch('/api/data'); // браузер сам добавит Cookie: sessionId=...
```

#### 4. Избегать third-party cookie для sensitive операций

```javascript
// ❌ Если загружаете сторонний скрипт — он может читать ваши JS-доступные куки
// <script src="https://analytics.evil.com/tracker.js"></script>
// Этот скрипт: document.cookie → получает все JS-доступные куки вашего домена

// ✅ CSP ограничивает выполняемые скрипты
// Content-Security-Policy: script-src 'self' https://trusted-cdn.com

// ✅ Subresource Integrity для загружаемых скриптов
// <script src="https://cdn.com/lib.js" integrity="sha384-..."></script>
```

#### 5. Logout: явное удаление кук

```typescript
// На клиенте при logout:
async function logout(): Promise<void> {
  // 1. Уведомить сервер (он удалит httpOnly куки через Set-Cookie)
  await fetch('/api/auth/logout', { method: 'POST', credentials: 'include' });
  
  // 2. Удалить JS-доступные куки
  deleteCookie('theme');
  deleteCookie('user_preferences');
  
  // 3. Очистить in-memory state
  store.dispatch(clearAuth());
  
  // 4. Перенаправить на страницу входа
  window.location.replace('/login');
}
```

#### 6. Проверка origin в postMessage (для iframe-сценариев)

```javascript
// ❌ Не проверяем origin — любой сайт может отправить сообщение
window.addEventListener('message', (event) => {
  document.cookie = `token=${event.data.token}`; // опасно!
});

// ✅ Проверяем origin перед обработкой
const TRUSTED_ORIGINS = new Set(['https://payment.myapp.com', 'https://auth.myapp.com']);

window.addEventListener('message', (event) => {
  if (!TRUSTED_ORIGINS.has(event.origin)) return;
  // Обрабатываем только от доверенных origin
});
```

#### 7. Избегать куки в localStorage/sessionStorage как «кеш»

```javascript
// ❌ Некоторые разработчики копируют куки в localStorage для удобства
localStorage.setItem('sessionId', getCookie('sessionId'));
// Теперь sessionId доступен из JS → XSS может украсть

// ✅ Работать через куки напрямую, не дублировать в хранилище
```

### Атаки через куки, от которых защищается клиент

| Атака | Механизм | Защита |
|-------|----------|--------|
| Cookie Theft via XSS | JS читает document.cookie | HttpOnly на сервере + CSP |
| Cookie in URL | Токен виден в логах, referer | Никогда не в URL |
| Third-party script stealing | Сторонний скрипт читает куки | CSP + SRI |
| Session Fixation | Атакующий устанавливает sessionId жертве | Обновлять sessionId после логина (на сервере) |

### Важные нюансы

- **Scope куки** — `document.cookie` возвращает куки только текущего origin без атрибутов; нельзя читать куки поддоменов или других path из JS
- **Cookie Prefixes** (`__Secure-`, `__Host-`) устанавливает только сервер; клиент не может установить куку с этими префиксами, если условия не выполнены
- **Partitioned Cookies (CHIPS)** — новый атрибут `Partitioned`, ограничивающий third-party куки конкретным top-level сайтом; замена сторонним кукам в рамках Privacy Sandbox

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Можно ли защититься от XSS только настройкой кук?** — Нет; HttpOnly предотвращает кражу кук, но XSS может делать запросы от имени пользователя напрямую (без чтения кук). Нужен CSP.
- **Что такое session fixation?** — Атакующий устанавливает жертве известный sessionId до логина; после логина та же сессия становится аутентифицированной. Защита: regenerate session ID после успешного логина.
- **Как работает SameSite=Lax в контексте OAuth redirect?** — OAuth redirect — это top-level navigation (GET), поэтому Lax разрешает отправку state cookie. Именно поэтому Lax работает для OAuth.
- **Что изменилось с third-party cookies?** — Chrome и другие браузеры поэтапно ограничивают third-party cookies (Privacy Sandbox); альтернативы: Storage Access API, CHIPS, First-Party Sets.

### Красные флаги (чего не говорить)

- «Клиент не может ничего сделать для безопасности кук» — может: CSP, SRI, проверка origin, не хранить в URL.
- «HttpOnly куку можно прочитать из JS, если знать трюк» — нет, это браузерное ограничение без обходов.
- Не упоминать SameSite как клиентскую меру защиты (устанавливается сервером, но применяется браузером).

### Связанные темы

- `011-secure-i-httponly-cookies.md`
- `013-luchshie-praktiki-veb-khranilishcha.md`
- `021-zashchita-ot-xss.md`
- `022-zashchita-ot-csrf.md`
