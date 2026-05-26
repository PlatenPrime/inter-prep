# Q025. Для чего используется цикл `for…of`?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

`for...of` (ES2015) — цикл для итерации по **итерируемым объектам**: массивам, строкам, Set, Map, генераторам, NodeList и любым объектам с `[Symbol.iterator]`. Перебирает **значения** (не ключи/индексы). В отличие от `for...in`, не затрагивает прототипную цепочку и не использует перечисляемость свойств.

---

## Развёрнутый ответ

### Суть и определение

`for...of` работает с **итерационным протоколом**: вызывает `[Symbol.iterator]()` объекта и многократно вызывает `next()` на полученном итераторе до `done: true`.

Синтаксис:
```javascript
for (const value of iterable) {
  // тело
}
```

Переменная может быть `const`, `let` (или `var`). Для каждой итерации создаётся новая привязка (`const` безопасен в `for...of`).

### Что можно перебирать

| Тип | Что выдаёт `for...of` |
|-----|----------------------|
| `Array` | Значения элементов |
| `String` | Символы (кодовые точки Unicode) |
| `Set` | Уникальные значения |
| `Map` | `[key, value]` пары |
| `Generator` | Yielded-значения |
| `NodeList` | DOM-узлы |
| `arguments` | Аргументы функции |
| Кастомный итерируемый | Что вернёт итератор |

### Практика и применение

```javascript
// Массив
const fruits = ['apple', 'banana', 'cherry'];
for (const fruit of fruits) {
  console.log(fruit);
}

// Строка — по кодовым точкам Unicode (а не байтам!)
for (const char of 'Hello 😀') {
  console.log(char); // H e l l o   😀 — 7 итераций, а не 8!
}

// Set
const roles = new Set(['admin', 'user', 'moderator']);
for (const role of roles) { console.log(role); }

// Map с деструктуризацией
const config = new Map([['host', 'localhost'], ['port', 3000]]);
for (const [key, value] of config) {
  console.log(`${key}: ${value}`);
}

// Индекс через entries()
const arr = ['a', 'b', 'c'];
for (const [index, value] of arr.entries()) {
  console.log(`${index}: ${value}`);
}

// Generator
function* range(start, end) {
  for (let i = start; i <= end; i++) yield i;
}
for (const n of range(1, 5)) {
  console.log(n); // 1 2 3 4 5
}

// break/continue работают
for (const item of largeCollection) {
  if (item.isDone) break;
  process(item);
}
```

### Важные нюансы и краеугольные камни

- **`for...of` НЕ работает с обычными объектами** `{}` — они не итерируемы. Нужно `Object.keys/values/entries()`.
- **`const` в `for...of`** — безопасен: каждая итерация — новое лексическое окружение.
- **Асинхронная версия** — `for await...of` для AsyncIterable (ES2018).
- **Производительность**: для массивов `for` с индексом быстрее в некоторых движках, но разница минимальна.
- **Строки по кодовым точкам** — важно при работе с эмодзи и символами за пределами BMP.

### Примеры

```javascript
// for await...of для потоков
async function processStream(stream) {
  for await (const chunk of stream) {
    await processChunk(chunk);
  }
}

// Досрочный выход с очисткой ресурсов
function* withResource() {
  const resource = acquireResource();
  try {
    yield* resource.data;
  } finally {
    resource.release(); // вызовется при break
  }
}

for (const item of withResource()) {
  if (shouldStop(item)) break; // finally сработает — ресурс освободится
}

// Плоский обход вложенных структур
function* walkDOM(node) {
  yield node;
  for (const child of node.children) {
    yield* walkDOM(child);
  }
}
for (const el of walkDOM(document.body)) {
  if (el.tagName === 'INPUT') el.disabled = true;
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `for...of` не работает с `{}`?** — Обычные объекты не итерируемы (нет `[Symbol.iterator]`); используйте `Object.entries()`.
- **Чем `for...of` отличается от `forEach`?** — `for...of` поддерживает `break`, `continue`, `return`, `await`; `forEach` — нет.
- **Как получить индекс в `for...of`?** — Через `arr.entries()`: `for (const [i, v] of arr.entries())`.
- **Что такое `for await...of`?** — Перебор AsyncIterable: ждёт каждый yield/chunk перед следующей итерацией.

### Красные флаги (чего не говорить)

- «`for...of` перебирает ключи объекта» — нет, значения; ключи — `for...in`.
- «`for...of` можно использовать с любым объектом» — только с итерируемыми.
- «Нет разницы между `for...of` и `forEach`» — `break`/`continue`/`await` — принципиальная разница.

### Связанные темы

- [`026-raznica-for-of-i-for-in.md`](026-raznica-for-of-i-for-in.md)
- [`023-chto-takoe-iteratory.md`](023-chto-takoe-iteratory.md)
- [`022-perebor-elementov-v-kollekciyah-map-i-set.md`](022-perebor-elementov-v-kollekciyah-map-i-set.md)
