# Q031. Что такое веб-хранилище (web storage)?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Web Storage** — браузерное API для хранения пар «ключ–значение» на стороне клиента в рамках **origin** (протокол + хост + порт). Включает **`localStorage`** (данные сохраняются между сессиями) и **`sessionStorage`** (живут до закрытия вкладки). Объём порядка 5–10 МБ на origin, синхронный доступ из main thread. Для больших структурированных данных и индексов используют **IndexedDB**; для серверной синхронизации и HTTP — **cookies**.

---

## Развёрнутый ответ

### Суть и определение

Спецификация HTML5 Web Storage дополняет cookies: проще API (`getItem`/`setItem`), нет автоматической отправки на сервер с каждым запросом, больше лимит. Данные — только строки; объекты сериализуют в JSON.

Не путать с:

- **Cookies** — заголовки HTTP, лимит ~4 КБ, `HttpOnly`, `Secure`, `SameSite`.
- **IndexedDB** — NoSQL, транзакции, индексы, асинхронно.
- **Cache API** — Response-объекты для Service Worker.

### Как это работает

Оба хранилища привязаны к **origin**. `localStorage` общий для всех вкладок одного origin; изменения можно слушать через `storage` event **в других вкладках** (не в той, где писали).

`sessionStorage` изолирован **на вкладку** (top-level browsing context): дубликат вкладки не копирует sessionStorage.

Синхронный API блокирует main thread при больших значениях — на мобильных заметно.

### Практика и применение

- **Тема UI, язык, черновики форм** — `localStorage`.
- **Состояние мастера на одной вкладке** — `sessionStorage`.
- **JWT в localStorage** — спорно: уязвимость к XSS; предпочтительнее httpOnly cookie + CSRF-защита.

Без web storage пришлось бы тащить всё на сервер или в cookies — лишний трафик и лимиты.

### Важные нюансы и краеугольные камни

- **Private mode** — данные могут очищаться при закрытии; не гарантирована персистентность.
- **Quota exceeded** — `setItem` бросает `QuotaExceededError`; нужен try/catch и очистка.
- **XSS = полный доступ** к localStorage — не хранить секреты.
- SSR не имеет доступа к storage — гидратация только на клиенте.
- Синхронность — для тяжёлых данных использовать IndexedDB.

### Примеры

```javascript
// Сохранение объекта
localStorage.setItem('prefs', JSON.stringify({ theme: 'dark', lang: 'ru' }));

const prefs = JSON.parse(localStorage.getItem('prefs') ?? '{}');

// Слушатель изменений в другой вкладке
window.addEventListener('storage', (e) => {
  if (e.key === 'prefs') console.log(e.newValue);
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается от cookie?** — размер, не уходит на сервер автоматически, нет HttpOnly.
- **Где хранить токен?** — trade-off XSS vs CSRF; httpOnly cookie vs memory.
- **storage event — почему не в той же вкладке?** — спецификация для межвкладочной синхронизации.
- **Лимиты по браузерам?** — ~5 МБ, зависит от диска и режима.
- **Когда IndexedDB вместо localStorage?** — большие объёмы, индексы, офлайн-каталог.

### Красные флаги (чего не говорить)

- «localStorage безопасен для JWT» без оговорки про XSS.
- «sessionStorage общий между вкладками».
- Хранить бинарники или мегабайты в localStorage.

### Связанные темы

- [032-raznica-cookie-session-local.md](032-raznica-cookie-session-local.md)
- [033-indexeddb.md](033-indexeddb.md)
- [016-chto-takoe-http-cookie.md](016-chto-takoe-http-cookie.md) *(если создан)*

---
