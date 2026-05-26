# Q009. Разница между Rest и Spread операторами?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Оба оператора используют синтаксис `...`, но делают противоположное. **Spread** «разворачивает» итерируемое в отдельные элементы (аргументы, элементы массива, свойства объекта). **Rest** «собирает» оставшиеся элементы в массив или объект. Spread — в вызовах и литералах, Rest — в параметрах функций и шаблонах деструктуризации.

---

## Развёрнутый ответ

### Суть и определение

**Spread operator** (`...iterable`) — применяется в выражениях:
- вызовах функций: `fn(...args)`
- литералах массивов: `[...a, ...b]`
- литералах объектов: `{ ...obj1, ...obj2 }` (ES2018)

**Rest parameters** (`...rest`) — применяется в местах, где принимаются значения:
- параметрах функции: `function f(a, b, ...rest)`
- деструктуризации: `const [first, ...others] = array`

### Как это работает

**Spread** итерирует значение (вызывает `Symbol.iterator`) и передаёт каждый элемент по отдельности. Для объектов — копирует собственные перечисляемые свойства.

**Rest** — синтаксическая конструкция: движок собирает «оставшиеся» аргументы или элементы в новый `Array`.

### Практика и применение

**Spread в массивах — копирование и конкатенация:**
```javascript
const a = [1, 2, 3];
const b = [4, 5, 6];
const merged = [...a, ...b];     // [1, 2, 3, 4, 5, 6]
const copy = [...a];              // поверхностная копия
const withExtra = [0, ...a, 99]; // [0, 1, 2, 3, 99]
```

**Spread в объектах — merge и override:**
```javascript
const defaults = { theme: 'light', lang: 'ru' };
const userPrefs = { lang: 'en', fontSize: 14 };
const config = { ...defaults, ...userPrefs }; // { theme: 'light', lang: 'en', fontSize: 14 }
```

**Spread в вызовах функций:**
```javascript
const nums = [3, 1, 4, 1, 5, 9];
Math.max(...nums); // 9 — вместо Math.max.apply(null, nums)
```

**Rest в функциях — вариативные аргументы:**
```javascript
function sum(...nums) {
  return nums.reduce((acc, n) => acc + n, 0);
}
sum(1, 2, 3, 4); // 10
```

**Rest в деструктуризации:**
```javascript
const [head, ...tail] = [1, 2, 3, 4];
// head = 1, tail = [2, 3, 4]

const { name, ...rest } = { name: 'Alice', age: 30, city: 'NY' };
// name = 'Alice', rest = { age: 30, city: 'NY' }
```

### Важные нюансы и краеугольные камни

- **Rest только последним параметром**: `function f(a, ...rest, b)` — SyntaxError.
- **Spread создаёт поверхностную копию**: вложенные объекты не клонируются.
- **Spread объектов не итерирует** — не вызывает `Symbol.iterator`, копирует собственные перечисляемые свойства.
- **Spread строки** даёт массив символов: `[...'hello']` → `['h','e','l','l','o']`.
- **Spread не работает с `null`/`undefined`**: `[...null]` → TypeError.
- **Rest vs `arguments`**: `arguments` — псевдомассив, не работает со стрелочными функциями; `...rest` — настоящий Array со всеми методами.

### Примеры

```javascript
// Rest: собирает оставшееся
function logFirst(first, second, ...remaining) {
  console.log(first);     // 1
  console.log(second);    // 2
  console.log(remaining); // [3, 4, 5]
}
logFirst(1, 2, 3, 4, 5);

// Spread: разворачивает
const parts = [2, 3, 4];
logFirst(1, ...parts, 5); // first=1, second=2, remaining=[3, 4, 5]

// Иммутабельное обновление Redux-стиля
const state = { count: 0, user: { name: 'Alice' } };
const newState = { ...state, count: state.count + 1 };
// state не мутирован, user — та же ссылка (поверхностная копия!)

// Клонирование Set через spread
const original = new Set([1, 2, 3]);
const copy = new Set([...original]);

// Деструктуризация + rest для omit
function omit(obj, ...keys) {
  return Object.fromEntries(
    Object.entries(obj).filter(([k]) => !keys.includes(k))
  );
}
omit({ a: 1, b: 2, c: 3 }, 'b'); // { a: 1, c: 3 }
```

---

## Сравнение

| Критерий | Spread (`...`) | Rest (`...`) |
|----------|----------------|--------------|
| Где применяется | Выражения: вызовы, литералы | Паттерны: параметры, деструктуризация |
| Что делает | Разворачивает итерируемое | Собирает оставшееся в массив |
| Результат | Отдельные значения | Новый `Array` |
| Работает с объектами | Да (`{ ...obj }`) | Да (`{ ...rest }` в деструктуризации) |
| Позиция | Любая | Только последней |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как сделать глубокую копию объекта?** — `structuredClone(obj)` (ES2022) или `JSON.parse(JSON.stringify(obj))` (с ограничениями). Spread — только поверхностная копия.
- **Чем `...rest` лучше `arguments`?** — `rest` — настоящий `Array`, работает в стрелочных функциях, позволяет именовать только нужные параметры.
- **Что происходит при `{ ...null }`?** — Возвращает `{}` (без ошибки), в отличие от `[...null]` (TypeError).
- **Сохраняется ли порядок при `{ ...obj1, ...obj2 }`?** — Да: свойства obj1, затем obj2; дубли из obj2 перезапишут obj1.

### Красные флаги (чего не говорить)

- «Spread создаёт глубокую копию» — нет, только поверхностную.
- «Rest и Spread — это один и тот же оператор» — синтаксис один, но семантика и контекст применения разные.
- «`arguments` и rest — одно и то же» — `arguments` — псевдомассив, не работает в стрелочных функциях.

### Связанные темы

- [`010-chto-takoe-destrukturizaciya.md`](010-chto-takoe-destrukturizaciya.md)
- [`005-raznica-obychnye-funkcii-i-strelochnye.md`](005-raznica-obychnye-funkcii-i-strelochnye.md)
