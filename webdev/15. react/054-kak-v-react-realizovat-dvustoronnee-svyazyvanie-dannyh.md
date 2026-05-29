# Q054. Как в React реализовать двустороннее связывание данных?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

В React нет встроенного двустороннего связывания как в Vue (`v-model`) или Angular (`[(ngModel)]`). Оно реализуется явно: `value={state}` (данные → UI) + `onChange={e => setState(e.target.value)}` (UI → данные). Это **controlled component** паттерн — явный и предсказуемый, хотя более многословный.

---

## Развёрнутый ответ

### Суть и определение

**Двустороннее связывание** означает: изменение данных → обновляет UI, и изменение UI → обновляет данные. React реализует это через **однонаправленный поток** с явными обработчиками:
- `value` prop — привязка данных к UI (один путь)
- `onChange` обработчик — обновление данных из UI (обратный путь)

### Базовый паттерн

```tsx
const TwoWayBinding: React.FC = () => {
  const [text, setText] = useState('');

  return (
    <div>
      {/* UI → State: onChange обновляет state */}
      {/* State → UI: value отображает state */}
      <input
        value={text}
        onChange={e => setText(e.target.value)}
      />
      <p>Введено: {text}</p>
    </div>
  );
};
```

### Двустороннее связывание для разных элементов формы

```tsx
interface FormValues {
  name: string;
  age: number;
  role: 'admin' | 'user';
  isActive: boolean;
  bio: string;
}

const CompleteForm: React.FC = () => {
  const [form, setForm] = useState<FormValues>({
    name: '',
    age: 18,
    role: 'user',
    isActive: true,
    bio: '',
  });

  // Универсальный обработчик для текстовых полей
  const handleChange = <K extends keyof FormValues>(field: K) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      const value = e.target.type === 'checkbox'
        ? (e.target as HTMLInputElement).checked
        : e.target.type === 'number'
          ? Number(e.target.value)
          : e.target.value;
      setForm(prev => ({ ...prev, [field]: value }));
    };

  return (
    <form>
      {/* Text input */}
      <input type="text" value={form.name} onChange={handleChange('name')} />

      {/* Number input */}
      <input type="number" value={form.age} onChange={handleChange('age')} />

      {/* Select */}
      <select value={form.role} onChange={handleChange('role')}>
        <option value="admin">Администратор</option>
        <option value="user">Пользователь</option>
      </select>

      {/* Checkbox */}
      <input
        type="checkbox"
        checked={form.isActive}
        onChange={e => setForm(prev => ({ ...prev, isActive: e.target.checked }))}
      />

      {/* Textarea */}
      <textarea value={form.bio} onChange={handleChange('bio')} />
    </form>
  );
};
```

### Сравнение с Vue v-model

```tsx
// Vue (двустороннее, декларативное):
// <input v-model="text" />
// Под капотом: :value="text" @input="text = $event.target.value"

// React (явное, verbose):
<input value={text} onChange={e => setText(e.target.value)} />
```

React намеренно делает это явным — нет «магии», полная предсказуемость.

### React Hook Form — де-факто стандарт для форм

```tsx
import { useForm, Controller } from 'react-hook-form';

interface LoginForm {
  email: string;
  password: string;
  rememberMe: boolean;
}

const LoginForm: React.FC = () => {
  const { register, handleSubmit, watch } = useForm<LoginForm>({
    defaultValues: { email: '', password: '', rememberMe: false }
  });

  const email = watch('email'); // подписка на изменения конкретного поля

  return (
    <form onSubmit={handleSubmit(data => console.log(data))}>
      <input {...register('email')} type="email" />
      <input {...register('password')} type="password" />
      <input {...register('rememberMe')} type="checkbox" />
      <p>Email: {email}</p>
      <button type="submit">Войти</button>
    </form>
  );
};
```

### Практика и применение

- **Формы**: стандарт для регистрации, логина, настроек
- **Живой предпросмотр**: markdown-editor + preview рендерится из того же state
- **Фильтры**: поиск и список данных из одного state
- **Настройки**: переключатели и применяются немедленно

### Важные нюансы и краеугольные камни

- Для форм с 5+ полями — React Hook Form или Formik избегают бойлерплейта
- `value={undefined}` — uncontrolled (React предупредит при смене на controlled); используйте `value={value ?? ''}`
- Каждое нажатие клавиши вызывает ре-рендер → для больших форм React Hook Form (uncontrolled) быстрее

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему React не имеет встроенного v-model?** — философия: явное лучше неявного; debugging проще
- **Как оптимизировать производительность большой формы?** — React Hook Form, `useReducer` вместо множества useState, разделить независимые секции
- **Что такое watch() в React Hook Form?** — подписка на изменения конкретного поля без ре-рендера всей формы

### Красные флаги (чего не говорить)

- «React не поддерживает двустороннее связывание» — поддерживает, но явно (value + onChange)
- «v-model в Vue лучше» — оба подхода решают задачу; React явнее, Vue декларативнее

### Связанные темы

- `053-raznica-mezhdu-kontroliruemym-controlled-i-nekontroliruemym-uncontrolled-komponentami.md`
- `018-chto-takoe-obratnyj-potok-dannyh-v-react.md`
- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
