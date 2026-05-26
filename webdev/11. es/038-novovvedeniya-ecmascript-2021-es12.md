# Q038. Какие нововведения были представлены в ECMAScript 2021 (ES12)?

> **Источник:** [11. es.md](../11.%20es.md) · **Тема:** ECMAScript

---

## Короткий ответ

ES2021 (ES12) включает: **логические операторы присваивания** (`&&=`, `||=`, `??=`), **числовые разделители** (`1_000_000`), **`String.prototype.replaceAll()`**, **`Promise.any()`**, **`WeakRef`** и **`FinalizationRegistry`**. Каждое нововведение решает конкретную практическую задачу — от улучшения читаемости до управления памятью.

---

## Развёрнутый ответ

### Суть и определение

Все нововведения прошли TC39 Stage 4 и были включены в финальную спецификацию в июне 2021 года.

---

### 1. Логические операторы присваивания

`&&=`, `||=`, `??=` — присваивают только при выполнении условия:

```javascript
// ||= : присваивает если значение falsy
let a = null;
a ||= 'default'; // a = 'default'

// &&= : присваивает если значение truthy
let b = 'value';
b &&= b.toUpperCase(); // b = 'VALUE'

// ??= : присваивает если значение nullish
let c = 0;
c ??= 42; // c = 0 (0 не nullish)
```

Подробнее: [`018-chto-takoe-operator-logicheskogo-prisvaivaniya.md`](018-chto-takoe-operator-logicheskogo-prisvaivaniya.md)

---

### 2. Числовые разделители (Numeric Separators)

`_` в числовых литералах для читаемости:

```javascript
const million    = 1_000_000;
const hex        = 0xFF_FF_FF;
const binary     = 0b1010_0001;
const bigint     = 9_007_199_254_740_991n;
const floatConst = 3.141_592_653;
```

Подробнее: [`037-kak-uvelichit-chitaemost-bolshih-chisel.md`](037-kak-uvelichit-chitaemost-bolshih-chisel.md)

---

### 3. `String.prototype.replaceAll()`

Замена всех вхождений строки без RegExp `/g`:

```javascript
'aabbcc'.replaceAll('b', 'x'); // 'aaxxcc'
// vs старый способ:
'aabbcc'.replace(/b/g, 'x');   // 'aaxxcc'
```

Подробнее: [`035-dlya-chego-metod-replaceall.md`](035-dlya-chego-metod-replaceall.md)

---

### 4. `Promise.any()`

Принимает итерируемое промисов, возвращает **первый выполненный (fulfilled)**. Игнорирует отклонённые. Если все отклонены — бросает `AggregateError`.

```javascript
const results = await Promise.any([
  fetch('/api/server1/data'),
  fetch('/api/server2/data'),
  fetch('/api/server3/data'),
]);
// Вернёт данные от первого ответившего сервера

// AggregateError если все отклонены
try {
  await Promise.any([
    Promise.reject(new Error('Server 1 down')),
    Promise.reject(new Error('Server 2 down')),
  ]);
} catch (e) {
  e instanceof AggregateError; // true
  e.errors; // [Error: 'Server 1 down', Error: 'Server 2 down']
}
```

**Promise comparison:**

| Метод | Ждёт | Возвращает |
|-------|------|------------|
| `Promise.all` | Все | Все fulfilled, или первый rejected |
| `Promise.allSettled` | Все | Все результаты (fulfilled + rejected) |
| `Promise.race` | Первый | Первый (fulfilled или rejected) |
| `Promise.any` | Первый fulfilled | Первый fulfilled, или `AggregateError` |

---

### 5. `WeakRef`

Слабая ссылка на объект — не препятствует сборке мусора. Значение доступно через `.deref()`:

```javascript
class Cache {
  #store = new Map();

  set(key, value) {
    this.#store.set(key, new WeakRef(value));
  }

  get(key) {
    return this.#store.get(key)?.deref(); // undefined если GC убрал объект
  }
}

const cache = new Cache();
let bigObject = { data: new Array(100000).fill(0) };
cache.set('key', bigObject);

// Если bigObject станет недостижимым — GC может его убрать
// cache.get('key') вернёт undefined
```

**Важно**: GC не детерминирован — нельзя полагаться на конкретный момент очистки.

---

### 6. `FinalizationRegistry`

Позволяет зарегистрировать колбэк, вызываемый после сборки мусора объекта:

```javascript
const registry = new FinalizationRegistry((heldValue) => {
  console.log(`Object with token "${heldValue}" was collected`);
});

let obj = { name: 'Alice' };
registry.register(obj, 'alice-token');

obj = null; // При следующей сборке мусора сработает колбэк
// Консоль: 'Object with token "alice-token" was collected'
```

**Применение**: очистка ресурсов (файловые дескрипторы, нативные ресурсы, кеши). **Не для критичной логики** — время вызова недетерминировано.

---

### Итоговая таблица ES2021

| Нововведение | Краткое описание |
|--------------|-----------------|
| `&&=`, `\|\|=`, `??=` | Логические операторы присваивания |
| `1_000_000` | Числовые разделители |
| `String.replaceAll()` | Замена всех вхождений |
| `Promise.any()` | Первый fulfilled промис |
| `WeakRef` | Слабая ссылка (не удерживает от GC) |
| `FinalizationRegistry` | Колбэк при GC-очистке объекта |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем `Promise.any` отличается от `Promise.race`?** — `race` возвращает первый settled (включая rejected); `any` — только первый fulfilled.
- **Что такое `AggregateError`?** — Новый тип ошибки ES2021, хранящий массив `.errors`; используется `Promise.any` когда все промисы отклонены.
- **Когда использовать `WeakRef`?** — Только для оптимизации кешей где потеря данных допустима; не для бизнес-логики.
- **Детерминирован ли колбэк `FinalizationRegistry`?** — Нет: движок вызовет его «когда-нибудь» после GC, порядок и время не гарантированы.

### Красные флаги (чего не говорить)

- «`Promise.any` — это то же что `Promise.race`» — `race` резолвит на первый settled (включая rejected), `any` — на первый fulfilled.
- «`WeakRef` позволяет отслеживать момент сборки мусора» — нет, `deref()` возвращает объект или `undefined` — нельзя узнать точный момент.
- «ES2021 добавил `async/await`» — нет, `async/await` появился в ES2017.

### Связанные темы

- [`018-chto-takoe-operator-logicheskogo-prisvaivaniya.md`](018-chto-takoe-operator-logicheskogo-prisvaivaniya.md)
- [`035-dlya-chego-metod-replaceall.md`](035-dlya-chego-metod-replaceall.md)
- [`037-kak-uvelichit-chitaemost-bolshih-chisel.md`](037-kak-uvelichit-chitaemost-bolshih-chisel.md)
- [`019-chto-takoe-set-map-weakmap-i-weakset.md`](019-chto-takoe-set-map-weakmap-i-weakset.md)
