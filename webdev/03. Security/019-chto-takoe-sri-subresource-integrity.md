# Q019. Что такое SRI (Subresource Integrity)? Как его использовать для улучшения безопасности?

> **Источник:** [03. security.md](../03.%20security.md) · **Тема:** Security

---

## Короткий ответ

**SRI (Subresource Integrity)** — механизм, позволяющий браузеру верифицировать, что загружаемый внешний ресурс (скрипт, CSS) не был изменён. Реализуется через атрибут `integrity` в тегах `<script>` и `<link>`, содержащий криптографический хеш ожидаемого содержимого (SHA-256/384/512). Если хеш не совпадает, браузер блокирует загрузку. Защищает от **Supply Chain атак**: если CDN или npm-пакет скомпрометирован, изменённый файл не выполнится.

---

## Развёрнутый ответ

### Суть проблемы

```html
<!-- Без SRI: если cdn.example.com взломан или подменён -->
<script src="https://cdn.example.com/react@18.2.0/react.min.js"></script>
<!-- Вредоносный код выполнится в браузере пользователя -->
```

Реальные инциденты: атака на `event-stream` npm (2018), `polyfill.io` (2024 — домен продан злоумышленникам, загружал malware).

### Синтаксис SRI

```html
<!-- Скрипт с SRI -->
<script
  src="https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js"
  integrity="sha512-WFN04846sdKMIP5LKNphMaWzU7YpMyCU245etK3g/2ARYbPK9Ub18eG+ljU96qKRCWh+quCY7yefSmlkQw1ANQ=="
  crossorigin="anonymous"
  referrerpolicy="no-referrer"
></script>

<!-- CSS с SRI -->
<link
  rel="stylesheet"
  href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.2/css/bootstrap.min.css"
  integrity="sha512-b2QcS5SsA8tZodcDtGRELiGv5SaKSk1vDHDaQRda0htPYWZ6046lr3kJ5bAAQdpV2mmA/4v0wQF9MyU6/pDIAg=="
  crossorigin="anonymous"
/>
```

**Атрибут `integrity`:** `{алгоритм}-{base64-хеш}`
- Алгоритмы: `sha256`, `sha384`, `sha512` (рекомендуется sha384 или sha512)
- Несколько хешей через пробел (fallback)

**Атрибут `crossorigin`:** обязателен для SRI с CORS-ресурсами:
- `anonymous` — без credentials
- `use-credentials` — с cookies

### Генерация хеша

```bash
# Вариант 1: openssl
curl -s https://cdnjs.cloudflare.com/ajax/libs/lodash.js/4.17.21/lodash.min.js | \
  openssl dgst -sha384 -binary | openssl base64 -A

# Вариант 2: через Node.js
node -e "
  const crypto = require('crypto');
  const fs = require('fs');
  const content = fs.readFileSync('lodash.min.js');
  const hash = crypto.createHash('sha384').update(content).digest('base64');
  console.log('sha384-' + hash);
"

# Вариант 3: онлайн — srihash.org
```

### Интеграция в процесс сборки

```typescript
// webpack-subresource-integrity plugin
// webpack.config.js
const { SubresourceIntegrityPlugin } = require('webpack-subresource-integrity');

module.exports = {
  output: {
    crossOriginLoading: 'anonymous',
  },
  plugins: [
    new SubresourceIntegrityPlugin({
      hashFuncNames: ['sha384'],
    }),
  ],
};

// Генерирует в HTML:
// <script src="/js/app.abc123.js" integrity="sha384-..." crossorigin="anonymous"></script>
```

```typescript
// Vite
// vite.config.ts
import { createHtmlPlugin } from 'vite-plugin-html';

export default {
  plugins: [
    // vite-plugin-sri вычисляет хеши автоматически для всех ассетов
  ],
};
```

### CSP и SRI — усиление защиты

