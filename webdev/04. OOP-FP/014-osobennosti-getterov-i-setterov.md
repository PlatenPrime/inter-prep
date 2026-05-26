# Q014. В чём заключаются особенности геттеров и сеттеров?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Геттер** (`get`) и **сеттер** (`set`) — специальные методы, которые вызываются при чтении или записи свойства объекта, выглядя как обычные свойства. Позволяют добавить логику (валидацию, вычисление, логирование) без изменения API объекта. В JavaScript реализуются через синтаксис `get`/`set` в литерале объекта или классе, либо через `Object.defineProperty`.

---

## Развёрнутый ответ

### Суть и определение

```typescript
class Temperature {
  private _celsius: number;

  constructor(celsius: number) {
    this._celsius = celsius;
  }

  // Геттер: обращение как к свойству, но вычисляется
  get fahrenheit(): number {
    return this._celsius * 9 / 5 + 32;
  }

  // Сеттер: присвоение как свойству, но с логикой
  set fahrenheit(f: number) {
    this._celsius = (f - 32) * 5 / 9;
  }

  get celsius(): number {
    return this._celsius;
  }

  set celsius(c: number) {
    if (c < -273.15) throw new RangeError('Below absolute zero');
    this._celsius = c;
  }
}

const t = new Temperature(100);
console.log(t.fahrenheit); // 212 — вызов геттера, выглядит как свойство
t.fahrenheit = 32;         // вызов сеттера
console.log(t.celsius);    // 0

t.celsius = -300;          // ❌ RangeError: Below absolute zero
```

---

### В литерале объекта

```javascript
const circle = {
  _radius: 5,

  get radius() {
    return this._radius;
  },

  set radius(r) {
    if (r < 0) throw new RangeError('Radius cannot be negative');
    this._radius = r;
  },

  // Вычисляемое свойство через геттер
  get area() {
    return Math.PI * this._radius ** 2;
  }
  // area — нет сеттера: только для чтения
};

circle.radius;      // 5
circle.area;        // 78.54
circle.radius = 10;
circle.area;        // 314.16

circle.area = 100;  // В strict — TypeError (нет сеттера)
```

---

### Через Object.defineProperty

```javascript
function createUser(name) {
  let _name = name;

  return Object.defineProperties({}, {
    name: {
      get() { return _name; },
      set(value) {
        if (typeof value !== 'string' || !value.trim()) {
          throw new TypeError('Name must be a non-empty string');
        }
        _name = value.trim();
      },
      enumerable: true,
      configurable: false
    },
    upperName: {
      get() { return _name.toUpperCase(); },
      enumerable: true,
      configurable: false
    }
  });
}

const user = createUser('alice');
user.name;           // 'alice'
user.upperName;      // 'ALICE'
user.name = ' Bob '; // валидация + trim
user.name;           // 'Bob'
```

---

### Геттер только для чтения

```typescript
class Circle {
  constructor(private readonly _radius: number) {}

  get radius(): number { return this._radius; }

  // Нет сеттера — попытка записи выбросит TypeError в strict mode
  get area(): number { return Math.PI * this._radius ** 2; }

  get circumference(): number { return 2 * Math.PI * this._radius; }
}

const c = new Circle(5);
c.radius;   // 5 — OK
c.area;     // 78.54 — OK
// c.radius = 10; // ❌ TypeError: Cannot set property radius of #<Circle>
```

---

### Ленивая инициализация через геттер

```typescript
class HeavyResource {
  private _data: string[] | null = null;

  // Данные загружаются только при первом обращении
  get data(): string[] {
    if (!this._data) {
      console.log('Loading...');
      this._data = this.expensiveLoad();
    }
    return this._data;
  }

  private expensiveLoad(): string[] {
    return ['item1', 'item2', 'item3'];
  }
}

const resource = new HeavyResource();
// 'Loading...' — только при обращении
resource.data; // первый раз: загрузка
resource.data; // второй раз: из кэша, 'Loading...' не вызывается
```

---

### Геттеры/сеттеры и реактивность (Vue 2 / Proxy)

```javascript
// Упрощённая модель Vue 2-реактивности
function makeReactive(obj, key, callback) {
  let value = obj[key];

  Object.defineProperty(obj, key, {
    get() {
      return value;
    },
    set(newValue) {
      if (value !== newValue) {
        value = newValue;
        callback(key, newValue); // триггер обновления
      }
    }
  });
}

const state = { count: 0 };
makeReactive(state, 'count', (key, val) => console.log(`${key} changed to ${val}`));

state.count = 5;  // 'count changed to 5'
state.count = 5;  // ничего — значение не изменилось
```

### Практика и применение

- **Валидация** при записи — сеттер как единственная точка контроля инвариантов
- **Вычисляемые свойства** — геттер вычисляет на лету, не хранит лишнее состояние
- **Ленивая загрузка** — геттер как кэш первого обращения
- **Реактивность** — Vue 2 строилась на `Object.defineProperty` с геттерами/сеттерами

### Важные нюансы и краеугольные камни

- Геттер **не должен иметь сайд-эффектов** — его вызывают предполагая чтение, не изменение
- Отсутствие сеттера при наличии геттера → **read-only** свойство (TypeError в strict при попытке записи)
- **Бесконечная рекурсия**: обращение к `this.name` внутри геттера `name` → бесконечный цикл; нужно хранить в `_name`
- **Геттеры не кэшируются по умолчанию** — вызываются при каждом обращении; для кэша нужна ленивая инициализация вручную
- В TypeScript `get` без `set` → свойство помечается как `readonly` для потребителей

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как геттер/сеттер связан с дескрипторами?** — Геттер/сеттер реализован через accessor descriptor с атрибутами `get`/`set`.
- **Чем сеттер лучше обычного метода `setX(value)`?** — API остаётся свойством (`obj.x = 5` vs `obj.setX(5)`), удобнее при деструктуризации, интеграции с фреймворками.
- **Как Vue 3 изменил подход по сравнению с Vue 2?** — Vue 3 использует `Proxy` вместо `Object.defineProperty`, что позволяет перехватывать добавление новых свойств и методы массивов.

### Красные флаги (чего не говорить)

- «Геттер — это просто функция» — технически да, но семантика важна: геттер не должен иметь сайд-эффектов.
- «Геттеры и сеттеры замедляют код» — микро-оптимизация; их стоимость пренебрежимо мала.

### Связанные темы

- `013-deskriptory-svoystv-obektov.md`
- `015-mekhanizm-prototipov-v-js.md`
- `001-osnovnye-printsipy-oop.md`
