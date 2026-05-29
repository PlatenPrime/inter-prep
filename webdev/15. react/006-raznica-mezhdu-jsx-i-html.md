# Q006. Разница между `JSX` и `HTML`?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

JSX — это синтаксическое расширение JavaScript, компилируемое в `React.createElement` вызовы, а HTML — язык разметки, напрямую интерпретируемый браузером. Основные отличия: атрибуты в camelCase (`className`, `htmlFor`), обязательные self-closing теги, вставка JS-выражений через `{}`, и невозможность использовать зарезервированные JS-слова в качестве атрибутов.

---

## Развёрнутый ответ

### Суть и определение

**HTML** — стандарт разметки W3C, интерпретируемый браузером для построения DOM. Браузер понимает HTML нативно.

**JSX** — расширение синтаксиса JS, требующее компиляции (Babel/SWC/TypeScript) перед выполнением в браузере. JSX описывает виртуальное дерево React, а не реальный DOM.

### Как это работает

| Различие | HTML | JSX |
|----------|------|-----|
| Атрибут класса | `class="btn"` | `className="btn"` |
| Лэйбл | `for="email"` | `htmlFor="email"` |
| Self-closing | `<img>`, `<br>` | `<img />`, `<br />` (обязательно) |
| Обработчики событий | `onclick="fn()"` | `onClick={fn}` (camelCase, функция) |
| Inline-стили | `style="color: red"` | `style={{ color: 'red' }}` (объект) |
| Комментарии | `<!-- comment -->` | `{/* comment */}` |
| Условная логика | не поддерживается | `{condition && <El />}` |
| Фрагменты | нет | `<>...</>` или `<Fragment>` |
| Кастомные компоненты | нет | `<MyComponent />` (с заглавной буквы) |
| Вставка переменных | нет | `{variable}` |

### Практика и применение

В реальном коде различия проявляются при:
- Миграции HTML-макетов в React: нужно переименовывать атрибуты
- Использовании ESLint plugin `eslint-plugin-jsx-a11y` — он следит за корректными HTML-атрибутами в JSX
- `dangerouslySetInnerHTML={{ __html: str }}` — вместо прямой вставки HTML-строки

### Важные нюансы и краеугольные камни

- JSX **не является HTML**: браузер его не понимает; нужен этап компиляции (build step)
- Компоненты с заглавной буквы — обязательно: `<myComponent />` воспринимается как HTML-тег, `<MyComponent />` — как React-компонент
- Булевые атрибуты в HTML: `disabled` = `disabled="disabled"`; в JSX: `disabled` или `disabled={true}` эквивалентны
- `tabIndex` (не `tabindex`), `crossOrigin` (не `crossorigin`) — все атрибуты DOM API в camelCase
- Значения событий в HTML — строки (`"handleClick()"`), в JSX — ссылки на функции (`{handleClick}`)

### Примеры

```html
<!-- HTML -->
<form>
  <label for="username">Имя:</label>
  <input id="username" class="input" tabindex="1" />
  <button onclick="submit()" disabled>Войти</button>
  <div style="color: red; font-size: 14px;">Ошибка</div>
  <!-- Комментарий -->
</form>
```

```tsx
// JSX (то же самое)
<form onSubmit={handleSubmit}>
  <label htmlFor="username">Имя:</label>
  <input id="username" className="input" tabIndex={1} />
  <button onClick={submit} disabled>Войти</button>
  <div style={{ color: 'red', fontSize: 14 }}>Ошибка</div>
  {/* Комментарий */}
</form>
```

---

## Сравнение

| Критерий | HTML | JSX |
|----------|------|-----|
| Тип | Язык разметки | Синтаксическое расширение JS |
| Компиляция | Не нужна | Обязательна (Babel/SWC/TS) |
| Атрибуты | snake-case / kebab-case | camelCase |
| Динамика | Нет | Через `{}` |
| Компоненты | Нет | Поддерживаются (с большой буквы) |
| Интерпретатор | Браузер (нативно) | JS-движок после компиляции |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `class` → `className`?** — `class` — зарезервированное ключевое слово в JS
- **Можно ли смешивать HTML и JSX в одном файле?** — нет; в `.jsx`/`.tsx` весь код — JSX
- **Что происходит, если написать компонент с маленькой буквы?** — React воспримет его как HTML-тег и не вызовет функцию компонента

### Красные флаги (чего не говорить)

- «JSX — это HTML в JavaScript» — это упрощение; синтаксис схожий, но семантика и правила другие
- «В JSX можно писать любой HTML» — нельзя: `class`, `for` и другие зарезервированные слова запрещены

### Связанные темы

- `005-chto-takoe-jsx.md`
- `007-raznica-mezhdu-elementom-i-komponentom.md`
- `045-kak-otrenderet-html-kod-v-react-komponente.md`
