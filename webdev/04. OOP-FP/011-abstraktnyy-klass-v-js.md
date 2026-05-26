# Q011. Можно ли в JavaScript реализовать абстрактный класс и как это сделать?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

В JavaScript нет встроенного ключевого слова `abstract` — это возможность **TypeScript**. В чистом JS абстрактный класс эмулируется через проверку `new.target` в конструкторе (запрет прямого инстанцирования) и броску ошибки в методах, которые обязаны быть переопределены. TypeScript предоставляет `abstract class` и `abstract method` с проверкой на этапе компиляции.

---

## Развёрнутый ответ

### Суть и определение

**Абстрактный класс** — класс, от которого нельзя создать экземпляр напрямую; он служит только базой для подклассов. Абстрактные методы объявляются без реализации и **обязаны** быть переопределены в подклассе.

---

### Вариант 1: TypeScript `abstract` (предпочтительно)

```typescript
abstract class Shape {
  // abstract-метод — нет реализации, подкласс обязан переопределить
  abstract area(): number;
  abstract perimeter(): number;

  // Обычный метод — есть реализация, наследуется как есть
  describe(): string {
    return `Shape with area=${this.area().toFixed(2)} and perimeter=${this.perimeter().toFixed(2)}`;
  }
}

class Circle extends Shape {
  constructor(private radius: number) { super(); }

  area(): number { return Math.PI * this.radius ** 2; }
  perimeter(): number { return 2 * Math.PI * this.radius; }
}

class Rectangle extends Shape {
  constructor(private w: number, private h: number) { super(); }

  area(): number { return this.w * this.h; }
  perimeter(): number { return 2 * (this.w + this.h); }
}

// new Shape(); // ❌ ошибка компилятора: Cannot create an instance of an abstract class
const c = new Circle(5);
console.log(c.describe()); // 'Shape with area=78.54 and perimeter=31.42'
```

TypeScript проверяет реализацию всех `abstract`-методов на этапе компиляции.

---

### Вариант 2: Чистый JS через `new.target`

```javascript
class Shape {
  constructor() {
    if (new.target === Shape) {
      throw new TypeError('Shape is abstract and cannot be instantiated directly');
    }
  }

  area() {
    throw new Error('Method area() must be implemented by subclass');
  }

  perimeter() {
    throw new Error('Method perimeter() must be implemented by subclass');
  }

  describe() {
    return `area=${this.area()}, perimeter=${this.perimeter()}`;
  }
}

class Circle extends Shape {
  constructor(radius) {
    super(); // new.target === Circle — проверка проходит
    this.radius = radius;
  }

  area() { return Math.PI * this.radius ** 2; }
  perimeter() { return 2 * Math.PI * this.radius; }
}

// new Shape(); // ❌ TypeError в рантайме
const c = new Circle(5); // ✅
```

**Минус:** ошибка возникает только в рантайме, не на этапе разработки.

---

### Вариант 3: Через Symbol + проверку в методах (строже)

```javascript
const ABSTRACT = Symbol('abstract');

class Animal {
  constructor() {
    if (new.target === Animal) {
      throw new TypeError('Animal is abstract');
    }

    // Проверяем, что все «обязательные» методы переопределены
    const required = ['speak', 'move'];
    for (const method of required) {
      if (this[method] === Animal.prototype[method]) {
        throw new TypeError(`${new.target.name} must implement ${method}()`);
      }
    }
  }

  speak() { throw new Error(ABSTRACT); }
  move() { throw new Error(ABSTRACT); }
}

class Dog extends Animal {
  speak() { return 'Woof!'; }
  move() { return 'Running'; }
}

// class Cat extends Animal {}
// new Cat(); // ❌ TypeError: Cat must implement speak()
```

---

### Абстрактный класс через интерфейс (TypeScript best practice)

```typescript
// Часто лучше разделить: интерфейс для контракта + абстрактный класс для shared-логики
interface Drawable {
  draw(ctx: CanvasRenderingContext2D): void;
}

abstract class BaseDrawable implements Drawable {
  protected color = '#000';

  abstract draw(ctx: CanvasRenderingContext2D): void;

  // Общая утилита для всех наследников
  setColor(color: string): this {
    this.color = color;
    return this;
  }
}

class Circle extends BaseDrawable {
  constructor(private x: number, private y: number, private r: number) {
    super();
  }

  draw(ctx: CanvasRenderingContext2D): void {
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    ctx.fillStyle = this.color;
    ctx.fill();
  }
}
```

### Практика и применение

- **Template Method Pattern** — идеальный случай для abstract class: базовый класс задаёт алгоритм, абстрактные методы — шаги
- **Base Controller / Base Service** в NestJS/Angular — наследуют общую логику из абстрактного класса
- **React class components** — `React.Component` де-факто абстрактный (требует `render()`)

### Важные нюансы и краеугольные камни

- В TypeScript `abstract class` **может** иметь конструктор и реализованные методы — это не интерфейс
- Отличие от интерфейса: абстрактный класс **может содержать состояние и реализацию**; интерфейс — только контракт
- `new.target` доступен только внутри `class`-конструктора и обычных функций-конструкторов (не в стрелочных функциях)
- В рантайме TypeScript-абстрактные классы — обычные JS-классы; проверок нет

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем abstract class отличается от interface в TypeScript?** — Абстрактный класс может иметь поля, конструктор, реализованные методы; интерфейс — только форма. Класс может `extends` только один abstract class, но `implements` много интерфейсов.
- **Когда использовать abstract class vs interface?** — Интерфейс: только контракт, несколько реализаций. Abstract class: есть общий код/состояние для наследников.
- **Что такое `new.target`?** — Ссылка на конструктор/класс, вызванный с `new`. В базовом классе — имя самого вызванного подкласса.

### Красные флаги (чего не говорить)

- «В JavaScript нельзя создать абстрактный класс» — можно эмулировать через `new.target` и броски ошибок.
- Путать абстрактный класс с интерфейсом — у abstract class может быть реализация.

### Связанные темы

- `010-tipy-polimorfizma.md`
- `005-klassovoe-vs-prototipnoe-nasledovanie.md`
- `015-mekhanizm-prototipov-v-js.md`
- `003-printsipy-s-nasledovaniem.md`
