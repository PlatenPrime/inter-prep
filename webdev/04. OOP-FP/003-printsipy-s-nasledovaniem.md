# Q003. Какие принципы можно использовать вместе с наследованием?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

Наследование само по себе — инструмент, а не принцип. В связке с ним правильно применять **LSP** (Liskov Substitution Principle) как обязательный критерий корректности иерархии, **OCP** (Open/Closed) как цель расширения через подклассы, а **принцип «is-a»** как проверку семантической обоснованности. Любое наследование стоит рассматривать в паре с альтернативой — **композицией**.

---

## Развёрнутый ответ

### Суть и определение

Наследование — механизм, при котором подкласс получает поведение и данные суперкласса. Оно оправдано только тогда, когда между классами есть **семантическая связь «является»** (is-a), а не просто желание переиспользовать код.

### Принципы, применимые совместно с наследованием

#### 1. LSP — обязательный минимум

Любая иерархия наследования обязана соблюдать LSP: подкласс должен быть полностью взаимозаменяем с базовым типом.

```typescript
class Bird {
  fly(): void { console.log('flying'); }
}

// ❌ Нарушение LSP: Penguin не может летать, но наследует метод fly()
class Penguin extends Bird {
  fly(): void { throw new Error('Cannot fly'); }
}

// ✅ Пересмотреть иерархию
abstract class Bird { abstract move(): void; }
class FlyingBird extends Bird { move() { /* fly */ } }
class Penguin extends Bird { move() { /* swim */ } }
```

**Правило:** если подкласс бросает исключение или ослабляет контракт в overridden-методе — иерархия неверна.

#### 2. OCP — наследование как механизм расширения

Базовый класс закрыт для изменений, поведение расширяется через подклассы.

```typescript
abstract class DataExporter {
  // Template Method Pattern — фиксирует алгоритм, расширяется через шаги
  export(data: unknown[]): string {
    const prepared = this.prepare(data);
    const formatted = this.format(prepared);
    return this.wrapOutput(formatted);
  }

  protected abstract format(data: unknown[]): string;

  protected prepare(data: unknown[]): unknown[] { return data; }
  protected wrapOutput(s: string): string { return s; }
}

class CsvExporter extends DataExporter {
  protected format(data: unknown[]): string {
    return data.map(row => Object.values(row as object).join(',')).join('\n');
  }
}

class JsonExporter extends DataExporter {
  protected format(data: unknown[]): string {
    return JSON.stringify(data, null, 2);
  }
}
```

Базовый класс не меняется при добавлении нового формата.

#### 3. Принцип «is-a» (семантика наследования)

Перед созданием иерархии задай вопрос: «Является ли B действительно A во всех контекстах?»

```typescript
// ✅ Корректная семантика
class Vehicle { startEngine(): void { /* ... */ } }
class Car extends Vehicle { /* Car IS-A Vehicle */ }
class Truck extends Vehicle { /* Truck IS-A Vehicle */ }

// ❌ Некорректная семантика — используется для переиспользования кода
class Stack extends Array {
  // Stack is NOT an Array — у массива можно вставить элемент в середину
  // Stack нарушает контракт Array
}

// ✅ Правильно — через композицию
class Stack<T> {
  private items: T[] = [];
  push(item: T) { this.items.push(item); }
  pop(): T | undefined { return this.items.pop(); }
  peek(): T | undefined { return this.items[this.items.length - 1]; }
}
```

#### 4. SRP совместно с наследованием

Каждый класс в иерархии должен иметь одну причину для изменения. Не перегружай базовый класс смешанными ответственностями.

```typescript
// ❌ Базовый класс делает слишком много
abstract class Entity {
  abstract getId(): string;
  abstract validate(): boolean;
  save(): void { /* SQL */ }         // инфраструктурная ответственность
  toJson(): string { /* сериализация */ } // представление
}

// ✅ Разделяем: Entity — чистая доменная модель
abstract class Entity {
  abstract getId(): string;
  abstract validate(): boolean;
}
// Сохранение — в репозитории, сериализация — в маппере
```

### Практика и применение

- **Template Method Pattern** — классический паттерн, использующий наследование правильно: базовый класс задаёт алгоритм, подклассы реализуют шаги.
- **Abstract base classes** в TypeScript — формализуют контракт при наследовании.
- Проверяй иерархию тестом: «если я заменю экземпляр родителя экземпляром дочернего — все тесты пройдут?»

### Важные нюансы и краеугольные камни

- **Глубина иерархии > 2-3 уровней** — почти всегда антипаттерн. Каждый уровень добавляет связанность.
- **Хрупкий базовый класс (Fragile Base Class)**: изменение базового класса неожиданно ломает подклассы — аргумент против глубоких иерархий.
- В JavaScript прототипная цепочка ограничена: нет интерфейсов, нет abstract-классов в рантайме — TypeScript исправляет это на этапе компиляции.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда наследование предпочтительнее композиции?** — Когда есть реальная семантика «является» и выгода от полиморфной заменяемости важнее гибкости.
- **Что такое Template Method Pattern и как он связан с наследованием?** — Базовый класс определяет алгоритм через вызов abstract-методов, подклассы реализуют детали.
- **Почему множественное наследование проблематично?** — Diamond problem: неопределённость, какой метод вызывать при пересечении иерархий; JS не поддерживает множественное наследование классов.

### Красные флаги (чего не говорить)

- «Наследование — лучший способ переиспользовать код» — переиспользование без семантики «is-a» — это антипаттерн.
- «LSP можно нарушить, если очень нужно» — нарушение LSP делает код хрупким и непредсказуемым для потребителей API.

### Связанные темы

- `002-chto-takoe-solid.md`
- `005-klassovoe-vs-prototipnoe-nasledovanie.md`
- `006-kompozitsiya-vs-nasledovanie.md`
- `010-tipy-polimorfizma.md`
