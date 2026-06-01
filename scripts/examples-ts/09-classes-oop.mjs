/** @typedef {import('./file-template.mjs').Task} Task */

/** @type {Task[]} */
export const tasks = [
  {
    num: 81,
    slug: 'class-typing',
    folder: '09-classes-oop',
    title: 'Типизация классов',
    tags: ['classes', 'oop'],
    difficulty: 'easy',
    theory:
      'Класс задаёт и тип экземпляра, и тип конструктора. Поля в теле класса автоматически попадают в instance type. implements/interface описывает контракт без runtime.',
    interview:
      'Class vs interface для формы объекта. public fields в constructor vs property declarations. strictPropertyInitialization.',
    related: 'structural typing, interfaces.',
    demo: `export class Counter {
  private value = 0;

  increment(by = 1): number {
    this.value += by;
    return this.value;
  }

  read(): number {
    return this.value;
  }
}

export type CounterInstance = Counter;`,
    test: `const c = new Counter();
assert(c.read() === 0);
assert(c.increment(3) === 3);`,
  },
  {
    num: 82,
    slug: 'access-modifiers',
    folder: '09-classes-oop',
    title: 'Модификаторы доступа',
    tags: ['classes', 'access'],
    difficulty: 'easy',
    theory:
      'public (по умолчанию), protected (подклассы), private (только класс). На уровне типов private не изолирует в runtime — только # private fields настоящие. # с ES2022.',
    interview:
      'private vs #private. protected в React class components (legacy). Можно ли обойти private в TS? Да, через bracket access на скомпилированном JS.',
    related: 'private fields (#), encapsulation.',
    demo: `export class BankAccount {
  public readonly id: string;
  private balance: number;

  constructor(id: string, initial = 0) {
    this.id = id;
    this.balance = initial;
  }

  deposit(amount: number): number {
    if (amount <= 0) throw new Error('positive only');
    this.balance += amount;
    return this.balance;
  }

  getBalance(): number {
    return this.balance;
  }
}`,
    test: `const acc = new BankAccount('a1', 10);
assert(acc.deposit(5) === 15);
assert(acc.getBalance() === 15);
assert(acc.id === 'a1');`,
  },
  {
    num: 83,
    slug: 'abstract-class',
    folder: '09-classes-oop',
    title: 'Abstract class',
    tags: ['classes', 'abstract'],
    difficulty: 'medium',
    theory:
      'abstract class нельзя инстанцировать напрямую; abstract method без тела — подкласс обязан реализовать. Смесь контракта и общей реализации. Отличие от interface: есть runtime и поля.',
    interview:
      'Abstract class vs interface — когда что? Множественное наследование только interfaces. abstract в TypeScript vs Java.',
    related: 'implements, override, polymorphism.',
    demo: `export abstract class Shape {
  abstract area(): number;

  describe(): string {
    return 'area=' + this.area();
  }
}

export class Circle extends Shape {
  constructor(private readonly radius: number) {
    super();
  }

  area(): number {
    return Math.PI * this.radius ** 2;
  }
}`,
    test: `const c = new Circle(1);
assert(c.area() > 3 && c.area() < 3.2);
assert(c.describe().startsWith('area='));`,
  },
  {
    num: 84,
    slug: 'implements',
    folder: '09-classes-oop',
    title: 'implements interface',
    tags: ['classes', 'interface'],
    difficulty: 'easy',
    theory:
      'class Foo implements Bar — класс обязан иметь все члены Bar (структурно). Несколько interfaces через запятую. implements не наследует реализацию, только проверку формы.',
    interview:
      'implements vs extends. Можно implements без class? type assertion. Дублирование сигнатур class и interface — DRY через Pick.',
    related: 'structural typing, declaration merging.',
    demo: `export interface Serializable {
  serialize(): string;
}

export interface Timestamped {
  readonly createdAt: number;
}

export class EventLog implements Serializable, Timestamped {
  readonly createdAt = Date.now();

  constructor(private readonly events: string[] = []) {}

  push(event: string): void {
    this.events.push(event);
  }

  serialize(): string {
    return JSON.stringify({ createdAt: this.createdAt, events: this.events });
  }
}`,
    test: `const log = new EventLog();
log.push('start');
const json = log.serialize();
assert(json.includes('start') && json.includes('createdAt'));`,
  },
  {
    num: 85,
    slug: 'override',
    folder: '09-classes-oop',
    title: 'override модификатор',
    tags: ['classes', 'override'],
    difficulty: 'medium',
    theory:
      'Ключевое слово override на методе подкласса: компилятор проверит, что в базовом классе есть такой метод. noImplicitOverride в tsconfig — все переопределения явно помечать.',
    interview:
      'Зачем override если JS и так перезаписывает? Ловит опечатки в имени метода. override vs overload — разные вещи.',
    related: 'abstract methods, inheritance chain.',
    demo: `export class Animal {
  speak(): string {
    return '...';
  }
}

export class Dog extends Animal {
  override speak(): string {
    return 'woof';
  }
}

export function speakTwice(animal: Animal): string[] {
  return [animal.speak(), animal.speak()];
}`,
    test: `const d = new Dog();
assert(d.speak() === 'woof');
assert(speakTwice(d).every((s) => s === 'woof'));`,
  },
  {
    num: 86,
    slug: 'static-members',
    folder: '09-classes-oop',
    title: 'Статические члены',
    tags: ['classes', 'static'],
    difficulty: 'easy',
    theory:
      'static принадлежит конструктору, не экземпляру. typeof Class для типа конструктора. Статические блоки (static {}) — инициализация при загрузке класса.',
    interview:
      'Static vs singleton. Как типизировать static side? interface с constructor signature + static members.',
    related: 'InstanceType, factory patterns.',
    demo: `export class IdGenerator {
  private static next = 1;

  static create(prefix = 'id'): string {
    const id = IdGenerator.next++;
    return \`\${prefix}-\${id}\`;
  }

  static reset(): void {
    IdGenerator.next = 1;
  }
}`,
    test: `IdGenerator.reset();
assert(IdGenerator.create('u') === 'u-1');
assert(IdGenerator.create('u') === 'u-2');`,
  },
  {
    num: 87,
    slug: 'private-fields',
    folder: '09-classes-oop',
    title: 'Private fields (#)',
    tags: ['classes', 'private'],
    difficulty: 'medium',
    theory:
      'Синтаксис #field — настоящая приватность в runtime (WeakMap под капотом в старых движках). TypeScript private — только compile-time. # нельзя обратиться снаружи даже в JS.',
    interview:
      'private keyword vs #. Доступ из subclass к # — нет, только protected для наследования логики через методы.',
    related: 'access modifiers, encapsulation.',
    demo: `export class SecretHolder {
  #secret: string;

  constructor(secret: string) {
    this.#secret = secret;
  }

  reveal(code: string): string | null {
    return code === 'ok' ? this.#secret : null;
  }

  rotate(next: string, code: string): boolean {
    if (code !== 'ok') return false;
    this.#secret = next;
    return true;
  }
}`,
    test: `const h = new SecretHolder('pwd');
assert(h.reveal('ok') === 'pwd');
assert(h.reveal('bad') === null);
assert(h.rotate('new', 'ok') === true);
assert(h.reveal('ok') === 'new');`,
  },
  {
    num: 88,
    slug: 'getters-setters',
    folder: '09-classes-oop',
    title: 'Геттеры и сеттеры',
    tags: ['classes', 'accessors'],
    difficulty: 'easy',
    theory:
      'get/set в классе — accessor properties. В типе видны как обычные поля. Можно readonly через get без set. Сеттер может валидировать и нормализовать.',
    interview:
      'Accessor vs метод getX(). Когда setter бросает — тип не отражает. Object.defineProperty совместимость.',
    related: 'readonly, parameter properties.',
    demo: `export class Temperature {
  private _c = 0;

  get celsius(): number {
    return this._c;
  }

  set celsius(value: number) {
    if (value < -273.15) throw new Error('below absolute zero');
    this._c = value;
  }

  get fahrenheit(): number {
    return this._c * 1.8 + 32;
  }
}`,
    test: `const t = new Temperature();
t.celsius = 100;
assert(Math.round(t.fahrenheit) === 212);
let err = false;
try { t.celsius = -300; } catch { err = true; }
assert(err);`,
  },
  {
    num: 89,
    slug: 'parameter-properties',
    folder: '09-classes-oop',
    title: 'Parameter properties',
    tags: ['classes', 'constructor'],
    difficulty: 'easy',
    theory:
      'Префикс public/private/protected/readonly на параметре конструктора создаёт поле автоматически: constructor(public name: string) {}. Сокращает boilerplate.',
    interview:
      'Где хранятся поля после emit? this.name = name в constructor. readonly parameter property — assignable только в constructor.',
    related: 'access modifiers, DI in Angular/Nest patterns.',
    demo: `export class User {
  constructor(
    public readonly id: string,
    public name: string,
    private role: 'admin' | 'user' = 'user',
  ) {}

  isAdmin(): boolean {
    return this.role === 'admin';
  }

  rename(name: string): void {
    this.name = name;
  }
}`,
    test: `const u = new User('1', 'Ann', 'admin');
assert(u.isAdmin() === true);
u.rename('Anna');
assert(u.name === 'Anna');`,
  },
  {
    num: 90,
    slug: 'mixin-pattern',
    folder: '09-classes-oop',
    title: 'Mixin pattern',
    tags: ['classes', 'mixin'],
    difficulty: 'hard',
    theory:
      'TS не поддерживает множественное наследование классов. Mixin — функция, принимающая Base и возвращающая class extends Base с доп. поведением. Типизация через intersection конструкторов.',
    interview:
      'Mixin vs composition (объект с делегированием). Как типизировать applyMixins? Generic constructor constraints.',
    related: 'intersection types, composition.',
    demo: `type Constructor<T = object> = new (...args: never[]) => T;

export function Timestamped<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    readonly mixedAt = Date.now();
  };
}

export function Loggable<TBase extends Constructor>(Base: TBase) {
  return class extends Base {
    log(msg: string): void {
      console.log('[log]', msg);
    }
  };
}

class BaseEntity {
  constructor(public id: string) {}
}

export const Entity = Timestamped(Loggable(BaseEntity));

export function createEntity(id: string) {
  return new Entity(id);
}`,
    test: `const e = createEntity('e1');
assert(e.id === 'e1');
assert(typeof e.mixedAt === 'number');
assert(typeof e.log === 'function');`,
  },
];
