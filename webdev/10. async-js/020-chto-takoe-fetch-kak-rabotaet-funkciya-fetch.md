# Q020. Что такое `fetch()`? Как работает функция `fetch()`?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

`fetch()` — нативный браузерный (и Node.js 18+) API для выполнения HTTP-запросов, основанный на промисах. Функция возвращает `Promise<Response>`, который resolve'ится как только получены заголовки ответа (не тело). Тело читается отдельно через методы объекта `Response`: `.json()`, `.text()`, `.blob()`. Важный нюанс: `fetch` **не выбрасывает ошибку** при HTTP 4xx/5xx — только при сетевой ошибке.

---

## Развёрнутый ответ

### Суть и определение

`fetch` появился в браузерах как замена громоздкому `XMLHttpRequest`. Он спроектирован вокруг промисов и потоков (Streams API), что делает его мощным и компонуемым инструментом.

**Стандарт:** Fetch API (WHATWG Living Standard). Доступен в Node.js 18+ нативно (ранее — через `node-fetch`).

### Как это работает

```javascript
fetch(url, options)
  → Promise<Response>
```

**Жизненный цикл запроса:**

1. `fetch('/api/data')` — создаёт и отправляет HTTP-запрос.
2. Promise resolve'ится с `Response` **при получении заголовков** (тело ещё не прочитано).
3. Тело читается через стриминг: `.json()` / `.text()` / `.blob()` / `.arrayBuffer()` / `.formData()` — каждый возвращает новый Promise.

**Объект `Response`:**

| Свойство/метод | Описание |
|----------------|----------|
| `response.ok` | `true` если статус 200–299 |
| `response.status` | HTTP статус код (200, 404, 500...) |
| `response.headers` | `Headers` объект |
| `response.json()` | Promise → распарсенный JSON |
| `response.text()` | Promise → строка |
| `response.blob()` | Promise → Blob (для файлов) |
| `response.body` | ReadableStream (стриминг) |

**Параметры `options`:**

```javascript
fetch(url, {
  method: 'POST',          // 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' ...
  headers: {               // Headers или plain object
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  },
  body: JSON.stringify(data), // строка, FormData, Blob, URLSearchParams
  credentials: 'include',    // 'omit' | 'same-origin' | 'include' (куки)
  signal: abortController.signal, // отмена запроса
  cache: 'no-cache',         // стратегия кэширования
  mode: 'cors',              // 'cors' | 'no-cors' | 'same-origin'
});
```

### Практика и применение

- **GET-запрос** — `fetch('/api/users')`.
- **POST с JSON** — `fetch('/api/users', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify(data) })`.
- **Загрузка файла** — `fetch('/api/upload', { method: 'POST', body: formData })` (не ставить `Content-Type` вручную — браузер сам задаёт boundary для multipart).
- **Стриминг больших данных** — читать `response.body` через `ReadableStream` по частям.
- **Отмена запроса** — `AbortController` + передача `signal`.

### Важные нюансы и краеугольные камни

- **`fetch` не reject'ится при 4xx/5xx** — нужно проверять `response.ok` или `response.status` вручную.
- Тело `Response` можно прочитать **только один раз** — второй вызов `.json()` выбросит ошибку. Используйте `response.clone()` если нужно читать дважды.
- `fetch` по умолчанию **не отправляет куки** для кросс-доменных запросов — нужно `credentials: 'include'`.
- В Node.js до версии 18 — используйте пакет `node-fetch` или `axios`.
- Нет встроенного таймаута — используйте `AbortSignal.timeout(ms)` (Node 17.3+, browsers 2022+) или `AbortController` + `setTimeout`.

### Примеры

```javascript
// Базовый GET с обработкой HTTP-ошибок
async function getUser(id) {
  const response = await fetch(`/api/users/${id}`);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

// POST с JSON
async function createUser(userData) {
  const response = await fetch('/api/users', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`,
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const errorBody = await response.json().catch(() => ({ message: 'Unknown error' }));
    throw new Error(errorBody.message);
  }

  return response.json();
}

// Отмена запроса
async function fetchWithTimeout(url, timeoutMs = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, { signal: controller.signal });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeoutId);
  }
}

// Или с AbortSignal.timeout (современный браузер/Node 17.3+)
const data = await fetch('/api/data', {
  signal: AbortSignal.timeout(5000),
}).then(r => r.json());

// Загрузка файла с FormData
async function uploadFile(file) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('name', file.name);
  // НЕ ставим Content-Type — браузер задаёт multipart boundary сам

  const response = await fetch('/api/upload', {
    method: 'POST',
    body: formData,
  });

  return response.json();
}

// Стриминг большого ответа
async function streamLargeResponse(url) {
  const response = await fetch(url);
  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let result = '';

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    result += decoder.decode(value, { stream: true });
    updateProgress(result.length);
  }

  return result;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `fetch` не reject'ится при 404?** — По спецификации `fetch` reject'ится только при сетевой ошибке (нет соединения, DNS), HTTP-ошибки — это валидный ответ.
- **Как реализовать таймаут для `fetch`?** — `AbortController` + `setTimeout` или `AbortSignal.timeout(ms)`.
- **Чем `fetch` отличается от `axios`?** — `axios`: автоматически throws при 4xx/5xx, JSON-трансформация по умолчанию, перехватчики (interceptors), поддержка Node.js без полифилла; `fetch` — нативный, минималистичный, Streams API.
- **Как отправить куки с кросс-доменным `fetch`-запросом?** — `credentials: 'include'` + сервер должен вернуть `Access-Control-Allow-Credentials: true`.

### Красные флаги (чего не говорить)

- «`fetch` выбрасывает ошибку при 404 или 500» — нет, только при сетевой ошибке.
- «Тело `Response` можно прочитать несколько раз» — только один раз; `response.clone()` для повторного чтения.
- «`fetch` доступен в Node.js всегда» — нативно только с Node.js 18+.

### Связанные темы

- `018-chto-takoe-ajax.md`
- `021-chto-takoe-json-v-javascript-kak-ego-mozhno-ispolzovat.md`
- `015-chto-takoe-async-await.md`
