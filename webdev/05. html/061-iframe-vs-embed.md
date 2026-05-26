# Q061. Чем отличается `<iframe>` от `<embed>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<iframe>` встраивает полноценный HTML-документ с собственным DOM, историей и политиками безопасности (sandbox, CSP). `<embed>` предназначен для встраивания внешнего контента (PDF, плагины) через браузерный плагин и не создаёт изолированного DOM-контекста. На практике `<iframe>` — универсальный выбор для встраивания HTML-страниц, тогда как `<embed>` — нишевой элемент, унаследованный от эпохи Flash.

---

## Развёрнутый ответ

### Суть и определение

`<iframe>` (Inline Frame) — контейнер для вложенного browsing context. Каждый iframe — это полноценный документ со своим window, document, историей навигации и стеком безопасности.

`<embed>` — механизм подключения внешнего контента, который обрабатывается браузерным плагином или встроенным обработчиком (например, PDF viewer). Не создаёт HTML-документа внутри себя.

### Как это работает

**iframe:**
- Браузер создаёт новый browsing context (вложенный window).
- Имеет полноценный DOM — к нему можно обращаться через `contentDocument` / `contentWindow`.
- Поддерживает атрибут `sandbox` для ограничения возможностей (запрет скриптов, форм, same-origin).
- CSP родительского документа может контролировать iframe через директиву `frame-src`.

**embed:**
- Браузер передаёт контент обработчику, определённому атрибутом `type` (MIME-тип).
- Нет доступа к DOM содержимого — чёрный ящик.
- Не поддерживает sandbox, history, postMessage в стандартном виде.
- Основные атрибуты: `src`, `type`, `width`, `height`.

### Практика и применение

- **iframe:** встраивание карт (Google Maps), виджетов оплаты (Stripe Elements), YouTube-плееров, OAuth-попапов, микрофронтендов.
- **embed:** встраивание PDF-файлов непосредственно в страницу (альтернатива — `<object>`).
- Для PDF на современных сайтах предпочтительнее `<iframe src="file.pdf">` — браузер сам использует PDF viewer.

### Важные нюансы и краеугольные камни

- `<embed>` не имеет fallback-содержимого (в отличие от `<object>`, у которого есть вложенный контент).
- `X-Frame-Options` и CSP `frame-ancestors` защищают от clickjacking — работают только для `<iframe>`, не для `<embed>`.
- `<iframe sandbox>` без значений блокирует всё; можно выборочно разрешать: `sandbox="allow-scripts allow-same-origin"`.
- `allow-same-origin` + `allow-scripts` в sandbox вместе снимают все ограничения — классическая ловушка.
- `<embed>` официально стандартизирован в HTML5, но Flash-зависимость сделала его редким.

### Примеры

```html
<!-- iframe: встраивание YouTube с ограничениями -->
<iframe
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  width="560"
  height="315"
  sandbox="allow-scripts allow-same-origin"
  loading="lazy"
  title="Rick Astley - Never Gonna Give You Up"
></iframe>

<!-- iframe: изолированный виджет без скриптов -->
<iframe
  src="/widget/map.html"
  sandbox="allow-forms"
  referrerpolicy="no-referrer"
></iframe>

<!-- embed: PDF -->
<embed src="/docs/report.pdf" type="application/pdf" width="800" height="600" />

<!-- Современная альтернатива embed для PDF -->
<iframe src="/docs/report.pdf" width="800" height="600" title="Отчёт"></iframe>
```

---

## Сравнение

| Критерий | `<iframe>` | `<embed>` |
|----------|-----------|-----------|
| Создаёт DOM | Да (полноценный document) | Нет |
| Доступ через JS | `contentDocument`, `contentWindow` | Недоступен |
| Sandbox-изоляция | Да (`sandbox` атрибут) | Нет |
| История навигации | Да | Нет |
| Fallback-контент | Нет (используйте `<object>`) | Нет |
| Основное применение | HTML-страницы, виджеты, микрофронтенды | PDF, legacy-плагины |
| CSP / X-Frame-Options | Поддерживается | Не применимо |
| postMessage | Поддерживается | Не поддерживается |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Как предотвратить clickjacking через iframe? (`X-Frame-Options: DENY` или CSP `frame-ancestors 'none'`)
- Что делает `sandbox` без значений и какова опасность комбинации `allow-scripts allow-same-origin`?
- Как iframe взаимодействует с родительским документом? (`postMessage` + проверка `event.origin`)
- Чем `<object>` отличается от `<embed>`? (`<object>` поддерживает fallback-контент)
- Влияет ли iframe на Web Vitals? (да — LCP, CLS, блокировка рендеринга без `loading="lazy"`)

### Красные флаги (чего не говорить)

- «`<embed>` и `<iframe>` — одно и то же, просто разный синтаксис» — принципиально разные модели.
- «sandbox полностью запрещает всё и его не нужно настраивать» — нужно понимать каждый флаг.
- «embed безопаснее iframe» — отсутствие DOM не означает безопасность; отсутствует и защита.

### Связанные темы

- [`068-atribut-target.md`](./068-atribut-target.md) — атрибут target и контексты навигации
- [`070-uluchshenie-proizvoditelnosti-html.md`](./070-uluchshenie-proizvoditelnosti-html.md) — `loading="lazy"` для iframe
