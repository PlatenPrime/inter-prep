# Q037. Что такое мемоизация? Реализуйте базовую логику функции для мемоизации?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Мемоизация** — техника оптимизации: результаты **чистой функции** кэшируются по ключу аргументов, и при повторном вызове с теми же аргументами возвращается кэшированный результат без повторного вычисления. Применима только к детерминированным функциям без побочных эффектов.

---

## Развёрнутый ответ

### Суть и определение

Мемоизация — специализированный вид кэширования. «Memoize» — от латинского memorandum («то, что нужно помнить»). Идея: первый вызов с заданными аргументами — вычислить и сохранить; следующие вызовы — вернуть из кэша.

Условия применимости:
1. Функция **чистая** (pure) — одинаковые аргументы → одинаковый результат.
2. Вычисление **дорогостоящее** — мемоизация даёт прирост только если overhead кэша < стоимость вычисления.

### Базовая реализация

```javascript
function memoize(fn) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### Использование

```javascript
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// Без мемоизации: O(2^n)
fibonacci(40); // медленно

// С мемоизацией
const memoFib = memoize(function fib(n) {
  if (n <= 1) return n;
  return memoFib(n - 1) + memoFib(n - 2);
});

memoFib(40); // быстро — O(n)
memoFib(40); // мгновенно — из кэша
```

### Продвинутая реализация с ограничением размера кэша (LRU)

```javascript
function memoize(fn, { maxSize = 100 } = {}) {
  const cache = new Map();

  return function memoized(...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      // LRU: переставляем в конец (последний использованный)
      const value = cache.get(key);
      cache.delete(key);
      cache.set(key, value);
      return value;
    }

    const result = fn.apply(this, args);

    if (cache.size >= maxSize) {
      // Удаляем самый старый (первый)
      cache.delete(cache.keys().next().value);
    }

    cache.set(key, result);
    return result;
  };
}
```

### Практика и применение

- **React `useMemo`/`useCallback`** — встроенная мемоизация: пересчёт только при изменении зависимостей.
- **Рекурсивные вычисления:** фибоначчи, динамическое программирование.
- **Дорогие CPU-вычисления:** парсинг, криптография, регулярные выражения.
- **Lodash `_.memoize`** — production-готовая реализация.

### Важные нюансы и краеугольные камни

- **`JSON.stringify` как ключ** — не подходит для объектов с циклическими ссылками, функций, Symbol. Для сложных аргументов нужна кастомная функция ключа.
- Мемоизация не должна применяться к нечистым функциям (с `Date.now()`, `Math.random()`).
- **Утечки памяти:** кэш растёт бесконечно. В production нужен `maxSize` или `WeakMap` для объектов-аргументов.
- `useMemo` в React — не гарантирует кэширование; React может выбросить кэш при memory pressure.

### Примеры

```javascript
// React useMemo
function ExpensiveComponent({ data, filter }) {
  const filteredData = useMemo(
    () => data.filter(item => item.category === filter),
    [data, filter] // пересчёт только при изменении data или filter
  );

  return <List items={filteredData} />;
}

// Мемоизация с WeakMap для объектов-аргументов
function memoizeWithWeakMap(fn) {
  const cache = new WeakMap();

  return function(obj) { // только для единственного объект-аргумента
    if (cache.has(obj)) return cache.get(obj);
    const result = fn(obj);
    cache.set(obj, result);
    return result;
  };
}

// Функция для сложных сериализуемых аргументов
const computeHash = memoize(
  (data) => crypto.subtle.digest('SHA-256', data),
  { keyFn: (data) => data.toString('hex') } // кастомный ключ
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему мемоизацию нельзя применять к нечистым функциям?** — Одинаковые аргументы могут давать разные результаты; кэш вернёт устаревшее значение.
- **Чем `useMemo` в React отличается от классической мемоизации?** — React может сбросить кэш; нет гарантии постоянного хранения.
- **Когда мемоизация вредна?** — Функции с дешёвыми вычислениями, частыми новыми аргументами — overhead кэша превышает выигрыш.

### Красные флаги (чего не говорить)

- «Мемоизация — это просто кэширование» — это специализированный кэш для чистых функций с ключом по аргументам.
- «Мемоизацию можно применять везде» — только к детерминированным, чистым функциям.

### Связанные темы

- `032-chto-takoe-chistaya-funkciya.md`
- `035-chto-takoe-zamykanie-closure.md`
- `029-chto-takoe-funkcii-vysshego-poryadka.md`
