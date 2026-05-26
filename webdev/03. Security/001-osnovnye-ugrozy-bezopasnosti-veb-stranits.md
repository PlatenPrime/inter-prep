# Q001. Какие основные угрозы безопасности могут возникать на веб-страницах?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Основные угрозы веб-безопасности: **XSS** (внедрение вредоносных скриптов), **CSRF** (подделка межсайтовых запросов), **SQL/Command Injection** (внедрение команд через данные), **Clickjacking** (подмена UI), **Insecure Direct Object Reference** (прямой доступ к чужим ресурсам) и **Man-in-the-Middle** (перехват трафика). Большинство из них описаны в OWASP Top 10 и воспроизводятся из-за недостаточной валидации входных данных или неправильной настройки политик браузера.

---

## Развёрнутый ответ

### Суть и классификация

Угрозы делятся по вектору атаки:

| Категория | Угроза | Вектор |
|-----------|--------|--------|
| Инъекции | XSS, SQL Injection, Command Injection | Входные данные пользователя |
| Аутентификация | Brute Force, Session Hijacking, Credential Stuffing | HTTP-сессии, cookies |
| Авторизация | IDOR, Privilege Escalation | API, URL-параметры |
| CSRF | Cross-Site Request Forgery | Браузерные куки + доверие сервера |
| Транспорт | MitM, SSL Stripping | Незащищённый HTTP |
| Конфигурация | Security Misconfiguration, Exposed Secrets | DevOps, env-переменные |
| Контент | Clickjacking, Tab Nabbing | iframe, DOM |

### Механизм ключевых угроз

**XSS (Cross-Site Scripting)**
```typescript
// Уязвимый код — вставка непроверенных данных в DOM
const userInput = location.hash.slice(1); // ?#<script>alert(1)</script>
document.getElementById('greeting').innerHTML = `Hello, ${userInput}`; // ❌

// Безопасный вариант
document.getElementById('greeting').textContent = `Hello, ${userInput}`; // ✅
```

**SQL Injection**
```typescript
// ❌ Уязвимо: конкатенация строк
const query = `SELECT * FROM users WHERE login='${req.body.login}'`;
// Атака: login = "' OR '1'='1" — вернёт всех пользователей

// ✅ Параметризованный запрос
const user = await db.query('SELECT * FROM users WHERE login = $1', [req.body.login]);
```

**CSRF (Cross-Site Request Forgery)**
```
1. Пользователь залогинен на bank.com (cookie сохранён)
2. Открывает evil.com, который содержит:
   <img src="https://bank.com/transfer?to=hacker&amount=1000" />
3. Браузер автоматически отправляет cookie bank.com → перевод выполнен
```

**Clickjacking**
```html
<!-- evil.com -->
<iframe src="https://legit-bank.com/transfer" style="opacity: 0; position: absolute; z-index: 999;"></iframe>
<button style="position: absolute; z-index: 1;">Click to win prize!</button>
<!-- Пользователь думает, что жмёт на приз, а жмёт на кнопку перевода -->
```

### Практика и применение

Checklist при code review:
- Все выводы в DOM — через `textContent`, не `innerHTML`
- Все SQL-запросы — параметризованы
- Все формы, изменяющие состояние — с CSRF-токеном
- HTTP-ответы содержат security-заголовки: `X-Frame-Options`, `CSP`, `HSTS`
- Куки помечены `HttpOnly; Secure; SameSite=Strict`
- Зависимости проверяются через `npm audit` / Snyk

### Важные нюансы

- **Defense in depth** — одного механизма защиты никогда не достаточно; нужны несколько слоёв
- **OWASP ASVS** (Application Security Verification Standard) — чеклист из 286 требований для аудита
- Большинство взломов происходит не из-за 0-day, а из-за базовых ошибок (неизменённые дефолтные пароли, отсутствие обновлений)
- **Threat modeling** (STRIDE) — систематический подход к поиску угроз ещё на этапе проектирования

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какие угрозы наиболее критичны для SPA?** — XSS (нет server-side рендеринга как барьера), CSRF (статeless JWT снимает проблему, но cookie-based auth уязвим), а также утечки токенов из localStorage.
- **Чем отличается stored XSS от reflected XSS?** — Stored постоянно хранится в БД и атакует всех посетителей; reflected — в URL и работает только при переходе жертвы по ссылке.
- **Что такое Supply Chain Attack?** — компрометация зависимости (npm пакета); актуально для экосистемы Node.js (инцидент event-stream, 2018).
- **Как строить threat model?** — STRIDE: Spoofing, Tampering, Repudiation, Information Disclosure, Denial of Service, Elevation of Privilege.

### Красные флаги (чего не говорить)

- «Мы используем HTTPS — этого достаточно» — HTTPS защищает только транспорт, не приложение.
- «Валидация на клиенте защищает от инъекций» — клиентскую валидацию обходят за секунды через DevTools или curl.
- Перечислять только XSS и SQL Injection, забывая про CSRF, IDOR, Misconfiguration.

### Связанные темы

- `002-chto-takoe-owasp-top-10.md`
- `020-chto-takoe-mezhsaytovyi-skripting-xss.md`
- `022-zashchita-ot-csrf.md`
