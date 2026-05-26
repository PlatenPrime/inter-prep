# Q026. Что такое паттерн, или шаблон проектирования?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Паттерн проектирования** — повторно используемое решение типичной проблемы проектирования программного обеспечения в определённом контексте. Это не готовый код, а **описание подхода** — шаблон, который нужно адаптировать под конкретную задачу. Паттерны стандартизируют словарь разработчиков: сказав «это Singleton» или «здесь Observer», сразу понятна структура решения.

---

## Развёрнутый ответ

### Суть и определение

Понятие пришло из архитектуры (Кристофер Александер), было формализовано для ПО книгой **«Gang of Four»** (GoF) — Gamma, Helm, Johnson, Vlissides — «Design Patterns: Elements of Reusable Object-Oriented Software» (1994).

Паттерн описывает четыре ключевых элемента:
1. **Имя** — идентификатор (общий словарь)
2. **Задача** — когда применять, в каком контексте
3. **Решение** — структура участников и их взаимодействие
4. **Последствия** — trade-offs, плюсы и минусы

---

### Зачем паттерны

```typescript
// ❌ Без паттерна: разработчик А решает проблему «в лоб»
class Database {
  private static db: Database | null = null;

  static getConnection(): Database {
    if (!Database.db) {
      Database.db = new Database();
    }
    return Database.db;
  }
}

// Разработчик Б видит код и не знает: это намеренно или случайно?
// Называем паттерн:

/**
 * Singleton: обеспечивает единственный экземпляр Database
 * во всём приложении с глобальной точкой доступа.
 */
class DatabaseSingleton {
  // ...
}
// Теперь любой разработчик мгновенно понимает намерение
```

---

### Анатомия паттерна на примере Observer

```typescript
// Задача: при изменении объекта нужно уведомить зависимые объекты
// Решение: Subject + Observer

interface Observer<T> {
  update(data: T): void;
}

interface Subject<T> {
  subscribe(observer: Observer<T>): void;
  unsubscribe(observer: Observer<T>): void;
  notify(data: T): void;
}

// Конкретная реализация
class EventEmitter<T> implements Subject<T> {
  private observers = new Set<Observer<T>>();

  subscribe(observer: Observer<T>): void {
    this.observers.add(observer);
  }

  unsubscribe(observer: Observer<T>): void {
    this.observers.delete(observer);
  }

  notify(data: T): void {
    this.observers.forEach(obs => obs.update(data));
  }
}

// Использование
interface StockPrice { symbol: string; price: number; }

class StockMarket extends EventEmitter<StockPrice> {
  updatePrice(symbol: string, price: number): void {
    this.notify({ symbol, price });
  }
}

class PriceDisplay implements Observer<StockPrice> {
  update({ symbol, price }: StockPrice): void {
    console.log(`${symbol}: $${price}`);
  }
}

const market = new StockMarket();
const display = new PriceDisplay();

market.subscribe(display);
market.updatePrice('AAPL', 150); // 'AAPL: $150'
```

---

### Паттерны не являются

- **Готовым кодом** — каждый раз реализация адаптируется под контекст
- **Алгоритмами** — алгоритм решает вычислительную задачу, паттерн — архитектурную
- **Обязательными** — избыточное применение паттернов = antipattern («overengineering»)
- **Единственным верным решением** — это один из возможных подходов

---

### Паттерны в современном JS/TS

```typescript
// Module Pattern (до ES6)
const userModule = (() => {
  let _privateState = 0;  // приватное через замыкание

  return {
    increment: () => ++_privateState,
    getCount: () => _privateState
  };
})();

// Современный эквивалент — ES6 модули (нативная инкапсуляция)
// Reveal Module — публичный API через export
let _count = 0;
export const increment = () => ++_count;
export const getCount = () => _count;
```

---

### Антипаттерны

Помимо паттернов, важно знать антипаттерны — типичные **плохие** решения:

| Антипаттерн | Описание |
|-------------|----------|
| God Object | Один класс знает и делает слишком много |
| Spaghetti Code | Запутанный поток управления |
| Golden Hammer | «У меня есть молоток — всё выглядит как гвоздь» |
| Shotgun Surgery | Маленькое изменение требует правок во многих местах |
| Magic Numbers | Литеральные числа/строки без объяснения |
| Premature Optimization | Оптимизация до выявления реальных узких мест |

---

### Практика и применение

- **Словарь команды**: «добавим Decorator для логирования» — без описания структуры
- **Код-ревью**: «здесь нарушается Strategy — вынеси алгоритм в отдельный объект»
- **Архитектура**: выбор паттернов влияет на расширяемость системы
- **Собеседование**: знание паттернов — сигнал о глубине инженерного мышления

### Важные нюансы и краеугольные камни

- Паттерны — **ответ на боль**, а не инструмент для любого случая. YAGNI — не добавляй паттерн заранее
- В функциональном программировании паттерны GoF часто заменяются функциями высшего порядка (Strategy → HOF, Command → функции)
- «Паттерн» в широком смысле включает архитектурные паттерны (MVC, CQRS), паттерны интеграции (Event Sourcing) и другие уровни

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем паттерн отличается от алгоритма?** — Алгоритм: конкретные шаги для вычисления (QuickSort). Паттерн: описание структуры для архитектурной проблемы, не конкретный код.
- **Можно ли обойтись без паттернов?** — Да, для маленьких проектов они излишни. Паттерны решают проблемы масштаба и командной разработки.
- **Какие паттерны GoF «умерли» в современном JS?** — Singleton (ES6 modules), Abstract Factory (TypeScript generics), Iterator (ES6 Iterators/generators) — есть встроенные замены.

### Красные флаги (чего не говорить)

- «Паттерны нужно использовать везде» — overengineering хуже отсутствия паттернов.
- «Паттерн — это готовый код для копирования» — нет, это описание подхода.

### Связанные темы

- `027-tipy-patternov.md`
- `028-chto-takoe-gof-patterny.md`
- `029-chto-takoe-grasp-patterny.md`
- `002-chto-takoe-solid.md`
