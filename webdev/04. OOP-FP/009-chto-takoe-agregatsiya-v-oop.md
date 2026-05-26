# Q009. Что такое агрегация в ООП?

> **Источник:** [04. oop-fp.md](../04.%20oop-fp.md) · **Тема:** OOP & FP

---

## Короткий ответ

**Агрегация** — тип отношения «содержит» (has-a) между объектами, при котором один объект включает другой, но **не владеет** им: дочерний объект имеет независимый жизненный цикл и может существовать без родителя. Это слабая форма ассоциации — объекты связаны, но не жёстко зависят друг от друга.

---

## Развёрнутый ответ

### Суть и определение

В UML агрегация обозначается пустым ромбом (◇) на стороне «контейнера». Объект-контейнер (агрегат) содержит ссылку на объект-часть, но не контролирует его создание и уничтожение.

```
University ◇────── Department
   (агрегат)          (часть)

Department существует независимо — может быть в нескольких University,
или вообще без привязки к University.
```

---

### Реализация в JavaScript/TypeScript

```typescript
class Department {
  constructor(
    public readonly id: string,
    public name: string
  ) {}

  getInfo(): string {
    return `Department: ${this.name} (${this.id})`;
  }
}

class University {
  private departments: Department[] = [];

  constructor(public name: string) {}

  // Принимаем уже существующий Department — агрегация
  addDepartment(department: Department): void {
    this.departments.push(department);
  }

  removeDepartment(id: string): void {
    this.departments = this.departments.filter(d => d.id !== id);
    // Department не уничтожается, просто убирается из списка
  }

  getDepartments(): Department[] {
    return [...this.departments];
  }
}

// Department создаётся независимо от University
const engineering = new Department('eng-1', 'Engineering');
const science = new Department('sci-1', 'Science');

const mit = new University('MIT');
const harvard = new University('Harvard');

mit.addDepartment(engineering);
harvard.addDepartment(engineering); // один Department в двух University

mit.removeDepartment('eng-1');
// engineering всё ещё существует и доступен через harvard
console.log(engineering.getInfo()); // 'Department: Engineering (eng-1)'
```

---

### Отличие агрегации от ассоциации и композиции

```typescript
// --- Ассоциация: объекты «знают» друг о друге, нет владения ---
class Teacher {
  constructor(public name: string) {}
}

class Student {
  constructor(
    public name: string,
    public teacher: Teacher // просто ссылка, без владения
  ) {}
}

// --- Агрегация: «содержит», но не владеет ---
class Team {
  constructor(
    public name: string,
    private members: Employee[] // Employee живут независимо
  ) {}
}

// --- Композиция: создаёт и владеет ---
class Order {
  private lines: OrderLine[]; // OrderLine не существуют без Order

  constructor(items: { productId: string; qty: number }[]) {
    this.lines = items.map(i => new OrderLine(i.productId, i.qty));
  }
}
```

---

### Признаки агрегации в коде

1. Дочерний объект **передаётся через конструктор или метод**, а не создаётся внутри
2. Дочерний объект **существует до** создания родителя
3. Дочерний объект **может принадлежать** нескольким родителям одновременно
4. Удаление родителя **не удаляет** дочерний объект (нет `ON DELETE CASCADE`)

```typescript
// Классический признак — приём извне
class Playlist {
  private songs: Song[] = [];

  // Song передаётся снаружи — агрегация
  addSong(song: Song): void {
    this.songs.push(song);
  }
}

const song = new Song('Bohemian Rhapsody');
const playlist1 = new Playlist('Rock Classics');
const playlist2 = new Playlist('Queen Greatest Hits');

playlist1.addSong(song);
playlist2.addSong(song); // одна и та же песня в двух плейлистах
```

### Практика и применение

- **ORM**: `@ManyToMany`, `@ManyToOne` без `cascade: 'remove'` — агрегация в базе данных
- **Event Bus**: обработчики событий агрегируются в шине — удаление шины не удаляет обработчики
- **React Context**: провайдер содержит значение через агрегацию — значение создаётся снаружи

### Важные нюансы и краеугольные камни

- Агрегация в JS — **концептуальная**, не техническая: GC собирает объект, когда нет ссылок. Программист сам решает, хранить ли ссылку вне «родителя».
- **Shared mutable state через агрегацию** опасен: изменение объекта в одном контейнере отражается во всех остальных.
- В DDD термин «агрегат» (Aggregate) имеет **другой смысл** — это корень транзакционной границы, не тип отношения. Не путать.

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как агрегация выражается в реляционной БД?** — Внешний ключ без `ON DELETE CASCADE`: удаление Parent-записи не удаляет Child.
- **Что такое shared mutable state через агрегацию и чем он опасен?** — Один объект изменяется, все агрегаторы видят изменение; нужна иммутабельность или явное клонирование.
- **Как DDD Aggregate отличается от агрегации в UML?** — DDD Aggregate — паттерн транзакционной границы; агрегация UML — тип отношения. Разные уровни абстракции.

### Красные флаги (чего не говорить)

- «Агрегация — это просто коллекция объектов» — суть в независимом жизненном цикле, а не в структуре данных.
- Путать агрегацию (UML has-a с независимым ЖЦ) и Aggregate из DDD — это разные термины.

### Связанные темы

- `008-raznica-agregatsiya-i-kompozitsiya.md`
- `006-kompozitsiya-vs-nasledovanie.md`
- `001-osnovnye-printsipy-oop.md`
