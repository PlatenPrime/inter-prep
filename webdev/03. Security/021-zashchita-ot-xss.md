# Q021. Как можно защищаться от межсайтового скриптинга (XSS)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Защита от XSS — многоуровневая: **контекстно-зависимое экранирование** вывода (output encoding), **санитизация HTML** (DOMPurify для rich text), **Content Security Policy** (блокировка inline-скриптов), **безопасные API** (`textContent` вместо `innerHTML`), **HttpOnly cookies** (защита от кражи сессии). Нет одного универсального средства — нужен весь набор, так как XSS бывает нескольких типов.

---

## Развёрнутый ответ

### 1. Безопасные DOM API (приоритет)

```javascript
const userInput = '<script>alert(1)</script><b>Hello</b>';

// ❌ Опасно: интерпретирует HTML
element.innerHTML = userInput;         // Выполнит скрипт
element.outerHTML = userInput;
document.write(userInput);

// ✅ Безопасно: вставляет как текст
element.textContent = userInput;       // '<script>alert(1)</script><b>Hello</b>'
element.innerText = userInput;         // (аналогично, но учитывает стили)

// ✅ Безопасно: setAttribute для стандартных атрибутов
element.setAttribute('title', userInput); // экранируется браузером

// ❌ НЕ безопасно: href и src могут содержать javascript: URI
anchor.href = userInput; // javascript:alert(1) — выполнится!
// ✅ Проверяем протокол:
const url = new URL(userInput, window.location.origin);
if (['http:', 'https:'].includes(url.protocol)) {
  anchor.href = url.toString();
}
```

### 2. Контекстно-зависимое экранирование

Разные контексты требуют разного экранирования:

```typescript
// HTML-контекст (для текстовых узлов и атрибутов)
function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

// JS-контекст (вставка данных в <script> тег)
function escapeJs(str: string): string {
  return JSON.stringify(str); // включает кавычки
  // или использовать библиотеку: he, xss-filters
}

// URL-контекст
function escapeUrl(str: string): string {
  return encodeURIComponent(str);
}

// CSS-контекст (вставка в style атрибут)
function escapeCss(str: string): string {
  return str.replace(/[^a-zA-Z0-9\-_]/g, (char) => `\\${char.codePointAt(0)?.toString(16)} `);
}
```

```html
<!-- HTML-контекст: экранировать < > & " ' -->
<div title="<%= escapeHtml(userInput) %>"><%= escapeHtml(userInput) %></div>

<!-- JS-контекст: JSON.stringify -->
<script>const data = <%- JSON.stringify(serverData) %>;</script>

<!-- URL-контекст: encodeURIComponent -->
<a href="/search?q=<%= encodeURIComponent(query) %>">Search</a>

<!-- CSS-контекст: только whitelist значений -->
<div style="color: <%= allowedColor %>">
  <!-- НЕ вставлять user input напрямую в style -->
```

### 3. Санитизация HTML (для Rich Text)

Когда необходимо разрешить пользователям форматировать текст (жирный, курсив), но не выполнять скрипты:

```typescript
import DOMPurify from 'dompurify';

// Конфигурация для markdown-подобного редактора
const ALLOWED_TAGS = ['b', 'i', 'em', 'strong', 'a', 'p', 'ul', 'ol', 'li', 'br', 'code', 'pre'];
const ALLOWED_ATTR = ['href', 'title', 'class'];

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    // Запретить javascript: href
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick'],
    // Разрешить только http/https ссылки
    ALLOWED_URI_REGEXP: /^(https?:|\/)/i,
  });
}

// Использование в React:
function CommentContent({ html }: { html: string }) {
  return (
    <div
      dangerouslySetInnerHTML={{ __html: sanitizeHtml(html) }}
    />
  );
}
```

### 4. Content Security Policy (CSP)

```typescript
// Основная линия обороны — даже если XSS внедрён, браузер его заблокирует
app.use((req, res, next) => {
  const nonce = crypto.randomBytes(16).toString('base64');
  res.locals.nonce = nonce;
  
  res.setHeader('Content-Security-Policy', [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `object-src 'none'`,  // отключить Flash/плагины
    `base-uri 'self'`,
    `connect-src 'self' https://api.myapp.com`, // ограничить fetch-запросы
  ].join('; '));
  
  next();
});
```

### 5. Защита в фреймворках

**React:**
```tsx
// ✅ Безопасно — React автоматически экранирует
function UserProfile({ name }: { name: string }) {
  return <div>Hello, {name}</div>; // <script> будет отображён как текст
}

