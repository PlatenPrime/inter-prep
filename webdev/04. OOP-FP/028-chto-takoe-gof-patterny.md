# Q028. Что такое GOF паттерны?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**GoF (Gang of Four) паттерны** — 23 классических паттерна проектирования из книги «Design Patterns: Elements of Reusable Object-Oriented Software» (1994) авторства Эриха Гаммы, Ричарда Хелма, Ральфа Джонсона и Джона Влиссидеса. Разделены на три группы: порождающие, структурные и поведенческие. Стали стандартным словарём ОО-разработчиков.

---

## Развёрнутый ответ

### Суть и контекст

Книга GoF формализовала опыт проектирования ОО-систем, дав каждому типичному решению имя и описание. В 1994 доминировали C++ и Smalltalk — некоторые паттерны в JS/TS выглядят иначе из-за динамической типизации и прототипной модели.

---

### Порождающие паттерны — самые используемые в JS/TS

#### Singleton

```typescript
class AppConfig {
  private static instance: AppConfig | null = null;
  private settings = new Map<string, string>();

  private constructor() {}

  static getInstance(): AppConfig {
    if (!AppConfig.instance) {
      AppConfig.instance = new AppConfig();
    }
    return AppConfig.instance;
  }

  set(key: string, value: string): void { this.settings.set(key, value); }
  get(key: string): string | undefined { return this.settings.get(key); }
}

// Современная альтернатива в ES6 — модуль является singleton по природе
// config.ts
export const config = new Map<string, string>();
// Импортируется один и тот же объект везде
```

#### Factory Method

```typescript
abstract class Notification {
  abstract send(message: string): void;

  // Factory method — подкласс выбирает, что создавать
  static create(type: 'email' | 'sms' | 'push'): Notification {
    switch (type) {
      case 'email': return new EmailNotification();
      case 'sms':   return new SmsNotification();
      case 'push':  return new PushNotification();
    }
  }
}

class EmailNotification extends Notification {
  send(message: string) { console.log(`Email: ${message}`); }
}

const notif = Notification.create('email');
notif.send('Hello');
```

#### Builder

```typescript
class RequestBuilder {
  private url = '';
  private method: 'GET' | 'POST' | 'PUT' | 'DELETE' = 'GET';
  private headers: Record<string, string> = {};
  private body?: unknown;

  setUrl(url: string): this { this.url = url; return this; }
  setMethod(method: typeof this.method): this { this.method = method; return this; }
  addHeader(key: string, value: string): this { this.headers[key] = value; return this; }
  setBody(body: unknown): this { this.body = body; return this; }

  build(): Request {
    return new Request(this.url, {
      method: this.method,
      headers: this.headers,
      body: this.body ? JSON.stringify(this.body) : undefined
    });
  }
}

const request = new RequestBuilder()
  .setUrl('/api/users')
  .setMethod('POST')
  .addHeader('Content-Type', 'application/json')
  .addHeader('Authorization', 'Bearer token')
  .setBody({ name: 'Alice' })
  .build();
```

---

### Структурные — ключевые в фронтенд-разработке

#### Decorator

```typescript
// Добавляем поведение без изменения исходного класса
interface DataSource {
  writeData(data: string): void;
  readData(): string;
}

class FileDataSource implements DataSource {
  private data = '';
  writeData(data: string) { this.data = data; }
  readData(): string { return this.data; }
}

// Базовый декоратор
abstract class DataSourceDecorator implements DataSource {
  constructor(protected source: DataSource) {}
  writeData(data: string) { this.source.writeData(data); }
  readData(): string { return this.source.readData(); }
}

// Конкретный декоратор — добавляет шифрование
class EncryptionDecorator extends DataSourceDecorator {
  writeData(data: string) {
    super.writeData(btoa(data)); // encode
  }
  readData(): string {
    return atob(super.readData()); // decode
  }
}

// Конкретный декоратор — добавляет сжатие
class CompressionDecorator extends DataSourceDecorator {
  writeData(data: string) {
    super.writeData(`COMPRESSED:${data}`);
  }
  readData(): string {
    return super.readData().replace('COMPRESSED:', '');
  }
}

// Стекуем декораторы
const source = new CompressionDecorator(
  new EncryptionDecorator(
    new FileDataSource()
  )
);

source.writeData('Hello World'); // compressed(encrypted(data))
```

#### Proxy (JS Proxy — нативная реализация)

