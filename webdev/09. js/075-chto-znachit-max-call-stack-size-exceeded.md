# Q075. Что значит «Maximum call stack size exceeded»?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`RangeError: Maximum call stack size exceeded` — ошибка переполнения стека вызовов (stack overflow). Происходит когда глубина вложенных вызовов функций превышает лимит (обычно ~10 000–15 000 в V8). Типичные причины: бесконечная рекурсия (нет базового случая), очень глубокая рекурсия или взаимная рекурсия без условия завершения.

---

## Развёрнутый ответ

### Суть

Каждый вызов функции добавляет **фрейм** (stack frame) в стек вызовов (call stack). Фрейм содержит: аргументы, локальные переменные, адрес возврата. Стек имеет ограниченный размер — при его исчерпании движок бросает `RangeError`.

### Причины

**1. Рекурсия без базового случая:**
```javascript
function infinite(n) {
  return infinite(n + 1); // нет условия остановки!
}
infinite(0); // RangeError: Maximum call stack size exceeded
```

**2. Ошибка в базовом случае:**
```javascript
function countDown(n) {
  if (n === 0) return; // ТОЛЬКО для n=0, не для отрицательных!
  return countDown(n - 1);
}
countDown(-1); // бесконечная рекурсия для отрицательных!

// Исправление:
function countDownFixed(n) {
  if (n <= 0) return; // покрывает все случаи ≤ 0
  return countDownFixed(n - 1);
}
```

**3. Слишком глубокая, но конечная рекурсия:**
```javascript
function sumTo(n) {
  if (n === 0) return 0;
  return n + sumTo(n - 1);
}
sumTo(100000); // RangeError в V8 (~10k-15k глубина)
```

**4. Взаимная рекурсия без завершения:**
```javascript
function isEven(n) {
  if (n === 0) return true;
  return isOdd(n - 1);
}
function isOdd(n) {
  if (n === 0) return false;
  return isEven(n - 1);
}
isEven(100000); // может переполнить стек
```

**5. Случайный бесконечный цикл событий (indirect):**
```javascript
// Getter вызывает сам себя
const obj = {
  get value() {
    return this.value; // ← рекурсивный вызов геттера!
  }
};
obj.value; // RangeError
```

### Решения

**1. Проверить базовый случай рекурсии:**
```javascript
// Всегда убеждайтесь, что базовый случай достижим для всех входных данных
function safe(n) {
  if (typeof n !== 'number' || n <= 0) return 0;
  return n + safe(n - 1);
}
```

**2. Итерация вместо рекурсии:**
```javascript
function sumToIter(n) {
  let result = 0;
  for (let i = 1; i <= n; i++) result += i;
  return result;
}
sumToIter(1000000); // без проблем
```

**3. Явный стек для глубоких деревьев:**
```javascript
function traverseIterative(root) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    process(node);
    node.children?.forEach(child => stack.push(child));
  }
}
```

**4. Trampolining:**
```javascript
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') result = result();
    return result;
  };
}
```

**5. Разбить на асинхронные задачи (chunking):**
```javascript
async function processLargeTree(root) {
  const queue = [root];
  while (queue.length) {
    const batch = queue.splice(0, 100); // обрабатывать по 100
    for (const node of batch) {
      process(node);
      queue.push(...(node.children || []));
    }
    await new Promise(r => setTimeout(r, 0)); // уступить Event Loop
  }
}
```

### Важные нюансы и краеугольные камни

- Лимит стека V8 зависит от размера фреймов; маленькие функции дают большую глубину.
- `--stack-size=N` в Node.js позволяет увеличить лимит, но это не решение.
- В strict mode ошибка та же, но `arguments.callee` недоступен.

### Примеры

```javascript
// Диагностика: определить глубину до error
let depth = 0;
function measure() {
  try {
    depth++;
    measure();
  } catch(e) {
    console.log(`Max depth: ~${depth}`); // обычно ~10k-15k
  }
}
measure();
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как найти причину stack overflow?** — Посмотреть stack trace в console; найти повторяющийся паттерн вызовов.
- **Чем stack overflow отличается от heap overflow?** — Stack overflow — исчерпание стека вызовов (глубина рекурсии); heap overflow — исчерпание памяти для объектов (out of memory).

### Красные флаги (чего не говорить)

- «Просто увеличим `--stack-size` и проблема решена» — это временный патч; нужно устранить первопричину.

### Связанные темы

- `073-chto-takoe-rekursiya.md`
- `074-chto-takoe-khvostovaya-rekursiya.md`
- `077-kak-rabotaet-kontekst-vypolneniya-execution-context.md`
