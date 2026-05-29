# Q053. Разница между контролируемым (controlled) и неконтролируемым (uncontrolled) компонентами в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Controlled component** — форм-элемент, значение которого управляется через React state: `value={state}` + `onChange={setState}`. React является «единственным источником правды». **Uncontrolled component** — форм-элемент, хранящий значение в DOM; React-state не задействован; доступ через `ref`. Controlled — стандарт для большинства случаев; uncontrolled — для интеграции с non-React кодом или `React Hook Form`.

---

## Развёрнутый ответ

### Суть и определение

**Controlled:**
- `value` prop привязан к state
- `onChange` обновляет state при вводе
- React контролирует каждое нажатие клавиши
- Синхронный доступ к значению в любой момент

**Uncontrolled:**
- DOM сам хранит значение
- Доступ к значению через `ref.current.value`
- Как традиционный HTML input
- `defaultValue` для начального значения (вместо `value`)

### Как это работает

**Controlled:**
```tsx
const ControlledForm: React.FC = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({ name, email }); // данные в state
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={name}           // ← привязан к state
        onChange={e => setName(e.target.value)} // ← обновляет state
      />
      <input
        type="email"
        value={email}
        onChange={e => setEmail(e.target.value)}
      />
      <button type="submit">Submit</button>
    </form>
  );
};
```

**Uncontrolled:**
```tsx
const UncontrolledForm: React.FC = () => {
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log({          // читаем из DOM при submit
      name: nameRef.current?.value,
      email: emailRef.current?.value,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input type="text" defaultValue="" ref={nameRef} />   {/* defaultValue, не value */}
      <input type="email" defaultValue="" ref={emailRef} />
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Когда какой выбирать

**Controlled — выбирайте когда:**
- Нужна немедленная валидация при вводе
- Условное отображение на основе значения поля
- Несколько полей зависят друг от друга (пароль + подтверждение)
- Программное изменение значения поля
- Режим «только чтение» (`readOnly`)

**Uncontrolled — выбирайте когда:**
- Интеграция с не-React кодом (DOM-библиотеки)
- `<input type="file">` — файловый input всегда uncontrolled (нельзя задать `value`)
- React Hook Form (использует uncontrolled под капотом для производительности)
- Простые формы без валидации

### React Hook Form — лучшее из двух миров

```tsx
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(2, 'Минимум 2 символа'),
  email: z.string().email('Неверный email'),
});

type FormData = z.infer<typeof schema>;

const OptimizedForm: React.FC = () => {
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: FormData) => console.log(data);

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <span>{errors.name.message}</span>}
      <input {...register('email')} />
      {errors.email && <span>{errors.email.message}</span>}
      <button type="submit">Submit</button>
    </form>
  );
};
```

### Важные нюансы и краеугольные камни

- `value={undefined}` → компонент становится uncontrolled; `value={null}` → ошибка (`null` не допустим)
- Нельзя переключаться между controlled и uncontrolled после mount — React выдаст предупреждение
- `<input type="file" />` — **всегда** uncontrolled; нет `value` prop
- Controlled input с `value` без `onChange` → `readOnly` (предупреждение), нужно добавить `readOnly` prop

### Примеры

```tsx
// Антипаттерн: смешение controlled/uncontrolled
const BuggyInput: React.FC<{ initial?: string }> = ({ initial }) => {
  const [value, setValue] = useState(initial); // initial может быть undefined

  // ❌ Если initial undefined → uncontrolled; если придёт строка → controlled
  return <input value={value} onChange={e => setValue(e.target.value)} />;
};

// ✅ Явный default
const GoodInput: React.FC<{ initial?: string }> = ({ initial = '' }) => {
  const [value, setValue] = useState(initial);
  return <input value={value} onChange={e => setValue(e.target.value)} />;
};
```

---

## Сравнение

| Критерий | Controlled | Uncontrolled |
|----------|------------|--------------|
| Хранение значения | React state | DOM |
| Доступ к значению | Из state (всегда) | Через ref при submit |
| Валидация | При каждом изменении | Только при submit |
| Производительность | Ре-рендер на каждый keystroke | Нет лишних ре-рендеров |
| Программное изменение | Просто (setState) | Через ref.current.value |
| `type="file"` | Нельзя | Только этот вариант |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как React Hook Form оптимизирует производительность?** — использует uncontrolled inputs; ре-рендер только при submit/blur
- **Почему `value` без `onChange` вызывает предупреждение?** — React видит controlled input, но не может обновить значение
- **Как сбросить форму?** — controlled: `setState('')`; uncontrolled: `ref.current.value = ''` или `form.reset()`

### Красные флаги (чего не говорить)

- «Uncontrolled лучше/хуже controlled» — у каждого паттерна свои сценарии; RHF использует оба
- «Можно переключать controlled↔uncontrolled» — нельзя после mount; React выдаёт ошибку

### Связанные темы

- `052-chto-takoe-react-ssylka-ref-kak-sozdat-ssylku.md`
- `054-kak-v-react-realizovat-dvustoronnee-svyazyvanie-dannyh.md`
- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
