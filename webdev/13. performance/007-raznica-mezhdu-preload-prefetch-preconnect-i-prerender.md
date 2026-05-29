# Q007. Разница между `preload`, `prefetch`, `preconnect` и `prerender`?

> **Источник:** [13. performance.md](../13.%20performance.md) · **Тема:** Performance

---

## Короткий ответ

Все четыре — директивы Resource Hints, подсказывающие браузеру заранее выполнить работу, но с разным приоритетом и назначением. **`preload`** — «загрузи этот ресурс прямо сейчас, он нужен на текущей странице». **`prefetch`** — «загрузи с низким приоритетом, возможно понадобится на следующей странице». **`preconnect`** — «установи TCP+TLS-соединение с origin заранее». **`prerender`** — «загрузи и отрендери следующую страницу в фоне» (устаревший, заменён Speculation Rules API).

---

## Развёрнутый ответ

### Суть и определение

Resource Hints позволяют сообщить браузеру о предстоящих потребностях до того, как они будут обнаружены при обычном парсинге. Правильное применение уменьшает задержку LCP, TTI и навигации.

### Как это работает

**`preload`** (`<link rel="preload">`)

- **Приоритет**: высокий (как у ресурса, встреченного при парсинге).
- **Действие**: немедленно загружает ресурс, минуя обычное обнаружение парсером.
- **Обязательный атрибут `as`**: сообщает тип ресурса — `script`, `style`, `font`, `image`, `fetch`, `document`.
- **Кэш**: ресурс сохраняется в memory cache, используется при следующем обращении.
- **CORS**: для шрифтов и cross-origin fetch требуется `crossorigin="anonymous"`.
- **Предупреждение**: неиспользованный preload через ~3 с генерирует Console warning — загруженный ресурс расходует сеть впустую.

```html
<!-- LCP-изображение: preload чтобы не ждать CSS -->
<link rel="preload" href="hero.webp" as="image">

<!-- Шрифт: crossorigin обязателен -->
<link rel="preload" href="/fonts/inter.woff2" as="font" type="font/woff2" crossorigin="anonymous">

<!-- Критический скрипт, используемый сразу -->
<link rel="preload" href="critical.js" as="script">
```

**`prefetch`** (`<link rel="prefetch">`)

- **Приоритет**: очень низкий (Idle time).
- **Действие**: загружает ресурс в фоне во время простоя браузера для **будущей навигации**.
- **Кэш**: HTTP-кэш (disk), используется при переходе на следующую страницу.
- **Не гарантировано**: на медленных соединениях или при высокой загрузке браузер может отменить запрос.

```html
<!-- Следующая страница: prefetch bundle -->
<link rel="prefetch" href="/page2/bundle.js" as="script">
<link rel="prefetch" href="/page2/data.json" as="fetch">
```

**`preconnect`** (`<link rel="preconnect">`)

- **Приоритет**: высокий (инициируется сразу).
- **Действие**: устанавливает TCP-соединение + TLS-handshake + DNS-резолв заранее. Сама загрузка ресурсов не начинается.
- **Экономия**: 100–500 мс на установку соединения с CDN, API, шрифтовым сервисом.
- **Срок жизни**: ~10 с (браузер закрывает неиспользованное соединение).

```html
<!-- Google Fonts: два origin — один для CSS, другой для файлов -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>

<!-- API-сервер: подключаемся заранее -->
<link rel="preconnect" href="https://api.example.com">
```

**`dns-prefetch`** (`<link rel="dns-prefetch">`)

- Более ограниченная альтернатива: только DNS-резолв, без TCP/TLS.
- Поддерживается более широко (включая IE11).
- Используется как fallback для `preconnect`.

```html
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link rel="dns-prefetch" href="https://fonts.gstatic.com"> <!-- fallback -->
```

**`prerender`** (устаревший `<link rel="prerender">`)

