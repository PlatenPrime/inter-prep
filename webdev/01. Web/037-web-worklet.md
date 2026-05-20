# Q037. Что такое Web Worklet?

> **Источник:** [01. Web.md](../01.%20Web.md) · **Тема:** Web Technologies

---

## Короткий ответ

**Worklet** — лёгкий, **специализированный** исполняемый контекст в браузере с очень коротким жизненным циклом и узким API. В отличие от Web Workers, worklet **тесно интегрирован** с подсистемой рендеринга: **Paint Worklet** (CSS Houdini), **Animation Worklet**, **AudioWorklet** (обработка звука в real-time). Код загружается через `registerPaint` / `audioWorklet.addModule` и вызывается движком многократно с жёсткими ограничениями по времени.

---

## Развёрнутый ответ

### Суть и определение

Worklets — часть **Houdini** и Web Audio. Глобальный scope минимален; нет `setTimeout` в том же виде, что в window. Цель — расширить возможности CSS и аудио **без блокировки main thread**, но с предсказуемой латентностью (особенно AudioWorklet — < 3 ms на callback).

Не универсальная замена Worker для произвольной бизнес-логики.

### Как это работает

**Paint Worklet:** `CSS.paintWorklet.addModule('checkerboard.js')`; в CSS `background-image: paint(checkerboard)`. Метод `paint(ctx, size, properties)` рисует на этапе paint.

**AudioWorklet:** модуль регистрирует `AudioWorkletProcessor`; процессор получает аудиобуферы в real-time на аудио-потоке.

**Animation Worklet:** кастомные анимации с доступом к timeline (ограниченная поддержка).

Жизненный цикл управляется браузером; разработчик не создаёт `new Worklet()` как Worker.

### Практика и применение

- **Кастомные фоны, border, noise** без тяжёлых canvas на main — Paint Worklet.
- **Эффекты, синтез** в веб-аудио — AudioWorklet вместо устаревшего ScriptProcessorNode.
- **Проблема без worklet:** хаки через большие GIF, тяжёлый JS на main для визуала.

Поддержка Paint Worklet — в основном Chromium; проверять caniuse и fallback.

### Важные нюансы и краеугольные камни

- **Детерминизм:** paint worklet должен быть чистым от async I/O — иначе артефакты.
- AudioWorklet — **hard real-time**; аллокации и lock в processor недопустимы.
- Нельзя произвольно «вынести React» в worklet — только узкие задачи движка.
- Fallback обязателен для Safari/Firefox по Houdini features.

### Примеры

```javascript
// checkerboard.js — Paint Worklet
registerPaint('checkerboard', class {
  paint(ctx, size) {
    const { width, height } = size;
    const step = 32;
    for (let y = 0; y < height; y += step) {
      for (let x = 0; x < width; x += step) {
        ctx.fillStyle = (x / step + y / step) % 2 ? '#ccc' : '#fff';
        ctx.fillRect(x, y, step, step);
      }
    }
  }
});
```

```css
.element {
  background-image: paint(checkerboard);
}
```

```javascript
// AudioWorklet (упрощённо)
await audioContext.audioWorklet.addModule('processor.js');
const node = new AudioWorkletNode(audioContext, 'gain-processor');
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Worklet vs Web Worker?** — scope, кто вызывает, real-time vs general compute.
- **Что такое CSS Houdini?** — paint, layout, properties API (разная зрелость).
- **Почему ScriptProcessorNode убрали?** — блокировал main, нестабильная латентность.
- **Поддержка браузеров Paint Worklet?** — в основном Chrome, progressive enhancement.
- **Layout Worklet?** — экспериментально, редко в проде.

### Красные флаги (чего не говорить)

- «Worklet — это то же самое, что Web Worker».
- Использовать Paint Worklet для тяжёлой бизнес-логики и сетевых запросов.
- Игнорировать fallback для не-Chromium.

### Связанные темы

- [036-web-workers.md](036-web-workers.md)
- [035-service-workers.md](035-service-workers.md)

---
