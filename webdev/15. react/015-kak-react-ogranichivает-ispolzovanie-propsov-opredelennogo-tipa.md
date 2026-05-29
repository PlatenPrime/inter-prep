# Q015. Как React обрабатывает или ограничивает использование пропсов определенного типа?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Для проверки типов props React предлагает два подхода: **PropTypes** — runtime-проверка в dev-режиме (предупреждения в консоли), и **TypeScript** — статическая типизация на этапе компиляции. В современных проектах используется TypeScript как основной инструмент; PropTypes — наследие до-TypeScript эпохи.

---

## Развёрнутый ответ

### Суть и определение

React сам по себе не ограничивает типы props — JavaScript динамически типизирован. Для контроля типов экосистема предлагает:

1. **PropTypes** — библиотека `prop-types` (ранее часть React), проверяет типы в runtime в dev-режиме
2. **TypeScript** — статическая проверка при компиляции, до запуска кода

### Как это работает

**PropTypes:**
```tsx
import PropTypes from 'prop-types';

const UserCard = ({ name, age, onSelect }) => (
  <div onClick={() => onSelect(name)}>
    {name} ({age})
  </div>
);

UserCard.propTypes = {
  name: PropTypes.string.isRequired,
  age: PropTypes.number,
  onSelect: PropTypes.func.isRequired,
  role: PropTypes.oneOf(['admin', 'user', 'guest']),
  tags: PropTypes.arrayOf(PropTypes.string),
  address: PropTypes.shape({
    city: PropTypes.string,
    zip: PropTypes.string.isRequired,
  }),
};

UserCard.defaultProps = {
  age: 0,
  role: 'user',
  tags: [],
};
```

**TypeScript (предпочтительно):**
```tsx
type Role = 'admin' | 'user' | 'guest';

interface Address {
  city?: string;
  zip: string;
}

interface UserCardProps {
  name: string;
  age?: number;
  onSelect: (name: string) => void;
  role?: Role;
  tags?: string[];
  address?: Address;
}

const UserCard: React.FC<UserCardProps> = ({
  name,
  age = 0,
  onSelect,
  role = 'user',
  tags = [],
}) => (
  <div onClick={() => onSelect(name)}>
    {name} ({age}) — {role}
  </div>
);
```

### Практика и применение

- **TypeScript** — стандарт в новых проектах; ошибки до запуска, IDE автодополнение, рефакторинг
- **PropTypes** — используется в JavaScript-проектах или в библиотеках компонентов для документирования API без TS
- **Zod + TypeScript** — для runtime-валидации данных из API (не props); `z.infer<typeof schema>` как тип props
- `React.FC<Props>` vs `(props: Props) => JSX.Element` — обе записи корректны; `React.FC` добавляет `displayName`, `defaultProps` (устарело в TS 5.1+)

### Важные нюансы и краеугольные камни

- **PropTypes работают только в dev-режиме** — в production они вырезаются; TypeScript защищает на этапе сборки
- **defaultProps для функциональных компонентов** — устаревает; лучше дефолты в деструктуризации: `{ age = 0 }`
- TypeScript **не проверяет runtime**-данные из API — нужен Zod/Yup
- Нельзя указать PropTypes для TypeScript generic props — ограничение PropTypes

### Примеры

```tsx
// ✅ TypeScript — предпочтительный подход
interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant: 'primary' | 'danger' | 'ghost';
  isLoading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ variant, isLoading = false, children, ...rest }) => (
  <button
    className={`btn btn-${variant}`}
    disabled={isLoading || rest.disabled}
    {...rest}
  >
    {isLoading ? <Spinner /> : children}
  </button>
);

// Ошибка TypeScript на этапе компиляции:
<Button variant="success" /> // TS2322: "success" не входит в 'primary' | 'danger' | 'ghost'
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **В чём разница PropTypes и TypeScript?** — PropTypes: runtime в dev, TypeScript: compile-time; TS предпочтительнее
- **Как типизировать children в TypeScript?** — `React.ReactNode` для любого контента; `React.ReactElement` для конкретного JSX
- **Как проверить данные из API?** — Zod: `schema.parse(apiResponse)` даёт runtime-валидацию и TypeScript-тип

### Красные флаги (чего не говорить)

- «PropTypes обязательны в TypeScript-проектах» — они избыточны; TypeScript полностью заменяет PropTypes
- «TypeScript проверяет данные в runtime» — TypeScript стирается при компиляции; runtime нужен Zod/Yup

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `016-kak-rabotaet-props-children-v-react.md`
