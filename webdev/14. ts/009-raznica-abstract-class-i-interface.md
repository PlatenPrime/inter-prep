# Q009. Разница между абстрактным классом (abstract class) и интерфейсом (interface)?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

`interface` — чисто типовая конструкция, стирается при компиляции и не генерирует JS-код. `abstract class` — реальная JS-конструкция (генерирует код), может содержать **реализацию методов**, **поля со значениями** и **конструктор**. Класс может реализовать несколько интерфейсов (`implements`), но наследовать только один абстрактный класс (`extends`).

---

## Развёрнутый ответ

### Суть и определение

**`interface`** — контракт: описывает, _что_ объект должен уметь, не _как_. Существует только в TypeScript, исчезает после компиляции.

**`abstract class`** — частично реализованный класс: описывает _и_ контракт (абстрактные методы), _и_ реализацию (конкретные методы, поля). Компилируется в реальный JavaScript-класс.

### Как это работает

#### Interface — чистый контракт

```typescript
interface Serializable {
  serialize(): string;
  deserialize(data: string): void;
}

// Любой объект/класс может реализовать интерфейс
class JsonSerializer implements Serializable {
  serialize(): string { return JSON.stringify(this); }
  deserialize(data: string): void { Object.assign(this, JSON.parse(data)); }
}

// Множественная реализация
interface Loggable { log(): void; }
class Service implements Serializable, Loggable {
  serialize() { return ""; }
  deserialize() {}
  log() { console.log(this); }
}
```

Скомпилированный JS от `interface` — **пустой** (0 байт кода).

#### Abstract Class — шаблонный метод

```typescript
abstract class Animal {
  // Поле с реализацией
  protected name: string;

  constructor(name: string) {
    this.name = name; // конструктор может быть в абстрактном классе
  }

  // Конкретный метод — реализация доступна подклассам
  move(distance: number = 0): void {
    console.log(`${this.name} moved ${distance}m`);
  }

  // Абстрактный метод — ОБЯЗАТЕЛЕН к реализации в подклассе
  abstract makeSound(): string;

  // Конкретный метод, использующий абстрактный
  describe(): string {
    return `${this.name} says: ${this.makeSound()}`;
  }
}

class Dog extends Animal {
  makeSound(): string { return "Woof!"; }
}

const dog = new Dog("Rex");
dog.describe();  // "Rex says: Woof!"
// new Animal("x"); // Error: нельзя создать экземпляр абстрактного класса
```

#### Ключевые технические различия

```typescript
// Interface: нет кода в рантайме
interface IRepository<T> {
  findById(id: string): Promise<T | null>;
  save(entity: T): Promise<void>;
}

// Abstract class: есть код в рантайме (базовая логика)
abstract class BaseRepository<T> implements IRepository<T> {
  // Общая реализация
  protected cache = new Map<string, T>();

  async findById(id: string): Promise<T | null> {
    if (this.cache.has(id)) return this.cache.get(id)!;
    const entity = await this.fetchFromDb(id);
    if (entity) this.cache.set(id, entity);
    return entity;
  }

  // Абстрактный — специфичен для каждого репозитория
  protected abstract fetchFromDb(id: string): Promise<T | null>;
  abstract save(entity: T): Promise<void>;
}

class UserRepository extends BaseRepository<User> {
  protected async fetchFromDb(id: string) { /* SQL query */ }
  async save(user: User) { /* SQL insert/update */ }
}
```

### Практика и применение

**`interface`** — для:
- Контрактов между слоями (DI, IoC)
- Типизации объектов без наследования
- Module augmentation
- Когда нужна множественная реализация без ограничений наследования

**`abstract class`** — для:
- Паттерна **Template Method** — базовый алгоритм с точками расширения
- Общего поведения/состояния у группы классов
- Когда нужен конструктор с общей логикой инициализации
- Фреймворки: `BaseController`, `BaseService`, `BaseRepository`

### Важные нюансы и краеугольные камни

- **Нельзя создать экземпляр** абстрактного класса — только его наследников
- **Один `extends`** — класс может наследовать только один класс (и абстрактный, и обычный)
- **Несколько `implements`** — класс может реализовывать любое количество интерфейсов
- Abstract class **генерирует JS-код** — это влияет на bundle size и рантайм; интерфейс нет
- `instanceof` работает с абстрактным классом, но не с интерфейсом
- Abstract class может реализовывать интерфейс частично — подклассы должны завершить реализацию

### Примеры

```typescript
// Комбинирование: abstract class + interface
interface ILogger {
  info(msg: string): void;
  error(msg: string): void;
}

abstract class BaseService {
  constructor(protected readonly logger: ILogger) {}

  // Шаблонный метод
  async execute<T>(operation: () => Promise<T>): Promise<T> {
    this.logger.info(`[${this.constructor.name}] Starting`);
    try {
      const result = await operation();
      this.logger.info(`[${this.constructor.name}] Done`);
      return result;
    } catch (err) {
      this.logger.error(`[${this.constructor.name}] Error: ${err}`);
      throw err;
    }
  }
}

class UserService extends BaseService {
  async createUser(dto: CreateUserDto): Promise<User> {
    return this.execute(() => this.userRepo.create(dto));
  }
}
```

---

## Сравнение

| Критерий | `interface` | `abstract class` |
|----------|-------------|-----------------|
| JS-код после компиляции | Нет (стирается) | Да (класс) |
| Реализация методов | Нет | Да (конкретные методы) |
| Поля со значениями | Нет | Да |
| Конструктор | Нет | Да |
| Множественное использование | `implements` любое кол-во | `extends` только один |
| `instanceof` | Нет | Да |
| Прямой инстанс | Нет | Нет (ошибка компиляции) |
| Декларативное слияние | Да | Нет |
| Паттерн Template Method | Нет | Да |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда выбрать abstract class вместо interface?** — когда нужна общая реализация (Template Method), конструктор, конкретные методы
- **Может ли abstract class реализовывать interface?** — да; частично или полностью, подклассы дореализуют остаток
- **Работает ли `instanceof` с interface?** — нет; типы стираются; `instanceof` работает только с классами
- **Что такое паттерн Template Method?** — базовый класс определяет алгоритм с абстрактными шагами; подклассы реализуют шаги

### Красные флаги (чего не говорить)

- «Abstract class и interface — одно и то же» — принципиально разная семантика и рантайм-поведение
- «Interface медленнее, потому что абстрактный» — наоборот: interface не генерирует код, abstract class — генерирует
- «Можно наследовать несколько abstract class» — JavaScript (и TypeScript) поддерживает только одиночное наследование

### Связанные темы

- `008-raznica-type-i-interface.md`
- `018-elementy-oop-v-typescript.md`
- `019-modifikatory-dostupa.md`
