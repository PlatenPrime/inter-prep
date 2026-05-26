# Q073. Что такое рекурсия?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Рекурсия** — техника, при которой функция вызывает **саму себя** для решения более простой версии той же задачи. Каждый рекурсивный вызов должен приближаться к **базовому случаю** (base case) — условию завершения. Без базового случая рекурсия бесконечна и приводит к `RangeError: Maximum call stack size exceeded`.

---

## Развёрнутый ответ

### Суть и структура

Каждая рекурсивная функция имеет:
1. **Базовый случай (base case)** — условие остановки.
2. **Рекурсивный случай (recursive case)** — вызов себя с упрощённым аргументом.

```javascript
function factorial(n) {
  // 1. Базовый случай
  if (n <= 1) return 1;

  // 2. Рекурсивный случай — приближаемся к 0
  return n * factorial(n - 1);
}

factorial(5);
// 5 * factorial(4)
// 5 * 4 * factorial(3)
// 5 * 4 * 3 * factorial(2)
// 5 * 4 * 3 * 2 * factorial(1)
// 5 * 4 * 3 * 2 * 1 = 120
```

### Стек вызовов (call stack)

Каждый вызов функции добавляет **фрейм** в стек. При рекурсии глубиной N — N фреймов одновременно. При переполнении (обычно ~10 000 вызовов) — `RangeError: Maximum call stack size exceeded`.

### Практика и применение

**1. Обход деревьев (DOM, файловая система, JSON):**
```javascript
function traverse(node) {
  console.log(node.value);
  for (const child of node.children) {
    traverse(child); // рекурсивный обход
  }
}

// Поиск всех элементов с классом
function findByClass(element, className, results = []) {
  if (element.classList?.contains(className)) results.push(element);
  for (const child of element.children) {
    findByClass(child, className, results);
  }
  return results;
}
```

**2. Фибоначчи:**
```javascript
// Наивная рекурсия — O(2^n)
function fib(n) {
  if (n <= 1) return n;
  return fib(n - 1) + fib(n - 2);
}

// С мемоизацией — O(n)
function fibMemo(n, memo = {}) {
  if (n in memo) return memo[n];
  if (n <= 1) return n;
  return memo[n] = fibMemo(n - 1, memo) + fibMemo(n - 2, memo);
}
```

**3. Глубокое копирование:**
```javascript
function deepClone(obj) {
  if (obj === null || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(deepClone);
  return Object.fromEntries(
    Object.entries(obj).map(([k, v]) => [k, deepClone(v)])
  );
}
```

**4. Flatten (развёртывание вложенного массива):**
```javascript
function flatten(arr) {
  return arr.reduce((acc, item) => {
    return acc.concat(Array.isArray(item) ? flatten(item) : item);
  }, []);
}
// Современно: arr.flat(Infinity)
```

### Рекурсия vs Итерация

```javascript
// Рекурсивно
function sumRecursive(n) {
  if (n <= 0) return 0;
  return n + sumRecursive(n - 1);
}

// Итеративно (нет риска stackoverflow)
function sumIterative(n) {
  let sum = 0;
  for (let i = 1; i <= n; i++) sum += i;
  return sum;
}
```

### Важные нюансы и краеугольные камни

- Глубина стека вызовов в V8 — ~10 000–15 000 фреймов.
- Рекурсивный DFS (Deep-First Search) деревьев — естественное применение.
- Для глубоких деревьев рассмотрите явный стек (итеративный DFS) или trampolining.
- **Взаимная рекурсия** — функция A вызывает B, B вызывает A.

### Примеры

```javascript
// Трамплин (trampoline) для хвостовой рекурсии без переполнения
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

function factTail(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factTail(n - 1, n * acc); // возвращаем функцию вместо вызова
}

const factorial = trampoline(factTail);
factorial(100000); // не переполнит стек!
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое базовый случай и почему он обязателен?** — Без него рекурсия бесконечна → переполнение стека.
- **Когда рекурсия хуже итерации?** — При большой глубине (риск stackoverflow) и когда итерация очевидна.
- **Как избежать повторных вычислений в рекурсии?** — Мемоизация.

### Красные флаги (чего не говорить)

- «Рекурсия всегда медленнее итерации» — для деревьев и графов рекурсия часто элегантнее и сравнима по скорости.

### Связанные темы

- `074-chto-takoe-khvostovaya-rekursiya.md`
- `075-chto-znachit-max-call-stack-size-exceeded.md`
- `037-chto-takoe-memoizaciya-realizuyte-bazvuyu-logiku.md`