// ❌ Опасно — обходит экранирование
function Unsafe({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: html }} />;
}

// ✅ Безопасно с санитизацией
function SafeHtml({ html }: { html: string }) {
  return <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(html) }} />;
}
```

**Vue:**
```vue
<!-- ✅ Безопасно — автоматическое экранирование -->
<template>
  <div>{{ userInput }}</div>
</template>

<!-- ❌ Опасно -->
<template>
  <div v-html="userInput"></div>  <!-- XSS если не санитизировано -->
</template>

<!-- ✅ Безопасно -->
<template>
  <div v-html="sanitize(userInput)"></div>
</template>
```

### 6. HttpOnly Cookies

```typescript
res.cookie('sessionId', token, {
  httpOnly: true,   // недоступна через document.cookie
  secure: true,
  sameSite: 'strict',
});
// Даже при XSS — атакующий не прочитает куку из JS
// Но сможет делать запросы с ней (браузер отправляет автоматически)
```

### 7. Валидация на сервере

```typescript
import { z } from 'zod';
import DOMPurify from 'isomorphic-dompurify';

// Строгая схема — не принимать raw HTML там, где он не нужен
const CommentSchema = z.object({
  text: z.string()
    .min(1).max(1000)
    .transform(s => DOMPurify.sanitize(s, { ALLOWED_TAGS: [] })), // strip все теги
});

app.post('/api/comments', async (req, res) => {
  const parsed = CommentSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: 'Invalid input' });
  
  const { text } = parsed.data; // чистый текст, без HTML
  await db.comments.create({ data: { text, userId: req.user.id } });
});
```

### Контрольный список защиты от XSS

```
✅ Использовать textContent вместо innerHTML
✅ DOMPurify для rich text (если HTML необходим)
✅ CSP с nonce (блокирует inline XSS)
✅ HttpOnly + Secure для session cookies
✅ Валидация и санитизация на сервере
✅ Контекстное экранирование (HTML/JS/URL/CSS)
✅ Избегать eval(), new Function(), setTimeout(string)
✅ Проверять URL протокол (javascript: запрещён)
✅ SRI для внешних скриптов
✅ Регулярный аудит зависимостей (npm audit)
```

### Важные нюансы

- **Экранирование ≠ санитизация** — escapeHtml(`<b>text</b>`) → `&lt;b&gt;text&lt;/b&gt;` (отображает теги как текст); sanitize(`<b>text</b>`) → `<b>text</b>` (оставляет разрешённые теги)
- **Trusted Types API** — новый браузерный API, требующий передавать только TrustedHTML в dangerous sinks; полностью устраняет DOM XSS; CSP `require-trusted-types-for 'script'`
- **Template Literals и XSS** — `\`Hello ${name}\`` безопасен только для textContent; в innerHTML — уязвим

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React безопасен по умолчанию?** — JSX компилируется в `React.createElement()`, который использует `textContent` для строковых значений, не `innerHTML`.
- **DOMPurify vs самодельный whitelist — что лучше?** — DOMPurify проверен аудитами, обновляется при нахождении обходов. Самодельный whitelist почти всегда имеет дыры.
- **Что такое Trusted Types и как они помогают?** — Браузерный API; все dangerous sinks принимают только специальные объекты TrustedHTML/TrustedScript, созданные через политику; нельзя вставить строку напрямую.
- **Как защититься от DOM XSS через location.hash?** — Никогда не использовать `innerHTML` с данными из URL; использовать `textContent`; Trusted Types.

### Красные флаги (чего не говорить)

- «Достаточно экранировать на сервере» — DOM-based XSS происходит полностью на клиенте, сервер не участвует.
- «Мы используем фреймворк — XSS нам не страшен» — `dangerouslySetInnerHTML`, `v-html` отключают защиту фреймворка.
- «Валидация только на клиенте защищает от Stored XSS» — серверная валидация обязательна.

### Связанные темы

- `020-chto-takoe-mezhsaytovyi-skripting-xss.md`
- `017-chto-takoe-content-security-policy-csp.md`
- `011-secure-i-httponly-cookies.md`
