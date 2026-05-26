# Q041. Как в JavaScript работают декораторы? Как они могут быть использованы для модификации поведения классов и методов?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**Декораторы** — специальный синтаксис (`@decorator`), позволяющий оборачивать классы, методы, свойства и параметры для добавления функциональности без изменения исходного кода. В Stage 3 ECMAScript (декораторы 2022). В TypeScript поддерживаются с `experimentalDecorators`. Паттерн декоратора реализуем и без синтаксиса — через функции высшего порядка.

---

## Развёрнутый ответ

### Суть и определение

Декоратор — это функция, которая принимает класс/метод/свойство и возвращает модифицированную версию. Используется для: логирования, кэширования, валидации, авторизации, timing и т.д.

**Два вида:**
1. **Синтаксические декораторы** (`@` syntax) — TypeScript / TC39 Stage 3.
2. **Функциональные декораторы** — HOF-обёртки без специального синтаксиса.

### Функциональные декораторы (без синтаксиса, всегда доступны)

```javascript
// Декоратор логирования
function withLogging(fn) {
  return function(...args) {
    console.log(`[${fn.name}] called with:`, args);
    const result = fn.apply(this, args);
    console.log(`[${fn.name}] returned:`, result);
    return result;
  };
}

// Декоратор измерения времени
function withTiming(fn) {
  return function(...args) {
    const start = performance.now();
    const result = fn.apply(this, args);
    console.log(`${fn.name}: ${(performance.now() - start).toFixed(2)}ms`);
    return result;
  };
}

function processData(data) { /* ... */ }
const loggedProcess = withLogging(withTiming(processData));
```

### Синтаксические декораторы (TypeScript / Stage 3)

**Декоратор метода:**
```typescript
function log(target: any, key: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function(...args: any[]) {
    console.log(`${key} called with`, args);
    const result = original.apply(this, args);
    console.log(`${key} returned`, result);
    return result;
  };
  return descriptor;
}

class UserService {
  @log
  async getUser(id: string) {
    return fetch(`/api/users/${id}`).then(r => r.json());
  }
}
```

**Декоратор класса:**
```typescript
function singleton<T extends { new(...args: any[]): {} }>(constructor: T) {
  let instance: T;
  return class extends constructor {
    constructor(...args: any[]) {
      if (instance) return instance;
      super(...args);
      instance = this as any;
    }
  };
}

@singleton
class DatabaseConnection {
  constructor(url: string) { /* ... */ }
}

const db1 = new DatabaseConnection('localhost');
const db2 = new DatabaseConnection('remote');
console.log(db1 === db2); // true — синглтон
```

**Декоратор свойства:**
```typescript
function readonly(target: any, key: string) {
  Object.defineProperty(target, key, { writable: false });
}

class Config {
  @readonly
  API_URL = 'https://api.example.com';
}
```

### Практика и применение

- **NestJS:** `@Controller()`, `@Get()`, `@Injectable()` — весь фреймворк строится на декораторах.
- **TypeORM / Prisma:** `@Entity()`, `@Column()`, `@PrimaryKey()`.
- **Angular:** `@Component()`, `@NgModule()`, `@Injectable()`.
- **MobX:** `@observable`, `@computed`, `@action`.
- **Zustand/Redux middleware** — функциональный паттерн декоратора.

### Важные нюансы и краеугольные камни

- TC39 Stage 3 декораторы (2022) несовместимы с legacy TypeScript `experimentalDecorators` — разные спецификации.
- Декораторы выполняются **при определении класса** (не при создании экземпляра).
- Несколько декораторов применяются **снизу вверх**: `@A @B method` → сначала B, потом A.
- Декораторы на стрелочных свойствах класса работают иначе, чем на методах прототипа.

### Примеры

```javascript
// Декоратор rate limiting (функциональный стиль)
function rateLimited(fn, maxCalls, window) {
  let calls = 0;
  let resetTime = Date.now() + window;

  return function(...args) {
    const now = Date.now();
    if (now > resetTime) {
      calls = 0;
      resetTime = now + window;
    }
    if (++calls > maxCalls) throw new Error('Rate limit exceeded');
    return fn.apply(this, args);
  };
}

// Декоратор retry
function withRetry(fn, retries = 3, delay = 1000) {
  return async function(...args) {
    let lastError;
    for (let i = 0; i <= retries; i++) {
      try {
        return await fn.apply(this, args);
      } catch (err) {
        lastError = err;
        if (i < retries) await new Promise(r => setTimeout(r, delay * 2 ** i));
      }
    }
    throw lastError;
  };
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В каком порядке применяются декораторы при стеке `@A @B`?** — Снизу вверх: B применяется первым, A — к результату B.
- **Чем legacy `experimentalDecorators` в TS отличаются от Stage 3?** — Разные API (PropertyDescriptor vs метаданные нового формата), несовместимы.
- **Когда декораторы выполняются?** — При определении класса (compile/load time), не при вызове.

### Красные флаги (чего не говорить)

- «Декораторы — только синтаксический сахар над HOF» — они выполняют ту же роль, но с декларативным синтаксисом и доступом к метаданным.
- «Декораторы работают без TypeScript» — нативный JS требует флага `--experimental-decorators` в Node или babel-плагина.

### Связанные темы

- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `037-chto-takoe-memoizaciya-realizuyte-bazvuyu-logiku.md`
- `046-chto-takoe-prototipnoe-nasledovanie.md`
