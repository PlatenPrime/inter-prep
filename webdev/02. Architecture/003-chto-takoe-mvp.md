# Q003. Что такое `MVP`?

> **Источник:** [02. architecture.md](../02.%20architecture.md) · **Тема:** Architecture

---

## Короткий ответ

**MVP (Model-View-Presenter)** — архитектурный паттерн, производный от MVC, в котором **View полностью пассивен** (не содержит никакой логики), а **Presenter** берёт на себя всю ответственность за UI-логику и является посредником между Model и View. View общается с Presenter через **интерфейс**, что даёт высокую тестируемость — Presenter тестируется с mock-View без реального UI.

---

## Развёрнутый ответ

### Суть и определение

MVP появился в Taligent (1990-е), популяризован в Android-разработке и WinForms. Ключевые отличия от MVC:

- **View** — «тупой» (Passive View): только отображает данные, делегирует все действия в Presenter.
- **Presenter** — знает о View через интерфейс (`IView`), управляет им напрямую (в отличие от MVVM, где ViewModel не знает о View).
- **Model** — данные и бизнес-логика, не знает о Presenter/View.

Есть два варианта MVP:
1. **Passive View** — View полностью тупой, Presenter управляет каждым элементом UI.
2. **Supervising Controller** — View способен делать простые привязки данных, Presenter вмешивается только для сложной логики.

### Как это работает

```
User → View → Presenter → Model
              ↑     |
         (Interface) ↓ (обновляет View напрямую)
              View ←────┘
```

1. Пользователь кликает кнопку во View.
2. View вызывает метод Presenter через интерфейс (`presenter.onLoginClicked()`).
3. Presenter вызывает Model (сервис авторизации).
4. Model возвращает результат Presenter.
5. Presenter вызывает метод на View (`view.showDashboard()` или `view.showError(...)`).

### Практика и применение

```typescript
// View Interface — контракт между Presenter и View
interface ILoginView {
  showLoading(isLoading: boolean): void;
  showError(message: string): void;
  navigateToDashboard(): void;
  getEmail(): string;
  getPassword(): string;
}

// Model — бизнес-логика
class AuthService {
  async login(email: string, password: string): Promise<{ token: string }> {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    if (!res.ok) throw new Error('Invalid credentials');
    return res.json();
  }
}

// Presenter — вся UI-логика, тестируется с mock ILoginView
class LoginPresenter {
  constructor(
    private readonly view: ILoginView,
    private readonly auth: AuthService,
  ) {}

  async onLoginClicked(): Promise<void> {
    const email = this.view.getEmail();
    const password = this.view.getPassword();

    if (!email || !password) {
      this.view.showError('Заполните все поля');
      return;
    }

    this.view.showLoading(true);
    try {
      await this.auth.login(email, password);
      this.view.navigateToDashboard();
    } catch (err) {
      this.view.showError('Неверный email или пароль');
    } finally {
      this.view.showLoading(false);
    }
  }
}

// View — React-компонент реализует интерфейс (Passive View)
const LoginPage: React.FC = () => {
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [isLoading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const view: ILoginView = {
    showLoading: setLoading,
    showError: setError,
    navigateToDashboard: () => navigate('/dashboard'),
    getEmail: () => emailRef.current?.value ?? '',
    getPassword: () => passwordRef.current?.value ?? '',
  };

  const presenter = useMemo(() => new LoginPresenter(view, new AuthService()), []);

  return (
    <form onSubmit={(e) => { e.preventDefault(); presenter.onLoginClicked(); }}>
      <input ref={emailRef} type="email" />
      <input ref={passwordRef} type="password" />
      {error && <p>{error}</p>}
      <button disabled={isLoading}>Войти</button>
    </form>
  );
};
```

### Важные нюансы и краеугольные камни

- **Testability** — главное преимущество MVP. Presenter полностью тестируется с mock-объектом `ILoginView` без браузера.
- **Boilerplate** — MVP многословен: нужен интерфейс View, много методов. Для простых экранов избыточен.
- **Android** исторически использовал MVP до появления ViewModel (Architecture Components). Сейчас MVVM + LiveData/StateFlow вытесняет MVP.
- **Massive Presenter** — та же проблема, что Massive ViewController в iOS: Presenter раздувается при сложном экране.

---

## Сравнение MVC / MVP / MVVM

| Критерий | MVC | MVP | MVVM |
|----------|-----|-----|------|
| Знает ли посредник о View? | Controller — да | Presenter — да (через интерфейс) | ViewModel — **нет** |
| View активен? | Частично | **Нет (Passive View)** | Подписка через binding |
| Связь View ↔ посредник | Прямая | Через IView-интерфейс | Data binding / Observables |
| Тестируемость логики | Средняя | Высокая | Высокая |
| Типичные платформы | Rails, Django | Android (legacy), WinForms | Angular, WPF, SwiftUI |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Presenter отличается от Controller?** — Controller в MVC знает о конкретном View; Presenter знает только об `IView`-интерфейсе, что позволяет подменять View в тестах.
- **Как тестировать Presenter?** — создаём mock, реализующий `ILoginView`, инжектируем в Presenter, проверяем вызовы методов mock.
- **Когда MVP лучше MVVM?** — когда фреймворк не поддерживает data binding, или нужен очень явный контроль над тем, что Presenter делает с View.
- **Что такое Passive View vs Supervising Controller?** — Passive View: View делегирует всё; Supervising: View может биндить простые данные, Presenter только для сложной логики.

### Красные флаги (чего не говорить)

- «MVP и MVC — одно и то же» — в MVP View пассивен и общается через интерфейс, это принципиальное отличие.
- «Presenter напрямую обращается к DOM» — Presenter не знает об HTML/DOM, только об абстрактном `IView`.

### Связанные темы

- `001-chto-takoe-mvc.md`, `002-chto-takoe-mvvm.md`
- `004-nedostatki-mvw.md`, `012-dependency-injection.md`
