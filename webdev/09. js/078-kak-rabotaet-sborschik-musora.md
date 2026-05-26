# Q078. Как работает сборщик мусора в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

JavaScript использует **автоматическое управление памятью** через сборщик мусора (Garbage Collector, GC). Основной алгоритм — **mark-and-sweep**: движок периодически «помечает» все объекты, достижимые из корней (глобальный объект, стек вызовов), и удаляет «недостижимые». Старый алгоритм подсчёта ссылок заменён из-за неспособности обрабатывать циклические ссылки.

---

## Развёрнутый ответ

### Суть

**Достижимость** (reachability) — ключевая концепция:
- Объект **достижим**, если к нему можно добраться из «корней» через цепочку ссылок.
- **Корни**: глобальный объект, стек вызовов (локальные переменные функций), регистры CPU.
- Недостижимые объекты — кандидаты на удаление.

### Алгоритм mark-and-sweep

```
1. Начать с корней (roots)
2. Пометить все объекты, достижимые из корней (DFS/BFS обход графа)
3. Все НЕ помеченные объекты → недостижимы → удалить → освободить память
4. Сбросить пометки
5. Повторить через некоторое время
```

### Простые случаи

```javascript
// Объект создаётся и теряет все ссылки
function createUser() {
  const user = { name: 'Alice', data: new Array(1000) }; // выделена память
  // user уходит из scope
}
createUser();
// user → недостижим → GC может освободить

// Явная потеря ссылки
let user = { name: 'Alice' };
user = null; // → объект может быть собран
```

### Циклические ссылки (не проблема для mark-and-sweep)

```javascript
function createCycle() {
  const a = {};
  const b = {};
  a.ref = b; // a → b
  b.ref = a; // b → a (цикл!)
  // a и b друг на друга ссылаются, но из внешнего кода недостижимы
}
createCycle();
// После выхода: a и b недостижимы из корней → собираются GC
// Подсчёт ссылок: ошибочно считает refcount(a)=1, refcount(b)=1 → утечка
// mark-and-sweep: правильно определяет недостижимость
```

### V8 GC: Generational Garbage Collection

V8 использует поколенческий GC:

**Young Generation (Nursery):**
- Новые объекты попадают сюда.
- Малый размер (~1–8 MB).
- Частые быстрые сборки (Minor GC, Scavenge).
- Большинство объектов умирают молодыми («гипотеза о молодости»).

**Old Generation:**
- Объекты, пережившие несколько Minor GC.
- Большой размер.
- Редкие полные сборки (Major GC, Mark-Sweep-Compact).
- Включает инкрементальную сборку, параллельную и конкурентную.

```
Allocation → Young Gen → (survive Minor GC × 2) → Old Gen
                ↓ (most objects die here)
              collected
```

### WeakRef и FinalizationRegistry (ES2021)

```javascript
// WeakRef — слабая ссылка (не препятствует GC)
let cache = new WeakRef(expensiveObject);
// ... позже:
const obj = cache.deref(); // undefined если GC собрал
if (obj) { /* используем */ }

// FinalizationRegistry — колбэк при сборке объекта
const registry = new FinalizationRegistry((value) => {
  console.log(`Object with value ${value} was collected`);
});
registry.register(someObject, 'metadata');
```

### Практика и применение

- Нет нужды вручную освобождать память (как в C).
- Но нужно **избегать утечек** — удерживания ненужных ссылок.
- `WeakMap`/`WeakSet` для кэшей с объектами-ключами: не блокируют GC.

### Важные нюансы и краеугольные камни

- GC **недетерминирован** — момент сборки непредсказуем.
- **Stop-the-world** пауза (Minor GC быстрее) — V8 использует инкрементальный и конкурентный GC для минимизации.
- **Утечки:** замыкания на большие объекты, не очищенные event listeners, глобальные переменные — сохраняют достижимость.

### Примеры

```javascript
// WeakMap как кэш без удержания объектов
const cache = new WeakMap();

function processElement(el) {
  if (cache.has(el)) return cache.get(el);

  const result = expensiveCompute(el);
  cache.set(el, result); // при удалении el из DOM → GC соберёт и кэш
  return result;
}

// Потенциальная утечка через event listener
function addHandler(element) {
  const data = new Array(10000); // большие данные
  element.addEventListener('click', () => {
    console.log(data.length); // data в замыкании → удерживает память
  });
}
// Решение: removeEventListener при cleanup или использовать AbortController
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему mark-and-sweep лучше подсчёта ссылок?** — Корректно обрабатывает циклические ссылки.
- **Что такое поколенческий GC?** — Разделение на молодое и старое поколения; быстрые сборки молодого, редкие полные сборки.
- **Когда WeakMap предпочтительнее Map?** — Когда ключи — объекты, и нужно разрешить GC собирать их при отсутствии других ссылок.

### Красные флаги (чего не говорить)

- «В JS нет утечек памяти» — есть, например через замыкания и event listeners.
- «GC запускается сразу после потери ссылки» — недетерминирован.

### Связанные темы

- `079-chto-takoe-utechki-pamyati.md`
- `080-osnovnye-tipy-utechek-pamyati-v-javascript.md`
- `035-chto-takoe-zamykanie-closure.md`
