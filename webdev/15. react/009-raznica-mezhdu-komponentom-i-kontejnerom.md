# Q009. Разница между компонентом и контейнером?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Это паттерн разделения ответственности: **presentational component** (компонент) отвечает только за отображение и принимает данные через props, **container component** (контейнер) получает данные из store/API и передаёт их вниз. Паттерн популяризировал Дэн Абрамов, но с появлением хуков он стал менее актуален — логику теперь выносят в custom hooks, а не в отдельные контейнеры.

---

## Развёрнутый ответ

### Суть и определение

**Presentational component (компонент представления):**
- Занимается только рендерингом UI
- Получает данные и колбэки через props
- Не знает о Redux, API, роутере
- Переиспользуемый, легко тестируемый в изоляции

**Container component (контейнер):**
- Получает данные из store (`useSelector`, `connect`) или API (`useQuery`)
- Трансформирует данные и передаёт их presentational-компоненту
- Содержит бизнес-логику подписки, dispatch, side-effects
- Не содержит разметки (или минимальную обёртку)

### Как это работает

```
[Redux Store / API]
        ↓
[Container] — знает о данных, dispatch
        ↓ props
[Presentational] — знает только как отрисовать
```

### Практика и применение

**До хуков — через HOC `connect`:**
```tsx
// Presentational
const UserList: React.FC<{ users: User[]; onSelect: (id: string) => void }> = ({ users, onSelect }) => (
  <ul>
    {users.map(u => <li key={u.id} onClick={() => onSelect(u.id)}>{u.name}</li>)}
  </ul>
);

// Container (Redux + connect)
const mapStateToProps = (state: RootState) => ({ users: state.users.list });
const mapDispatchToProps = { onSelect: selectUser };
export default connect(mapStateToProps, mapDispatchToProps)(UserList);
```

**С хуками — логика в custom hook:**
```tsx
// Custom hook заменяет контейнер
const useUserList = () => {
  const users = useSelector((s: RootState) => s.users.list);
  const dispatch = useDispatch();
  const onSelect = (id: string) => dispatch(selectUser(id));
  return { users, onSelect };
};

// Компонент использует хук — нет отдельного контейнера
const UserList: React.FC = () => {
  const { users, onSelect } = useUserList();
  return (
    <ul>
      {users.map(u => <li key={u.id} onClick={() => onSelect(u.id)}>{u.name}</li>)}
    </ul>
  );
};
```

### Важные нюансы и краеугольные камни

- Дэн Абрамов в 2019 году написал, что **больше не рекомендует** этот паттерн как строгое правило — хуки решают ту же проблему разделения логики и представления более элегантно
- Паттерн всё ещё полезен в крупных кодовых базах для **явного документирования** границ ответственности
- Чрезмерное разбиение увеличивает число файлов без реальной пользы
- В Storybook удобно показывать presentational-компоненты без store-зависимостей

### Примеры

```tsx
// Чистый presentational компонент
interface ButtonProps {
  label: string;
  isLoading?: boolean;
  onClick: () => void;
}
const Button: React.FC<ButtonProps> = ({ label, isLoading, onClick }) => (
  <button disabled={isLoading} onClick={onClick}>
    {isLoading ? 'Загрузка...' : label}
  </button>
);

// Контейнер (или custom hook)
const useSubmitForm = () => {
  const [isLoading, setIsLoading] = useState(false);
  const handleSubmit = async () => {
    setIsLoading(true);
    await api.submitForm();
    setIsLoading(false);
  };
  return { isLoading, handleSubmit };
};

const SubmitButton: React.FC = () => {
  const { isLoading, handleSubmit } = useSubmitForm();
  return <Button label="Отправить" isLoading={isLoading} onClick={handleSubmit} />;
};
```

---

## Сравнение

| Критерий | Presentational (компонент) | Container (контейнер) |
|----------|--------------------------|-----------------------|
| Задача | Рендеринг UI | Получение данных |
| Данные | Из props | Из store / API |
| Зависимости | Только React | Redux, useQuery и т.д. |
| Переиспользование | Высокое | Низкое |
| Тестирование | Изолированное | Требует mock store |
| Стиль современный | Без изменений | Заменяется custom hook |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как хуки заменяют контейнеры?** — custom hook инкапсулирует логику подписки и dispatch, компонент вызывает хук
- **Почему всё ещё стоит знать паттерн?** — legacy codebases с Redux + connect, понимание разделения ответственности
- **Что лучше: контейнер или хук?** — хук предпочтительнее: меньше абстракций, легче тестировать

### Красные флаги (чего не говорить)

- «Контейнер — это всегда HOC с connect» — контейнер может быть и компонентом с хуками внутри
- «Паттерн обязателен» — он опциональный; Абрамов сам дистанцировался от строгого его применения

### Связанные темы

- `036-chto-takoe-komponent-vysshego-poryadka-higher-order-component-hoc.md`
- `047-chto-takoe-kontekst-context.md`
- `024-chto-takoe-react-huki-hooks.md`