```typescript
// Паттерн Proxy для кэширования
function createCachedProxy<T extends object>(target: T): T {
  const cache = new Map<string | symbol, unknown>();

  return new Proxy(target, {
    get(obj, prop) {
      const value = Reflect.get(obj, prop);

      if (typeof value === 'function') {
        return function (...args: unknown[]) {
          const key = `${String(prop)}:${JSON.stringify(args)}`;
          if (cache.has(key)) {
            console.log(`Cache hit: ${key}`);
            return cache.get(key);
          }
          const result = value.apply(obj, args);
          cache.set(key, result);
          return result;
        };
      }

      return value;
    }
  });
}
```

#### Facade

```typescript
// Простой интерфейс над сложной подсистемой
class EmailFacade {
  constructor(
    private smtp: SmtpClient,
    private templateEngine: TemplateEngine,
    private queue: MessageQueue,
    private validator: EmailValidator
  ) {}

  async sendWelcome(userEmail: string, userName: string): Promise<void> {
    if (!this.validator.isValid(userEmail)) throw new Error('Invalid email');
    const html = this.templateEngine.render('welcome', { name: userName });
    const message = this.smtp.createMessage(userEmail, 'Welcome!', html);
    await this.queue.enqueue(message);
  }
}

// Потребитель видит только один метод
const emailFacade = new EmailFacade(smtp, templates, queue, validator);
await emailFacade.sendWelcome('alice@example.com', 'Alice');
```

---

### Поведенческие — наиболее часто упоминаемые на собеседованиях

#### Observer (встроен в браузер через addEventListener)

```typescript
// Собственная реализация
class Store<T> {
  private state: T;
  private listeners = new Set<(state: T) => void>();

  constructor(initial: T) { this.state = initial; }

  subscribe(listener: (state: T) => void): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener); // unsubscribe
  }

  setState(updater: (prev: T) => T): void {
    this.state = updater(this.state);
    this.listeners.forEach(l => l(this.state));
  }

  getState(): T { return this.state; }
}
```

#### Command (Undo/Redo)

```typescript
interface Command {
  execute(): void;
  undo(): void;
}

class TextEditor {
  private history: Command[] = [];
  private text = '';

  executeCommand(command: Command): void {
    command.execute();
    this.history.push(command);
  }

  undoLast(): void {
    this.history.pop()?.undo();
  }

  getText() { return this.text; }
  setText(text: string) { this.text = text; }
}

class InsertTextCommand implements Command {
  private previousText = '';

  constructor(
    private editor: TextEditor,
    private insertion: string
  ) {}

  execute(): void {
    this.previousText = this.editor.getText();
    this.editor.setText(this.previousText + this.insertion);
  }

  undo(): void {
    this.editor.setText(this.previousText);
  }
}
```

#### Template Method

```typescript
// Базовый класс — алгоритм, подкласс — шаги
abstract class DataMigration {
  // Template method — алгоритм неизменён
  async run(): Promise<void> {
    await this.connect();
    const data = await this.extract();
    const transformed = this.transform(data);
    await this.load(transformed);
    await this.disconnect();
  }

  protected abstract extract(): Promise<unknown[]>;
  protected abstract transform(data: unknown[]): unknown[];
  protected abstract load(data: unknown[]): Promise<void>;

  protected async connect(): Promise<void> { /* общая логика */ }
  protected async disconnect(): Promise<void> { /* общая логика */ }
}
```

### Важные нюансы и краеугольные камни

- **ES6 modules = Singleton** по умолчанию — экспортируемые объекты инстанцируются один раз
- **Decorator-паттерн** ≠ TypeScript decorators (`@Injectable`) — второе метапрограммирование
- **Iterator** встроен в JS через `Symbol.iterator` и `for...of` — паттерн стал частью языка
- Некоторые GoF-паттерны в JS реализуются проще: Prototype — `Object.create`, Observer — `EventEmitter`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Назовите 3 паттерна, которые вы чаще всего используете в работе?** — Observer/EventEmitter, Strategy, Builder/Factory — аргументируй примерами из реального кода.
- **Как Singleton тестировать?** — Сложно: глобальное состояние. Решение: reset-метод для тестов или IoC-контейнер вместо статического метода.
- **Чем Builder отличается от Factory?** — Factory: создаёт объект за один вызов по типу. Builder: пошаговое конструирование одного сложного объекта.

### Красные флаги (чего не говорить)

- «Singleton — хороший паттерн, использую везде» — глобальное мутабельное состояние затрудняет тестирование.
- Путать Decorator-паттерн с TypeScript/ES decorators — это разные концепции.

### Связанные темы

- `027-tipy-patternov.md`
- `029-chto-takoe-grasp-patterny.md`
- `026-chto-takoe-pattern-shablon-proektirovaniya.md`
- `002-chto-takoe-solid.md`
