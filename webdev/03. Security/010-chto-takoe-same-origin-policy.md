# Q010. Что такое same-origin policy в контексте JavaScript?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**Same-Origin Policy (SOP)** — фундаментальный механизм безопасности браузера, запрещающий JavaScript одного происхождения (origin) читать данные другого происхождения. Origin определяется тремя компонентами: **схема** (protocol), **хост** (hostname) и **порт**. SOP предотвращает атаки, при которых вредоносный сайт читает cookies, localStorage или DOM-содержимое банковского сайта, открытого в соседней вкладке.

---

## Развёрнутый ответ

### Определение Origin

Origin = scheme + host + port

```
https://example.com:443/path?query

scheme: https
host:   example.com
port:   443 (по умолчанию для https)
```

```
Сравнение с origin https://example.com:

URL                              | Same-Origin? | Причина
---------------------------------|--------------|--------
https://example.com/other/page  | ✅ Да        | Совпадает всё
https://example.com:443/page    | ✅ Да        | 443 — дефолтный порт https
http://example.com/page         | ❌ Нет       | Другая схема (http vs https)
https://sub.example.com/page    | ❌ Нет       | Другой хост (subdomain)
https://example.com:8080/page   | ❌ Нет       | Другой порт
https://example.org/page        | ❌ Нет       | Другой домен
```

### Что ограничивает SOP

**Читать ответ** из cross-origin запроса (fetch/XMLHttpRequest):
```javascript
// На странице evil.com:
fetch('https://bank.com/api/account-balance')
  .then(r => r.json())
  .then(data => {
    // ❌ SOP: браузер заблокирует чтение ответа
    // Даже если запрос дойдёт до сервера, JS не получит данные
    sendToHacker(data);
  });
```

**Доступ к DOM** через iframe:
```javascript
// На evil.com:
const frame = document.getElementById('bankFrame'); // src="https://bank.com"
const balance = frame.contentDocument.getElementById('balance'); 
// ❌ SOP: DOMException: Blocked a frame with origin "https://evil.com"
```

**Доступ к cookies** другого origin:
```javascript
// Cookies bank.com недоступны из evil.com через document.cookie
// SOP защищает автоматически
```

### Что SOP НЕ блокирует

```html
<!-- Запросы, инициируемые HTML-тегами, НЕ блокируются SOP: -->
<img src="https://other.com/image.png" />      <!-- ✅ загружается -->
<script src="https://cdn.com/lib.js"></script>  <!-- ✅ загружается и выполняется -->
<link href="https://fonts.com/style.css" />     <!-- ✅ загружается -->
<form action="https://bank.com/transfer" method="POST">  <!-- ✅ отправляется! -->
<!-- Именно поэтому CSRF возможен -->
```

```javascript
// fetch/XHR ОТПРАВЛЯЕТ запрос (с cookies), но браузер блокирует ЧТЕНИЕ ответа
// Для simple requests (GET без custom headers) — запрос долетает до сервера
// Для preflighted — браузер сначала проверяет CORS preflight
```

### SOP и механизмы ослабления

**CORS** (Cross-Origin Resource Sharing) — официальный способ ослабить SOP:
```
Сервер отвечает: Access-Control-Allow-Origin: https://myapp.com
Браузер: разрешает JS прочитать ответ
```

**document.domain** (устаревший):
```javascript
// На sub.example.com и example.com можно было:
document.domain = 'example.com'; // теперь запрещено в современных браузерах
```

**postMessage** — безопасная межorigin-коммуникация:
```javascript
// Страница A (https://app.com):
const iframe = document.querySelector('iframe'); // src="https://payment.com"
iframe.contentWindow.postMessage({ type: 'GET_BALANCE' }, 'https://payment.com');

// Страница B (https://payment.com):
window.addEventListener('message', (event) => {
  if (event.origin !== 'https://app.com') return; // проверяем origin!
  if (event.data.type === 'GET_BALANCE') {
    event.source?.postMessage({ balance: 1000 }, event.origin);
  }
});
```

### SOP vs CORS

```
SOP  — политика БРАУЗЕРА: блокирует чтение ответов из других origin
CORS — механизм СЕРВЕРА: указывает браузеру, каким origin разрешено читать ответы

SOP = проблема (ограничение)
CORS = решение (контролируемое ослабление)
```

### Важные нюансы

- **SOP не защищает от CSRF** — форма или `<img>` отправляет запрос (с cookies!) несмотря на SOP; браузер просто не даёт JS прочитать ответ. Для защиты от CSRF нужны CSRF-токены или `SameSite` cookies.
- **SOP применяется браузером** — серверы между собой (curl, server-side fetch) не ограничены SOP
- **Credentialed requests** — по умолчанию кросс-origin запросы не включают cookies; нужно явно: `fetch(url, { credentials: 'include' })` + `Access-Control-Allow-Credentials: true` на сервере

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему CSRF возможен при наличии SOP?** — SOP блокирует чтение ответа, но не отправку запроса; форма может отправить POST с cookies жертвы.
- **Как работает CORS preflight?** — Для non-simple запросов браузер сначала делает OPTIONS-запрос с `Origin` и `Access-Control-Request-Method`; сервер отвечает разрешёнными методами/заголовками.
- **Что такое null origin?** — Запросы из file://, data:, sandboxed iframe имеют `Origin: null`; нельзя добавлять `null` в whitelist CORS — это уязвимость.
- **Зачем `Access-Control-Allow-Origin: *` опасен с credentials?** — Браузер запрещает `credentials: include` при `*`; но без credentials wildcard открывает API для любого сайта.

### Красные флаги (чего не говорить)

- «SOP защищает от CSRF» — нет; SOP не блокирует отправку форм и simple requests.
- «SOP блокирует `<script>` с других доменов» — нет; `<script src>` загружается свободно (отсюда JSONP).
- «Если ответ не читается, значит запрос не отправился» — запрос долетает до сервера, SOP блокирует только чтение ответа в JS.

### Связанные темы

- `015-chto-takoe-cors.md`
- `016-podhody-dlya-mezhdomennykh-zaprosov.md`
- `022-zashchita-ot-csrf.md`
