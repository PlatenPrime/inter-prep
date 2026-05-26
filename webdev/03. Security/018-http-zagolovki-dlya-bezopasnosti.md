# Q018. Какие типы HTTP заголовков могут быть полезны для обеспечения безопасности веб-приложений?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

Ключевые HTTP security headers: **`Content-Security-Policy`** (защита от XSS), **`Strict-Transport-Security`** (HTTPS only), **`X-Frame-Options`** или `frame-ancestors` в CSP (защита от Clickjacking), **`X-Content-Type-Options`** (защита от MIME-sniffing), **`Referrer-Policy`** (контроль утечки URL в Referer), **`Permissions-Policy`** (ограничение API браузера). Все вместе обеспечивают Defense in Depth на транспортном уровне и уровне браузера.

---

## Развёрнутый ответ

### Полный набор security headers

```typescript
// Express + helmet (охватывает большинство заголовков)
import helmet from 'helmet';
import express from 'express';

const app = express();

app.use(helmet({
  contentSecurityPolicy: { /* см. 017-csp.md */ },
  hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
  frameguard: { action: 'deny' },
  xContentTypeOptions: true,
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  permittedCrossDomainPolicies: false,
}));
```

### Детальный разбор каждого заголовка

#### 1. `Content-Security-Policy` (CSP)

```http
Content-Security-Policy: default-src 'self'; script-src 'self' 'nonce-{n}'; object-src 'none'
```
Защита: XSS, data exfiltration, inline scripts. Подробно: `017-chto-takoe-content-security-policy-csp.md`

#### 2. `Strict-Transport-Security` (HSTS)

```http
Strict-Transport-Security: max-age=31536000; includeSubDomains; preload
```

- Браузер запоминает, что сайт всегда HTTPS
- Защита от SSL Stripping (MitM-атака, понижающая до HTTP)
- `max-age=31536000` — 1 год
- `includeSubDomains` — применяется к sub.myapp.com
- `preload` — для внесения в HSTS Preload List браузеров

```typescript
// Важно: первый запрос всё ещё может быть HTTP!
// Решение: редирект 301 на HTTPS + HSTS
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https' && process.env.NODE_ENV === 'production') {
    return res.redirect(301, `https://${req.host}${req.url}`);
  }
  next();
});
```

#### 3. `X-Frame-Options`

```http
X-Frame-Options: DENY           # Запретить любые iframe
X-Frame-Options: SAMEORIGIN     # Разрешить только тот же origin
```

Защита: Clickjacking (страница не может быть встроена в iframe злоумышленника).

**Современная альтернатива:** `Content-Security-Policy: frame-ancestors 'none'` — более гибко и поддерживает whitelist domain.

#### 4. `X-Content-Type-Options`

```http
X-Content-Type-Options: nosniff
```

Запрещает браузеру «угадывать» MIME-тип ответа (MIME-sniffing). Без этого заголовка:

```
Атакующий загружает файл с расширением .jpg, но содержимым JS
Браузер: «содержимое выглядит как JavaScript» → выполняет как script
С nosniff: браузер использует Content-Type из заголовка, не угадывает
```

#### 5. `Referrer-Policy`

```http
Referrer-Policy: strict-origin-when-cross-origin
Referrer-Policy: no-referrer
Referrer-Policy: same-origin
```

Контролирует, какой URL отправляется в заголовке `Referer`:

| Политика | Same-origin | Cross-origin |
|----------|-------------|-------------|
| `no-referrer` | — | — |
| `same-origin` | Полный URL | — |
| `strict-origin-when-cross-origin` | Полный URL | Только origin |
| `unsafe-url` | Полный URL | Полный URL |

Защита: Предотвращает утечку sensitive URL (с токенами, ID) во внешние запросы (аналитика, CDN).

```
❌ Без политики: https://myapp.com/reset-password?token=abc123
   → Referer: https://myapp.com/reset-password?token=abc123 (внешний сайт видит токен!)

