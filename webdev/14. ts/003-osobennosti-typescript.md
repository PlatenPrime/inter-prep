# Q003. Назовите особенности TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

Ключевые особенности TypeScript: **структурная (duck) типизация**, **вывод типов (type inference)**, **union/intersection типы**, **generics**, **декораторы**, и **совместимость с любым JavaScript**. В отличие от языков с номинальной типизацией (Java, C#), в TS два типа совместимы, если у них совпадает структура — не название.

---

## Развёрнутый ответ

### Суть и определение

TypeScript привносит в JavaScript несколько принципиально важных возможностей, которые делают его уникальным среди компилируемых в JS языков.

### Как это работает

#### 1. Структурная типизация (Structural Typing)

TypeScript использует **duck typing**: типы совместимы, если совпадают их структуры (набор полей и методов), а не имена.

```typescript
interface Point { x: number; y: number; }
interface Vector { x: number; y: number; }

const p: Point = { x: 1, y: 2 };
const v: Vector = p; // OK — структуры совпадают
```

#### 2. Вывод типов (Type Inference)

Компилятор автоматически выводит типы из контекста — явные аннотации не всегда нужны.

```typescript
const name = "Alice";        // выведен как string
const nums = [1, 2, 3];      // выведен как number[]
const user = { id: 1 };      // выведен как { id: number }
```

#### 3. Union и Intersection типы

```typescript
type StringOrNumber = string | number; // Union: одно ИЛИ другое
type Admin = User & HasPermissions;    // Intersection: оба сразу
```

#### 4. Generics — параметрический полиморфизм

```typescript
function identity<T>(value: T): T { return value; }
```

#### 5. Утилитарные типы (Utility Types)

Встроенные трансформации: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Pick<T, K>`, `Omit<T, K>`, `Record<K, V>` и другие.

#### 6. Декораторы

Метапрограммирование через синтаксис `@`: `@Component`, `@Injectable`, `@Log`.

#### 7. Совместимость с JavaScript (Gradual Typing)

- Любой `.js` файл валиден в `.ts`
- `allowJs: true` — компиляция JS-файлов без переименования
- `@ts-check` — проверка типов в JS через JSDoc-комментарии
- Declaration files (`.d.ts`) — типы для внешних JS-библиотек

#### 8. Строгие режимы

`strict: true` включает:
- `strictNullChecks` — `null` и `undefined` не являются подтипами всех типов
- `noImplicitAny` — нельзя оставить тип неявным `any`
- `strictFunctionTypes` — контравариантность параметров функций
- `strictPropertyInitialization` — поля класса должны быть инициализированы

#### 9. Conditional и Mapped Types

Мощные инструменты для создания производных типов:

```typescript
type NonNullable<T> = T extends null | undefined ? never : T;
type Readonly<T> = { readonly [K in keyof T]: T[K] };
```

### Практика и применение

- **Структурная типизация** упрощает тестирование: можно передавать моки без явной реализации интерфейса
- **Вывод типов** уменьшает многословность: 80% аннотаций не нужны при правильном коде
- **`strictNullChecks`** устраняет целый класс ошибок `Cannot read property of undefined`
- Декораторы — основа фреймворков: Angular (компоненты), NestJS (контроллеры, сервисы), TypeORM (сущности)

### Важные нюансы и краеугольные камни

- **Типы стираются в рантайме** — нельзя использовать тип как значение
- **Structural typing** может привести к неожиданной совместимости: `{ name: string; age: number }` совместим с `{ name: string }` (лишние поля допустимы при присваивании)
- **Excess property checking** — дополнительная проверка при литеральном присваивании: объектный литерал с лишними полями даст ошибку
- `const enum` — компилируется в инлайн-значения, но несовместим с `isolatedModules`

### Примеры

```typescript
// Structural typing — совместимость по форме
interface Named { name: string; }
class Person { constructor(public name: string) {} }

const n: Named = new Person("Alice"); // OK — структура совпадает

// Inference — автоматический вывод
function createPair<T, U>(a: T, b: U) {
  return { first: a, second: b }; // возвращает { first: T, second: U }
}
const pair = createPair(1, "hello"); // { first: number, second: string }

// Conditional type
type IsString<T> = T extends string ? "yes" : "no";
type R1 = IsString<string>; // "yes"
type R2 = IsString<number>; // "no"
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое structural vs nominal typing?** — в TS совместимость по структуре; в Java/C# — по имени типа; последнее имитируется через branded types
- **Что такое `strictNullChecks`?** — без него `null`/`undefined` присваиваемы любому типу; с ним — отдельные типы
- **Как сделать nominal typing в TS?** — через branded/opaque types: `type UserId = string & { readonly _brand: "UserId" }`
- **Что такое excess property checking?** — TS проверяет лишние поля только в объектных литералах, не в переменных

### Красные флаги (чего не говорить)

- «TypeScript использует номинальную типизацию как Java» — нет, структурную
- «Вывод типов делает аннотации необязательными везде» — для параметров функций публичного API аннотации обязательны для ясности контракта
- «`strict: true` слишком строго, лучше не включать» — это best practice; включать с самого начала

### Связанные темы

- `007-tipy-v-typescript.md`
- `008-raznica-type-i-interface.md`
- `013-genericheskie-tipy-generic.md`
- `014-utilitarnye-tipy-utility-types.md`
