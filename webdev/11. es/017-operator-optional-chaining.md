# Q017. Расскажите об операторе Optional Chaining (`?.`)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

Optional chaining `?.` (ES2020) позволяет безопасно обращаться к вложенным свойствам объекта без явной проверки каждого уровня на `null`/`undefined`. Если значение слева от `?.` равно `null` или `undefined`, выражение сразу возвращает `undefined` (без ошибки). Работает для свойств (`?.`), вызовов методов (`?.()`), индексации массивов (`?.[index]`).

---

## Развёрнутый ответ

### Суть и определение

До ES2020 для безопасного доступа к глубоко вложенным свойствам требовались явные проверки:

```javascript
const city = user && user.address && user.address.city;
// или
const city = user?.address?.city; // ES2020
```

Optional chaining реализует так называемый «безопасный доступ» — если цепочка обрывается (null/undefined), всё выражение возвращает `undefined`.

### Как это работает

`?.` проверяет левый операнд на `null`/`undefined`:
- Если `null`/`undefined` → возвращает `undefined`, прерывает цепочку
- Иначе → продолжает доступ к свойству/методу/индексу

```
obj?.prop         ← доступ к свойству
obj?.[expr]       ← доступ через выражение (динамический ключ)
func?.()          ← вызов функции если она не null/undefined
obj?.method?.()   ← безопасный вызов метода
```

### Практика и применение

```javascript
const user = {
  name: 'Alice',
  address: null,
  getAge: () => 30,
};

// Цепочка свойств
user?.address?.city;         // undefined — без ошибки
user?.address?.city?.length; // undefined

// Динамический ключ
const key = 'name';
user?.[key];                 // 'Alice'

// Опциональный вызов метода
user?.getAge?.();            // 30
user?.getPhone?.();          // undefined — метода нет

// С массивами
const users = null;
users?.[0]?.name;            // undefined — безопасно

// Комбинация с ??
const city = user?.address?.city ?? 'Unknown'; // 'Unknown'
```

**Реальный use case — работа с данными из API:**
```javascript
function formatUser(user) {
  return {
    name: user?.profile?.displayName ?? user?.name ?? 'Anonymous',
    avatar: user?.settings?.avatar?.url ?? '/default-avatar.png',
    role: user?.permissions?.[0]?.role ?? 'guest',
  };
}
```

**Опциональный вызов колбэка:**
```javascript
function Button({ onClick, label }) {
  return <button onPress={() => onClick?.()}>{ label }</button>;
}
// onClick?.() — вызов только если передан
```

### Важные нюансы и краеугольные камни

- **Реагирует только на `null`/`undefined`**, не на другие falsy:
  ```javascript
  const obj = { value: 0 };
  obj?.value; // 0 — не undefined, цепочка продолжается
  ```
- **Short-circuit — прерывает всю цепочку**:
  ```javascript
  let count = 0;
  const obj = null;
  obj?.items[count++]; // count не инкрементируется — вычисление остановлено
  console.log(count); // 0
  ```
- **Нельзя использовать в левой части присваивания**:
  ```javascript
  user?.name = 'Bob'; // SyntaxError
  ```
- **`?.()` — вызов, если значение callable**, а не если свойство существует:
  ```javascript
  const obj = { fn: null };
  obj?.fn?.(); // undefined — безопасно (fn null, не вызываем)
  obj?.fn();   // TypeError — fn существует (null), но не функция
  ```
- **TypeScript**: `?.` сужает тип, возвращаемый тип — `T | undefined`.

### Примеры

```javascript
// Глубокая вложенность из API
const response = {
  data: {
    user: null,
  },
};
const avatar = response?.data?.user?.profile?.avatarUrl ?? '/default.png';
// '/default.png'

// Опциональный вызов с аргументами
const handlers = { onClick: null };
handlers?.onClick?.('event'); // undefined — безопасно

// Динамический ключ на объекте
const config = { db: { host: 'localhost' } };
const keys = ['db', 'host'];
const value = keys.reduce((obj, key) => obj?.[key], config);
// 'localhost'

// Сложная цепочка
const getDisplayName = (user) =>
  user?.profile?.nickname ??
  user?.profile?.fullName ??
  user?.email?.split('@')?.[0] ??
  'Anonymous';
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Прерывает ли `?.` вычисление остатка цепочки?** — Да, short-circuit: `obj?.a.b.c` — если `obj` null, то `a.b.c` не вычисляется.
- **Чем `?.()` отличается от `?.()`?** — `fn?.()` безопасен если `fn` — `null`/`undefined`; если `fn` не вызываемый объект (`{}`), это всё равно `TypeError`.
- **Можно ли использовать `?.` в левой части?** — Нет, SyntaxError.
- **Как `?.` влияет на TypeScript-типы?** — Возвращаемый тип становится `T | undefined`.

### Красные флаги (чего не говорить)

- «`?.` работает как `&&` в цепочке» — почти, но `&&` возвращает первое falsy, `?.` только проверяет на nullish.
- «`?.()` безопасно вызовет любое значение» — нет, если значение не `null`/`undefined`, но и не функция — TypeError.
- «`?.` появился в ES6» — нет, в ES2020.

### Связанные темы

- [`015-chto-takoe-operator-nulevogo-sliyaniya.md`](015-chto-takoe-operator-nulevogo-sliyaniya.md)
- [`016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md`](016-otlichie-operatora-nulevogo-sliyaniya-i-operatora-ili.md)
