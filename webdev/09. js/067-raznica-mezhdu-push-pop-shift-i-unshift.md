# Q067. Разница между методами `.push()`, `.pop()`, `.shift()` и `.unshift()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

Все четыре метода **мутируют** исходный массив. `push` / `pop` — работают с **концом** массива (O(1)). `unshift` / `shift` — работают с **началом** массива (O(n): все элементы переиндексируются). `push`/`unshift` — добавляют; `pop`/`shift` — удаляют.

---

## Развёрнутый ответ

### Таблица методов

| Метод | Конец/Начало | Операция | Возвращает |
|-------|-------------|----------|-----------|
| `push(...items)` | Конец | Добавляет | Новую длину |
| `pop()` | Конец | Удаляет | Удалённый элемент |
| `unshift(...items)` | Начало | Добавляет | Новую длину |
| `shift()` | Начало | Удаляет | Удалённый элемент |

### Примеры

```javascript
const arr = [2, 3, 4];

// push — добавить в конец
arr.push(5);        // возвращает 4 (новая длина)
arr.push(6, 7);     // несколько элементов
console.log(arr);   // [2, 3, 4, 5, 6, 7]

// pop — удалить с конца
const last = arr.pop(); // 7
console.log(arr);       // [2, 3, 4, 5, 6]

// unshift — добавить в начало
arr.unshift(0, 1);  // возвращает 7 (новая длина)
console.log(arr);   // [0, 1, 2, 3, 4, 5, 6]

// shift — удалить с начала
const first = arr.shift(); // 0
console.log(arr);          // [1, 2, 3, 4, 5, 6]
```

### Производительность

```javascript
// push/pop — O(1): только изменение последнего элемента + length
arr.push(x);  // быстро
arr.pop();    // быстро

// unshift/shift — O(n): все элементы переиндексируются
arr.unshift(x); // медленно при большом массиве
arr.shift();    // медленно при большом массиве
```

Для частых операций с началом массива лучше использовать `LinkedList`, `deque` или перевернуть логику (работать с концом).

### Паттерны: Стек и Очередь

```javascript
// Stack (LIFO — Last In, First Out)
class Stack {
  #items = [];
  push(item) { this.#items.push(item); }     // O(1)
  pop() { return this.#items.pop(); }         // O(1)
  peek() { return this.#items.at(-1); }
  get size() { return this.#items.length; }
}

// Queue (FIFO — First In, First Out) через push + shift
class Queue {
  #items = [];
  enqueue(item) { this.#items.push(item); }  // O(1)
  dequeue() { return this.#items.shift(); }  // O(n) — может быть медленно
  peek() { return this.#items[0]; }
  get size() { return this.#items.length; }
}
```

### Практика и применение

- **Стек** (`push`/`pop`): история навигации, undo/redo, вычисление выражений, DFS обход.
- **Очередь** (`push`/`shift`): очередь задач, BFS обход, буфер событий.
- **Аккумулирование результатов**: `reduce` с `push` в аккумулятор.

### Важные нюансы и краеугольные камни

- `push` с несколькими аргументами: `arr.push(1, 2, 3)` — эффективнее, чем 3 отдельных вызова.
- `pop()` на пустом массиве вернёт `undefined` (не ошибку).
- `shift()` на пустом массиве вернёт `undefined`.
- Иммутабельные альтернативы: `[...arr, item]` вместо `push`; `[item, ...arr]` вместо `unshift`; `arr.slice(0, -1)` вместо `pop`; `arr.slice(1)` вместо `shift`.

### Примеры

```javascript
// Иммутабельные эквиваленты (для React state)
const arr = [1, 2, 3];

// push
const afterPush = [...arr, 4];          // [1, 2, 3, 4]
// pop
const afterPop = arr.slice(0, -1);      // [1, 2]
// unshift
const afterUnshift = [0, ...arr];       // [0, 1, 2, 3]
// shift
const afterShift = arr.slice(1);        // [2, 3]

// Реализация undo/redo
class HistoryManager {
  #past = [];
  #future = [];
  #current;

  constructor(initial) {
    this.#current = initial;
  }

  do(action) {
    this.#past.push(this.#current);
    this.#current = action(this.#current);
    this.#future = [];
  }

  undo() {
    if (!this.#past.length) return;
    this.#future.push(this.#current);
    this.#current = this.#past.pop();
  }

  redo() {
    if (!this.#future.length) return;
    this.#past.push(this.#current);
    this.#current = this.#future.pop();
  }

  get state() { return this.#current; }
}
```

---

## Сравнение

| | `push` | `pop` | `unshift` | `shift` |
|--|--------|-------|-----------|---------|
| Конец/начало | Конец | Конец | Начало | Начало |
| Добавление/удаление | Добавляет | Удаляет | Добавляет | Удаляет |
| Возвращает | Длина | Элемент | Длина | Элемент |
| Сложность | O(1) | O(1) | O(n) | O(n) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `shift`/`unshift` медленнее `push`/`pop`?** — Нужно переиндексировать все элементы.
- **Как реализовать очередь с O(1) для enqueue и dequeue?** — Два стека или связный список.
- **Как иммутабельно добавить элемент в начало массива?** — `[newItem, ...arr]`.

### Красные флаги (чего не говорить)

- «`push` возвращает добавленный элемент» — нет, возвращает новую длину массива.
- «`shift`/`unshift` работают так же быстро, как `push`/`pop`» — нет, O(n) vs O(1).

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `065-raznica-mezhdu-slice-i-splice.md`