- Загружал и рендерил всю следующую страницу в скрытой вкладке.
- Плохо поддерживался, расходовал ресурсы.
- **Заменён** на [Speculation Rules API](https://developer.chrome.com/blog/prerender-pages/) (Chrome 108+).

```html
<!-- Современный способ: Speculation Rules API -->
<script type="speculationrules">
{
  "prerender": [{"source": "list", "urls": ["/next-page"]}],
  "prefetch":  [{"source": "document", "eagerness": "moderate"}]
}
</script>
```

### Практика и применение

**Типовые кейсы:**

| Ситуация | Директива |
|----------|-----------|
| LCP-изображение не найдено в HTML (фон через CSS) | `preload as="image"` |
| Шрифт из Google Fonts | `preconnect` к обоим origin + `preload as="font"` |
| Страница B — 90% пользователей переходят с A | `prefetch` JS/CSS страницы B |
| Стороннее API для первого запроса | `preconnect` к API origin |
| SPA next route chunk | `prefetch` через router (React Router, Vue Router) |

### Важные нюансы и краеугольные камни

- **`preload` без `as`** — браузер присваивает очень низкий приоритет и выводит предупреждение.
- **`preload` шрифта без `crossorigin`** — браузер делает два запроса (один без CORS, второй с), шрифт загружается дважды.
- **`preconnect` к слишком многим origin** — браузер устанавливает соединения впустую; рекомендуется не более 2–3 критических origin.
- **`prefetch` не работает в приватном режиме** (Safari) — браузер может игнорировать.
- **Разница с HTTP Early Hints (103)** — сервер отправляет `preload`/`preconnect` ещё до HTML; эффективнее, особенно для SSR.

---

## Сравнение

| Критерий | `preload` | `prefetch` | `preconnect` | `prerender` |
|----------|-----------|-----------|--------------|-------------|
| Приоритет | Высокий | Idle | Высокий (connection) | — |
| Что делает | Загружает ресурс | Загружает ресурс | Устанавливает соединение | Рендерит страницу |
| Для текущей / следующей страницы | Текущая | Следующая | Оба | Следующая |
| Гарантия использования | Должен использоваться | Не гарантировано | Не гарантировано | — |
| Кэш | Memory cache | HTTP cache | — | — |
| Статус | Актуален | Актуален | Актуален | Устарел |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему у `preload` шрифта нужен `crossorigin`?** — Шрифты всегда загружаются с CORS; без атрибута браузер сделает два запроса — один без CORS (preload), другой с CORS (реальное использование).
- **Чем `preconnect` отличается от `dns-prefetch`?** — `preconnect` делает DNS + TCP + TLS; `dns-prefetch` — только DNS; `preconnect` дороже, но экономит больше.
- **Когда prefetch может навредить?** — На медленных мобильных соединениях расходует лимитированный трафик пользователя без гарантии использования.
- **Что такое Speculation Rules API?** — Современная замена `prerender`: JSON-объект в `<script type="speculationrules">`, управляет prefetch и prerender с условиями.
- **Как `preload` влияет на LCP?** — Браузер начинает загрузку LCP-изображения раньше (не ждёт CSS), что напрямую уменьшает LCP-метрику.

### Красные флаги (чего не говорить)

- «`preload` и `prefetch` одинаковы — оба загружают заранее» — разный приоритет, разное назначение (текущая vs следующая страница).
- «`preconnect` загружает ресурс» — нет, только устанавливает соединение; без последующего запроса — пустые расходы.
- «`prerender` — современный способ ускорить навигацию» — устарел; нужен Speculation Rules API.
- «Можно добавить `preload` на все ресурсы» — неиспользованные preload — это потраченная полоса пропускания и Console-предупреждения.

### Связанные темы

- `001-nazvajte-kriticheskie-etapy-renderinga-critical-rendering-path.md`
- `005-pochemu-link-v-head-a-script-pered-zakryvayushimsya-body.md`
- `006-raznica-mezhdu-script-script-async-i-script-defer.md`
- `010-rasskazhite-o-metrikakh-core-web-vitals.md`
- `015-metody-optimizacii-zagruzki-shriftov.md`
