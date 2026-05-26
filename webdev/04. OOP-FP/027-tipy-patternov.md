# Q027. Типы паттернов?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

GoF делит паттерны на три категории: **порождающие** (Creational) — создание объектов, **структурные** (Structural) — организация классов и объектов, **поведенческие** (Behavioral) — взаимодействие и алгоритмы. Помимо GoF существуют архитектурные паттерны (MVC, MVVM, CQRS), паттерны параллелизма и интеграционные паттерны (EIP).

---

## Развёрнутый ответ

### 1. Порождающие паттерны (Creational)

Решают проблему **создания объектов**, скрывая детали инстанцирования.

| Паттерн | Задача | Применение в JS/TS |
|---------|--------|--------------------|
| **Singleton** | Один экземпляр на приложение | Config, DB connection, Store |
| **Factory Method** | Создание объектов через метод, подкласс решает какой | Экземпляры по типу |
| **Abstract Factory** | Семейства связанных объектов | UI-kit (светлая/тёмная тема) |
| **Builder** | Пошаговое создание сложных объектов | Query builder, FormBuilder |
| **Prototype** | Клонирование объектов | `Object.create`, spread |

```typescript
// Builder — пошаговое создание объекта
class QueryBuilder {
  private query: { table?: string; conditions: string[]; limit?: number } = {
    conditions: []
  };

  from(table: string): this {
    this.query.table = table;
    return this;
  }

  where(condition: string): this {
    this.query.conditions.push(condition);
    return this;
  }

  limit(n: number): this {
    this.query.limit = n;
    return this;
  }

  build(): string {
    const { table, conditions, limit } = this.query;
    let sql = `SELECT * FROM ${table}`;
    if (conditions.length) sql += ` WHERE ${conditions.join(' AND ')}`;
    if (limit) sql += ` LIMIT ${limit}`;
    return sql;
  }
}

const sql = new QueryBuilder()
  .from('users')
  .where('age > 18')
  .where('active = true')
  .limit(10)
  .build();
// SELECT * FROM users WHERE age > 18 AND active = true LIMIT 10
```

---

### 2. Структурные паттерны (Structural)

Описывают **организацию классов и объектов** — как их собирать в более крупные структуры.

| Паттерн | Задача | Применение в JS/TS |
|---------|--------|--------------------|
| **Adapter** | Совместимость несовместимых интерфейсов | Обёртки над SDK/API |
| **Bridge** | Отделение абстракции от реализации | Платформо-независимый код |
| **Composite** | Иерархии «часть-целое» | Дерево DOM, файловая система |
| **Decorator** | Динамическое добавление поведения | HOC, middleware, TypeScript decorators |
| **Facade** | Простой интерфейс над сложной системой | API-клиент, SDK |
| **Flyweight** | Разделение состояния для экономии памяти | Canvas-рендеринг, пул объектов |
| **Proxy** | Контроль доступа к объекту | `Proxy`, lazy-загрузка, кэш |

```typescript
// Adapter: новый интерфейс поверх старого
interface ModernLogger {
  info(msg: string): void;
  warn(msg: string): void;
  error(msg: string): void;
}

class LegacyLogger {
  log(level: 'INFO' | 'WARN' | 'ERROR', message: string): void {
    console.log(`[${level}] ${message}`);
  }
}

class LegacyLoggerAdapter implements ModernLogger {
  constructor(private legacy: LegacyLogger) {}
  info(msg: string)  { this.legacy.log('INFO', msg); }
  warn(msg: string)  { this.legacy.log('WARN', msg); }
  error(msg: string) { this.legacy.log('ERROR', msg); }
}

// Decorator: добавляем поведение без изменения класса
class TimedLogger implements ModernLogger {
  constructor(private logger: ModernLogger) {}
  info(msg: string)  { this.logger.info(`[${Date.now()}] ${msg}`); }
  warn(msg: string)  { this.logger.warn(`[${Date.now()}] ${msg}`); }
  error(msg: string) { this.logger.error(`[${Date.now()}] ${msg}`); }
}
```

---

### 3. Поведенческие паттерны (Behavioral)

