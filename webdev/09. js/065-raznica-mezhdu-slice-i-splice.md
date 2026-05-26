# Q065. Разница между методами `.slice()` и `.splice()`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`.slice(start, end)` — **иммутабельный**: возвращает новый массив (или строку) с элементами от `start` до `end` (не включая), не изменяет оригинал. `.splice(start, deleteCount, ...items)` — **мутирующий**: изменяет оригинальный массив (удаляет/вставляет элементы) и возвращает массив удалённых элементов.

---

## Развёрнутый ответ

### `.slice()` — иммутабельное извлечение

```javascript
const arr = [1, 2, 3, 4, 5];

arr.slice(1, 3);   // [2, 3] — индексы 1 и 2, end не включается
arr.slice(2);      // [3, 4, 5] — от индекса 2 до конца
arr.slice(-2);     // [4, 5] — последние 2 элемента
arr.slice(1, -1);  // [2, 3, 4] — с 1 до предпоследнего

console.log(arr); // [1, 2, 3, 4, 5] — не изменился!
```

Также работает для строк: `"hello".slice(1, 3)` → `"el"`.

**Применение:**
- Копирование массива: `arr.slice()` → shallow copy.
- Безопасное извлечение части данных.
- Конвертация псевдомассива: `Array.prototype.slice.call(arguments)`.

### `.splice()` — мутирующее редактирование

```javascript
const arr = [1, 2, 3, 4, 5];

// Удаление: splice(start, deleteCount)
arr.splice(1, 2);            // возвращает [2, 3], arr = [1, 4, 5]

// Вставка: splice(start, 0, ...items)
arr.splice(1, 0, 'a', 'b'); // возвращает [], arr = [1, 'a', 'b', 4, 5]

// Замена: splice(start, deleteCount, ...newItems)
arr.splice(1, 2, 'x');      // возвращает ['a', 'b'], arr = [1, 'x', 4, 5]

// Удаление с конца
arr.splice(-1, 1);           // удалить последний элемент
```

### Практика и применение

```javascript
// slice — иммутабельная пагинация
function paginate(items, page, pageSize) {
  const start = (page - 1) * pageSize;
  return items.slice(start, start + pageSize);
}

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
paginate(items, 2, 3); // [4, 5, 6]

// splice — удаление элемента по значению
function removeByValue(arr, value) {
  const index = arr.indexOf(value);
  if (index !== -1) arr.splice(index, 1);
  return arr;
}

// Иммутабельный аналог splice через slice + spread
function removeAt(arr, index) {
  return [...arr.slice(0, index), ...arr.slice(index + 1)];
}
// или: arr.filter((_, i) => i !== index)
// или ES2023: arr.toSpliced(index, 1)
```

### Важные нюансы и краеугольные камни

- `splice` работает только для массивов; `slice` — для массивов и строк.
- `splice` с отрицательным `start` — считает с конца: `splice(-1, 1)` удаляет последний.
- `slice()` без аргументов → полная shallow copy массива.
- ES2023 `toSpliced(start, deleteCount, ...items)` — иммутабельный аналог `splice`.

### Примеры

```javascript
// Мнемоника: slice — "срезает" копию, splice — "вживляет/удаляет" в оригинал

// Реализация очереди через splice
class Queue {
  #items = [];

  enqueue(item) {
    this.#items.push(item);
  }

  dequeue() {
    return this.#items.splice(0, 1)[0]; // удалить первый
    // Более эффективно: this.#items.shift()
  }

  peek() {
    return this.#items.slice(0, 1)[0]; // посмотреть без удаления
  }
}
```

---

## Сравнение

| Критерий | `.slice()` | `.splice()` |
|----------|-----------|------------|
| Мутирует оригинал | ✗ | ✓ |
| Возвращает | Новый массив | Массив удалённых элементов |
| Работает со строками | ✓ | ✗ |
| Отрицательные индексы | ✓ | ✓ |
| Применение | Извлечение, копирование | Вставка, удаление, замена |
| ES2023 аналог | — | `toSpliced()` (иммутабельный) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как иммутабельно реализовать вставку в середину массива?** — `[...arr.slice(0, i), newItem, ...arr.slice(i)]` или `arr.toSpliced(i, 0, newItem)`.
- **Как `slice()` без аргументов используется?** — Создаёт shallow copy массива.

### Красные флаги (чего не говорить)

- «`slice` мутирует массив» — нет, иммутабельный.
- «`splice` и `slice` — одно и то же, просто синтаксис разный» — принципиально разные операции.

### Связанные темы

- `062-metody-massivov-v-javascript.md`
- `067-raznica-mezhdu-push-pop-shift-i-unshift.md`
- `055-raznica-mezhdu-deep-i-shallow-kopiyami-obiekta.md`
