# Q017. Что такое Content Security Policy (CSP)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**CSP (Content Security Policy)** — HTTP-заголовок, позволяющий указать браузеру, из каких источников разрешено загружать ресурсы (скрипты, стили, изображения, iframe и т.д.). CSP — основной инструмент защиты от **XSS**: даже если злоумышленник внедрил `<script>` тег, браузер не выполнит его, если источник не в whitelist. Задаётся через заголовок `Content-Security-Policy` или `<meta http-equiv>`.

---

## Развёрнутый ответ

### Суть и механизм

Без CSP браузер выполняет любой скрипт на странице — инлайновый или из любого источника. CSP позволяет явно перечислить разрешённые источники для каждого типа ресурсов.

```http
Content-Security-Policy: default-src 'self'; script-src 'self' https://cdn.trusted.com
```

При нарушении политики браузер:
1. Блокирует загрузку/выполнение ресурса
2. Опционально отправляет отчёт на `report-uri`

### Директивы CSP

| Директива | Что контролирует |
|-----------|-----------------|
| `default-src` | Fallback для всех типов ресурсов |
| `script-src` | JavaScript файлы и инлайн-скрипты |
| `style-src` | CSS файлы и инлайн-стили |
| `img-src` | Изображения |
| `connect-src` | fetch, XHR, WebSocket, EventSource |
| `font-src` | Шрифты |
| `frame-src` | iframe |
| `media-src` | video, audio |
| `object-src` | Flash, плагины (рекомендуется `'none'`) |
| `form-action` | Куда могут отправляться формы |
| `base-uri` | Разрешённые значения `<base href>` |
| `frame-ancestors` | Кто может встраивать страницу в iframe |
| `upgrade-insecure-requests` | HTTP → HTTPS автоматически |

### Значения источников

```
'none'           — запретить всё
'self'           — только текущий origin
'unsafe-inline'  — разрешить инлайновые скрипты/стили (ослабляет защиту)
'unsafe-eval'    — разрешить eval(), Function(), setTimeout("string")
'nonce-{base64}' — разрешить конкретный инлайн по одноразовому nonce
'sha256-{hash}'  — разрешить конкретный инлайн по хешу содержимого
https:           — любой HTTPS источник
data:            — data: URI (для изображений)
```

### Практика: строгий CSP с nonce

```typescript
// Генерация nonce на сервере для каждого запроса
import crypto from 'crypto';

app.use((req, res, next) => {
  res.locals.nonce = crypto.randomBytes(16).toString('base64');
  next();
});

app.use((req, res, next) => {
  const nonce = res.locals.nonce;
  
  res.setHeader('Content-Security-Policy', [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' https://cdn.trusted.com`,
    `style-src 'self' 'nonce-${nonce}' https://fonts.googleapis.com`,
    `img-src 'self' data: https://cdn.myapp.com`,
    `font-src 'self' https://fonts.gstatic.com`,
    `connect-src 'self' https://api.myapp.com wss://ws.myapp.com`,
    `frame-src 'none'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
    `upgrade-insecure-requests`,
    `report-uri /api/csp-report`,
  ].join('; '));
  
  next();
});

// В шаблоне используем nonce:
// <script nonce="<%= nonce %>">...</script>
// <link rel="stylesheet" nonce="<%= nonce %>">
```

### CSP в React/Next.js

```typescript
// next.config.ts
import { NextConfig } from 'next';
import crypto from 'crypto';

const generateNonce = () => crypto.randomBytes(16).toString('base64');

// Через middleware:
// middleware.ts
import { NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const nonce = Buffer.from(crypto.randomUUID()).toString('base64');
  
  const csp = [
    `default-src 'self'`,
    `script-src 'self' 'nonce-${nonce}' 'strict-dynamic'`,
    `style-src 'self' 'nonce-${nonce}'`,
    `img-src 'self' blob: data: https:`,
    `connect-src 'self'`,
    `font-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action 'self'`,
    `frame-ancestors 'none'`,
  ].join('; ');

  const response = NextResponse.next({
    request: { headers: new Headers({ 'x-nonce': nonce }) },
  });
  
  response.headers.set('Content-Security-Policy', csp);
  return response;
}
```

### strict-dynamic

```
script-src 'strict-dynamic' 'nonce-{nonce}'
```

`strict-dynamic` позволяет скриптам, загруженным через nonce, динамически добавлять новые `<script>` теги (нужно для бандлеров). При этом whitelist доменов игнорируется для динамически добавленных скриптов.

### Report-Only режим (для постепенного внедрения)

```http
Content-Security-Policy-Report-Only: default-src 'self'; report-uri /api/csp-violations

/* Браузер НЕ блокирует, только отправляет отчёты */
/* Позволяет понять, что сломается перед включением блокировки */
```

```typescript
// Обработчик отчётов
app.post('/api/csp-violations', express.json({ type: 'application/csp-report' }), (req, res) => {
  const report = req.body['csp-report'];
  logger.warn('CSP Violation', {
    documentUri: report['document-uri'],
    violatedDirective: report['violated-directive'],
    blockedUri: report['blocked-uri'],
  });
  res.status(204).end();
});
```

### Типичные проблемы при внедрении CSP

```
❌ 'unsafe-inline' в script-src — обесценивает всю защиту от XSS
❌ Забыть object-src 'none' — Flash/плагины обходят CSP
❌ Не ограничить frame-ancestors — clickjacking возможен
❌ data: в script-src — позволяет выполнять base64-encoded скрипты
✅ Использовать nonce или hash вместо 'unsafe-inline'
✅ Начинать с Report-Only, затем переходить к Enforce
```

### Важные нюансы

- **CSP ≠ серебряная пуля** — защищает от inline XSS, но не от DOM-based XSS через `eval` (если разрешён) или `innerHTML`
- **Совместимость** — все современные браузеры поддерживают CSP Level 3; IE поддерживает только Level 1
- **`<meta>` тег** — менее предпочтителен, чем заголовок: не работает для некоторых директив (`frame-ancestors`, `report-uri`)

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `'unsafe-inline'` плохо?** — Разрешает выполнение любого inline скрипта, сводя на нет защиту от XSS — именно то, от чего CSP должен защищать.
- **Чем `'nonce'` лучше `'unsafe-inline'`?** — Nonce уникален для каждого запроса; только скрипты с этим nonce выполняются; атакующий не знает nonce заранее.
- **Что такое `'strict-dynamic'` и зачем нужен?** — Позволяет скриптам с nonce загружать дополнительные скрипты динамически; необходим для работы бандлеров в CSP-окружении.
- **Как CSP помогает против data exfiltration?** — `connect-src` ограничивает, куда JS может делать fetch/XHR; злоумышленник не может отправить украденные данные на свой сервер.

### Красные флаги (чего не говорить)

- «Добавляем `'unsafe-inline'` — проще» — это отключает XSS-защиту CSP.
- «CSP защищает от CSRF» — нет, CSP про источники ресурсов, не про межсайтовые запросы.
- «CSP нужен только на страницах с пользовательским вводом» — нужен на всех страницах.

### Связанные темы

- `018-http-zagolovki-dlya-bezopasnosti.md`
- `019-chto-takoe-sri-subresource-integrity.md`
- `020-chto-takoe-mezhsaytovyi-skripting-xss.md`
- `021-zashchita-ot-xss.md`
