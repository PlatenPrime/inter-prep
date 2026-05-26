# Q006. Разница между композицией и наследованием?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Наследование** — «является» (is-a): класс B наследует реализацию A, создавая жёсткую связь через иерархию. **Композиция** — «содержит» (has-a): класс B использует объект A как поле, делегируя ему работу. GoF-принцип «favour composition over inheritance» говорит: предпочитай композицию там, где нет реальной семантики «является», так как она даёт гибкость и слабую связанность.

---

## Развёрнутый ответ

### Суть и определение

| Критерий | Наследование | Композиция |
|----------|-------------|------------|
| Отношение | is-a («является») | has-a («содержит») |
| Связанность | Жёсткая (compile-time) | Слабая (runtime) |
| Переиспользование | Через иерархию | Через делегирование |
| Гибкость | Низкая — иерархию сложно изменить | Высокая — зависимость инжектируется |
| Инкапсуляция | Нарушается: protected-детали базового класса видны дочернему | Не нарушается |
| Тестируемость | Сложнее: требует создания базового класса | Проще: мокируем зависимость |

---

### Наследование — когда оправдано

```typescript
// ✅ Реальная семантика is-a
abstract class HttpError extends Error {
  constructor(public statusCode: number, message: string) {
    super(message);
  }
}

class NotFoundError extends HttpError {
  constructor(resource: string) {
    super(404, `${resource} not found`);
  }
}

class UnauthorizedError extends HttpError {
  constructor() { super(401, 'Unauthorized'); }
}

// Полиморфизм работает правильно
function handleError(err: HttpError) {
  res.status(err.statusCode).json({ error: err.message });
}
```

---

### Композиция — гибкое альтернативное решение

```typescript
// ❌ Наследование: User наследует Logger — нет семантики is-a
class User extends Logger {
  constructor(public name: string) { super(); }
  doSomething() {
    this.log(`User ${this.name} did something`); // метод от Logger
  }
}

// ✅ Композиция: User содержит Logger
interface Logger {
  log(message: string): void;
}

class User {
  constructor(
    public name: string,
    private logger: Logger  // инжектируем зависимость
  ) {}

  doSomething() {
    this.logger.log(`User ${this.name} did something`);
  }
}

// Подменяем логгер без изменения User
const user = new User('Alice', new ConsoleLogger());
const testUser = new User('Alice', new MockLogger());
```

---

### Проблема наследования: Fragile Base Class

```typescript
class EventEmitter {
  private handlers: Map<string, Function[]> = new Map();

  on(event: string, handler: Function) {
    const list = this.handlers.get(event) ?? [];
    this.handlers.set(event, [...list, handler]);
  }

  emit(event: string, ...args: unknown[]) {
    this.handlers.get(event)?.forEach(h => h(...args));
  }
}

// ❌ Наследуем, чтобы добавить логирование
class LoggingEmitter extends EventEmitter {
  emit(event: string, ...args: unknown[]) {
    console.log(`Event: ${event}`);
    super.emit(event, ...args); // хрупко: зависит от реализации super
  }
}

// ✅ Через композицию
class LoggingEmitter {
  constructor(private emitter: EventEmitter) {}

  on(event: string, handler: Function) { this.emitter.on(event, handler); }

  emit(event: string, ...args: unknown[]) {
    console.log(`Event: ${event}`);
    this.emitter.emit(event, ...args);
  }
}
```

---

### Миксины — "горизонтальная" композиция

```typescript
// Компонуем поведение из независимых блоков
type Constructor<T = object> = new (...args: unknown[]) => T;

const Timestamped = <T extends Constructor>(Base: T) =>
  class extends Base {
    readonly createdAt = new Date();
  };

const Activatable = <T extends Constructor>(Base: T) =>
  class extends Base {
    isActive = false;
    activate() { this.isActive = true; }
    deactivate() { this.isActive = false; }
  };

class UserBase {
  constructor(public name: string) {}
}

class User extends Timestamped(Activatable(UserBase)) {}

const user = new User('Alice');
user.activate();         // из Activatable
user.createdAt;          // из Timestamped
user.name;               // из UserBase
```

### Практика и применение

- **React Hooks** — яркий пример композиции вместо наследования (`useAuth` + `usePermissions` + `useLogging` вместо `AuthComponent extends BaseComponent`)
- **Strategy Pattern** — объект содержит стратегию (has-a), а не наследует её
- **Entity Component System** (игровой движок) — чистая композиция: сущности собираются из независимых компонентов

### Важные нюансы и краеугольные камни

- **Глубина иерархии > 2** — сигнал пересмотреть в пользу композиции
- **Protected-поля в базовом классе** — нарушение инкапсуляции: дочерний класс знает детали родителя
- Композиция требует больше кода («склейки»), но платит гибкостью и тестируемостью

---

## Сравнение

| Сценарий | Предпочтительно |
|----------|----------------|
| Есть реальная связь «является» | Наследование |
| Поведение нужно переиспользовать без иерархии | Композиция |
| Зависимость должна подменяться в тестах | Композиция (DI) |
| Полиморфная замена через контракт | Интерфейс + любой подход |
| Переиспользование нескольких независимых поведений | Миксины / композиция |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React перешёл от HOC к хукам?** — HOC — форма наследования-в-компонентах через обёртки; хуки — чистая горизонтальная композиция.
- **Что такое «хрупкий базовый класс»?** — Изменение базового класса ломает подклассы — следствие жёсткой связи при наследовании.
- **Когда оба подхода неверны?** — Когда ни «является», ни «содержит» не подходят семантически — нужен отдельный сервис/утилита.

### Красные флаги (чего не говорить)

- «Наследование всегда хуже» — оно оправдано при полиморфизме подтипов и иерархиях предметной области.
- «Композиция = миксины» — миксины это один из способов, не синоним.

### Связанные темы

- `007-kompozitsiya-v-kontekste-js.md`
- `008-raznica-agregatsiya-i-kompozitsiya.md`
- `003-printsipy-s-nasledovaniem.md`
- `002-chto-takoe-solid.md`
