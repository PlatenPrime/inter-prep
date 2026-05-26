# Q010. Типы полиморфизма?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Полиморфизм — способность кода работать с объектами разных типов через единый интерфейс. Основные типы: **полиморфизм подтипов** (overriding методов в иерархии), **параметрический полиморфизм** (generics), **специальный полиморфизм** (overloading) и **утиная типизация** (duck typing) — характерная для JavaScript. В рантайме JS использует прототипную диспетчеризацию.

---

## Развёрнутый ответ

### 1. Полиморфизм подтипов (Subtype / Inclusion Polymorphism)

Классический ООП-полиморфизм: объект подкласса может быть использован вместо объекта базового класса.

```typescript
abstract class Notification {
  abstract send(message: string): Promise<void>;
}

class EmailNotification extends Notification {
  async send(message: string) {
    console.log(`Email: ${message}`);
  }
}

class PushNotification extends Notification {
  async send(message: string) {
    console.log(`Push: ${message}`);
  }
}

class SmsNotification extends Notification {
  async send(message: string) {
    console.log(`SMS: ${message}`);
  }
}

// Код не знает, какой конкретно тип — работает с базовым
async function notifyAll(channels: Notification[], msg: string) {
  await Promise.all(channels.map(c => c.send(msg)));
}

notifyAll([new EmailNotification(), new PushNotification()], 'Hello');
```

Диспетчеризация происходит в **рантайме** через прототипную цепочку.

---

### 2. Параметрический полиморфизм (Parametric / Generics)

Код работает с любым типом, переданным как параметр. В TypeScript — generics.

```typescript
// Функция работает с любым типом T, не зная о нём ничего
function identity<T>(value: T): T {
  return value;
}

// Обобщённая структура данных
class Stack<T> {
  private items: T[] = [];
  push(item: T): void { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}

const numberStack = new Stack<number>();
const stringStack = new Stack<string>();

// Ограниченный параметрический полиморфизм (Bounded Polymorphism)
function getLength<T extends { length: number }>(item: T): number {
  return item.length;
}

getLength('hello');    // 5
getLength([1, 2, 3]);  // 3
```

---

### 3. Специальный полиморфизм (Ad-hoc / Overloading)

Функция ведёт себя по-разному в зависимости от типов аргументов. В TypeScript реализуется через function overloads.

```typescript
// Перегрузки — объявляем сигнатуры
function format(value: string): string;
function format(value: number): string;
function format(value: Date): string;

// Единственная реализация
function format(value: string | number | Date): string {
  if (typeof value === 'string') return value.toUpperCase();
  if (typeof value === 'number') return value.toFixed(2);
  return value.toISOString().split('T')[0];
}

format('hello');       // 'HELLO'
format(3.14159);       // '3.14'
format(new Date());    // '2026-05-26'
```

В JS до TypeScript — ручная проверка типов через `typeof`/`instanceof`.

---

### 4. Утиная типизация (Duck Typing)

«Если это ходит как утка и крякает как утка — это утка». Объект совместим с интерфейсом, если имеет нужные методы/свойства — независимо от типа.

```typescript
interface Printable {
  print(): void;
}

class Document {
  print() { console.log('Printing document...'); }
}

class Photo {
  print() { console.log('Printing photo...'); }
}

class NumberValue {
  // нет метода print — не Printable
  valueOf() { return 42; }
}

function printItem(item: Printable): void {
  item.print();
}

// TypeScript структурно типизирован — проверяет форму, не имя класса
printItem(new Document()); // работает
printItem(new Photo());    // работает
// printItem(new NumberValue()); // ошибка: нет метода print
```

---

### 5. Полиморфизм через интерфейсы (Interface Polymorphism)

В TypeScript — предпочтительная форма: зависимость от контракта, не иерархии.

```typescript
interface Serializer {
  serialize(data: unknown): string;
  deserialize(raw: string): unknown;
}

class JsonSerializer implements Serializer {
  serialize(data: unknown) { return JSON.stringify(data); }
  deserialize(raw: string) { return JSON.parse(raw); }
}

class CsvSerializer implements Serializer {
  serialize(data: unknown) { /* CSV */ return ''; }
  deserialize(raw: string) { /* CSV */ return {}; }
}

class DataExporter {
  constructor(private serializer: Serializer) {}
  export(data: unknown): string { return this.serializer.serialize(data); }
}
```

---

### Сравнение типов полиморфизма

| Тип | Когда определяется | Механизм в JS |
|-----|--------------------|---------------|
| Подтипов | Runtime | Прототипная цепочка |
| Параметрический | Compile-time | TypeScript generics (erasure) |
| Специальный (overloading) | Compile-time | Ручная проверка типов в JS |
| Утиная типизация | Compile-time (TS) / runtime (JS) | Структурная совместимость |

### Важные нюансы и краеугольные камни

- В JavaScript нет compile-time перегрузки — только runtime проверки типов
- TypeScript использует **структурную типизацию**, а не номинальную: два класса с одинаковыми методами взаимозаменяемы без явного `implements`
- **Полиморфизм через union types** в TypeScript: `type Shape = Circle | Rectangle` + discriminated union — современный идиоматический подход

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем структурная типизация TypeScript отличается от номинальной?** — В структурной совместимость определяется формой (набором методов/полей); в номинальной — именем типа. TS структурная, Java — номинальная.
- **Что такое discriminated union и как это форма полиморфизма?** — `type Result = { ok: true; value: T } | { ok: false; error: string }` — switch по `ok` обеспечивает полиморфное поведение без классов.
- **Как полиморфизм реализуется в функциональном стиле?** — Через функции высшего порядка, discriminated unions и pattern matching.

### Красные флаги (чего не говорить)

- «Полиморфизм — это только override методов» — это лишь один вид (подтипов).
- «Перегрузка методов есть в JavaScript» — нет, только в TypeScript на уровне типов; в рантайме одна функция.

### Связанные темы

- `001-osnovnye-printsipy-oop.md`
- `005-klassovoe-vs-prototipnoe-nasledovanie.md`
- `011-abstraktnyy-klass-v-js.md`
- `015-mekhanizm-prototipov-v-js.md`