Описывают **взаимодействие объектов** и распределение ответственностей.

| Паттерн | Задача | Применение в JS/TS |
|---------|--------|--------------------|
| **Observer** | Уведомление подписчиков об изменениях | EventEmitter, RxJS, Vue reactivity |
| **Strategy** | Взаимозаменяемые алгоритмы | Сортировки, валидаторы, форматтеры |
| **Command** | Инкапсуляция запроса как объекта | Undo/Redo, очередь задач |
| **Chain of Responsibility** | Цепочка обработчиков | Express middleware, NestJS guards |
| **Template Method** | Алгоритм с переопределяемыми шагами | Abstract base class |
| **State** | Поведение зависит от состояния | Конечный автомат |
| **Iterator** | Обход коллекции без знания её структуры | `for...of`, generators |
| **Mediator** | Централизованная координация объектов | EventBus, Redux |
| **Visitor** | Операции над элементами структуры | AST traversal |
| **Memento** | Сохранение и восстановление состояния | Undo history |

```typescript
// Strategy: взаимозаменяемые алгоритмы
interface SortStrategy<T> {
  sort(data: T[]): T[];
}

class BubbleSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    const arr = [...data];
    // bubble sort implementation
    return arr;
  }
}

class QuickSort<T> implements SortStrategy<T> {
  sort(data: T[]): T[] {
    if (data.length <= 1) return data;
    const [pivot, ...rest] = data;
    return [
      ...this.sort(rest.filter(x => x <= pivot)),
      pivot,
      ...this.sort(rest.filter(x => x > pivot))
    ];
  }
}

class DataProcessor<T> {
  constructor(private strategy: SortStrategy<T>) {}

  setStrategy(strategy: SortStrategy<T>): void {
    this.strategy = strategy;
  }

  process(data: T[]): T[] {
    return this.strategy.sort(data);
  }
}

const processor = new DataProcessor(new QuickSort<number>());
processor.process([3, 1, 4, 1, 5]); // [1, 1, 3, 4, 5]
```

---

### Архитектурные паттерны (не GoF)

| Паттерн | Описание |
|---------|----------|
| MVC/MVP/MVVM | Разделение представления и логики |
| Repository | Абстракция доступа к данным |
| Unit of Work | Группировка транзакций |
| CQRS | Разделение команд и запросов |
| Event Sourcing | Хранение истории событий |
| Saga | Длинные транзакции через события |

### Практика и применение

- **Observer** — стандарт для реактивных систем; встроен в DOM (`addEventListener`), RxJS, Vue
- **Strategy** — заменяет switch/if по типу; HOF в ФП — его функциональный аналог
- **Decorator** — HOC в React, TypeScript-декораторы NestJS, axios-интерцепторы

### Важные нюансы и краеугольные камни

- В ФП многие GoF-паттерны реализуются через HOF без классов: Strategy = функция-аргумент, Command = функция в очереди
- Паттерны GoF созданы для статически типизированных языков (C++, Java); в JS/TypeScript некоторые упрощаются
- **Не смешивай**: паттерн не решит проблему неверной архитектуры

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Какой паттерн используется в Express middleware?** — Chain of Responsibility: запрос проходит цепочку обработчиков, каждый может прервать или передать дальше.
- **Чем Decorator-паттерн отличается от TypeScript декораторов?** — Паттерн: оборачивает объект в другой того же типа. TS-декораторы: метапрограммирование, изменяют класс/метод через метаданные.
- **Что такое CQRS?** — Command Query Responsibility Segregation: разделение операций чтения (Query) и записи (Command) — разные модели, потенциально разные хранилища.

### Красные флаги (чего не говорить)

- Называть только GoF — архитектурные паттерны (CQRS, Event Sourcing) важны для senior-уровня.
- «Все паттерны нужно знать наизусть» — важнее знать, когда и зачем применять конкретный.

### Связанные темы

- `028-chto-takoe-gof-patterny.md`
- `029-chto-takoe-grasp-patterny.md`
- `026-chto-takoe-pattern-shablon-proektirovaniya.md`
