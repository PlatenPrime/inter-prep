# Q018. Что такое обратный поток данных в React?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Обратный поток данных (inverse data flow)** — паттерн в React, при котором дочерний компонент сообщает об изменениях родителю через **callback-функции**, переданные как props. Данные текут вниз (родитель → дочерний), события/изменения — вверх (дочерний → родитель). Это реализация двусторонней связи при сохранении однонаправленного потока данных.

---

## Развёрнутый ответ

### Суть и определение

React придерживается принципа **одностороннего потока данных** (unidirectional data flow): props идут сверху вниз. Но UI требует взаимодействия пользователя — ввод текста, нажатие кнопки. Для передачи событий обратно вверх родитель передаёт дочернему callback-функцию через props, и дочерний вызывает её при изменении.

### Как это работает

```
[Родитель]
  ↓ props (данные + callbacks)
[Дочерний]
  ↑ вызывает callback при событии → родитель обновляет state → ре-рендер
```

```tsx
// Родитель управляет состоянием
const SearchPage: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<string[]>([]);

  const handleSearch = (newQuery: string) => {
    setQuery(newQuery);
    // Выполнить поиск...
    setResults([`Результат для "${newQuery}"`]);
  };

  return (
    <div>
      {/* Дочерний уведомляет родителя через onSearch */}
      <SearchInput value={query} onSearch={handleSearch} />
      <ResultsList results={results} />
    </div>
  );
};

// Дочерний — не знает о состоянии родителя
interface SearchInputProps {
  value: string;
  onSearch: (query: string) => void;
}

const SearchInput: React.FC<SearchInputProps> = ({ value, onSearch }) => (
  <input
    value={value}
    onChange={e => onSearch(e.target.value)}  // обратный поток
    placeholder="Поиск..."
  />
);
```

### Практика и применение

- **Формы**: каждое поле сообщает о своём значении в форму-предок
- **Списки с выбором**: `<List onItemSelect={handleSelect} />` — выбор элемента поднимается вверх
- **Модальные окна**: `<Modal onClose={handleClose} />` — закрытие инициирует дочерний, обрабатывает родитель
- **Таблицы**: сортировка, фильтрация, пагинация через callbacks в родительский контейнер

### Важные нюансы и краеугольные камни

- Обратный поток **не нарушает** принцип однонаправленности — это всё ещё контролируемый паттерн
- Глубокий обратный поток через 3+ уровней — сигнал применить **Context** или **state-менеджер**
- **Стабильность callback'ов**: передача новой функции при каждом рендере родителя ломает `React.memo` в дочернем → использовать `useCallback`
- Для сложных форм обратный поток становится многословным → `React Hook Form` / `Formik` абстрагируют это

### Примеры

```tsx
// useCallback для стабильных callback'ов
const ParentComponent: React.FC = () => {
  const [value, setValue] = useState('');

  // Без useCallback — новая функция каждый рендер
  // const handleChange = (v: string) => setValue(v);

  // С useCallback — стабильная ссылка
  const handleChange = useCallback((v: string) => setValue(v), []);

  return <MemoizedChild value={value} onChange={handleChange} />;
};

const MemoizedChild = React.memo<{ value: string; onChange: (v: string) => void }>(
  ({ value, onChange }) => (
    <input value={value} onChange={e => onChange(e.target.value)} />
  )
);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем обратный поток отличается от двустороннего связывания (v-model в Vue)?** — в React всё явно: callback передаётся явно, нет «магии»; в Vue/Angular — декларативная синхаронизация
- **Когда использовать Context вместо callback'ов?** — когда callbacks нужно передавать через 3+ уровней (prop drilling)
- **Как useCallback помогает производительности?** — стабильная ссылка функции не вызывает ре-рендер React.memo-компонентов

### Красные флаги (чего не говорить)

- «React не поддерживает обратный поток» — поддерживает через callback props, это официальный паттерн
- «Обратный поток — антипаттерн» — нет, это стандартный механизм коммуникации компонентов в React

### Связанные темы

- `013-raznica-mezhdu-sostoyaniem-state-i-propsami-props.md`
- `017-chto-takoe-podnyatie-sostoyaniya-vverh-lifting-state-up.md`
- `054-kak-v-react-realizovat-dvustoronnee-svyazyvanie-dannyh.md`
