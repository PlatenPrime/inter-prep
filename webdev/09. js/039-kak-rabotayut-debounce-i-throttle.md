# Q039. Что такое и как работает `debounce()` и `throttle()` в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

**`debounce`** — откладывает выполнение функции до тех пор, пока не пройдёт заданное время с **последнего** вызова (сбрасывает таймер при каждом вызове). **`throttle`** — гарантирует выполнение функции **не чаще одного раза** за указанный интервал. Оба паттерна ограничивают частоту вызовов дорогостоящих операций.

---

## Развёрнутый ответ

### Суть и определение

**Debounce:** «подождать тишины» — ждать паузы в активности.
```
Events:  click ─ click ─ click ─ click ─── ─── ─── ─── [выполнение]
         │        │        │        │              ↑
         │        │        │        └──────────────┤
         │        │        └─────────────────timer сбрасывается
         │        └──────────────────────── всё время
         └──────── ждём паузу 500ms
```

**Throttle:** «гарантированный ритм» — выполнять не чаще раза в N мс.
```
Events:  click ─ click ─ click ─ click ─ click ─ click
          ↑                               ↑
         exec                            exec (500ms позже)
         (остальные игнорируются в течение интервала)
```

### Реализация debounce

```javascript
function debounce(fn, delay) {
  let timerId = null;

  return function(...args) {
    clearTimeout(timerId);
    timerId = setTimeout(() => {
      fn.apply(this, args);
    }, delay);
  };
}
```

### Реализация throttle

```javascript
function throttle(fn, interval) {
  let lastCallTime = 0;

  return function(...args) {
    const now = Date.now();
    if (now - lastCallTime >= interval) {
      lastCallTime = now;
      return fn.apply(this, args);
    }
  };
}
```

### Практика и применение

**Debounce:**
- Поиск по мере ввода (`input` → API-запрос): не делаем запрос при каждом нажатии клавиши.
- Автосохранение формы.
- Обработка изменения размера окна (`window.resize`).
- Валидация поля после завершения ввода.

```javascript
const searchInput = document.querySelector('#search');
const debouncedSearch = debounce(async (query) => {
  const results = await fetch(`/api/search?q=${query}`).then(r => r.json());
  renderResults(results);
}, 300);

searchInput.addEventListener('input', e => debouncedSearch(e.target.value));
```

**Throttle:**
- Обработка прокрутки (`scroll`) — обновление UI элементов.
- Обработка движения мыши (`mousemove`) — например, drag-and-drop.
- Ограничение частоты API-запросов (rate limiting).
- Игровые циклы, анимации.

```javascript
const handleScroll = throttle(() => {
  const { scrollY } = window;
  updateNavbarStyle(scrollY);
  lazyLoadImages(scrollY);
}, 100); // не чаще 10 раз в секунду

window.addEventListener('scroll', handleScroll);
```

### Важные нюансы и краеугольные камни

- **Leading/trailing edge:** debounce и throttle могут выполняться в начале интервала (leading), в конце (trailing) или в обоих. Lodash предоставляет опции `{ leading: true, trailing: false }`.
- **Отмена:** debounce-функция должна иметь метод `.cancel()` для очистки таймера при размонтировании компонента.
- **Контекст `this`:** при передаче в обработчики `this` может потеряться — используйте стрелочные функции или сохраняйте контекст.
- В React: создавайте debounce/throttle через `useCallback` + `useRef` или используйте библиотеки (`use-debounce`).

### Примеры

```javascript
// Debounce с cancel() и immediate (leading edge)
function debounce(fn, delay, { leading = false } = {}) {
  let timerId = null;
  let lastArgs = null;

  const debounced = function(...args) {
    lastArgs = args;

    if (leading && !timerId) {
      fn.apply(this, args);
    }

    clearTimeout(timerId);
    timerId = setTimeout(() => {
      if (!leading) fn.apply(this, lastArgs);
      timerId = null;
    }, delay);
  };

  debounced.cancel = () => {
    clearTimeout(timerId);
    timerId = null;
  };

  return debounced;
}

// React hook
function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer); // cleanup при размонтировании
  }, [value, delay]);

  return debouncedValue;
}
```

---

## Сравнение

| Критерий | `debounce` | `throttle` |
|----------|------------|------------|
| Триггер | После паузы в N мс | Раз в N мс |
| Гарантия | Выполнится хотя бы раз после активности | Выполнится строго с интервалом |
| Применение | Поиск, автосохранение | Scroll, mousemove, resize |
| Аналогия | «Лифт ждёт пока не зайдёт последний» | «Лифт уходит каждые N секунд» |

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что если пользователь непрерывно вводит текст — когда выполнится debounce?** — Только после паузы в `delay` мс; при постоянном вводе — никогда.
- **Как реализовать throttle с гарантией последнего вызова?** — Комбинация throttle + финальный debounce.
- **Как очистить debounce в React при размонтировании?** — `useEffect` возвращает cleanup: `return () => debouncedFn.cancel()`.

### Красные флаги (чего не говорить)

- «Debounce и throttle — одно и то же» — принципиально разные паттерны.
- «Debounce всегда срабатывает сразу» — по умолчанию trailing edge (после паузы).

### Связанные темы

- `029-chto-takoe-funkcii-vysshego-poryadka.md`
- `076-tipy-taymerov-v-javascript.md`
- `035-chto-takoe-zamykanie-closure.md`
