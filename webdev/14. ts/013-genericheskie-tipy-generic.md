# Q013. Что такое общие типы (`generic`) в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Generics** (обобщённые/общие типы) — механизм параметрического полиморфизма: функция, класс или тип принимает **параметр типа** `<T>` и работает с любым конкретным типом, сохраняя типобезопасность. Это позволяет написать код один раз и использовать с разными типами без потери информации о типах (в отличие от `any`).

---

## Развёрнутый ответ

### Суть и определение

Без generics для работы с разными типами приходится либо дублировать код, либо использовать `any` (теряя типобезопасность). Generics решают эту проблему: тип становится **параметром**.

Синтаксис: `<T>` после имени функции/класса/типа, где `T` — произвольное имя параметра типа (конвенция: `T`, `U`, `V`, `K`, `V` — для ключей/значений, `E` — для элементов).

### Как это работает

#### Generic функции

```typescript
// Без generic — теряем тип
function identityAny(arg: any): any { return arg; }
const r1 = identityAny(42); // r1: any — тип потерян

// С generic — тип сохраняется
function identity<T>(arg: T): T { return arg; }
const r2 = identity(42);        // r2: number — вывод типа работает!
const r3 = identity<string>("hi"); // явный тип: r3: string

// Несколько параметров типа
function pair<A, B>(a: A, b: B): [A, B] {
  return [a, b];
}
const p = pair("hello", 42); // [string, number]

// Generic с массивом
function first<T>(arr: T[]): T | undefined {
  return arr[0];
}
const n = first([1, 2, 3]);   // number | undefined
const s = first(["a", "b"]);  // string | undefined
```

#### Generic интерфейсы и типы

```typescript
interface Repository<T> {
  findById(id: string): Promise<T | null>;
  findAll(): Promise<T[]>;
  save(entity: T): Promise<T>;
  delete(id: string): Promise<void>;
}

type ApiResponse<T> = {
  data: T;
  status: number;
  message: string;
};

type Nullable<T> = T | null;
type Maybe<T> = T | null | undefined;
```

#### Generic классы

```typescript
class Stack<T> {
  private items: T[] = [];

  push(item: T): void {
    this.items.push(item);
  }

  pop(): T | undefined {
    return this.items.pop();
  }

  peek(): T | undefined {
    return this.items[this.items.length - 1];
  }

  get size(): number {
    return this.items.length;
  }
}

const numStack = new Stack<number>();
numStack.push(1);
numStack.push(2);
const top = numStack.pop(); // number | undefined
```

#### Ограничения (Constraints) — `extends`

```typescript
// T должен иметь поле id
function findById<T extends { id: string }>(items: T[], id: string): T | undefined {
  return items.find(item => item.id === id);
}

// keyof — ограничение ключами объекта
function getProperty<T, K extends keyof T>(obj: T, key: K): T[K] {
  return obj[key];
}

const user = { name: "Alice", age: 30 };
const name = getProperty(user, "name"); // string
const age = getProperty(user, "age");   // number
// getProperty(user, "foo"); // Error: "foo" не является ключом
```

#### Default type parameters (TS 2.3+)

```typescript
interface Container<T = string> {
  value: T;
}

const c1: Container = { value: "hello" };  // T = string по умолчанию
const c2: Container<number> = { value: 42 };
```

### Практика и применение

Generics — основа всей стандартной библиотеки TypeScript:
- `Array<T>`, `Promise<T>`, `Map<K, V>`, `Set<T>`
- Utility types: `Partial<T>`, `Required<T>`, `Readonly<T>`, `Record<K, V>`
- React: `useState<T>`, `useRef<T>`, `FC<Props>`, `ComponentProps<typeof C>`

**Реальные паттерны:**

```typescript
// Generic hook в React
function useLocalStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(() => {
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value: T) => {
    setStoredValue(value);
    window.localStorage.setItem(key, JSON.stringify(value));
  };

  return [storedValue, setValue] as const;
}

// Использование:
const [theme, setTheme] = useLocalStorage<"light" | "dark">("theme", "light");
```

### Важные нюансы и краеугольные камни

- **Type inference работает для generics** — обычно не нужно указывать `<T>` явно при вызове
- **`T extends object` vs `T extends {}`**: первое исключает примитивы, второе нет
- **Variance**: TypeScript использует structural + use-site variance; `--strictFunctionTypes` включает контравариантность параметров
- **`infer`** в conditional types — «вытащить» тип из структуры:
  ```typescript
  type UnpackPromise<T> = T extends Promise<infer U> ? U : T;
  type Result = UnpackPromise<Promise<string>>; // string
  ```
- Generic функция с `extends` ограничением: `T extends string` не означает что `T = string`; T может быть литеральным подтипом

### Примеры

```typescript
// Продвинутый паттерн: строго типизированный event emitter
type EventMap = {
  userCreated: { id: string; email: string };
  orderPlaced: { orderId: string; amount: number };
};

class TypedEventEmitter<Events extends Record<string, unknown>> {
  private handlers = new Map<keyof Events, Set<(data: any) => void>>();

  on<K extends keyof Events>(event: K, handler: (data: Events[K]) => void): void {
    if (!this.handlers.has(event)) {
      this.handlers.set(event, new Set());
    }
    this.handlers.get(event)!.add(handler);
  }

  emit<K extends keyof Events>(event: K, data: Events[K]): void {
    this.handlers.get(event)?.forEach(h => h(data));
  }
}

const emitter = new TypedEventEmitter<EventMap>();
emitter.on("userCreated", ({ id, email }) => console.log(id, email)); // типизировано
emitter.emit("userCreated", { id: "1", email: "a@b.com" }); // типизировано
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое `infer` в generics?** — ключевое слово в conditional types для захвата типа из структуры: `T extends Array<infer U> ? U : never`
- **Что такое `keyof` и `typeof`?** — `keyof T` — union всех ключей T; `typeof x` — тип значения x
- **Чем generic отличается от `any`?** — generic сохраняет связь между входным и выходным типом; `any` теряет всю информацию
- **Что такое conditional type?** — `T extends U ? X : Y` — выбор типа в зависимости от условия; distributin occurs over union

### Красные флаги (чего не говорить)

- «Generic — это как шаблоны в C++» — похожи концептуально, но TS generics структурные, не номинальные; нет специализации
- «Всегда нужно явно указывать `<T>` при вызове» — TypeScript умеет выводить тип из аргументов; явное указание нужно только при неоднозначности
- «`T extends any` — то же что без constraint» — `extends any` допускает всё, но `extends {}` исключает null/undefined

### Связанные темы

- `014-utilitarnye-tipy-utility-types.md`
- `008-raznica-type-i-interface.md`
- `010-raznica-obedinenie-i-peresechenie.md`
- `015-suzhenie-tipov-type-narrowing.md`
