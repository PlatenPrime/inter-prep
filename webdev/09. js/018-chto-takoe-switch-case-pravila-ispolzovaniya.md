# Q018. Что такое `switch/case`? Правила использования `switch/case`?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`switch` — инструкция выбора, сравнивающая выражение с несколькими вариантами (`case`) через **строгое равенство** (`===`). При совпадении выполняется блок кода вплоть до `break` или `return`. Без `break` происходит **fall-through** — выполнение продолжается в следующем `case`. Рекомендуется всегда ставить `break`, а в `default` — обработчик непредвиденных значений.

---

## Развёрнутый ответ

### Суть и определение

```javascript
switch (expression) {
  case value1:
    // код
    break;
  case value2:
    // код
    break;
  default:
    // код при отсутствии совпадений
}
```

- `expression` вычисляется один раз.
- Каждый `case` сравнивается с результатом через `===`.
- `default` — необязательный, выполняется если ни один `case` не совпал. Может быть в любом месте.
- `break` завершает `switch`. Без него — **fall-through**.

### Как это работает

```javascript
const day = 'Mon';

switch (day) {
  case 'Sat':
  case 'Sun':          // fall-through намеренный: оба случая → одна ветка
    console.log('Выходной');
    break;
  case 'Mon':
    console.log('Понедельник');
    break;
  default:
    console.log('Рабочий день');
}
```

**Fall-through (непреднамеренный) — ловушка:**
```javascript
switch (status) {
  case 'active':
    console.log('active'); // нет break!
  case 'pending':          // ВЫПОЛНИТСЯ ТОЖЕ
    console.log('pending');
    break;
}
```

### Практика и применение

`switch` читаемее цепочки `else if`, когда сравниваем одну переменную с константными значениями. Хорош для:
- Обработки action type в reducer (Redux-style).
- Разбора команд/статусов.
- Конечных автоматов.

Для сложной логики с диапазонами — `if/else` нагляднее.

```javascript
// Redux reducer — классическое применение
function reducer(state = initialState, action) {
  switch (action.type) {
    case 'INCREMENT':
      return { ...state, count: state.count + 1 };
    case 'DECREMENT':
      return { ...state, count: state.count - 1 };
    case 'RESET':
      return initialState;
    default:
      return state;
  }
}
```

### Важные нюансы и краеугольные камни

- Сравнение строго (`===`): `switch ("1")` не совпадёт с `case 1:`.
- `default` может стоять в середине, но по конвенции — в конце.
- `break` внутри цикла с `switch` прерывает `switch`, не цикл — для прерывания цикла нужны `label` или вынесение в функцию с `return`.
- **Scope:** все `case` находятся в одном блоке видимости; объявление `let` в одном `case` без `{}` может конфликтовать с другим. Решение — обёртывать каждый `case` в `{}`.

### Примеры

```javascript
// Правильно: break в каждом case, {} для let/const
switch (action) {
  case 'save': {
    const result = save(data); // нет конфликта с другими case
    console.log(result);
    break;
  }
  case 'delete': {
    const result = remove(id);
    console.log(result);
    break;
  }
  default:
    console.warn('Unknown action:', action);
}

// Object lookup — альтернатива switch для простых маппингов
const handlers = {
  save: () => save(data),
  delete: () => remove(id),
};
(handlers[action] ?? (() => console.warn('Unknown')))();
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое fall-through и когда он полезен?** — Намеренное объединение нескольких `case` в одну ветку (группировка).
- **Как объявить переменную в `case` без конфликта?** — Обернуть `case` в `{}`.
- **Когда `switch` хуже `if/else`?** — При сложных условиях, диапазонах, условиях с несколькими переменными.
- **Альтернатива `switch`?** — Object/Map lookup: `{ [key]: handler }[key]?.()`.

### Красные флаги (чего не говорить)

- «`switch` использует нестрогое равенство» — нет, `===`.
- «`default` всегда должен быть последним» — по конвенции да, но технически может быть в любом месте.
- «Fall-through — всегда баг» — иногда используется намеренно.

### Связанные темы

- `017-chto-takoe-vyrazheniya-i-instrukcii.md`
- `019-chto-takoe-strict-mode.md`