✅ strict-origin-when-cross-origin:
   → Referer: https://myapp.com (только origin)
```

#### 6. `Permissions-Policy` (ранее Feature-Policy)

```http
Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()
```

Запрещает использование браузерных API на странице и в iframe:

```typescript
app.use((req, res, next) => {
  res.setHeader('Permissions-Policy', [
    'camera=()',           // запретить доступ к камере
    'microphone=()',       // запретить доступ к микрофону
    'geolocation=()',      // запретить геолокацию
    'payment=(self)',      // Payment API только для самого сайта
    'interest-cohort=()',  // FLoC (приватность)
    'autoplay=()',
  ].join(', '));
  next();
});
```

#### 7. `Cross-Origin-Opener-Policy` (COOP)

```http
Cross-Origin-Opener-Policy: same-origin
```

Изолирует browsing context от cross-origin windows. Защита от Spectre-подобных атак (side-channel через shared memory). Нужен для использования `SharedArrayBuffer` и `performance.measureUserAgentSpecificMemory()`.

#### 8. `Cross-Origin-Embedder-Policy` (COEP)

```http
Cross-Origin-Embedder-Policy: require-corp
```

Требует, чтобы все встраиваемые ресурсы явно разрешали cross-origin использование (`Cross-Origin-Resource-Policy: cross-origin`). В паре с COOP включает «cross-origin isolation».

#### 9. `Cross-Origin-Resource-Policy` (CORP)

```http
Cross-Origin-Resource-Policy: same-site
Cross-Origin-Resource-Policy: same-origin
Cross-Origin-Resource-Policy: cross-origin
```

Указывает, кто может загружать ресурс. `same-origin` — только тот же origin (защита от Spectre).

#### 10. `Cache-Control` для sensitive страниц

```http
Cache-Control: no-store, no-cache, must-revalidate
Pragma: no-cache
```

Для страниц с sensitive данными (личный кабинет, банк) — запрет кеширования.

### Автоматическая проверка заголовков

```bash
# securityheaders.com — онлайн анализ
# или через curl:
curl -I https://myapp.com | grep -i "strict-transport\|content-security\|x-frame\|x-content-type"

# Helmet в Express — автоматически устанавливает безопасные дефолты
```

### Важные нюансы

- **Порядок приоритетов** — если одновременно установлены `X-Frame-Options` и `frame-ancestors` в CSP, CSP имеет приоритет в современных браузерах
- **`nosniff` и CORS** — при `nosniff` браузер строже проверяет Content-Type в CORS-запросах
- **Security headers не спасут от уязвимостей в коде** — они слой защиты, не замена валидации/санитизации

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как проверить security headers своего сайта?** — securityheaders.com, Mozilla Observatory, OWASP ZAP, `curl -I`.
- **Что такое HSTS Preload?** — Список доменов, хардкоженный в Chrome/Firefox; браузер никогда не соединяется с ними по HTTP, даже в первый раз.
- **Как COOP/COEP/CORP связаны с Spectre?** — Spectre использует timing side-channels через SharedArrayBuffer; COOP+COEP включают cross-origin isolation, изолируя процесс браузера и делая атаку невозможной.
- **Какой минимальный набор headers для новых проектов?** — HSTS, CSP, X-Content-Type-Options, Referrer-Policy, X-Frame-Options / frame-ancestors — это базовый minimum.

### Красные флаги (чего не говорить)

- Называть только 1-2 заголовка (например, только CORS headers) — это неполный ответ.
- «Заголовки безопасности необязательны» — они часть OWASP Security Misconfiguration и влияют на оценку безопасности.
- Путать `X-XSS-Protection` с CSP — `X-XSS-Protection: 1; mode=block` устарел и отключён в Chrome; CSP — правильная замена.

### Связанные темы

- `017-chto-takoe-content-security-policy-csp.md`
- `014-chto-takoe-ssl-tls.md`
- `023-zashchita-ot-klikdzhekinga.md`
- `005-metody-povysheniya-bezopasnosti-veb-prilozhenii.md`
