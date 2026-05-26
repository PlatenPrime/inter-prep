# Q059. Что такое `<iframe>`?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<iframe>` (inline frame) — HTML-элемент, встраивающий другой HTML-документ в текущую страницу. Создаёт изолированный browsing context со своим DOM, историей навигации и JavaScript-окружением. Используется для встраивания карт, видео, виджетов оплаты и любого внешнего контента.

---

## Развёрнутый ответ

### Суть и определение

`<iframe>` создаёт вложенный browsing context — полноценное «окно браузера» внутри страницы. Внутренний документ полностью изолирован: имеет собственный DOM, `window`, историю и политики безопасности. Родительская страница и iframe взаимодействуют только через `postMessage` API (если разные origin) или напрямую через `contentWindow` (если same-origin).

### Как это работает

1. Браузер создаёт новый browsing context при парсинге `<iframe>`.
2. Загружает URL из атрибута `src` (или `srcdoc` для inline HTML) в отдельный процесс/поток (в Chromium — site isolation).
3. Рендерит содержимое внутри области `<iframe>`.
4. Применяет политики безопасности: Same-Origin Policy, `sandbox`, `allow` (Permissions Policy).

**Ключевые атрибуты:**

| Атрибут | Описание |
|---|---|
| `src` | URL загружаемого документа |
| `srcdoc` | Inline HTML (приоритет над `src`) |
| `width` / `height` | Размеры (по умолчанию 300×150 px) |
| `name` | Имя browsing context (target для `<a>`, `<form>`) |
| `sandbox` | Набор ограничений безопасности |
| `allow` | Permissions Policy (camera, microphone, fullscreen...) |
| `loading` | `"eager"` (default) или `"lazy"` |
| `referrerpolicy` | Политика Referer-заголовка |
| `title` | Описание для screen readers (обязательно для a11y) |
| `allowfullscreen` | Устарел, заменён `allow="fullscreen"` |

**Атрибут `sandbox`:**
По умолчанию запрещает всё; разрешения добавляются явно:
- `allow-scripts` — выполнение JS.
- `allow-forms` — отправку форм.
- `allow-same-origin` — сохранение origin (без этого iframe обрабатывается как null-origin).
- `allow-top-navigation` — навигацию родительского окна.
- `allow-popups` — открытие новых окон.

### Практика и применение

- **Видео-виджеты:** YouTube, Vimeo (`<iframe src="https://www.youtube.com/embed/...">`)
- **Карты:** Google Maps, Yandex Maps
- **Виджеты оплаты:** Stripe Elements, PayPal (изоляция от DOM страницы — безопасность)
- **Социальные кнопки:** Twitter/X, Facebook Like
- **Микрофронтенды:** встраивание независимо деплоенных приложений
- **Sandboxed preview:** предпросмотр HTML без доступа к странице (редакторы кода типа CodePen)

### Важные нюансы и краеугольные камни

- **`title` обязателен для a11y:** screen readers объявляют `<iframe>` через его `title`; без него — пустое объявление.
- **`sandbox` без `allow-same-origin`:** iframe получает null-origin и теряет доступ к cookies, localStorage — полезно для untrusted контента.
- **`sandbox` + `allow-scripts` + `allow-same-origin` вместе** — опасная комбинация: скрипт может убрать sandbox атрибут через `parent.document`.
- **`loading="lazy"`:** откладывает загрузку until viewport — хорошо для карт и видео ниже fold.
- **`X-Frame-Options` / `Content-Security-Policy: frame-ancestors`:** сервер может запретить встраивание своего контента в iframe.
- **Размер:** `<iframe>` не адаптируется под содержимое автоматически; нужно JS или `aspect-ratio` + `width: 100%`.
- **Производительность:** каждый iframe — отдельный сетевой запрос и rendering pipeline.

### Примеры

```html
<!-- YouTube embed с атрибутами безопасности -->
<iframe
  width="560"
  height="315"
  src="https://www.youtube.com/embed/dQw4w9WgXcQ"
  title="Название видео для screen readers"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen
  loading="lazy"
  referrerpolicy="strict-origin-when-cross-origin">
</iframe>

<!-- Sandboxed preview (например, в онлайн-редакторе) -->
<iframe
  srcdoc="<h1>Hello</h1><script>alert('sandboxed')<\/script>"
  sandbox="allow-scripts"
  title="HTML Preview"
  width="100%"
  height="400"
  style="border: 1px solid #e2e8f0; border-radius: 8px;">
</iframe>

<!-- Адаптивный iframe (16:9) через CSS aspect-ratio -->
<div style="width: 100%; aspect-ratio: 16 / 9;">
  <iframe
    src="https://maps.google.com/..."
    title="Карта офиса"
    style="width: 100%; height: 100%; border: none;"
    loading="lazy">
  </iframe>
</div>

<!-- postMessage: общение между страницей и iframe -->
<script>
  const frame = document.querySelector('iframe');

  // Отправка сообщения во фрейм
  frame.contentWindow.postMessage({ type: 'UPDATE', payload: 42 }, 'https://example.com');

  // Получение ответа
  window.addEventListener('message', (event) => {
    if (event.origin !== 'https://example.com') return; // валидация origin!
    console.log('От iframe:', event.data);
  });
</script>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Как безопасно общаться между родительской страницей и iframe разного origin? (`postMessage` + валидация `event.origin`)
- Почему `sandbox` + `allow-scripts` + `allow-same-origin` — опасная комбинация?
- Как запретить встраивание вашего сайта в чужой iframe? (`X-Frame-Options: DENY` или `CSP: frame-ancestors 'none'`)
- Что значит null-origin у sandboxed iframe без `allow-same-origin`?
- Как сделать адаптивный iframe под любое соотношение сторон?

### Красные флаги (чего не говорить)

- «`<iframe>` и `<frame>` — одно и то же» — `<frame>` устарел и удалён из HTML5.
- «iframe полностью изолирован, cross-site scripting через него невозможен» — clickjacking, postMessage-инъекции возможны без правильной настройки.
- «`loading="lazy"` работает для всех iframe без исключений» — некоторые браузеры могут игнорировать его для определённых ресурсов.

### Связанные темы

- [060-plyusy-minusy-iframe.md](./060-plyusy-minusy-iframe.md) — плюсы и минусы iframe