```http
Content-Security-Policy: 
  script-src 'self' https://cdnjs.cloudflare.com 'sha384-{hash}';
  require-sri-for script style;
```

`require-sri-for script style` — требует наличие SRI для ВСЕХ скриптов и стилей. Браузер отклонит ресурс без атрибута `integrity`.

### SRI для npm-пакетов (через CDN)

```html
<!-- Вместо бесконтрольного CDN лучше хостить самостоятельно -->
<!-- Но если CDN неизбежен, всегда проверять: -->

<!-- Актуальные хеши для популярных библиотек — cdnjs.com, jsdelivr.com -->
<script
  src="https://cdn.jsdelivr.net/npm/vue@3.4.0/dist/vue.global.prod.js"
  integrity="sha384-АКТУАЛЬНЫЙ_ХЕШ"
  crossorigin="anonymous"
></script>
```

### Ограничения SRI

```
✅ Защищает от:
  - Компрометации CDN
  - Man-in-the-Middle подмены ресурса
  - Случайного изменения файла

❌ НЕ защищает от:
  - Изначально вредоносного пакета (SRI проверяет целостность, не безопасность содержимого)
  - Уязвимостей в самой библиотеке (неизменённой)
  - Динамически загружаемых ресурсов через JS (fetch, dynamic import)
  
⚠️ Проблема с динамическим контентом:
  - Если сервер отдаёт файл, генерируемый на лету — SRI неприменим (хеш всегда разный)
  - SRI не работает с ServiceWorker intercept
```

### Практика и применение

Когда использовать SRI:
- Любые внешние CDN-скрипты (jQuery, React, Vue, Bootstrap)
- Внешние шрифты и стили (если критично, обычно самохостинг лучше)
- В CI/CD: автоматически генерировать и обновлять хеши при обновлении версий

Лучший подход — самохостинг:
```javascript
// Вместо загрузки с CDN — бандлируем зависимости в свой бандл
// npm install lodash → import _ from 'lodash' → webpack включает в bundle
// Нет внешней зависимости → нет риска компрометации CDN
```

### Важные нюансы

- **Версии с плавающим номером** — `lodash@latest` на CDN несовместим с SRI; хеш изменится при выходе новой версии. Всегда фиксировать точную версию.
- **Множественные хеши** — можно указать несколько алгоритмов для совместимости: `integrity="sha256-... sha384-..."`
- **SRI и Service Workers** — SW может перехватить запрос до проверки SRI; нужен COEP для строгой изоляции

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **SRI vs самохостинг — что лучше?** — Самохостинг предпочтительнее: нет зависимости от третьей стороны, нет DNS-lookups, лучший контроль над кешированием. SRI — если CDN неизбежен.
- **Как SRI помогает при `polyfill.io`-инциденте?** — Если SRI был настроен с хешем оригинального polyfill.io, вредоносная версия имела бы другой хеш и браузер заблокировал бы её.
- **Работает ли SRI с dynamic import()?** — Нет, `import()` не поддерживает SRI нативно; webpack-subresource-integrity добавляет поддержку через манифест.
- **Как автоматизировать обновление SRI при обновлении зависимостей?** — Renovate Bot и Dependabot автоматически обновляют хеши; `npm run build` с webpack-sri плагином генерирует актуальные хеши.

### Красные флаги (чего не говорить)

- «SRI проверяет, что скрипт безопасен» — нет, только что он не изменился; вредоносная библиотека с правильным хешем пройдёт.
- «SRI работает для всех ресурсов» — только для `<script>` и `<link rel="stylesheet">`; не работает для `fetch()`.
- Не упоминать необходимость атрибута `crossorigin` — без него браузер не выполняет SRI-проверку для CORS-ресурсов.

### Связанные темы

- `017-chto-takoe-content-security-policy-csp.md`
- `001-osnovnye-ugrozy-bezopasnosti-veb-stranits.md`
- `005-metody-povysheniya-bezopasnosti-veb-prilozhenii.md`
