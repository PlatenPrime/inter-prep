# Q031. Разница между функцией и методом?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Функция** — самостоятельная единица кода, вызываемая по имени, не привязанная к объекту. **Метод** — функция, являющаяся свойством объекта или класса, имеющая доступ к `this` (контексту вызова). В JavaScript любой метод технически — функция, разница лишь в контексте: есть ли объект-владелец и как привязан `this`.

---

## Развёрнутый ответ

### Суть и определение

```typescript
// Функция — существует сама по себе
function greet(name: string): string {
  return `Hello, ${name}`;
}

// Стрелочная функция
const square = (x: number): number => x ** 2;

// Метод — принадлежит объекту
const user = {
  name: 'Alice',
  greet(): string {           // метод: доступен как user.greet()
    return `Hello, ${this.name}`; // this = user при вызове через user.greet()
  }
};

// Метод класса
class Calculator {
  private value = 0;

  add(n: number): this {      // метод: принадлежит Calculator.prototype
    this.value += n;
    return this;
  }

  result(): number {
    return this.value;
  }
}
```

---

### Ключевое различие: `this`

```javascript
// Функция — this не определён (undefined в strict mode)
function showThis() {
  console.log(this);
}
showThis(); // undefined (strict) или window/global (sloppy)

// Метод — this = объект при вызове через точку
const obj = {
  value: 42,
  showThis() {
    console.log(this); // { value: 42, showThis: [Function] }
  }
};
obj.showThis(); // this = obj

// Та же функция — разное this в зависимости от вызова!
const fn = obj.showThis;
fn(); // this = undefined (strict) — потерян контекст
```

---

### Потеря контекста и её решения

```typescript
class Timer {
  private count = 0;

  start(): void {
    // ❌ Потеря контекста: callback вызывается не через Timer
    setInterval(function() {
      this.count++; // this = undefined (strict) или global
    }, 1000);

    // ✅ Стрелочная функция — нет собственного this, берёт из лексического окружения
    setInterval(() => {
      this.count++; // this = Timer (из замыкания)
    }, 1000);

    // ✅ Явная привязка через bind
    setInterval((function() {
      this.count++;
    }).bind(this), 1000);
  }
}
```

---

### Стрелочная функция vs обычная как метод

```typescript
class EventEmitter {
  private callbacks: Array<() => void> = [];

  addCallback(cb: () => void) { this.callbacks.push(cb); }
  run() { this.callbacks.forEach(cb => cb()); }
}

class Button {
  label = 'Click me';

  // ✅ Стрелочная функция-поле — this всегда привязан к экземпляру
  handleClick = (): void => {
    console.log(this.label); // всегда корректно
  };

  // ⚠️ Обычный метод — this зависит от способа вызова
  handleClickMethod(): void {
    console.log(this.label);
  }
}

const btn = new Button();
const emitter = new EventEmitter();

emitter.addCallback(btn.handleClick);       // ✅ работает (стрелка)
emitter.addCallback(btn.handleClickMethod); // ❌ this потерян

emitter.addCallback(btn.handleClickMethod.bind(btn)); // ✅ bind спасает
```

---

### Статические методы vs методы экземпляра

```typescript
class MathHelper {
  // Статический метод — принадлежит классу, не экземпляру
  static square(x: number): number { return x ** 2; }

  // Метод экземпляра — вызывается на объекте
  double(x: number): number { return x * 2; }
}

MathHelper.square(4);         // 16 — через класс
new MathHelper().double(4);   // 8 — через экземпляр
// MathHelper.double(4);      // ❌ TypeError
```

---

### Функции высшего порядка vs методы

```typescript
// Функция — передаётся как значение
const numbers = [1, 2, 3, 4, 5];

// double — функция-аргумент
const doubled = numbers.map(x => x * 2);

// Метод map принимает функцию — это функция высшего порядка
// Можно передать метод объекта (с осторожностью к this):
const multiplier = {
  factor: 3,
  multiply(x: number) { return x * this.factor; }
};

// ❌ Метод теряет this при передаче
numbers.map(multiplier.multiply);          // this.factor = undefined → NaN

// ✅ Привязка через bind или стрелку
numbers.map(x => multiplier.multiply(x)); // ✅
numbers.map(multiplier.multiply.bind(multiplier)); // ✅
```

---

### Методы-геттеры как специальные методы

```typescript
class Circle {
  constructor(private radius: number) {}

  // Геттер — метод, вызываемый как свойство (нет скобок)
  get area(): number {
    return Math.PI * this.radius ** 2;
  }

  // Обычный метод
  calcArea(): number {
    return Math.PI * this.radius ** 2;
  }
}

const c = new Circle(5);
c.area;        // 78.54 — геттер, без ()
c.calcArea();  // 78.54 — метод, с ()
```

### Практика и применение

- **Методы класса** — инкапсулированное поведение объекта
- **Стрелочные поля** (`handleClick = () => {}`) — React event handlers, всегда сохраняют контекст
- **Чистые функции** в ФП — не нужен `this`, нет контекста
- **`call`/`apply`/`bind`** — явная управление `this` при передаче методов

### Важные нюансы и краеугольные камни

- Стрелочная функция **не имеет** собственного `this`, `arguments`, `prototype` — не может быть конструктором
- Метод — это свойство объекта со значением `function`; никакой другой магии
- В TypeScript стрелочное поле (`handleClick = () => {}`) создаёт копию на **каждом экземпляре**, а метод в `prototype` — одну копию на всех

---

## Сравнение

| Критерий | Функция | Метод |
|----------|---------|-------|
| `this` | Нет / глобал / undefined | Объект-владелец (при вызове через точку) |
| Расположение | Самостоятельная | Свойство объекта/класса |
| Передача | Как значение | Теряет `this` без bind/стрелки |
| `prototype` | Есть (обычная), нет (стрелка) | Есть на классовом методе |
| Статический | Нет | Да (`static`) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое «потеря контекста» и как её избежать?** — При передаче метода как callback `this` не привязан к объекту. Решение: `bind`, стрелочная функция-поле, или оборачивание стрелкой `() => obj.method()`.
- **Чем стрелочная функция отличается от обычной по `this`?** — Стрелочная захватывает `this` из лексического окружения при определении; обычная — `this` определяется в момент вызова.
- **Можно ли вызвать метод без объекта?** — Да: `const fn = obj.method; fn()` — но `this` будет `undefined` (strict) или `global` (sloppy).

### Красные флаги (чего не говорить)

- «Метод и функция — одно и то же» — функция без `this`-контекста не является методом.
- «Стрелочная функция всегда лучше для методов» — стрелочные поля создают копию на каждом экземпляре (потребляют больше памяти), в прототипе они не живут.

### Связанные темы

- `015-mekhanizm-prototipov-v-js.md`
- `012-staticheskiy-metod-klassa-static.md`
- `016-chto-takoe-funktsionalnoe-programmirovanie.md`
