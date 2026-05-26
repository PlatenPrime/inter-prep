# Q012. Для чего используется оператор двойного отрицания (`!!`)?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

`!!value` — идиома для явного приведения любого значения к булевому типу. Первое `!` инвертирует и приводит к `boolean`, второе `!` инвертирует обратно. Результат семантически эквивалентен `Boolean(value)`, но короче. Используется для нормализации truthy/falsy значений в явный `true`/`false`.

---

## Развёрнутый ответ

### Суть и определение

Оператор `!` (логическое НЕ) всегда возвращает булевое значение: `!truthy` → `false`, `!falsy` → `true`. Применив его дважды, получаем приведение к булевому без инверсии:

```
!!value
  │
  └─▶ !value → boolean (инвертированный)
                  │
                  └─▶ !(!value) → boolean (оригинальный truthy/falsy)
```

### Как это работает

```javascript
!!1         // true
!!0         // false
!!"hello"   // true
!!""        // false
!!null      // false
!!undefined // false
!!{}        // true
!![]        // true
!!NaN       // false
```

Полностью эквивалентно `Boolean(value)`:
```javascript
!!x === Boolean(x) // всегда true (за исключением edge-кейсов символов и т.д.)
```

### Практика и применение

- **Нормализация флагов:** `const isActive = !!user.activeAt` — гарантирует `true`/`false` вместо `Date | null`.
- **Сохранение в состоянии:** `setState({ isLoggedIn: !!token })` — явный boolean в state.
- **Возврат из функции-предиката:** `return !!someValue` — гарантирует boolean, а не truthy/falsy объект.
- **Старые кодовые базы:** до ES2015 `!!` был распространён вместо `Boolean()`.

```javascript
// Без !! — вернёт объект или null, не boolean
function hasPermission(user) {
  return user.permissions; // может вернуть [] или null
}

// С !! — гарантированный boolean
function hasPermission(user) {
  return !!user.permissions; // true или false
}
```

### Важные нюансы и краеугольные камни

- `!!` и `Boolean()` идентичны по результату, выбор — вопрос стиля. ESLint правило `no-extra-boolean-cast` может предупреждать о лишнем `!!` в уже булевом контексте.
- В TypeScript `!!` полезен для сужения типа: `string | null` → `boolean`.
- `!!` не меняет тип `NaN`: `!!NaN === false`.
- В условии `if (!!value)` двойное отрицание избыточно — `if (value)` даёт тот же эффект; `!!` полезен только когда нужно именно значение `true`/`false`.

### Примеры

```javascript
// Нормализация типа
const token: string | null = getToken();
const isAuthenticated: boolean = !!token;

// Предикат в filter
const users = [null, { name: 'Alice' }, undefined, { name: 'Bob' }];
const validUsers = users.filter(u => !!u);
// [{ name: 'Alice' }, { name: 'Bob' }]
// Эквивалентно: users.filter(Boolean)

// Сравнение !! vs Boolean
console.log(!!0);         // false
console.log(Boolean(0));  // false  — идентично

// Когда !! НЕ нужен
if (!!value) { }  // избыточно
if (value) { }    // достаточно

// Когда !! нужен — присваивание в boolean-переменную
const isLoading: boolean = !!pendingRequest;
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `!!` отличается от `Boolean()`?** — Функционально идентичны; `Boolean()` нагляднее, `!!` короче.
- **Когда `!!` избыточен?** — Внутри `if`, `while`, тернарного оператора — там уже неявная конвертация.
- **Как TypeScript трактует `!!`?** — Сужает тип с `T | null | undefined` до `boolean`.

### Красные флаги (чего не говорить)

- «`!!` — это оператор, как `===`» — нет, это просто два последовательно применённых унарных `!`.
- «`!!` и `!` дают одинаковый результат» — `!` инвертирует, `!!` нормализует к boolean.

### Связанные темы

- `011-kak-prevratit-lyuboi-tip-v-bulevyi-lozhnyye-znacheniya.md`
- `010-raznica-yavnoe-i-neyavnoe-preobrazovanie.md`
- `015-operatory-i-i-ili.md`
