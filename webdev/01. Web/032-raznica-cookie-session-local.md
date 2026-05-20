# Q032. Разница между `cookie`, `sessionStorage` и `localStorage`?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Cookie** — небольшие пары ключ–значение, которые браузер **прикрепляет к HTTP-запросам** на сервер (сессии, auth, tracking); лимит ~4 КБ, настраиваются `HttpOnly`, `Secure`, `SameSite`, срок `Expires`/`Max-Age`. **`sessionStorage`** и **`localStorage`** — только на клиенте, ~5–10 МБ, не уходят на сервер автоматически; session живёт до закрытия вкладки, local — до явного удаления. Для авторизации чаще cookie (httpOnly); для UI-состояния — storage.

---

## Развёрнутый ответ

### Суть и определение

Три механизма решают разные задачи:

- **Cookie** — транспорт состояния HTTP, сервер читает в каждом запросе.
- **sessionStorage** — временное состояние одной вкладки.
- **localStorage** — долговременные клиентские настройки.

Все привязаны к origin (для cookie ещё `Domain`/`Path`).

### Как это работает

**Cookie:** сервер отдаёт `Set-Cookie`; браузер сохраняет и шлёт `Cookie` на подходящие URL. `document.cookie` доступен только если не `HttpOnly`. CSRF — риск при cookie-based auth без защиты.

**localStorage / sessionStorage:** Web Storage API, только строки, синхронно. `storage` event — между вкладками для localStorage.

### Практика и применение

| Задача | Выбор |
|--------|--------|
| Session id, refresh token (httpOnly) | Cookie |
| Корзина для гостя без логина | localStorage или сервер |
| Многошаговая форма в одной вкладке | sessionStorage |
| A/B тест, аналитика third-party | Cookie (с учётом privacy) |

Без httpOnly cookie токен в localStorage проще украсть через XSS-скрипт.

### Важные нюансы и краеугольные камни

- **Размер:** переполнение cookie ломает запросы; localStorage — QuotaExceededError.
- **GDPR / ePrivacy:** неessential cookies — согласие.
- **Subdomain:** `Domain=.example.com` — общие cookie; storage не шарится между поддоменами без одного origin.
- **SSR:** только cookie приходят на сервер в заголовке.
- Дублирование JWT и в cookie, и в localStorage — путаница и баги logout.

### Примеры

```javascript
// Cookie из JS (не для секретов — лучше Set-Cookie с сервера)
document.cookie = 'theme=dark; path=/; max-age=31536000; SameSite=Lax';

// Storage
sessionStorage.setItem('step', '2');
localStorage.setItem('cart', JSON.stringify(items));
```

```http
Set-Cookie: sid=abc; Path=/; HttpOnly; Secure; SameSite=Strict
```

---

## Сравнение

| Критерий | Cookie | sessionStorage | localStorage |
|----------|--------|----------------|--------------|
| Отправка на сервер | Да, автоматически | Нет | Нет |
| Типичный лимит | ~4 КБ на cookie, лимит на домен | ~5–10 МБ | ~5–10 МБ |
| Срок жизни | Expires / Max-Age / session | До закрытия вкладки | Пока не удалят |
| Доступ из JS | Да, кроме HttpOnly | Да | Да |
| Область видимости | Domain, Path | Вкладка (top-level) | Origin, все вкладки |
| API | `document.cookie` / Set-Cookie | Web Storage | Web Storage |
| Безопасность для токенов | HttpOnly + Secure предпочтительно | Уязвим к XSS | Уязвим к XSS |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **SameSite=Lax vs Strict vs None?** — CSRF и cross-site POST/GET.
- **Почему не JWT в localStorage?** — XSS; альтернатива — httpOnly + BFF.
- **Сколько cookie на домен?** — лимиты браузера (~180–300), размер заголовка.
- **Third-party cookies deprecation?** — Privacy Sandbox, влияние на рекламу.
- **Как синхронизировать корзину между устройствами?** — сервер, не localStorage alone.

### Красные флаги (чего не говорить)

- «Все три взаимозаменяемы».
- «Cookie всегда плохие» — нужны для stateful HTTP-сессий.
- Хранить пароли в любом из трёх.

### Связанные темы

- [031-web-storage.md](031-web-storage.md)
- [033-indexeddb.md](033-indexeddb.md)
- [035-service-workers.md](035-service-workers.md)

---
