# Q023. Какие области видимости доступны в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

TypeScript наследует все области видимости JavaScript: **глобальная**, **модульная** (файл с `import`/`export`), **функциональная** (`var`, функции), **блочная** (`let`, `const`, блок `{}`). Дополнительно TypeScript вводит **область видимости класса** (поля с модификаторами `public`/`private`/`protected`) и **пространства имён** (`namespace`).

---

## Развёрнутый ответ

### Суть и определение

Область видимости (scope) определяет, где в коде доступна переменная или тип. TypeScript полностью следует правилам JS для значений и добавляет собственные правила для **типов**.

### Как это работает

#### 1. Глобальная область (Global Scope)

```typescript
// Без import/export — файл добавляет переменные в глобальный скоп
var globalVar = "I'm global";         // window.globalVar в браузере
let blockVar = "I'm module-ish";      // не на window, но видна в файле

// В TypeScript: declare добавляет тип в глобальный скоп
declare global {
  interface Window {
    myPlugin: Plugin;
  }
  var __APP_VERSION__: string;
}
```

#### 2. Модульная область (Module Scope)

```typescript
// Любой файл с import/export — это модуль
// Всё объявленное — приватно для файла, если не экспортировано
export const API_URL = "https://api.example.com";

const internalHelper = () => "not exported"; // видна только в этом файле

export function fetchUser(id: string) {
  return fetch(`${API_URL}/users/${id}`); // API_URL доступна
}
```

#### 3. Функциональная область (Function Scope)

```typescript
function outer() {
  var x = 10; // x: доступна во всей функции (var hoisting)
  let y = 20; // y: доступна в блоке объявления (до конца функции)

  function inner() {
    console.log(x); // OK — замыкание
    console.log(y); // OK — замыкание
    var z = 30;     // z: видна только в inner
  }

  // console.log(z); // Error: z is not defined
}
```

#### 4. Блочная область (Block Scope)

```typescript
function example() {
  if (true) {
    let blockLet = "block";     // только внутри if
    const blockConst = "const"; // только внутри if
    var funcVar = "func";       // поднимается до функции!
  }

  // console.log(blockLet);   // Error: blockLet is not defined
  // console.log(blockConst); // Error
  console.log(funcVar);       // OK: "func" — var игнорирует блоки

  for (let i = 0; i < 3; i++) {
    // i: только в теле цикла
  }
  // console.log(i); // Error: i is not defined
}
```

#### 5. Область видимости класса (Class Scope)

```typescript
class Counter {
  private count: number = 0; // поле класса
  static instances: number = 0; // статическое поле

  increment(): void {
    this.count++; // доступ через this
  }

  // Метод "видит" все поля класса через this
  reset(): void {
    this.count = 0;
    Counter.instances; // статические поля — через имя класса
  }
}
```

#### 6. Область видимости типов

Типы имеют собственную систему видимости, независимую от значений:

```typescript
// Тип можно экспортировать отдельно
type UserId = string;
export type { UserId }; // только тип, не значение

// Тип виден только в файле где объявлен (без export)
type InternalState = { loading: boolean; data: unknown };

// declare module — расширение типов в другом файле
declare module "./user" {
  interface User {
    permissions: string[];
  }
}
```

#### 7. Namespace (пространство имён)

```typescript
namespace Validation {
  export interface StringValidator {
    isAcceptable(s: string): boolean;
  }

  const lettersRegexp = /^[A-Za-z]+$/; // приватно для namespace

  export class LettersOnlyValidator implements StringValidator {
    isAcceptable(s: string) {
      return lettersRegexp.test(s);
    }
  }
}

const validator = new Validation.LettersOnlyValidator();
```

> `namespace` — legacy-механизм из дотомодульной эпохи TypeScript. В современном коде используй ES modules (`import`/`export`).

### Практика и применение

- **Модульный скоп** — стандарт для всего нового кода: каждый файл — модуль
- **Блочный скоп** — `let`/`const` вместо `var` везде: предсказуемое поведение
- **Замыкания** — для инкапсуляции приватного состояния без классов
- **`declare global`** — для расширения глобальных типов (полифиллы, плагины браузера)

### Важные нюансы и краеугольные камни

- **`var` hoisting**: `var` поднимается до начала функции (не блока) и инициализируется `undefined` — источник багов; использовать `let`/`const`
- **Temporal Dead Zone (TDZ)**: `let`/`const` hoisting есть, но обращение до объявления — `ReferenceError`
- **TypeScript добавляет отдельный скоп для типов**: тип и значение с одним именем существуют независимо (`class` и `interface` — одновременно тип и значение или только тип)
- **Файл без `import`/`export`** — это скрипт, не модуль; все объявления попадают в глобальный скоп
- **`namespace` устарел** для организации кода: используй ES modules; `namespace` допустим только для ambient declarations в `.d.ts`

### Примеры

```typescript
// Демонстрация всех скоупов в одном месте
const MODULE_CONSTANT = "module-level"; // модульный скоп

function demonstrateScopes() {
  const functionConst = "function-level"; // функциональный скоп

  {
    const blockConst = "block-level"; // блочный скоп
    console.log(MODULE_CONSTANT);     // OK: модульный доступен везде ниже
    console.log(functionConst);       // OK: функциональный доступен
    console.log(blockConst);          // OK: в своём блоке
  }

  // console.log(blockConst); // Error: вне блока

  class LocalClass {
    private field = "class-level"; // скоп класса
    method() {
      console.log(this.field);      // OK
      console.log(functionConst);   // OK: замыкание
    }
  }
}

// Замыкание как инкапсуляция
function createCounter(initial: number = 0) {
  let count = initial; // private state через closure

  return {
    increment: () => ++count,
    decrement: () => --count,
    value: () => count,
  };
}

const counter = createCounter(10);
counter.increment(); // 11
// count недоступен снаружи — инкапсуляция через скоп
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое hoisting для `var`, `let`, `const`?** — все три поднимаются; `var` инициализируется `undefined`; `let`/`const` — в TDZ до объявления
- **Что такое Temporal Dead Zone?** — зона от начала блока до объявления `let`/`const`; обращение — ReferenceError
- **Чем модульный скоп отличается от глобального?** — в модуле нужен явный `export` чтобы что-то стало видно снаружи; без `export` — только в файле
- **Зачем `declare global` в TypeScript?** — для добавления типов в глобальный скоп из модуля; используется для расширения `Window`, `NodeJS.Process` и т.д.

### Красные флаги (чего не говорить)

- «`let` и `const` имеют функциональный скоп как `var`» — нет, блочный скоп
- «TypeScript вводит новые области видимости для значений» — нет; скоп значений тот же что в JS; TS добавляет скоп для типов
- «Используем `namespace` для организации кода» — устарело; используй ES modules

### Связанные темы

- `024-raznica-internal-i-external-module.md`
- `025-klyuchevoe-slovo-declare.md`
- `018-elementy-oop-v-typescript.md`
