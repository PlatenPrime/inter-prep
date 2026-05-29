# Q038. Что такое распределенный компонент?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

**Распределённый компонент** (distributed component) в контексте React — это подход, при котором ответственность компонента разделена между несколькими частями или местами в дереве. Чаще этот термин используется в смысле **Compound Components** (составные компоненты) — когда один компонент разбит на связанные части (`Select` + `Select.Option`, `Tabs` + `Tabs.Tab`), взаимодействующие через общий контекст.

---

## Развёрнутый ответ

### Суть и определение

Термин «распределённый компонент» не является стандартным в официальной документации React. В интервью-контексте он может означать:

1. **Compound Components** — компонент из нескольких частей-потомков
2. **Distributed State** — state компонента распределён через Context на потомков
3. **React Portals** — части компонента рендерятся в разных местах DOM

Наиболее вероятное значение в интервью — **Compound Components**.

### Compound Components (составные компоненты)

```tsx
// Паттерн: Select = набор связанных частей
interface SelectContextValue {
  selectedValue: string;
  onSelect: (value: string) => void;
}

const SelectContext = React.createContext<SelectContextValue | null>(null);

const useSelectContext = () => {
  const ctx = React.useContext(SelectContext);
  if (!ctx) throw new Error('Select.Option must be used within Select');
  return ctx;
};

// Корневой компонент
interface SelectProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
}

const Select: React.FC<SelectProps> & { Option: typeof Option } = ({ value, onChange, children }) => (
  <SelectContext.Provider value={{ selectedValue: value, onSelect: onChange }}>
    <div className="select">{children}</div>
  </SelectContext.Provider>
);

// Подкомпонент
interface OptionProps {
  value: string;
  children: React.ReactNode;
}

const Option: React.FC<OptionProps> = ({ value, children }) => {
  const { selectedValue, onSelect } = useSelectContext();
  return (
    <div
      className={`option ${selectedValue === value ? 'selected' : ''}`}
      onClick={() => onSelect(value)}
    >
      {children}
    </div>
  );
};

Select.Option = Option;

// Использование — декларативно и читаемо
<Select value={selected} onChange={setSelected}>
  <Select.Option value="react">React</Select.Option>
  <Select.Option value="vue">Vue</Select.Option>
  <Select.Option value="angular">Angular</Select.Option>
</Select>
```

### Другие интерпретации «распределённого»

**Портальный паттерн** (компонент рендерится в нескольких DOM-местах):
```tsx
const ModalWithOverlay: React.FC<{ children: ReactNode }> = ({ children }) => {
  const overlayRoot = document.getElementById('overlay-root');
  return overlayRoot
    ? ReactDOM.createPortal(children, overlayRoot)
    : children;
};
```

**Micro-frontends**: компонент «распределён» по нескольким приложениям — каждое монтирует свой React root.

### Практика и применение

- **Compound Components** — Radix UI, shadcn/ui, Headless UI используют этот паттерн широко: `<Dialog>`, `<Dialog.Trigger>`, `<Dialog.Content>`
- **Гибкость API**: потребитель свободно размещает части в любом порядке
- **Инкапсуляция**: сложная логика скрыта в корневом компоненте и Context; части-потомки — «тупые»

### Важные нюансы и краеугольные камни

- Compound Components требуют Context — добавляет overhead ре-рендеров при частых обновлениях
- **Валидация вложения**: `useContext` с throw гарантирует, что Option нельзя использовать вне Select
- `React.Children.map` + `cloneElement` — старый способ Compound Components без Context (хрупче)

### Примеры

```tsx
// Accordion как Compound Component
const Accordion: React.FC<{ children: ReactNode }> & {
  Item: typeof AccordionItem;
  Trigger: typeof AccordionTrigger;
  Content: typeof AccordionContent;
} = ({ children }) => {
  const [openId, setOpenId] = useState<string | null>(null);
  return (
    <AccordionContext.Provider value={{ openId, setOpenId }}>
      <div className="accordion">{children}</div>
    </AccordionContext.Provider>
  );
};

// Использование
<Accordion>
  <Accordion.Item id="first">
    <Accordion.Trigger>Заголовок 1</Accordion.Trigger>
    <Accordion.Content>Содержимое 1</Accordion.Content>
  </Accordion.Item>
</Accordion>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Чем Compound Components лучше простых props?** — гибкость структуры; пользователь размещает части в любом порядке
- **Как передавать данные между частями?** — через Context; корневой компонент — провайдер
- **Что такое Headless UI?** — compound components без стилей, только логика и accessibility; пользователь сам задаёт внешний вид

### Красные флаги (чего не говорить)

- «Распределённый компонент — это микрофронтенд» — не обязательно; в большинстве контекстов речь о Compound Components
- «Context в Compound Components — лишняя сложность» — это стандартный паттерн в библиотеках компонентов

### Связанные темы

- `047-chto-takoe-kontekst-context.md`
- `016-kak-rabotaet-props-children-v-react.md`
- `046-chto-takoe-portal.md`
