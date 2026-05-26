# Q007. Если представить HTML5 как открытую веб-платформу, из каких блоков он состоит?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

HTML5 как открытая веб-платформа — это не просто язык разметки, а экосистема из восьми взаимосвязанных блоков: семантика, связь (Connectivity), офлайн и хранилище, мультимедиа, 2D/3D графика, производительность, доступ к устройствам и стилизация. Каждый блок расширяет возможности браузера, приближая его к нативным приложениям. Этим HTML5 принципиально отличается от HTML4, где большинство этих возможностей требовало Flash или Java-апплетов.

---

## Развёрнутый ответ

### Суть и определение

В 2008 году W3C и WHATWG начали разработку HTML5 не только как эволюции разметки, но как открытой платформы для веб-приложений. Концепция «открытой веб-платформы» (Open Web Platform) объединяет HTML, CSS, JavaScript API и браузерные возможности в единую экосистему без проприетарных плагинов.

### Как это работает

**8 блоков открытой веб-платформы HTML5:**

---

#### 1. Семантика (Semantics)
Новые элементы, передающие смысл структуры документа.

- Структурные: `<header>`, `<footer>`, `<main>`, `<nav>`, `<aside>`, `<article>`, `<section>`
- Медиа-контент: `<figure>`, `<figcaption>`, `<time>`, `<mark>`
- Интерактивность: `<details>`, `<summary>`, `<dialog>`, `<menu>`
- Формы: новые типы `<input>` (email, url, number, date, range, color…)

---

#### 2. Связь (Connectivity)
Новые протоколы общения клиента с сервером.

| Технология | Описание |
|-----------|----------|
| **WebSockets** | Двунаправленный постоянный канал (не HTTP-запросы) |
| **Server-Sent Events (SSE)** | Однонаправленный поток событий от сервера |
| **WebRTC** | P2P связь в реальном времени (видео, аудио, данные) |

---

#### 3. Офлайн и хранилище (Offline & Storage)
Возможность работать без постоянного интернета.

| API | Описание |
|-----|----------|
| **Service Workers** | Прокси между браузером и сетью, управляет кешем |
| **Cache API** | Программное управление HTTP-кешем |
| **IndexedDB** | NoSQL БД в браузере для больших объёмов данных |
| **localStorage / sessionStorage** | Простое key-value хранилище |
| **Web Storage API** | Обобщённый термин для localStorage/sessionStorage |

> AppCache — устарел и удалён из спецификации.

---

#### 4. Мультимедиа (Multimedia)
Нативное воспроизведение медиа без плагинов.

- `<audio>` — воспроизведение звука с API управления
- `<video>` — воспроизведение видео с субтитрами (`<track>`)
- **Web Audio API** — низкоуровневая обработка звука
- **MediaStream API** — доступ к микрофону и камере

---

#### 5. 2D/3D графика (2D/3D Graphics & Effects)
Рендеринг графики в браузере.

| Технология | Описание |
|-----------|----------|
| **`<canvas>` 2D** | Пиксельный рендеринг через JavaScript API |
| **WebGL** | Аппаратно-ускоренная 3D графика (OpenGL ES в браузере) |
| **WebGPU** | Следующее поколение GPU API (2023+) |
| **SVG** | Векторная графика, интегрированная в DOM |
| **CSS 3D Transforms** | Аппаратно-ускоренные CSS-трансформации |

---

#### 6. Производительность (Performance & Integration)
Возможности для выноса задач из главного потока.

| API | Описание |
|-----|----------|
| **Web Workers** | Многопоточность: тяжёлые вычисления вне UI-потока |
| **requestAnimationFrame** | Синхронизация анимаций с частотой обновления экрана |
| **Performance API** | Измерение времени загрузки и выполнения |
| **`<script defer>`/`async`** | Управление загрузкой скриптов |

---

#### 7. Доступ к устройствам (Device Access)
Взаимодействие с аппаратурой устройства.

| API | Описание |
|-----|----------|
| **Geolocation API** | Определение местоположения |
| **Camera/Microphone** | Доступ через getUserMedia() |
| **Gamepad API** | Подключение геймпадов |
| **Touch Events / Pointer Events** | Мультитач |
| **Notifications API** | Push-уведомления |
| **Web Bluetooth / USB** | Низкоуровневый доступ к устройствам |

---

#### 8. Стилизация (Styling/Effects)
CSS3 возможности, ставшие частью платформы.

- Flexbox, Grid, Custom Properties (переменные)
- CSS Animations, Transitions, Transforms
- Web Fonts (`@font-face`)
- Media Queries, Container Queries
- `calc()`, `clamp()`, CSS Nesting

---

### Практика и применение

- **PWA (Progressive Web Apps)** строятся на Service Workers + Cache API + Web Manifest.
- **Real-time приложения** (чаты, игры, трейдинг) используют WebSockets / WebRTC.
- **Figma, AutoCAD Web** — WebAssembly + WebGL/WebGPU.
- **Google Docs, Notion** — IndexedDB для офлайн-режима.

### Важные нюансы и краеугольные камни

- Поддержка API различается между браузерами — всегда проверять [caniuse.com](https://caniuse.com).
- Web Workers не имеют доступа к DOM — это ограничение архитектурное, не баг.
- AppCache объявлен устаревшим — использовать только Service Workers.
- WebGPU — современная альтернатива WebGL с лучшей производительностью, поддержка растёт.

### Примеры

```html
<!-- Мультимедиа без плагинов -->
<video controls width="640" poster="preview.jpg">
  <source src="video.mp4" type="video/mp4" />
  <track kind="subtitles" src="subs.vtt" srclang="ru" label="Русский" />
</video>

<!-- Офлайн-данные -->
<script>
  localStorage.setItem('theme', 'dark');

  // IndexedDB через обёртку
  const db = await openDB('app', 1, {
    upgrade(db) {
      db.createObjectStore('todos', { keyPath: 'id' });
    }
  });
</script>

<!-- Web Worker для тяжёлых вычислений -->
<script>
  const worker = new Worker('heavy-calc.js');
  worker.postMessage({ data: largeArray });
  worker.onmessage = (e) => console.log(e.data);
</script>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Service Worker отличается от Web Worker?** — SW перехватывает сетевые запросы и управляет кешем; WW — общие вычисления в отдельном потоке.
- **Что такое PWA и какие технологии HTML5 лежат в основе?** — Service Worker + Web App Manifest + HTTPS.
- **Зачем WebRTC если есть WebSockets?** — WebRTC P2P (прямое соединение без сервера), низкая задержка для видео/аудио; WebSockets — через сервер.
- **Почему AppCache устарел?** — сложная модель кеширования, невозможность нормально инвалидировать кеш; заменён Service Workers.

### Красные флаги (чего не говорить)

- «HTML5 — это только новые теги» — HTML5 как платформа включает десятки браузерных API.
- «Все API HTML5 поддерживаются везде» — поддержка различается, нужна проверка через caniuse.
- «AppCache для офлайн-режима» — устарел и удалён из спецификации.

### Связанные темы

- [001-chto-takoe-html.md](./001-chto-takoe-html.md)
- [006-bazovaya-struktura-html-stranicy.md](./006-bazovaya-struktura-html-stranicy.md)
- [010-chto-takoe-semantika.md](./010-chto-takoe-semantika.md)
