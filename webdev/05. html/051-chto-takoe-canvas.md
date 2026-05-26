# Q051. Что такое `<canvas>`? И для чего он используется?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<canvas>` — HTML-элемент, предоставляющий растровый (bitmap) холст для рисования через JavaScript API. По умолчанию имеет размер 300×150 px и прозрачный фон. Используется для рендеринга 2D-графики через `CanvasRenderingContext2D` или 3D через `WebGL`/`WebGL2`. Сам тег не отображает ничего — весь контент формируется скриптом.

---

## Развёрнутый ответ

### Суть и определение

`<canvas>` — это прямоугольная область пикселей (пиксельный буфер), управляемая JavaScript. В отличие от SVG, холст не хранит сцену в DOM — все нарисованное немедленно растеризуется и «забывается». Получить контекст рендеринга можно вызовом `canvas.getContext('2d')` или `canvas.getContext('webgl')`.

### Как это работает

1. Браузер резервирует буфер пикселей заданного размера (`width`/`height` атрибуты).
2. JS получает контекст (`ctx = canvas.getContext('2d')`).
3. Вызовы API (`fillRect`, `drawImage`, `arc`, ...) немедленно изменяют пикселы в буфере.
4. Браузер копирует буфер на экран при следующем composite-шаге.
5. Чтобы анимировать, нужно явно очищать (`clearRect`) и перерисовывать каждый кадр через `requestAnimationFrame`.

**Важно:** атрибуты `width`/`height` — размер буфера (в пикселях устройства), а CSS `width`/`height` — визуальный размер. При несовпадении картинка будет растянута/сжата.

### Практика и применение

- **Игры** — Canvas 2D и WebGL используются в большинстве браузерных игр (Phaser, Three.js).
- **Data Visualization** — Chart.js, D3 (canvas-режим) для графиков с тысячами точек.
- **Обработка изображений** — фильтры, кроп, watermark на стороне клиента без серверного round-trip.
- **Видео-эффекты** — попиксельная обработка кадров из `<video>`.
- **Подписи / аннотации** — инструменты рисования поверх документов.
- **PDF / изображение из HTML** — html2canvas, jspdf.

### Важные нюансы и краеугольные камни

- **Fallback-контент:** текст/изображение внутри тега отображается только если браузер не поддерживает canvas.
- **Retina/HiDPI:** нужно масштабировать буфер на `devicePixelRatio` и масштабировать контекст через `ctx.scale(dpr, dpr)`, иначе картинка мыльная.
- **Доступность (a11y):** canvas полностью непрозрачен для screen readers — добавляйте `role`, `aria-label` или дублирующий DOM-контент.
- **Утечки памяти:** не забывайте отменять `requestAnimationFrame` и освобождать WebGL-ресурсы при unmount компонента.
- **CORS:** `drawImage` из cross-origin источника «отравляет» (taint) canvas — `toDataURL()` бросит исключение, если сервер не выдаёт CORS-заголовки.

### Примеры

```html
<!-- Базовый холст с fallback -->
<canvas id="myCanvas" width="600" height="400" role="img" aria-label="Интерактивный график">
  Ваш браузер не поддерживает canvas.
</canvas>

<script>
  const canvas = document.getElementById('myCanvas');
  const ctx = canvas.getContext('2d');

  // Прямоугольник
  ctx.fillStyle = '#4f46e5';
  ctx.fillRect(50, 50, 200, 100);

  // Текст
  ctx.fillStyle = '#ffffff';
  ctx.font = '20px sans-serif';
  ctx.fillText('Hello Canvas', 80, 110);
</script>
```

```js
// Правильная работа с HiDPI
function setupHiDPI(canvas, width, height) {
  const dpr = window.devicePixelRatio || 1;
  canvas.width = width * dpr;
  canvas.height = height * dpr;
  canvas.style.width = `${width}px`;
  canvas.style.height = `${height}px`;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  return ctx;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Чем `canvas.width = X` отличается от `canvas.style.width = 'Xpx'`? (буфер vs визуальный размер)
- Что происходит при `canvas.width = canvas.width`? (холст сбрасывается в прозрачный)
- Как реализовать hit-testing (определить, по какому объекту кликнул пользователь)?
- Что такое «отравленный» (tainted) canvas и почему `toDataURL()` может упасть?
- Как избежать мыльности на Retina-экранах?
- Какие альтернативы canvas для 3D-графики в браузере? (WebGL, WebGPU)

### Красные флаги (чего не говорить)

- «Canvas поддерживает DOM-элементы внутри себя» — нет, это просто пиксели.
- «Canvas масштабируется как SVG без потери качества» — нет, это растровый буфер.
- «Canvas доступен для screen readers автоматически» — нет, нужна явная a11y-разметка.

### Связанные темы

- [052-svg-i-canvas.md](./052-svg-i-canvas.md) — что такое SVG и canvas
- [053-raznica-canvas-vs-svg.md](./053-raznica-canvas-vs-svg.md) — сравнение canvas и SVG
- [054-kogda-canvas-kogda-svg.md](./054-kogda-canvas-kogda-svg.md) — когда что использовать
