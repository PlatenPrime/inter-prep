# Q016. В чём отличие оператора нулевого слияния (`??`) и оператора "ИЛИ" (`||`)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Оба оператора возвращают левый операнд если он «достаточно истинный», иначе — правый. Разница в критерии: `||` активирует правый операнд при любом **falsy** значении (`0`, `''`, `false`, `NaN`, `null`, `undefined`). `??` — только при **nullish** (`null` или `undefined`). Это делает `??` правильным выбором для дефолтных значений, где `0`, `false`, `''` являются валидными данными.

---

## Развёрнутый ответ

### Суть и определение

| Оператор | Возвращает правый операнд если левый... | Короткое замыкание |
|----------|----------------------------------------|--------------------|
| `\|\|` | falsy (`false`, `0`, `''`, `NaN`, `null`, `undefined`) | При truthy левом |
| `??` | nullish (`null`, `undefined`) | При non-nullish левом |

### Как это работает

```javascript
// || — логическое ИЛИ
'' || 'default'    // 'default' — '' falsy
0  || 42           // 42 — 0 falsy
false || true      // true — false falsy
null || 'fallback' // 'fallback'

// ?? — нулевое слияние
'' ?? 'default'    // '' — пустая строка не nullish!
0  ?? 42           // 0 — ноль не nullish!
false ?? true      // false — false не nullish!
null ?? 'fallback' // 'fallback' — null nullish
```

### Практика и применение

**Сценарии где `||` ломает логику:**

```javascript
// Конфигурация сервера
function createServer({ port = 0, debug = false, title = '' } = {}) {}
// или принимаем извне:
const options = { port: 0, debug: false, title: '' };

const port  = options.port  || 3000;  // 3000 — ОШИБКА: port=0 валиден
const debug = options.debug || true;  // true  — ОШИБКА: debug=false валиден
const title = options.title || 'App'; // 'App' — ОШИБКА: пустой заголовок валиден

// Правильно:
const port2  = options.port  ?? 3000;  // 0
const debug2 = options.debug ?? true;  // false
const title2 = options.title ?? 'App'; // ''
```

**Когда `||` уместен:**

```javascript
// Если 0, '', false — действительно недопустимы
const name = inputName || 'Anonymous'; // '' → 'Anonymous' — намеренное поведение
const count = items?.length || 'no items'; // 0 → 'no items' — тоже намеренное
```

### Важные нюансы и краеугольные камни

- **Оба оператора используют короткое замыкание**: если левый операнд определяет результат, правый не вычисляется.
- **`||=` и `??=`** (ES2021) — аналогичные операторы присваивания:
  ```javascript
  let a = 0;
  a ||= 5;   // a = 5 (0 falsy)
  a ??= 5;   // a = 0 (0 не nullish, не перезаписывается)
  ```
- **Комбинирование без скобок** — SyntaxError для `||` и `??` одновременно.
- **Производительность**: идентична — оба используют одинаковый механизм короткого замыкания.

### Примеры

```javascript
const values = {
  zero: 0,
  empty: '',
  falseVal: false,
  nanVal: NaN,
  nullVal: null,
  undefinedVal: undefined,
  truthy: 'hello',
};

// || — все falsy заменяются
Object.entries(values).forEach(([key, val]) => {
  console.log(`${key}: ${val} || 'D' =`, val || 'D');
});
// zero: 0 || 'D' = D        ← заменено
// empty: '' || 'D' = D      ← заменено
// falseVal: false || 'D' = D ← заменено
// nanVal: NaN || 'D' = D    ← заменено
// nullVal: null || 'D' = D  ← заменено
// undefinedVal: undefined || 'D' = D ← заменено
// truthy: hello || 'D' = hello

// ?? — только null/undefined заменяются
Object.entries(values).forEach(([key, val]) => {
  console.log(`${key}: ${val} ?? 'D' =`, val ?? 'D');
});
// zero: 0 ?? 'D' = 0        ← сохранено
// empty: '' ?? 'D' = ''     ← сохранено
// falseVal: false ?? 'D' = false ← сохранено
// nanVal: NaN ?? 'D' = NaN  ← сохранено
// nullVal: null ?? 'D' = D  ← заменено
// undefinedVal: undefined ?? 'D' = D ← заменено
// truthy: hello ?? 'D' = hello

// Практический выбор
function initScore(score) {
  const displayScore = score ?? 0;  // null/undefined → 0, иначе как есть
  const label = score || 'N/A';    // 0 → 'N/A' (здесь 0 = нет результата)
  return { displayScore, label };
}
initScore(null);  // { displayScore: 0, label: 'N/A' }
initScore(0);     // { displayScore: 0, label: 'N/A' }  — здесь ?? и || ведут себя по-разному!
initScore(10);    // { displayScore: 10, label: 10 }
```

---

## Сравнение

| Критерий | `\|\|` | `??` |
|----------|--------|------|
| Триггер для правого | Любой falsy | Только `null`/`undefined` |
| Реагирует на `0` | Да | Нет |
| Реагирует на `''` | Да | Нет |
| Реагирует на `false` | Да | Нет |
| Реагирует на `NaN` | Да | Нет |
| Введён в | ES1 | ES2020 |
| Оператор присваивания | `\|\|=` (ES2021) | `??=` (ES2021) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое falsy-значения в JavaScript?** — `false`, `0`, `-0`, `0n`, `''`, `null`, `undefined`, `NaN`.
- **Когда всё же использовать `||` для дефолтов?** — Когда `0`, `''`, `false` — недопустимые значения и должны заменяться дефолтом.
- **Что такое `??=`?** — Присваивает только если текущее значение `null` или `undefined`.
- **Можно ли цепочить `??`?** — Да: `a ?? b ?? c ?? 'default'`.

### Красные флаги (чего не говорить)

- «`??` — это просто новый `||`» — принципиальная разница в обработке `0`, `false`, `''`.
- «`||` лучше подходит для всех дефолтных значений» — нет, при числовых и булевых параметрах `||` часто даёт баги.
- «`??` появился в ES6» — нет, в ES2020.

### Связанные темы

- [`015-chto-takoe-operator-nulevogo-sliyaniya.md`](015-chto-takoe-operator-nulevogo-sliyaniya.md)
- [`017-operator-optional-chaining.md`](017-operator-optional-chaining.md)
- [`018-chto-takoe-operator-logicheskogo-prisvaivaniya.md`](018-chto-takoe-operator-logicheskogo-prisvaivaniya.md)
