# Q002. Что такое `MVVM`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**MVVM (Model-View-ViewModel)** — архитектурный паттерн, в котором **ViewModel** служит «посредником»: преобразует данные **Model** в формат, удобный для **View**, и обрабатывает UI-логику. Ключевое отличие от MVC — **ViewModel не знает о View**; связь устанавливается через **двустороннюю привязку данных (data binding)** или реактивные потоки. Популярен в Angular (services + components), WPF/.NET, SwiftUI, Jetpack Compose, Vue.

---

## Развёрнутый ответ

### Суть и определение

MVVM предложил Джон Госсман (Microsoft, 2005) для WPF, взяв идею Presentation Model от Мартина Фаулера. Главная проблема, которую решает паттерн: View и Model не должны знать друг о друге; ViewModel — адаптер между ними.

- **Model** — данные и бизнес-правила (то же, что в MVC).
- **View** — декларативный UI (XAML, HTML-шаблон, JSX). Наблюдает за ViewModel через binding.
- **ViewModel** — состояние View (observables), команды (actions), трансформация данных. Тестируется без UI.

### Как это работает

```
Model ←→ ViewModel ←→ View
              ↑            ↓
          (Observables)  (Data Binding / Reactions)
```

1. View подписывается на свойства ViewModel (или ViewModel реактивно привязан к View).
2. Пользователь вводит данные → View вызывает команду/метод ViewModel.
3. ViewModel вызывает Model (API, БД).
4. Model возвращает данные → ViewModel обновляет observable-свойство → View автоматически перерисовывается.

### Практика и применение

```typescript
// Model — сервис данных
class UserService {
  async getUser(id: string): Promise<User> {
    const res = await fetch(`/api/users/${id}`);
    return res.json();
  }
  async updateEmail(id: string, email: string): Promise<User> {
    const res = await fetch(`/api/users/${id}`, {
      method: 'PATCH',
      body: JSON.stringify({ email }),
    });
    return res.json();
  }
}

// ViewModel — состояние + команды + трансформация
class UserViewModel {
  // MobX/Signals/observable-подход
  user: User | null = null;
  isLoading = false;
  error: string | null = null;

  // Вычисляемые свойства для View — не надо логику в шаблон
  get displayName(): string {
    return this.user ? `${this.user.firstName} ${this.user.lastName}` : '—';
  }

  constructor(private readonly service: UserService) {}

  async load(id: string): Promise<void> {
    this.isLoading = true;
    this.error = null;
    try {
      this.user = await this.service.getUser(id);
    } catch {
      this.error = 'Не удалось загрузить пользователя';
    } finally {
      this.isLoading = false;
    }
  }

  async updateEmail(email: string): Promise<void> {
    if (!this.user) return;
    this.user = await this.service.updateEmail(this.user.id, email);
  }
}

// View — только рендеринг, подписка на VM (React + MobX example)
const UserProfile: React.FC<{ vm: UserViewModel }> = observer(({ vm }) => {
  if (vm.isLoading) return <Spinner />;
  if (vm.error) return <ErrorMessage text={vm.error} />;
  return (
    <div>
      <h1>{vm.displayName}</h1>
      <button onClick={() => vm.updateEmail('new@email.com')}>Обновить</button>
    </div>
  );
});
```

### Важные нюансы и краеугольные камни

- **Testability** — ViewModel тестируется как обычный класс, без DOM/рендеринга. Это главное преимущество над MVC.
- **Data Binding overhead** — двусторонняя привязка удобна, но при злоупотреблении усложняет дебаггинг («откуда обновилось состояние?»).
- **Angular** реализует MVVM нативно: компонент — ViewModel, шаблон — View, сервисы — Model.
- **React** не MVVM «из коробки», но паттерн реализуется через хуки (`useUserViewModel`) или MobX stores.

---

## Сравнение с MVC

| Аспект | MVC | MVVM |
|--------|-----|------|
| Знает ли Controller/ViewModel о View? | Controller знает | ViewModel НЕ знает |
| Связь View ↔ Controller/ViewModel | Явные вызовы | Data Binding / Observables |
| Тестируемость UI-логики | Средняя | Высокая (VM = POJO) |
| Двустороннее обновление | Ручное | Автоматическое |
| Применение | Серверный рендеринг, REST | SPA, мобильные (WPF, SwiftUI) |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как MVVM решает проблему тестируемости?** — ViewModel — чистый JS/TS-класс без зависимости на DOM; тест создаёт VM, вызывает методы, проверяет состояние.
- **Чем отличается от MVP?** — в MVP Presenter знает о View (через интерфейс); в MVVM ViewModel не знает, связь через binding.
- **Когда MVVM избыточен?** — простые CRUD-формы, небольшие компоненты; не нужно выделять ViewModel ради паттерна.
- **Как Angular реализует MVVM?** — компонент (`@Component`) с полями и методами = ViewModel; `template` = View; `service` = Model.

### Красные флаги (чего не говорить)

- «MVVM — это то же самое, что MVC» — ключевое отличие в направлении зависимости и data binding.
- «ViewModel может напрямую вызывать DOM» — это разрушает паттерн и убивает testability.
- «MVVM только для Angular» — используется в WPF, SwiftUI, Jetpack Compose, Vue Composition API.

### Связанные темы

- `001-chto-takoe-mvc.md`, `003-chto-takoe-mvp.md`
- `004-nedostatki-mvw.md`, `008-odnonapravlennyy-potok-vs-dvustoronnyaya-svyaz.md`
