# Q074. Что такое хвостовая рекурсия? Оптимизация рекурсии?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Хвостовая рекурсия (tail recursion)** — рекурсия, при которой рекурсивный вызов является **последней операцией** функции. В таком случае движок может оптимизировать: не добавлять новый фрейм в стек, а переиспользовать текущий (Tail Call Optimization, TCO). В ES6 TCO является частью спецификации, но **поддерживается только Safari**; в V8 (Node/Chrome) — не реализована. Практическая альтернатива — trampolining.

---

## Развёрнутый ответ

### Обычная vs хвостовая рекурсия

**Обычная рекурсия** — после возврата нужно выполнить операцию (умножение), поэтому фрейм нельзя удалить:
```javascript
function factorial(n) {
  if (n <= 1) return 1;
  return n * factorial(n - 1); // УМНОЖЕНИЕ после вызова — не хвостовая!
}
// Стек: factorial(5) → factorial(4) → factorial(3) → ...
```

**Хвостовая рекурсия** — рекурсивный вызов — последнее действие, результат передаётся через аккумулятор:
```javascript
function factTail(n, acc = 1) {
  if (n <= 1) return acc;
  return factTail(n - 1, n * acc); // вызов — последняя операция, TCO возможна
}
factTail(5);    // factTail(4, 5) → factTail(3, 20) → factTail(2, 60) → ...
```

### Tail Call Optimization (TCO)

При TCO движок **заменяет** текущий фрейм новым вместо добавления:
```
Без TCO:  [fact(5)] → [fact(4)] → [fact(3)] → ...  (N фреймов)
С TCO:    [fact(n)] всегда один фрейм (заменяется)
```

Спецификация ES6 требует TCO, но на практике:
- **Safari** — поддерживает.
- **V8 (Chrome, Node.js)** — не поддерживает (признан «harmful»).
- **SpiderMonkey (Firefox)** — не поддерживает.

### Практические альтернативы

**1. Итерация — лучший вариант когда возможна:**
```javascript
function factIter(n) {
  let result = 1;
  for (let i = 2; i <= n; i++) result *= i;
  return result;
}
```

**2. Trampolining — эмуляция TCO:**
```javascript
// Trampoline: выполняет функцию, пока она возвращает функцию
function trampoline(fn) {
  return function(...args) {
    let result = fn(...args);
    while (typeof result === 'function') {
      result = result();
    }
    return result;
  };
}

// Хвостовая рекурсия через thunks
function factTailThunk(n, acc = 1) {
  if (n <= 1) return acc;
  return () => factTailThunk(n - 1, n * acc); // ФУНКЦИЯ, не вызов
}

const factorial = trampoline(factTailThunk);
factorial(10000); // работает без переполнения стека!
```

**3. Явный стек (iterative DFS):**
```javascript
// Рекурсивный DFS (может переполнить стек для глубоких деревьев)
function dfsRecursive(node) {
  console.log(node.value);
  node.children.forEach(dfsRecursive);
}

// Итеративный DFS с явным стеком
function dfsIterative(root) {
  const stack = [root];
  while (stack.length) {
    const node = stack.pop();
    console.log(node.value);
    stack.push(...node.children.reverse());
  }
}
```

### Оптимизация рекурсии в целом

| Техника | Когда применять |
|---------|----------------|
| Мемоизация | Перекрывающиеся подзадачи (fib, DP) |
| Хвостовая рекурсия + TCO | Линейная рекурсия, движок поддерживает |
| Trampolining | Когда TCO недоступен |
| Итерация | Простые линейные задачи |
| Явный стек | Глубокие деревья/графы |

### Важные нюансы и краеугольные камни

- Хвостовая рекурсия требует передачи состояния через аккумулятор — меняет API функции.
- TCO в V8 была реализована (ES6 Harmony), но отключена в Chrome 59 из-за сложности с инструментами отладки.
- Для production в Node.js — использовать итерацию или trampolining.

### Примеры

```javascript
// Fibonacci с хвостовой рекурсией
function fibTail(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return fibTail(n - 1, b, a + b); // хвостовой вызов
}

// Trampolined Fibonacci
function fibThunk(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return () => fibThunk(n - 1, b, a + b);
}

const fibonacci = trampoline(fibThunk);
fibonacci(10000); // работает!
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Поддерживает ли V8 TCO?** — Нет; в Node.js/Chrome необходимы альтернативы.
- **Что такое trampolining?** — Замена рекурсивного вызова возвратом функции-thunk; выполнение в цикле снаружи.
- **Чем хвостовая рекурсия отличается от обычной?** — Рекурсивный вызов — последнее действие, не нужно хранить фрейм для последующих операций.

### Красные флаги (чего не говорить)

- «Node.js поддерживает TCO» — не поддерживает.
- «Хвостовая рекурсия автоматически оптимизируется в JS» — только в Safari.

### Связанные темы

- `073-chto-takoe-rekursiya.md`
- `075-chto-znachit-max-call-stack-size-exceeded.md`
- `037-chto-takoe-memoizaciya-realizuyte-bazvuyu-logiku.md`
