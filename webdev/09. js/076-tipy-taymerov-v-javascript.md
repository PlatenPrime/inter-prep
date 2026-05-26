# Q076. Типы таймеров в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript четыре основных механизма таймеров: **`setTimeout(fn, delay)`** — выполнить один раз через N мс; **`setInterval(fn, delay)`** — выполнять повторно каждые N мс; **`requestAnimationFrame(fn)`** — выполнить перед следующей перерисовкой (для анимаций); **`queueMicrotask(fn)`** — добавить в очередь микротаск (выполнится до следующей задачи Event Loop). Все они асинхронные и взаимодействуют с Event Loop.

---

## Развёрнутый ответ

### `setTimeout` — отложенный однократный вызов

```javascript
const id = setTimeout(() => {
  console.log('Executed after 1 second');
}, 1000);

// Отмена
clearTimeout(id);

// Минимальная задержка
setTimeout(fn, 0); // не сразу, а в следующей итерации Event Loop
                   // (минимум ~4ms в браузерах для вложенных вызовов)
```

### `setInterval` — повторяющийся вызов

```javascript
const id = setInterval(() => {
  console.log('Every 500ms');
}, 500);

// Отмена
clearInterval(id);

// Проблема: если колбэк занимает > delay мс — вызовы накапливаются!
// Решение: setTimeout рекурсивный (adaptive interval)
function adaptiveInterval(fn, delay) {
  function loop() {
    fn();
    setTimeout(loop, delay); // следующий запуск ПОСЛЕ завершения
  }
  setTimeout(loop, delay);
}
```

### `requestAnimationFrame` — анимации и рендеринг

```javascript
let frame;

function animate(timestamp) {
  // timestamp — время в мс от начала документа
  updatePosition(timestamp);
  render();
  frame = requestAnimationFrame(animate); // следующий кадр
}

frame = requestAnimationFrame(animate);

// Остановка
cancelAnimationFrame(frame);
```

- Вызывается ~60 раз в секунду (синхронизировано с refresh rate монитора).
- Приостанавливается на неактивных вкладках — экономия батареи/CPU.
- Идеален для анимаций и игровых циклов.

### `queueMicrotask` — микротаск

```javascript
console.log('1');
setTimeout(() => console.log('2'), 0);  // макротаск
queueMicrotask(() => console.log('3')); // микротаск
Promise.resolve().then(() => console.log('4')); // тоже микротаск
console.log('5');

// Вывод: 1, 5, 3, 4, 2
// Микротаски (3, 4) выполняются ДО следующего макротаска (2)
```

### Event Loop и очерёдность

```
1. Выполняется текущий синхронный код (Call Stack)
2. Очищается очередь микротасков (Promise.then, queueMicrotask, MutationObserver)
3. Выполняется один макротаск (setTimeout, setInterval, I/O)
4. Снова очищается очередь микротасков
5. requestAnimationFrame (перед рендерингом)
6. Рендеринг
7. → goto 1
```

### Практика

```javascript
// Debounce через setTimeout
function debounce(fn, delay) {
  let id;
  return (...args) => {
    clearTimeout(id);
    id = setTimeout(() => fn(...args), delay);
  };
}

// Polling через setInterval
function pollUntil(check, onSuccess, interval = 1000, maxAttempts = 10) {
  let attempts = 0;
  const id = setInterval(() => {
    if (check()) {
      clearInterval(id);
      onSuccess();
    } else if (++attempts >= maxAttempts) {
      clearInterval(id);
      throw new Error('Polling timeout');
    }
  }, interval);
  return () => clearInterval(id); // cleanup
}
```

### Важные нюансы и краеугольные камни

- `setTimeout(fn, 0)` не означает «немедленно» — выполняется после текущего синхронного кода и микротасков.
- `setInterval` с задержкой 0 — активное ожидание, нагружает CPU.
- В Node.js есть также `setImmediate(fn)` — выполняется после I/O колбэков.
- `process.nextTick(fn)` в Node.js — выполняется даже раньше Promise-микротасков.

### Примеры

```javascript
// requestAnimationFrame для плавной анимации
function smoothMove(element, target, duration) {
  const start = element.offsetLeft;
  const distance = target - start;
  let startTime = null;

  function step(timestamp) {
    if (!startTime) startTime = timestamp;
    const elapsed = timestamp - startTime;
    const progress = Math.min(elapsed / duration, 1);

    element.style.left = `${start + distance * easeInOut(progress)}px`;

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

function easeInOut(t) {
  return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
}
```

---

## Сравнение

| Таймер | Когда | Отмена | Особенности |
|--------|-------|--------|-------------|
| `setTimeout` | Однократно через N мс | `clearTimeout` | Макротаск |
| `setInterval` | Каждые N мс | `clearInterval` | Может накапливаться |
| `requestAnimationFrame` | Перед рендером (~60fps) | `cancelAnimationFrame` | Пауза на неактивных вкладках |
| `queueMicrotask` | Немедленно (микротаск) | — | До следующего макротаска |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `setTimeout(fn, 0)` не выполняется немедленно?** — Добавляет в очередь макротасков; сначала выполняется синхронный код + микротаски.
- **Когда использовать `requestAnimationFrame` вместо `setInterval`?** — Для анимаций: синхронизирован с refresh rate, автоматически паузируется.
- **Что такое `setImmediate`?** — Node.js специфичный; выполняется после I/O, перед setTimeout(0).

### Красные флаги (чего не говорить)

- «`setTimeout(fn, 0)` выполняется синхронно» — нет, асинхронно.

### Связанные темы

- `077-kak-rabotaet-kontekst-vypolneniya-execution-context.md`
- `039-kak-rabotayut-debounce-i-throttle.md`
