# Q018. Что такое AJAX?

> **Источник:** [10. async-js.md](../10.%20async-js.md) · **Тема:** Async JavaScript

---

## Короткий ответ

AJAX (Asynchronous JavaScript and XML) — техника построения веб-приложений, при которой браузер обменивается данными с сервером в фоне, без полной перезагрузки страницы. Название историческое: сегодня вместо XML используется преимущественно JSON, а вместо `XMLHttpRequest` — `fetch` API. AJAX лежит в основе всех современных Single Page Applications.

---

## Развёрнутый ответ

### Суть и определение

Термин «AJAX» ввёл Джесси Джеймс Гаррет в статье 2005 года. До AJAX веб-приложения работали по схеме «запрос → полная перезагрузка страницы». AJAX позволил обновлять только часть страницы.

**Оригинальный стек AJAX:**
- **A**synchronous — запрос не блокирует страницу
- **J**avaScript — логика на клиенте
- **A**nd — связующее звено
- **X**ML — формат данных (ныне заменён JSON)

**Современный стек:**
- `fetch()` API (или `axios`, `ky`) вместо `XMLHttpRequest`
- JSON вместо XML
- `async/await` вместо колбэков

### Как это работает

```
Браузер                    Сервер
   │                          │
   │  1. Пользователь вводит  │
   │     текст поиска         │
   │                          │
   │  2. JS создаёт HTTP-     │
   │     запрос (фоновой)     │
   │──────────── GET /api/search?q=... ──────────→│
   │                          │  3. Сервер обрабатывает
   │                          │     и возвращает JSON
   │←───────────── { results: [...] } ───────────│
   │                          │
   │  4. JS обновляет DOM,    │
   │     страница не          │
   │     перезагружается      │
```

**Через `XMLHttpRequest` (классика):**

```javascript
const xhr = new XMLHttpRequest();
xhr.open('GET', '/api/data');
xhr.onreadystatechange = function() {
  if (xhr.readyState === 4 && xhr.status === 200) {
    const data = JSON.parse(xhr.responseText);
    render(data);
  }
};
xhr.send();
```

**Через `fetch` (современно):**

```javascript
const response = await fetch('/api/data');
const data = await response.json();
render(data);
```

### Практика и применение

- **Автодополнение (autocomplete)** — запрос при каждом вводе символа, обновление выпадающего списка.
- **Бесконечная прокрутка** — загрузка следующей страницы при достижении конца списка.
- **Валидация форм** — проверка занятости email/username на сервере без отправки формы.
- **Живые обновления** — опрос сервера (polling) для получения новых сообщений/уведомлений.
- **SPA навигация** — загрузка контента для новых «страниц» без перезагрузки HTML-каркаса.

### Важные нюансы и краеугольные камни

- **CORS** (Cross-Origin Resource Sharing) — браузер блокирует AJAX-запросы на другой домен без специальных заголовков от сервера (`Access-Control-Allow-Origin`).
- **CSRF** — AJAX-запросы с куками могут использоваться для атак; защита: CSRF-токены, `SameSite` cookies.
- `XMLHttpRequest` поддерживает прогресс загрузки (`xhr.onprogress`) — `fetch` из коробки не поддерживает (нужно читать ReadableStream).
- **Polling vs WebSocket** — AJAX-polling (периодические запросы) менее эффективен для real-time данных, чем WebSocket.

### Примеры

```javascript
// Современный AJAX: поиск с debounce
async function searchUsers(query) {
  if (!query.trim()) return [];

  const response = await fetch(`/api/users/search?q=${encodeURIComponent(query)}`, {
    headers: { 'Accept': 'application/json' },
    signal: AbortSignal.timeout(5000), // таймаут
  });

  if (!response.ok) {
    throw new Error(`Search failed: ${response.status}`);
  }

  return response.json();
}

// Debounced autocomplete
let abortController = null;

inputEl.addEventListener('input', async (e) => {
  abortController?.abort(); // отменяем предыдущий запрос
  abortController = new AbortController();

  try {
    const results = await fetch(
      `/api/search?q=${e.target.value}`,
      { signal: abortController.signal }
    ).then(r => r.json());
    renderSuggestions(results);
  } catch (err) {
    if (err.name !== 'AbortError') throw err;
  }
});

// Отправка формы без перезагрузки
async function submitForm(formData) {
  const response = await fetch('/api/submit', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(Object.fromEntries(formData)),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message);
  }

  return response.json();
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `fetch` отличается от `XMLHttpRequest`?** — `fetch` промис-based, нативно поддерживает `async/await`, но не имеет встроенной отмены (нужен `AbortController`) и прогресса загрузки.
- **Что такое CORS и как он влияет на AJAX?** — Браузерная политика безопасности; запросы на другой origin блокируются без `Access-Control-Allow-Origin` от сервера.
- **Как реализовать загрузку файла через AJAX с прогрессом?** — `XMLHttpRequest` с `xhr.upload.onprogress`, или `fetch` + `ReadableStream`.
- **Чем AJAX-polling отличается от WebSocket?** — Polling: клиент периодически запрашивает данные; WebSocket: двунаправленное постоянное соединение, более эффективно для real-time.

### Красные флаги (чего не говорить)

- «AJAX = XMLHttpRequest» — AJAX это техника, реализуемая через `fetch`, `axios`, `XMLHttpRequest`.
- «AJAX всегда использует XML» — сегодня стандарт — JSON, название историческое.
- «AJAX — это библиотека» — это паттерн/техника, не конкретный инструмент.

### Связанные темы

- `019-plyusy-i-minusy-ispolzovaniya-ajax.md`
- `020-chto-takoe-fetch-kak-rabotaet-funkciya-fetch.md`
- `001-raznica-mezhdu-sinhronnymi-i-asinhronnymi-funkciyami.md`
