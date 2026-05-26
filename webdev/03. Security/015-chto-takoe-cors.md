# Q015. Что такое CORS?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**CORS (Cross-Origin Resource Sharing)** — механизм браузера, позволяющий серверу явно указать, каким сторонним origin разрешено читать его ответы. Это контролируемое ослабление Same-Origin Policy: сервер добавляет заголовки `Access-Control-Allow-Origin` и другие, на основании которых браузер решает — разрешить или заблокировать ответ для JavaScript. CORS — это исключительно браузерная политика; серверы между собой CORS не применяют.

---

## Развёрнутый ответ

### Суть механизма

```
Без CORS:
  SPA на https://app.com → fetch('https://api.com/data') → браузер блокирует ответ

С CORS:
  Сервер api.com отвечает:
    Access-Control-Allow-Origin: https://app.com
  Браузер: «сервер разрешил» → JS получает данные ✅
```

### Simple Requests vs Preflighted Requests

**Simple Request** — не вызывает preflight:
- Методы: GET, HEAD, POST
- Заголовки: только стандартные (Accept, Content-Type: text/plain|multipart/form-data|application/x-www-form-urlencoded)
- Запрос отправляется сразу; браузер проверяет CORS-заголовки в ответе

**Preflighted Request** — браузер сначала делает OPTIONS-запрос:
```
Условия preflight (любое из):
- Метод: PUT, DELETE, PATCH
- Заголовок: Authorization, Content-Type: application/json, любой кастомный
```

```http
/* 1. Preflight (OPTIONS) */
OPTIONS /api/data HTTP/1.1
Origin: https://app.com
Access-Control-Request-Method: POST
Access-Control-Request-Headers: Content-Type, Authorization

/* 2. Ответ сервера на preflight */
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: https://app.com
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Content-Type, Authorization
Access-Control-Max-Age: 86400

/* 3. Основной запрос (только если preflight прошёл) */
POST /api/data HTTP/1.1
Origin: https://app.com
Content-Type: application/json
Authorization: Bearer eyJ...

/* 4. Ответ с CORS-заголовком */
HTTP/1.1 200 OK
Access-Control-Allow-Origin: https://app.com
```

### Реализация на сервере

```typescript
import cors from 'cors';
import express from 'express';

const app = express();

// Вариант 1: простой (небезопасный в production)
app.use(cors()); // Access-Control-Allow-Origin: * — для всех

// Вариант 2: настроенный whitelist
const ALLOWED_ORIGINS = new Set([
  'https://myapp.com',
  'https://admin.myapp.com',
  process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : '',
].filter(Boolean));

app.use(cors({
  origin: (origin, callback) => {
    // origin = undefined для server-to-server запросов (curl, Postman)
    if (!origin || ALLOWED_ORIGINS.has(origin)) {
      callback(null, true);
    } else {
      callback(new Error(`CORS: origin ${origin} not allowed`));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID'],
  exposedHeaders: ['X-Total-Count', 'X-Rate-Limit-Remaining'],
  credentials: true,          // разрешить куки в кросс-origin запросах
  maxAge: 86400,              // кеш preflight на 24 часа
  optionsSuccessStatus: 204,
}));
```

### Credentials (куки и Authorization header)

```javascript
// Клиент: явно запрашивает отправку кук/credentials
fetch('https://api.com/data', {
  credentials: 'include', // включает куки
  headers: { 'Authorization': 'Bearer token' },
});

// Сервер ДОЛЖЕН ответить:
// Access-Control-Allow-Origin: https://app.com (НЕ '*' — запрещено с credentials)
// Access-Control-Allow-Credentials: true
```

```typescript
// Если credentials: true, нельзя использовать wildcard origin
// ❌ Неправильно — браузер заблокирует:
res.setHeader('Access-Control-Allow-Origin', '*');
res.setHeader('Access-Control-Allow-Credentials', 'true');

// ✅ Правильно:
res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '');
res.setHeader('Access-Control-Allow-Credentials', 'true');
res.setHeader('Vary', 'Origin'); // важно для кеширования!
```

### Заголовок Vary: Origin

```http
Vary: Origin
```

Без этого заголовка CDN/прокси может закешировать ответ с одним `Access-Control-Allow-Origin` и вернуть его другому origin — нарушение безопасности.

### Распространённые ошибки

```typescript
// ❌ Ошибка 1: CORS на клиенте — не имеет смысла
// CORS — серверная политика, браузер её исполняет
// "Отключить CORS" на клиенте нельзя (если только не через proxy)

// ❌ Ошибка 2: Разрешать все origins в production
app.use(cors({ origin: '*', credentials: true })); // браузер отклонит с credentials

// ❌ Ошибка 3: Забыть про preflight OPTIONS
app.post('/api/data', handler); // OPTIONS не обрабатывается → preflight падает
// Решение: cors() middleware обрабатывает OPTIONS автоматически

// ❌ Ошибка 4: Разрешать null origin
if (origin === 'null' || !origin) callback(null, true); // уязвимость
// null origin → файловые протоколы, sandboxed iframe — опасно разрешать
```

### CORS в development: proxy

```javascript
// Vite — проксирование в dev режиме (избегает CORS)
// vite.config.ts
export default {
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:8080',
        changeOrigin: true,
      },
    },
  },
};
// Запросы на /api идут через dev-сервер Vite → нет кросс-origin
```

### Важные нюансы

- **CORS не защищает сервер** — он только контролирует, что JS прочитает ответ; запрос всё равно доходит до сервера. Для защиты сервера нужны CSRF-токены или SameSite cookies.
- **CORS и безопасность API** — `Access-Control-Allow-Origin: *` ОК для публичного API (без auth); опасно для API с авторизацией
- **Preflight cache** — `Access-Control-Max-Age` кеширует результат preflight; слишком большое значение замедляет обнаружение изменений в политике

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем CORS отличается от SOP?** — SOP — политика браузера (запрет по умолчанию); CORS — механизм сервера (явное разрешение). SOP блокирует, CORS разрешает.
- **Почему CORS не защищает от CSRF?** — CORS блокирует JS от чтения ответа; CSRF не читает ответ — он только инициирует действие (форма, img). Куки отправляются браузером автоматически.
- **Что если сервер не поддерживает CORS?** — Использовать CORS proxy (в dev), BFF (backend-for-frontend), JSONP (устарело), или попросить владельца API добавить заголовки.
- **Как работает `Access-Control-Expose-Headers`?** — По умолчанию JS видит только «простые» заголовки ответа; exposedHeaders указывает дополнительные заголовки, доступные через `response.headers.get()`.

### Красные флаги (чего не говорить)

- «CORS настраивается на клиенте» — CORS-политика задаётся сервером.
- «Wildcard `*` безопасен для авторизованного API» — нет, если используются credentials.
- «CORS — это защита от атак» — CORS контролирует доступ JS к данным, а не защищает сервер.

### Связанные темы

- `010-chto-takoe-same-origin-policy.md`
- `016-podhody-dlya-mezhdomennykh-zaprosov.md`
- `022-zashchita-ot-csrf.md`
