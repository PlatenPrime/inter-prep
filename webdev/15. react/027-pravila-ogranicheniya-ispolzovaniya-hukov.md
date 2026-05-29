# Q027. Правила (ограничения) использования хуков?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Существует два официальных правила хуков: **1) вызывать только на верхнем уровне** (не внутри условий, циклов, вложенных функций) и **2) вызывать только из React-функций** (функциональные компоненты или custom hooks). Оба правила обусловлены тем, что React хранит состояние хуков в linked list, ориентируясь на порядок вызовов.

---

## Развёрнутый ответ

### Суть и определение

Правила хуков — не произвольные ограничения, а следствие реализации: React хранит все хуки компонента в виде связного списка в Fiber-ноде. При каждом рендере React проходит этот список в том же порядке. Если порядок нарушается — состояние попадёт «не в тот» хук.

### Правило 1: Только на верхнем уровне

**Запрещено:**
- Внутри `if`/`else`
- Внутри `for`/`while`
- Внутри вложенных функций
- Внутри `try/catch`

```tsx
// ❌ В условии
const Component = ({ isAuth }) => {
  if (isAuth) {
    const [user, setUser] = useState(null); // порядок нарушен при isAuth=false
  }
  // ...
};

// ❌ В цикле
for (let i = 0; i < 3; i++) {
  const [val, setVal] = useState(0); // количество вызовов меняется
}

// ❌ В callback
const handleClick = () => {
  const [local, setLocal] = useState(0); // не в компоненте
};
```

**Правильно: условие внутри хука, а не хук внутри условия:**
```tsx
// ✅
const [user, setUser] = useState(null);
if (isAuth) {
  // используем user, но хук уже вызван
}

// ✅ Или хук, который сам обрабатывает условие
const data = useData(isAuth ? userId : null);
```

### Правило 2: Только в React-функциях

**Где можно:**
- Функциональные компоненты React
- Custom hooks (функции, начинающиеся с `use`)

**Где нельзя:**
- Обычные JavaScript функции
- Классовые компоненты
- Event handlers (без компонента вокруг)
- Глобальные функции / утилиты

```tsx
// ❌ В обычной функции
function processUser(id: string) {
  const [data, setData] = useState(null); // ОШИБКА
  return data;
}

// ✅ В custom hook (начинается с use)
function useProcessUser(id: string) {
  const [data, setData] = useState(null); // ОК
  useEffect(() => { fetchUser(id).then(setData); }, [id]);
  return data;
}
```

### Автоматическая проверка: ESLint

Правило `eslint-plugin-react-hooks` автоматически проверяет:
- `react-hooks/rules-of-hooks` — правила вызова
- `react-hooks/exhaustive-deps` — полнота dependency arrays

```json
{
  "plugins": ["react-hooks"],
  "rules": {
    "react-hooks/rules-of-hooks": "error",
    "react-hooks/exhaustive-deps": "warn"
  }
}
```

### Почему такая реализация?

```
Первый рендер:   useState  useEffect  useContext  ← порядок 1, 2, 3
Второй рендер:   useState  useEffect  useContext  ← тот же порядок → правильное сопоставление

Если нарушить:
Первый рендер:   useState  useEffect  useContext  ← 1, 2, 3
Второй рендер:   useEffect useContext             ← 1, 2 (useState пропущен условно)
                 ↑ React думает что этот useEffect — тот useState!
```

### Практика и применение

- TypeScript + ESLint плагин = нарушения ловятся на этапе написания кода
- React DevTools подсвечивают нарушения в браузере

### Важные нюансы и краеугольные камни

- **Custom hook** — функция `use*` может нарушить правила изнутри → ошибка переедет в компонент
- Можно вызывать хуки **условно** в ранних return через hook factories — антипаттерн, не нужно
- React 19 Compiler проверяет правила статически и генерирует корректный код автоматически

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нельзя вызывать хук в условии?** — нарушение порядка вызовов ломает сопоставление состояния в Fiber linked list
- **Как вызвать хук при определённом условии?** — хук вызывается всегда; логика условия — внутри него или через параметр
- **Что сделает React при нарушении?** — в dev: ошибка в консоли «Rendered more hooks than previous»; в prod: непредсказуемое поведение

### Красные флаги (чего не говорить)

- «Правила можно нарушать в production» — нарушение правил приводит к непредсказуемым багам независимо от режима
- «ESLint необязателен для правил хуков» — без ESLint нарушения легко пропустить в code review

### Связанные темы

- `024-chto-takoe-react-huki-hooks.md`
- `025-preimushchestva-hukov.md`
- `026-nedostatki-hukov.md`
