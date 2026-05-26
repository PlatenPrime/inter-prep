# Q080. Основные типы утечек памяти в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Выделяют **6 основных типов** утечек памяти в JavaScript: глобальные переменные, незакрытые таймеры/интервалы, забытые обработчики событий, замыкания с ненужными ссылками, отсоединённые DOM-узлы, и использование `Map`/`Set` вместо `WeakMap`/`WeakSet` для хранения объектов. Общий принцип: объект не освобождается пока существует хотя бы одна ссылка на него.

---

## Развёрнутый ответ

### Суть

Сборщик мусора V8 использует алгоритм **Mark-and-Sweep**: объект «жив», если до него можно добраться по цепочке ссылок от корней (`window`, стек). Утечка — это случай когда ссылка есть, но объект «логически» уже не нужен.

### Тип 1: Случайные глобальные переменные

```javascript
// Опечатка в sloppy mode → глобальная переменная
function leak() {
  accidentalGlobal = new Array(1_000_000); // window.accidentalGlobal
}

// Через this в sloppy mode
function leak2() {
  this.data = new Array(1_000_000); // this === window при вызове без new
}

// Защита:
'use strict'; // ReferenceError при неявном создании глобалей
```

### Тип 2: Забытые таймеры и интервалы

```javascript
// setInterval захватывает замыкание через колбэк
class DataPoller {
  constructor() {
    this.data = new Array(100_000);
    // Интервал живёт и держит this.data, даже если DataPoller уничтожен!
    setInterval(() => this.processData(), 1000);
  }
}

// Правильно: хранить id и очищать
class DataPollerFixed {
  #intervalId = null;

  start() {
    this.#intervalId = setInterval(() => this.processData(), 1000);
  }

  destroy() {
    clearInterval(this.#intervalId);
  }
}
```

### Тип 3: Забытые обработчики событий

```javascript
// Распространённая утечка в SPA
function addModal() {
  const modal = document.createElement('div');
  const heavyData = fetchHeavyData();

  // Слушатель захватывает heavyData через замыкание
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      modal.remove(); // modal удалён из DOM...
      // но слушатель на document остался! → heavyData не освобождается
    }
  });
}

// Правильно: AbortController или именованная функция
function addModalFixed() {
  const controller = new AbortController();

  document.addEventListener('keydown', closeModal, {
    signal: controller.signal,
  });

  function closeModal(e) {
    if (e.key === 'Escape') {
      controller.abort(); // удаляет слушатель
    }
  }
}
```

### Тип 4: Замыкания с ненужными ссылками

```javascript
// Классический пример утечки через замыкание (стародавний баг IE, но поучителен)
function setup(element) {
  const bigData = new Array(1_000_000);

  element.addEventListener('click', function onClick() {
    console.log('clicked'); // bigData не используется, но удерживается!
  });
}

// Современный V8 оптимизирует это, но явная чистка надёжнее:
function setupFixed(element) {
  element.addEventListener('click', function onClick() {
    console.log('clicked');
  });
  // bigData в отдельном scope — очистится сразу
}
```

### Тип 5: Отсоединённые DOM-узлы (Detached DOM)

```javascript
// Сохранение ссылки на удалённый DOM-элемент
const elements = {
  button: document.getElementById('btn'),
};

document.body.removeChild(document.getElementById('btn'));
// elements.button всё ещё ссылается на удалённый узел → не освобождается GC

// Правильно:
function removeButton() {
  document.body.removeChild(document.getElementById('btn'));
  elements.button = null; // явно обнуляем ссылку
}
```

### Тип 6: Неправильное кэширование с Map/Set

```javascript
// Map удерживает сильные ссылки на ключи
const cache = new Map();

function processElement(domElement) {
  if (!cache.has(domElement)) {
    cache.set(domElement, expensiveComputation(domElement));
  }
  return cache.get(domElement);
}

// Если domElement удалён из DOM — запись в Map остаётся в памяти!

// Правильно: WeakMap (слабые ссылки не блокируют GC)
const weakCache = new WeakMap();

function processElementFixed(domElement) {
  if (!weakCache.has(domElement)) {
    weakCache.set(domElement, expensiveComputation(domElement));
  }
  return weakCache.get(domElement);
}
// При удалении domElement → запись из weakCache автоматически исчезнет
```

### Диагностика утечек в Chrome DevTools

1. **Performance Monitor** — наблюдать за `JS heap size` в реальном времени.
2. **Memory → Heap Snapshot** — сравнить до и после действия.
3. **Memory → Allocation Timeline** — найти объекты, которые не освобождаются.
4. Фильтр «Detached» в Heap Snapshot — найти Detached DOM-узлы.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как WeakRef отличается от WeakMap?** — `WeakRef` хранит слабую ссылку на объект напрямую; объект может быть собран GC в любой момент. Нужен `FinalizationRegistry` для реагирования на сборку.
- **Может ли Closure сама по себе быть утечкой?** — Только если содержит ссылку на большой объект дольше нужного; сам механизм замыкания не является утечкой.
- **Как Node.js помогает найти утечки?** — `--inspect`, `process.memoryUsage()`, `clinic.js`, `heapdump`.

### Красные флаги (чего не говорить)

- «Утечки памяти бывают только в C/C++» — в JS тоже, просто управление памятью неявное.
- Путать «утечку» с «нормальным кэшированием» — ключевое слово: «нужно ли это в памяти?»

### Связанные темы

- `078-kak-rabotaet-sborschik-musora.md`
- `079-chto-takoe-utechki-pamyati.md`
- `059-zachem-nuzhen-konstruktor-proxy.md`
