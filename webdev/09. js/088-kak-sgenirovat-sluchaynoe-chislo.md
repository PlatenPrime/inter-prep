# Q088. Как сгенерировать случайное число в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`Math.random()` возвращает псевдослучайное число от `0` (включительно) до `1` (не включительно). Для получения целого числа в диапазоне `[min, max]` используют формулу `Math.floor(Math.random() * (max - min + 1)) + min`. Для криптографически стойкой генерации — `crypto.getRandomValues()`.

---

## Развёрнутый ответ

### Суть

`Math.random()` использует **псевдослучайный генератор (PRNG)** — алгоритм, детерминированный по скрытому seed. Результаты предсказуемы при знании алгоритма и seed. Для большинства задач (игры, UI, тесты) — достаточно. Для криптографии, паролей, токенов — **запрещён**.

### Math.random() — базовое использование

```javascript
// Число от 0 (включительно) до 1 (не включительно)
Math.random(); // 0.6823019285904516

// Число от 0 до N (не включительно)
Math.random() * 10; // [0, 10)

// Целое число от 0 до N-1
Math.floor(Math.random() * 10); // [0, 9]
```

### Утилиты для генерации случайных чисел

```javascript
/**
 * Случайное целое число в диапазоне [min, max] включительно
 */
function randomInt(min, max) {
  if (min > max) throw new RangeError('min must be <= max');
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

randomInt(1, 6);   // Броски кубика: 1-6
randomInt(0, 100); // Процент: 0-100

/**
 * Случайное дробное число в диапазоне [min, max)
 */
function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

randomFloat(1.5, 2.5); // [1.5, 2.5)

/**
 * Случайный элемент массива
 */
function randomItem(array) {
  if (!array.length) return undefined;
  return array[Math.floor(Math.random() * array.length)];
}

randomItem(['rock', 'paper', 'scissors']); // случайный выбор

/**
 * Перемешать массив (Fisher-Yates shuffle)
 */
function shuffle(array) {
  const arr = [...array]; // не мутировать оригинал
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
  }
  return arr;
}

shuffle([1, 2, 3, 4, 5]); // [3, 1, 5, 2, 4]
```

### Криптографически стойкая генерация

```javascript
// Браузер и Node.js (Web Crypto API)
const array = new Uint32Array(1);
crypto.getRandomValues(array);
const secureRandom = array[0]; // 32-битное беззнаковое целое

// Число в диапазоне [0, max) — стойкое
function secureRandomInt(max) {
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return array[0] % max; // внимание: небольшое смещение для не-степеней двойки
}

// Генерация безопасного токена
function generateToken(byteLength = 32) {
  const buffer = new Uint8Array(byteLength);
  crypto.getRandomValues(buffer);
  return Array.from(buffer, b => b.toString(16).padStart(2, '0')).join('');
}

generateToken(); // 'a3f8c2...' (64 hex символа)

// Node.js: crypto module
import { randomBytes, randomInt } from 'crypto';

const token = randomBytes(32).toString('hex');
const secureInt = randomInt(1, 100); // [1, 100)
```

### Генерация UUID v4

```javascript
// Нативно (ES2021+, все современные среды)
crypto.randomUUID(); // 'f47ac10b-58cc-4372-a567-0e02b2c3d479'

// Ручная реализация (для понимания)
function uuidv4() {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}
```

### Воспроизводимая случайность (seeded PRNG)

`Math.random()` нельзя сидировать. Для воспроизводимых результатов (тесты, игры) нужен сторонний PRNG:

```javascript
// Простой алгоритм mulberry32
function mulberry32(seed) {
  return function() {
    seed |= 0;
    seed = seed + 0x6D2B79F5 | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = t + Math.imul(t ^ (t >>> 7), 61 | t) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const random = mulberry32(42); // детерминированный seed
random(); // 0.187... (всегда одно и то же при seed=42)
random(); // 0.749...
```

### Сравнение методов

| Метод | Использование | Криптостойкость | Воспроизводимость |
|-------|---------------|-----------------|-------------------|
| `Math.random()` | Игры, UI, тесты | ❌ | ❌ |
| `crypto.getRandomValues()` | Токены, пароли, UUID | ✅ | ❌ |
| `crypto.randomUUID()` | Уникальные ID | ✅ | ❌ |
| Seeded PRNG (сторонний) | Игры, воспроизводимые тесты | ❌ | ✅ |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `Math.random() * max | 0` не совсем правильно для `max` не равного степени двойки?** — Из-за `|0` (bitwise OR с 0 = `Math.trunc`), но проблема здесь не в этом — нужно использовать `Math.floor`.
- **Как получить случайный элемент с равномерным распределением?** — `array[Math.floor(Math.random() * array.length)]`.
- **Почему нельзя использовать `Math.random()` для паролей?** — PRNG предсказуем при знании алгоритма/seed; нужен `crypto.getRandomValues()`.

### Красные флаги (чего не говорить)

- «`Math.random()` подходит для генерации паролей» — категорически нет.
- Путать `Math.random()` и `crypto.getRandomValues()` — принципиально разные гарантии безопасности.

### Связанные темы

- `013-pochemu-0-1-plus-0-2-ne-ravno-0-3.md` (IEEE 754 и числа)
- `014-tipy-operatorov-v-javascript.md`
