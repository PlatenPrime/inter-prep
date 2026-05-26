# Q016. Подходы для междоменных запросов в JavaScript?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Основные подходы: **CORS** (официальный стандарт — сервер разрешает конкретные origin), **Proxy** (запросы идут через тот же origin, избегая ограничения), **JSONP** (устаревший хак через `<script>` тег — только GET). Для production правильный выбор — CORS с настроенным whitelist или архитектурный паттерн **BFF** (Backend for Frontend), выступающий прокси. JSONP не рекомендуется из-за уязвимостей.

---

## Развёрнутый ответ

### 1. CORS (Cross-Origin Resource Sharing) — рекомендуемый

Официальный механизм W3C. Сервер явно разрешает запросы от конкретных origin.

```typescript
// Сервер добавляет заголовки:
app.use(cors({
  origin: ['https://app.com', 'https://admin.app.com'],
  credentials: true,
}));

// Клиент:
const data = await fetch('https://api.other.com/endpoint', {
  credentials: 'include',
}).then(r => r.json());
```

Подробно: см. `015-chto-takoe-cors.md`

### 2. Proxy (Development и Production)

**Development Proxy (Vite/webpack):**
```typescript
// vite.config.ts
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://external-api.com',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        // Запрос: /api/users → https://external-api.com/users
        // Браузер видит запрос к localhost → нет CORS
      },
    },
  },
});
```

**Production Proxy (nginx):**
```nginx
# Запросы на /api/ проксируются к backend, который в той же сети
location /api/ {
    proxy_pass http://backend-service:3000/;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    
    # CORS заголовки на уровне nginx (если нужен internal API)
    add_header Access-Control-Allow-Origin $http_origin always;
}
```

**BFF (Backend for Frontend):**
```typescript
// SPA → BFF (тот же домен) → External API
// BFF — Node.js сервис, который проксирует к внешним API

app.get('/api/weather', async (req, res) => {
  // Клиент запрашивает /api/weather (тот же origin)
  // BFF проксирует к stороннему API (server-side — нет CORS)
  const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${req.query.city}&appid=${WEATHER_API_KEY}`);
  const data = await response.json();
  res.json(data); // BFF скрывает API key от клиента
});
```

### 3. JSONP (устаревший, не рекомендуется)

Хак: `<script src>` не ограничен SOP → можно загрузить JSON с callback.

```javascript
// ❌ JSONP — устаревший подход, только GET, уязвим к XSS

// Клиент: добавляет <script> тег
function jsonp(url: string, callback: string): Promise<unknown> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}`;
    (window as Record<string, unknown>)[callbackName] = (data: unknown) => {
      delete (window as Record<string, unknown>)[callbackName];
      document.body.removeChild(script);
      resolve(data);
    };

    const script = document.createElement('script');
    script.src = `${url}?callback=${callbackName}`;
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

// Сервер отвечает не JSON, а JS:
// jsonp_1234567890({ "data": "value" })

// Уязвимость: злоумышленник может подменить содержимое → XSS
// Решение: никогда не использовать JSONP; использовать CORS
```

### 4. postMessage (для iframe/window)

Для общения между страницами разных origin через iframe или popup:

```typescript
// Страница A (sender): https://app.com
const targetWindow = (document.querySelector('iframe') as HTMLIFrameElement).contentWindow;

targetWindow?.postMessage(
  { type: 'REQUEST_DATA', payload: { userId: '123' } },
  'https://embed.service.com', // targetOrigin — обязательно указывать!
);

// Страница B (receiver): https://embed.service.com
window.addEventListener('message', (event: MessageEvent) => {
  // Всегда проверяем origin!
  if (event.origin !== 'https://app.com') return;
  
  const { type, payload } = event.data;
  if (type === 'REQUEST_DATA') {
    event.source?.postMessage(
      { type: 'RESPONSE_DATA', data: fetchData(payload.userId) },
      event.origin,
    );
  }
});
```

### 5. WebSocket (нет SOP ограничений)

WebSocket не ограничен SOP, но сервер должен проверять Origin:

```typescript
import { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', (ws, req) => {
  const origin = req.headers.origin;
  const allowedOrigins = ['https://app.com', 'http://localhost:3000'];
  
  if (!origin || !allowedOrigins.includes(origin)) {
    ws.close(1008, 'Forbidden origin');
    return;
  }
  
  ws.on('message', (data) => { /* обработка */ });
});
```

### 6. Server-Sent Events (SSE)

SSE подчиняется CORS — сервер должен отвечать с `Access-Control-Allow-Origin`:

```typescript
// Клиент:
const eventSource = new EventSource('https://api.other.com/events', {
  withCredentials: true, // для кук
});
eventSource.onmessage = (event) => console.log(event.data);

// Сервер:
app.get('/events', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Access-Control-Allow-Origin', req.headers.origin ?? '');
  res.setHeader('Cache-Control', 'no-cache');
  
  const interval = setInterval(() => {
    res.write(`data: ${JSON.stringify({ time: Date.now() })}\n\n`);
  }, 1000);
  
  req.on('close', () => clearInterval(interval));
});
```

### Сравнение подходов

| Подход | Методы | Требует изменений сервера | Безопасность | Рекомендация |
|--------|--------|--------------------------|--------------|-------------|
| CORS | Все | Да (заголовки) | Высокая | ✅ Производство |
| Dev Proxy | Все | Нет | Только dev | ✅ Разработка |
| BFF Proxy | Все | Нет (свой сервис) | Высокая | ✅ Производство |
| JSONP | Только GET | Да (callback) | Низкая (XSS) | ❌ Устарел |
| postMessage | Iframe/Popup | Нет | Средняя | ✅ Встраивание |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему JSONP устарел?** — Только GET, выполняет JS из ответа (XSS если ответ подменён), нет обработки ошибок HTTP. Заменён CORS.
- **Что такое BFF-паттерн?** — Backend for Frontend — отдельный сервис для каждого frontend клиента; агрегирует данные из микросервисов, хранит секреты (API ключи), избегает CORS, адаптирует ответы под нужды клиента.
- **Как настроить CORS для мобильного приложения?** — Нативные приложения (iOS/Android) не применяют SOP/CORS — они делают запросы напрямую; CORS нужен только для браузера.
- **Что произойдёт если установить `targetOrigin: '*'` в postMessage?** — Сообщение получит любое окно; рекомендуется всегда указывать конкретный origin.

### Красные флаги (чего не говорить)

- «Отключаем CORS через `--disable-web-security` в Chrome» — это только для разработки; в production недопустимо.
- Предлагать JSONP как решение для новых проектов.
- «Proxy — это обход CORS» — это архитектурное решение, при котором CORS становится неактуальным, а не «обход».

### Связанные темы

- `015-chto-takoe-cors.md`
- `010-chto-takoe-same-origin-policy.md`
