# Q007. Что такое композиция в контексте JavaScript?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

В JavaScript **композиция** — это сборка объектов или функций из более мелких, независимых частей. Существует две формы: **объектная композиция** (объект содержит другие объекты как свойства) и **функциональная композиция** (compose/pipe: результат одной функции передаётся в следующую). JS поощряет композицию через прототипы, миксины и функции высшего порядка — в противовес жёстким классовым иерархиям.

---

## Развёрнутый ответ

### Суть и определение

Композиция в JS реализуется на нескольких уровнях:

1. **Объектная композиция** — объект содержит другие объекты (`has-a`)
2. **Функциональная композиция** — `compose`/`pipe` для объединения функций
3. **Миксины** — горизонтальное объединение поведения в прототип/объект
4. **React-хуки** — функциональная композиция в UI

---

### 1. Объектная композиция

```typescript
interface Logger {
  log(msg: string): void;
}

interface Validator {
  validate(data: unknown): boolean;
}

class ConsoleLogger implements Logger {
  log(msg: string) { console.log(`[LOG] ${msg}`); }
}

class SchemaValidator implements Validator {
  validate(data: unknown): boolean {
    return data !== null && data !== undefined;
  }
}

// UserService собран из независимых частей
class UserService {
  constructor(
    private logger: Logger,
    private validator: Validator
  ) {}

  createUser(data: unknown): void {
    if (!this.validator.validate(data)) {
      this.logger.log('Invalid data');
      return;
    }
    this.logger.log('User created');
  }
}

const service = new UserService(new ConsoleLogger(), new SchemaValidator());
```

---

### 2. Функциональная композиция

```typescript
// compose: f(g(h(x))) — правая к левой
const compose = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduceRight((acc, fn) => fn(acc), x);

// pipe: h(g(f(x))) — левая к правой (удобнее читать)
const pipe = <T>(...fns: Array<(x: T) => T>) =>
  (x: T): T => fns.reduce((acc, fn) => fn(acc), x);

// Пример: обработка строки
const trim = (s: string) => s.trim();
const toLowerCase = (s: string) => s.toLowerCase();
const removeSpaces = (s: string) => s.replace(/\s+/g, '-');

const slugify = pipe(trim, toLowerCase, removeSpaces);

slugify('  Hello World  '); // 'hello-world'

// Compose: тот же результат, обратный порядок объявления
const slugifyC = compose(removeSpaces, toLowerCase, trim);
slugifyC('  Hello World  '); // 'hello-world'
```

---

### 3. Миксины (объектная горизонтальная композиция)

```typescript
// Поведенческие единицы — не классы, а объекты/функции
const withFly = (obj: object) => ({
  ...obj,
  fly() { return `${(obj as { name: string }).name} is flying`; }
});

const withSwim = (obj: object) => ({
  ...obj,
  swim() { return `${(obj as { name: string }).name} is swimming`; }
});

const duck = withFly(withSwim({ name: 'Donald' }));
duck.fly();  // 'Donald is flying'
duck.swim(); // 'Donald is swimming'

// Паттерн через TypeScript Mixins
type Constructor<T = object> = new (...args: unknown[]) => T;

const Flyable = <T extends Constructor>(Base: T) =>
  class extends Base {
    fly() { return 'flying'; }
  };

const Swimmable = <T extends Constructor>(Base: T) =>
  class extends Base {
    swim() { return 'swimming'; }
  };

class Animal {
  constructor(public name: string) {}
}

class Duck extends Flyable(Swimmable(Animal)) {}

const d = new Duck('Donald');
d.fly();  // 'flying'
d.swim(); // 'swimming'
```

---

### 4. Функциональная композиция в React

```typescript
// Вместо HOC-иерархии — композиция хуков
function useAuth() {
  return { user: { id: '1', role: 'admin' } };
}

function usePermissions(role: string) {
  return { canEdit: role === 'admin' };
}

function useAuditLog() {
  return { log: (action: string) => console.log(`[AUDIT] ${action}`) };
}

// Компонент собирается из независимых хуков — чистая композиция
function UserDashboard() {
  const { user } = useAuth();
  const { canEdit } = usePermissions(user.role);
  const { log } = useAuditLog();

  const handleEdit = () => {
    if (canEdit) {
      log('User edited profile');
    }
  };

  return <button onClick={handleEdit}>Edit</button>;
}
```

---

### Практика и применение

- **Middleware в Express/Koa** — цепочка функций-обработчиков: `compose(logger, auth, rateLimit)(handler)`
- **Redux middleware** — `applyMiddleware(thunk, logger, analytics)`
- **RxJS операторы** — `pipe(filter(...), map(...), debounceTime(...))`
- **Декораторы TypeScript** — форма функциональной композиции для классов

### Важные нюансы и краеугольные камни

- **`Object.assign` vs spread для миксинов**: spread (`{...a, ...b}`) создаёт новый объект; `Object.assign` мутирует target
- **Порядок в compose vs pipe** противоположный — типичная точка ошибки
- При глубокой цепочке `pipe` теряется TypeScript-вывод типов — используй явные аннотации
- Функциональная композиция работает только с **чистыми функциями** — с сайд-эффектами нужна осторожность

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Разница между `compose` и `pipe`?** — Порядок применения функций: compose — справа налево, pipe — слева направо.
- **Что такое точечный стиль (point-free style)?** — Запись функций через композицию без явного указания аргументов: `const slugify = pipe(trim, toLower)`.
- **Как миксины реализуются в TypeScript?** — Через generic-функции, принимающие конструктор и возвращающие расширенный класс.
- **Чем функциональная композиция отличается от цепочки методов?** — Цепочка методов требует конкретного объекта, функциональная композиция — набор независимых функций.

### Красные флаги (чего не говорить)

- «Композиция — это просто Object.assign» — Object.assign лишь один из инструментов, концепция шире.
- Путать функциональную композицию с Promise-цепочкой (`then`) — это разные механизмы.

### Связанные темы

- `006-kompozitsiya-vs-nasledovanie.md`
- `008-raznica-agregatsiya-i-kompozitsiya.md`
- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
- `019-chto-takoe-karrirovanie-currying.md`
