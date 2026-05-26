# Q008. Разница между агрегацией и композицией?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

И агрегация, и композиция — формы отношения «содержит» (has-a). Различие — в **жизненном цикле**: при **композиции** (сильная агрегация) дочерний объект не существует без родителя и уничтожается вместе с ним; при **агрегации** (слабая агрегация) дочерний объект существует независимо и может принадлежать нескольким родителям.

---

## Развёрнутый ответ

### Суть и определение

Оба термина описывают, как объекты связываются друг с другом. Разница — в **владении** и **зависимости жизненного цикла**.

| Аспект | Агрегация | Композиция |
|--------|-----------|------------|
| Тип связи | Слабая («использует») | Сильная («владеет») |
| Жизненный цикл | Независимый | Зависимый от родителя |
| Владение | Не эксклюзивное | Эксклюзивное |
| При удалении родителя | Дочерний объект сохраняется | Дочерний объект уничтожается |
| Диаграмма UML | Пустой ромб ◇ | Закрашенный ромб ◆ |

---

### Агрегация

```typescript
class Department {
  name: string;

  constructor(name: string) {
    this.name = name;
  }
}

class Employee {
  constructor(
    public name: string,
    public department: Department // агрегация: Department существует независимо
  ) {}
}

// Department создаётся отдельно и может принадлежать нескольким объектам
const engineering = new Department('Engineering');

const alice = new Employee('Alice', engineering);
const bob = new Employee('Bob', engineering); // тот же объект Department

// Если Alice уволена — Department продолжает существовать
// Если Department переименован — изменение видно через всех Employee
```

---

### Композиция

```typescript
class Address {
  constructor(
    public street: string,
    public city: string
  ) {}
}

class Person {
  private address: Address; // композиция: Address создаётся внутри Person

  constructor(street: string, city: string, public name: string) {
    this.address = new Address(street, city); // Person владеет Address
  }

  getCity(): string {
    return this.address.city;
  }
}

// Address создаётся и уничтожается вместе с Person
// Address не существует без Person (в данной модели)
const person = new Person('Baker St', 'London', 'Sherlock');

// person уничтожен → address уничтожен тоже
```

---

### Практические примеры

```typescript
// --- Агрегация: Tag может жить без Article ---
class Tag {
  constructor(public name: string) {}
}

class Article {
  constructor(
    public title: string,
    public tags: Tag[] // теги существуют вне статьи, могут быть у многих статей
  ) {}
}

const jsTag = new Tag('JavaScript');
const tsTag = new Tag('TypeScript');

const article1 = new Article('Intro to JS', [jsTag]);
const article2 = new Article('TS vs JS', [jsTag, tsTag]); // тот же jsTag

// --- Композиция: Engine не существует без Car ---
class Engine {
  constructor(private horsepower: number) {}
  start() { return `Engine (${this.horsepower}hp) started`; }
}

class Car {
  private engine: Engine; // Car создаёт и владеет Engine

  constructor(public model: string, horsepower: number) {
    this.engine = new Engine(horsepower); // создаётся внутри
  }

  start() { return this.engine.start(); }
}

const car = new Car('BMW', 300);
// engine доступен только через car, не снаружи
```

---

### Как выбрать

```
Вопрос: «Может ли дочерний объект существовать без родителя?»
  Да → Агрегация
  Нет → Композиция

Вопрос: «Может ли один объект принадлежать нескольким родителям?»
  Да → Агрегация
  Нет → Композиция
```

### Практика и применение

- **ORM (TypeORM, Prisma)**: отношения `@OneToMany` с `cascade: 'delete'` — композиция; без cascade — агрегация
- **React-компоненты**: `children` — агрегация (компонент получает снаружи); внутреннее состояние — композиция
- **Документы MongoDB**: вложенные документы — композиция; ссылки (ObjectId) — агрегация

### Важные нюансы и краеугольные камни

- В JavaScript нет настоящего деструктора, поэтому «уничтожение вместе с родителем» — концептуальный, не технический термин. Реально это управление ссылками: если ссылка на дочерний объект нигде больше не хранится, GC его соберёт.
- Граница между агрегацией и композицией **контекстуальная** — одна и та же связь может быть агрегацией в одной системе и композицией в другой.
- В UML термины строгие; в коде разница часто условна — важно моделировать жизненный цикл осознанно.

---

## Сравнение

| Критерий | Агрегация | Композиция |
|----------|-----------|------------|
| Отношение | «использует» | «владеет» |
| Жизненный цикл | Независимый | Родитель контролирует |
| Разделяемость | Объект у нескольких родителей | Только у одного |
| Пример | Employee — Department | Car — Engine |
| UML | ◇ (пустой ромб) | ◆ (закрашенный ромб) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как агрегация и композиция отражаются в схеме базы данных?** — Композиция: `ON DELETE CASCADE`; агрегация: внешний ключ без cascade.
- **Может ли одна модель иметь и агрегацию, и композицию?** — Да, например Order (владеет OrderItem — композиция) и ссылается на Customer (агрегация).
- **Как это связано с DDD (Domain-Driven Design)?** — Aggregate Root в DDD — пример строгой композиции: объекты внутри Aggregate не живут вне его контекста.

### Красные флаги (чего не говорить)

- «Агрегация и композиция — одно и то же» — ключевое различие в жизненном цикле.
- Путать агрегацию с ассоциацией — ассоциация это просто «знает о», без владения.

### Связанные темы

- `009-chto-takoe-agregatsiya-v-oop.md`
- `006-kompozitsiya-vs-nasledovanie.md`
- `007-kompozitsiya-v-kontekste-js.md`
