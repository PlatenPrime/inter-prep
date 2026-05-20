# Q034. Что такое History API в браузере?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**History API** (`window.history`) позволяет управлять **стеком сессии браузера** без полной перезагрузки страницы: менять URL и состояние через `pushState` / `replaceState` и реагировать на навигацию «назад/вперёд» через `popstate`. Это основа **клиентского роутинга** в SPA (React Router, Vue Router). Расширение **Navigation API** (новее) даёт более явную модель переходов.

---

## Развёрнутый ответ

### Суть и определение

До History API смена hash (`#page`) была единственным способом менять URL без запроса к серверу. `pushState(state, unused, url)` добавляет запись в history; `replaceState` — заменяет текущую. `state` — произвольный сериализуемый объект (клон structured clone).

Событие **`popstate`** срабатывает при переходе по history (не при каждом `pushState` — только при back/forward).

### Как это работает

1. Пользователь открывает `/` — первая запись.
2. SPA вызывает `history.pushState({ route: 'about' }, '', '/about')` — URL меняется, сервер не перезагружается.
3. Кнопка «Назад» — `popstate`, роутер читает `event.state` или парсит `location.pathname`.
4. Сервер должен отдавать **index.html** на все deep links (fallback в nginx/Vercel).

`history.length`, `back()`, `forward()`, `go(n)` — программная навигация.

### Практика и применение

- **SPA/SSR гибриды** — Next.js App Router, клиентские переходы между страницами.
- **Модальные окна с URL** — `/item/42` для шаринга состояния.
- **Аналитика** — virtual pageviews при `pushState`.

Без History API каждый «переход» — full reload, потеря состояния и медленный UX.

### Важные нюансы и краеугольные камни

- **`pushState` не проверяет** same-origin жёстко для всех сценариев — осторожно с open redirect при некорректном url.
- Серверный **404** на прямом заходе `/about` — забытый rewrite на `index.html`.
- `popstate` **не** при первом `pushState` — начальное состояние нужно синхронизировать вручную.
- Scroll restoration — `history.scrollRestoration = 'manual'` в длинных списках.
- Hash routing vs History API — hash не требует server config, но уродливые URL.

### Примеры

```javascript
function navigate(path, state = {}) {
  history.pushState(state, '', path);
  renderRoute(path, state);
}

window.addEventListener('popstate', (event) => {
  renderRoute(location.pathname, event.state);
});

// Замена без новой записи в стеке
history.replaceState({ tab: 2 }, '', '/settings?tab=2');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем отличается от `location.hash`?** — path URL, SEO, server fallback.
- **Как настроить сервер для SPA?** — try_files / rewrite на index.html.
- **Navigation API vs History API?** — intercept navigation, transitions (поддержка растёт).
- **SSR + client navigation?** — гидратация, совпадение URL и state.
- **Можно ли pushState на чужой origin?** — нет, security error.

### Красные флаги (чего не говорить)

- «pushState загружает страницу с сервера» — нет, только меняет URL в bar.
- Игнорировать конфигурацию сервера для deep links.
- Путать `popstate` с `hashchange` для path-based routing.

### Связанные темы

- [038-csr.md](038-csr.md)
- [039-ssr.md](039-ssr.md)
- [040-ssr-vs-csr.md](040-ssr-vs-csr.md)

---
