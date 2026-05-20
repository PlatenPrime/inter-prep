# Q028. Как работает `JSONP`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**JSONP (JSON with Padding)** — обход ограничения **same-origin policy** для GET-запросов до появления CORS: сервер возвращает не JSON, а **JavaScript**, вызывающий глобальную функцию с данными. Клиент создаёт `<script src="https://other.com/api?callback=cb">`, браузер выполняет ответ как скрипт. Сегодня это **legacy**; вместо JSONP используют CORS, прокси или postMessage.

---

## Развёрнутый ответ

### Суть и определение

Same-origin policy блокирует чтение ответа `fetch`/XHR с другого домена. Тег `<script>` **не** подчиняется тому же ограничению на чтение — загружаемый скрипт выполняется. JSONP использует это: API отдаёт `callbackName({ "data": 1 })`, где `callbackName` заранее объявлена на странице.

Исторически — кросс-доменные виджеты, аналитика, старые API (например, Twitter/Flickr). Спецификации как у CORS нет — соглашение de facto.

### Как это работает

1. Клиент генерирует уникальное имя функции, например `jsonp_12345`, и вешает её на `window`.
2. Вставляет `<script src="https://api.example.com/data?callback=jsonp_12345">`.
3. Сервер отвечает `Content-Type: application/javascript` и телом `jsonp_12345({...})`.
4. Браузер выполняет скрипт → вызывается callback с данными → скрипт удаляется из DOM.

Работает только для **GET** (семантика script). POST/PUT через JSONP невозможны в классическом виде.

### Практика и применение

- Подключение **сторонних виджетов** на чужих доменах в эпоху IE6–IE9 без CORS.
- Сейчас в продакшене — почти не стартуют новые фичи на JSONP: **CORS** + JSON, или BFF-прокси на своём домене.

Без альтернативы (CORS) кросс-доменные данные в старых браузерах были недоступны для XHR — JSONP был компромиссом с дырами в безопасности.

### Важные нюансы и краеугольные камни

- **XSS:** если сервер отражает `callback` без валидации — выполнение произвольного JS (`callback=alert(1)//`).
- Нет нормальных **HTTP-кодов ошибок** в теле — только успешный скрипт или сетевой сбой.
- **CSRF:** GET с побочными эффектами + JSONP опасны; API должны быть идемпотентны и без мутаций.
- Утечка данных через **Referer** и логи CDN с query `callback`.
- Не работает с **CSP** `script-src` без whitelist домена API.

### Примеры

```javascript
// Клиент (legacy-паттерн)
function jsonp(url, callbackName) {
  return new Promise((resolve, reject) => {
    const name = `jsonp_${Date.now()}`;
    window[name] = (data) => {
      resolve(data);
      delete window[name];
      script.remove();
    };
    const script = document.createElement('script');
    script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${name}`;
    script.onerror = () => reject(new Error('JSONP failed'));
    document.head.appendChild(script);
  });
}

// Ответ сервера:
// jsonp_1739123456789({"status":"ok"})
```

```javascript
// Современная замена
const res = await fetch('https://api.example.com/data', {
  credentials: 'include',
});
const data = await res.json(); // при Access-Control-Allow-Origin
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему JSONP только GET?** — семантика загрузки script, не произвольный HTTP-метод.
- **Чем CORS безопаснее?** — контроль origin, preflight, не выполнение ответа как кода.
- **Как эксплуатировать небезопасный callback?** — reflected XSS через имя функции.
- **Работает ли с CSP?** — нужен явный домен в `script-src`.
- **Альтернатива для iframe?** — `postMessage` между окнами.

### Красные флаги (чего не говорить)

- «JSONP — современный способ кросс-доменных запросов».
- «JSONP безопасен, это же JSON» — ответ исполняется как код.
- Предлагать JSONP для мутаций данных или отправки токенов.

### Связанные темы

- [027-raznica-polling-ws-sse.md](027-raznica-polling-ws-sse.md)
- [030-raznica-json-i-xml.md](030-raznica-json-i-xml.md)
- [003-security-cors.md](../03.%20security/) *(тема security, если есть)*

---
