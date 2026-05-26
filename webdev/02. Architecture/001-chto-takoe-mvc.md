# Q001. Что такое `MVC`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**MVC (Model-View-Controller)** — архитектурный паттерн, разделяющий приложение на три слоя: **Model** (данные и бизнес-логика), **View** (отображение, UI) и **Controller** (обработка пользовательского ввода, оркестрация). Цель — разделение ответственностей (Separation of Concerns), облегчение тестирования и поддержки кода. Пользователь взаимодействует с Controller → Controller обновляет Model → Model нотифицирует View → View отображает новое состояние.

---

## Развёрнутый ответ

### Суть и определение

MVC появился в Smalltalk-80 (Xerox PARC, 1979) и стал одним из самых влиятельных паттернов в истории ПО. Ключевая идея — ни один слой не знает деталей реализации другого:

- **Model** — независимая бизнес-логика: сущности, валидация, работа с БД/API, вычисления. Не знает о View.
- **View** — чистое отображение данных из Model. Не содержит логики, только рендеринг.
- **Controller** — «дирижёр»: принимает ввод (клик, форма, HTTP-запрос), вызывает методы Model, решает какой View показать.

### Как это работает

```
User Input → Controller → Model (изменение состояния)
                               ↓
                            View ← Model (данные для рендера)
                               ↓
                         User (видит результат)
```

В классическом серверном MVC (Rails, Django, Laravel, Spring MVC):

1. HTTP-запрос `GET /users/42` → **Router** → `UsersController#show`
2. Controller вызывает `User.find(42)` → **Model** делает SQL-запрос
3. Controller рендерит `views/users/show.html` с данными — **View**
4. HTML-ответ отправляется клиенту

### Практика и применение

```typescript
// Model — бизнес-логика, независима от UI
class UserModel {
  async findById(id: string): Promise<User> {
    return db.users.findUnique({ where: { id } });
  }

  async update(id: string, data: Partial<User>): Promise<User> {
    if (!data.email?.includes('@')) throw new ValidationError('Invalid email');
    return db.users.update({ where: { id }, data });
  }
}

// Controller — обработка запроса, оркестрация
class UserController {
  constructor(private readonly userModel: UserModel) {}

  async show(req: Request, res: Response): Promise<void> {
    const user = await this.userModel.findById(req.params.id);
    if (!user) { res.status(404).json({ error: 'Not found' }); return; }
    res.json(UserView.serialize(user)); // View-layer serialization
  }
}

// View — сериализация/шаблон (в REST это DTO/serializer)
class UserView {
  static serialize(user: User) {
    return { id: user.id, name: user.name, email: user.email };
    // намеренно скрываем passwordHash, createdAt и пр.
  }
}
```

### Важные нюансы и краеугольные камни

- **Thick vs Thin Controller** — Controller должен быть тонким. «Толстый» Controller — антипаттерн: логика уходит в Model или Service-слой.
- **В SPA-фреймворках** (React, Vue) классического Controller нет: его роль берут обработчики событий + state management.
- **Two-way data binding** (Angular) размывает границы MVC — View и Model начинают напрямую «слышать» друг друга. Это уже ближе к MVVM.
- **Passive View vs Supervising Controller** — два варианта MVP, выросших из MVC.

---

## Сравнение слоёв

| Слой | Ответственность | Что не должно быть |
|------|----------------|-------------------|
| Model | Данные, бизнес-правила, работа с хранилищем | UI-логика, HTTP-зависимости |
| View | Рендеринг UI на основе данных из Model | Бизнес-логика, прямые вызовы БД |
| Controller | Обработка ввода, вызов Model, выбор View | Сложная бизнес-логика, SQL-запросы |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем MVC отличается от MVP и MVVM?** — в MVP View пассивен, Presenter знает о View через интерфейс; в MVVM — ViewModel не знает о View, связь через привязки.
- **Где в React MVC?** — React ближе к V (View) из MVC; Redux/Zustand — к Model; компоненты-контейнеры заменяют Controller.
- **Почему Controller должен быть тонким?** — Fat Controller нарушает SRP, усложняет тестирование; логика должна жить в Model/Service.
- **Как тестировать MVC?** — Model изолированно (unit), Controller с mock-Model, View через снапшоты/e2e.

### Красные флаги (чего не говорить)

- «MVC — это только для бэкенда» — применяется в iOS (UIKit), Android, desktop-приложениях.
- «View напрямую работает с БД» — это нарушение всей сути паттерна.
- Путать MVC и MTV (Django) — в Django Template = View, View = Controller, по сути тот же MVC, просто переименован.

### Связанные темы

- `002-chto-takoe-mvvm.md`, `003-chto-takoe-mvp.md`
- `004-nedostatki-mvw.md`, `008-odnonapravlennyy-potok-vs-dvustoronnyaya-svyaz.md`
