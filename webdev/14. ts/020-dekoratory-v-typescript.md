# Q020. Что такое декораторы в TypeScript?

> **Источник:** [14. ts.md](../14.%20ts.md) · **Тема:** TypeScript

---

## Короткий ответ

**Декораторы** — специальный синтаксис `@expression` для метапрограммирования: они позволяют добавлять поведение или метаданные к классам, методам, свойствам и параметрам без изменения их кода. В TypeScript есть два стандарта: **legacy decorators** (Stage 2 proposal, `experimentalDecorators: true`) и **стандартные декораторы** (TC39 Stage 3, поддерживаются с TS 5.0).

---

## Развёрнутый ответ

### Суть и определение

Декоратор — это функция, вызываемая во время **объявления класса** (не инстанциирования). Он получает информацию о целевом объекте (класс, метод, свойство) и может:
- Добавить или изменить поведение
- Зарегистрировать метаданные (для DI-контейнеров, ORM, валидации)
- Заменить реализацию

### Как это работает

#### Виды декораторов (Legacy — `experimentalDecorators`)

```typescript
// tsconfig.json:
// "experimentalDecorators": true,
// "emitDecoratorMetadata": true  // для Reflect.metadata

// 1. Декоратор класса
function Injectable(target: Function) {
  // target — сам класс (конструктор)
  Reflect.defineMetadata("injectable", true, target);
}

@Injectable
class UserService {
  constructor(private userRepo: UserRepository) {}
}

// 2. Декоратор метода
function Log(target: any, propertyKey: string, descriptor: PropertyDescriptor) {
  const original = descriptor.value;
  descriptor.value = function (...args: any[]) {
    console.log(`[${propertyKey}] called with`, args);
    const result = original.apply(this, args);
    console.log(`[${propertyKey}] returned`, result);
    return result;
  };
  return descriptor;
}

class Calculator {
  @Log
  add(a: number, b: number): number {
    return a + b;
  }
}

// 3. Декоратор свойства
function Validate(min: number, max: number) {
  return function (target: any, propertyKey: string) {
    let value: number;
    Object.defineProperty(target, propertyKey, {
      get: () => value,
      set: (v: number) => {
        if (v < min || v > max) throw new RangeError(`${propertyKey} must be ${min}–${max}`);
        value = v;
      },
    });
  };
}

class Product {
  @Validate(0, 1000)
  price: number = 0;
}

// 4. Декоратор параметра
function Param(target: any, methodName: string, paramIndex: number) {
  console.log(`Parameter ${paramIndex} of ${methodName}`);
}

class Service {
  findUser(@Param id: string) {
    return { id };
  }
}
```

#### Фабрики декораторов (Decorator Factories)

```typescript
// Декоратор с параметрами — фабрика возвращает декоратор
function Role(...roles: string[]) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    descriptor.value = function (...args: any[]) {
      const user = getCurrentUser();
      if (!roles.some(r => user.roles.includes(r))) {
        throw new Error("Forbidden");
      }
      return original.apply(this, args);
    };
    return descriptor;
  };
}

class AdminController {
  @Role("admin", "superadmin")
  deleteUser(userId: string): void {
    // ...
  }
}
```

#### Стандартные декораторы (TC39 Stage 3, TS 5.0+)

```typescript
// Новый API — не требует experimentalDecorators
function logged<This, Args extends any[], Return>(
  target: (this: This, ...args: Args) => Return,
  context: ClassMethodDecoratorContext
) {
  return function (this: This, ...args: Args): Return {
    console.log(`Calling ${String(context.name)} with`, args);
    return target.call(this, ...args);
  };
}

class UserService {
  @logged
  async getUser(id: string): Promise<User> {
    return fetch(`/api/users/${id}`).then(r => r.json());
  }
}
```

### Практика и применение

Декораторы — основа популярных фреймворков:

```typescript
// NestJS — полностью на декораторах
@Controller("/users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get(":id")
  @UseGuards(AuthGuard)
  async findOne(@Param("id") id: string): Promise<User> {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(201)
  async create(@Body() createUserDto: CreateUserDto): Promise<User> {
    return this.usersService.create(createUserDto);
  }
}

// TypeORM — ORM на декораторах
@Entity("users")
export class User {
  @PrimaryGeneratedColumn("uuid")
  id: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;
}

// class-validator — валидация
class CreateUserDto {
  @IsString()
  @MinLength(2)
  name: string;

  @IsEmail()
  email: string;

  @IsInt()
  @Min(18)
  age: number;
}
```

### Важные нюансы и краеугольные камни

- **Legacy vs Standard**: NestJS/TypeORM используют legacy (`experimentalDecorators`); стандартные — будущее, но пока не совместимы со старыми фреймворками
- **`emitDecoratorMetadata: true`** — нужен для DI-контейнеров, которые используют `Reflect.metadata` для анализа типов параметров конструктора
- **Порядок применения**: декораторы применяются снизу вверх (от ближнего к методу — к дальнему); фабрики — сверху вниз
- **`reflect-metadata`** — polyfill для `Reflect.metadata`; нужен при `emitDecoratorMetadata`
- Декораторы **не поддерживают `isolatedModules: true`** в legacy форме — несовместимость с esbuild/Vite
- Декораторы свойств в legacy API не получают начальное значение поля

### Примеры

```typescript
// Практичный декоратор: memoization
function Memoize() {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const original = descriptor.value;
    const cache = new Map<string, any>();

    descriptor.value = function (...args: any[]) {
      const cacheKey = JSON.stringify(args);
      if (cache.has(cacheKey)) return cache.get(cacheKey);
      const result = original.apply(this, args);
      cache.set(cacheKey, result);
      return result;
    };

    return descriptor;
  };
}

class MathService {
  @Memoize()
  fibonacci(n: number): number {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда декоратор применяется — при создании экземпляра или при объявлении класса?** — при объявлении класса (один раз при загрузке модуля)
- **В каком порядке применяются несколько декораторов?** — снизу вверх; но фабрики вызываются сверху вниз
- **Что такое `emitDecoratorMetadata`?** — флаг, заставляющий TS эмитить тип-метаданные в рантайм; используется DI-контейнерами через `reflect-metadata`
- **Чем legacy декораторы отличаются от стандартных (TC39)?** — другой API; стандартные не требуют `experimentalDecorators`; не поддерживаются старыми фреймворками

### Красные флаги (чего не говорить)

- «Декораторы — это только для Angular/NestJS» — универсальный механизм; применим для логирования, кэширования, валидации в любом коде
- «Декоратор вызывается при `new MyClass()`» — нет, при объявлении класса; один раз
- «Декораторы работают в браузере без трансформации» — нет, нужен компилятор (TS или Babel); browsers не поддерживают нативно пока

### Связанные темы

- `018-elementy-oop-v-typescript.md`
- `019-modifikatory-dostupa.md`
- `006-typescript-v-servernoj-razrabotke.md`
