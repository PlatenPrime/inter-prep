# Q079. Что такое утечки памяти в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Утечка памяти (memory leak)** — ситуация, когда объекты, которые больше не используются, продолжают **удерживаться** от сборщика мусора из-за ненужных ссылок. В JS GC собирает только «недостижимые» объекты — утечка происходит когда ссылка случайно или намеренно сохраняется дольше нужного.

---

## Развёрнутый ответ

### Суть

Утечка ≠ «потерянный объект». Объект продолжает жить в памяти, потому что на него есть ссылка. Программист забыл или не успел её убрать.

Признаки утечки: растущее потребление памяти со временем, деградация производительности, браузер/Node.js «тормозит» или падает.

### Основные типы утечек

**1. Глобальные переменные (ненамеренные):**
```javascript
// Sloppy mode: опечатка создаёт глобальную переменную
function process() {
  data = new Array(10000); // window.data — живёт вечно!
}

// Явная глобальная:
window.cache = {};  // если не очищается — растёт бесконечно
```

**2. Забытые таймеры и интервалы:**
```javascript
// setInterval удерживает колбэк и его замыкание
const heavyData = new Array(10000);
const id = setInterval(() => {
  process(heavyData); // heavyData не освобождается пока id не clearInterval!
}, 1000);

// Решение:
function start() {
  const id = setInterval(() => {
    if (shouldStop) {
      clearInterval(id);
    }
  }, 1000);
}
```

**3. Забытые обработчики событий:**
```javascript
// Классическая утечка при работе с DOM
function attachHandler(element) {
  const bigData = new Array(100000);
  element.addEventListener('click', function handler() {
    console.log(bigData.length); // замыкание удерживает bigData
  });
  // Если element удаляется из DOM но слушатель не удаляется — утечка!
}

// Правильно: cleanup при удалении
function attachWithCleanup(element) {
  const controller = new AbortController();
  element.addEventListener('click', handler, { signal: controller.signal });
  return () => controller.abort(); // cleanup function
}
```

**4. Замыкания с ненужными ссылками:**
```javascript
function outer() {
  const smallData = 'needed';
  const bigData = new Array(100000); // не нужен снаружи!

  return function() {
    return smallData; // замыкание удерживает ВЕСЬ scope outer(), включая bigData!
  };
}

// В V8 этот сценарий оптимизируется, но лучше явно изолировать:
function outerFixed() {
  const smallData = 'needed';
  {
    const bigData = new Array(100000); // отдельный блок — очистится раньше
    setup(bigData);
  }
  return () => smallData;
}
```

**5. Отсоединённые DOM-узлы:**
```javascript
let detachedDiv;

function createDetached() {
  detachedDiv = document.createElement('div'); // создан, но НЕ добавлен в DOM
  detachedDiv.innerHTML = '<p>Large content</p>';
}
// detachedDiv живёт в памяти, но не виден в DOM
// Решение: detachedDiv = null когда больше не нужен
```

**6. Map/Set с объектами-ключами (вместо WeakMap/WeakSet):**
```javascript
const cache = new Map(); // обычный Map удерживает ключи-объекты

function cacheResult(domElement, result) {
  cache.set(domElement, result);
  // domElement удалён из DOM, но Map держит ссылку → не собирается GC
}

// Правильно: WeakMap
const weakCache = new WeakMap();
weakCache.set(domElement, result);
// При удалении domElement из DOM → запись из weakCache тоже собирается
```

### Инструменты обнаружения

- **Chrome DevTools → Memory** → Heap Snapshot, Allocation Timeline.
- **Node.js**: `process.memoryUsage()`, `--inspect` + Chrome DevTools.
- **Библиотека**: `heapdump`, `node-memwatch`.

### Примеры

```javascript
// React: утечка через useEffect без cleanup
useEffect(() => {
  const subscription = eventEmitter.on('data', handler);
  // НУЖЕН CLEANUP:
  return () => subscription.off('data', handler);
}, []);

// React: setState после размонтирования (раньше была проблема)
useEffect(() => {
  const controller = new AbortController();
  fetch('/api', { signal: controller.signal })
    .then(r => r.json())
    .then(data => {
      if (!controller.signal.aborted) setState(data);
    });
  return () => controller.abort(); // cleanup
}, []);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как найти утечку памяти в браузере?** — DevTools → Memory → Heap Snapshot до и после действия; сравнить.
- **Почему WeakMap решает проблему кэша с DOM элементами?** — Слабые ссылки не блокируют GC; при удалении ключа-объекта запись удаляется автоматически.
- **Является ли setTimeout с незакрытым колбэком утечкой?** — Да, если колбэк держит ссылки на большие данные через замыкание.

### Красные флаги (чего не говорить)

- «В JavaScript нет утечек памяти» — есть, и в production они критичны.
- «GC автоматически всё почистит» — только недостижимые объекты.

### Связанные темы

- `078-kak-rabotaet-sborschik-musora.md`
- `080-osnovnye-tipy-utechek-pamyati-v-javascript.md`
- `035-chto-takoe-zamykanie-closure.md`
