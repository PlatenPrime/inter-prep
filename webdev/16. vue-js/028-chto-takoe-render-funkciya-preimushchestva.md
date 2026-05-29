# Q028. Что такое рендер-функция (render function)? Преимущества рендер-функции?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Рендер-функция** — это JavaScript-функция, возвращающая Virtual DOM (VNode) вместо HTML-шаблона. Шаблоны Vue компилируются в рендер-функции под капотом. Преимущества: полная мощь JavaScript (программная генерация разметки, динамические компоненты, сложная условная логика без ограничений синтаксиса директив), а также JSX-совместимость. Используется в редких случаях, когда шаблон недостаточно гибок.

---

## Развёрнутый ответ

### Суть и определение

Рендер-функция — это низкоуровневый API Vue для создания VNode напрямую. Компилятор Vue автоматически преобразует шаблоны в рендер-функции, но разработчик может написать их вручную для максимальной гибкости.

### Как это работает

**Функция `h()` (hyperscript)**

```typescript
import { h, ref } from 'vue'

// h(type, props, children)
// type — тег, компонент или строка
// props — объект атрибутов, событий
// children — строка, массив VNode, объект слотов

const vnode = h('div', { class: 'container', id: 'app' }, [
  h('h1', { style: { color: 'red' } }, 'Заголовок'),
  h('p', null, 'Текст'),
])
```

**Компонент с рендер-функцией:**

```typescript
import { defineComponent, h, ref } from 'vue'

const Counter = defineComponent({
  setup() {
    const count = ref(0)

    return () =>
      h('div', [
        h('p', `Счётчик: ${count.value}`),
        h('button', { onClick: () => count.value++ }, 'Увеличить'),
      ])
  },
})
```

**JSX — более читаемый синтаксис для рендер-функций:**

```tsx
import { defineComponent, ref } from 'vue'

const Counter = defineComponent({
  setup() {
    const count = ref(0)

    return () => (
      <div>
        <p>Счётчик: {count.value}</p>
        <button onClick={() => count.value++}>Увеличить</button>
      </div>
    )
  },
})
```

**Сравнение шаблон vs рендер-функция:**

```vue
<!-- Шаблон (компилируется в рендер-функцию) -->
<template>
  <div :class="containerClass">
    <h1>{{ title }}</h1>
    <slot name="content" :data="items" />
  </div>
</template>
```

```typescript
// Эквивалентная рендер-функция
() =>
  h('div', { class: containerClass.value }, [
    h('h1', null, title.value),
    slots.content?.({ data: items.value }),
  ])
```

### Практика и применение

**Кейс 1: Динамические теги заголовков**

```typescript
// Компонент, генерирующий h1-h6 по пропсу
const DynamicHeading = defineComponent({
  props: { level: { type: Number, required: true } },
  setup(props, { slots }) {
    return () => h(`h${props.level}`, slots.default?.())
  },
})
```

```vue
<!-- Использование -->
<DynamicHeading :level="headingLevel">Текст заголовка</DynamicHeading>
```

**Кейс 2: Renderless компонент (логика без разметки)**

```typescript
const ResizeObserver = defineComponent({
  props: { element: Object as PropType<HTMLElement | null> },
  emits: ['resize'],
  setup(props, { emit, slots }) {
    const size = reactive({ width: 0, height: 0 })

    const observer = new window.ResizeObserver(([entry]) => {
      size.width = entry.contentRect.width
      size.height = entry.contentRect.height
      emit('resize', size)
    })

    onMounted(() => props.element && observer.observe(props.element))
    onUnmounted(() => observer.disconnect())

    // Передаём данные в слот — renderless паттерн
    return () => slots.default?.({ size })
  },
})
```

**Кейс 3: Компилятор Vue — что получается из шаблона**

```typescript
// Шаблон: <div v-if="show">{{ text }}</div>
// Компилируется в:
() => show.value
  ? createElementVNode('div', null, toDisplayString(text.value))
  : createCommentVNode('v-if', true)
```

### Важные нюансы и краеугольные камни

- **Рендер-функции не получают compile-time оптимизаций** (static hoisting, patch flags) — только runtime оптимизации. Поэтому шаблоны обычно производительнее
- **Слоты в рендер-функциях** передаются как объект функций: `slots.default?.()`, `slots.header?.()`
- **JSX в Vue 3** отличается от JSX в React: `class` вместо `className`, `onClick` вместо `onclick`, слоты через `v-slots`
- Рендер-функции — **стандартный вывод для библиотек компонентов**, но в приложениях использовать только когда шаблон невозможен

### Преимущества рендер-функций

1. **Полная мощь JavaScript** — циклы, условия, рекурсия, программная генерация тегов
2. **Динамические теги** — `h(tag, ...)` где `tag` — переменная
3. **Интеграция со сторонними библиотеками** — проще передавать функции и нестандартные структуры
4. **Renderless компоненты** — логика без привязки к конкретной разметке
5. **Переиспользование в разных контекстах** — функция может возвращать разные деревья в зависимости от окружения

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое VNode?** — виртуальный DOM-узел, JavaScript-объект, описывающий элемент DOM или компонент
- **Почему шаблоны обычно производительнее рендер-функций вручную?** — компилятор применяет static hoisting и patch flags, которые разработчик должен добавлять вручную
- **Что такое JSX в Vue и чем отличается от React-JSX?** — синтаксис тот же, но нет `className`, события через `onClick`, слоты через объект

### Красные флаги (чего не говорить)

- «Рендер-функции быстрее шаблонов» — наоборот, шаблоны получают compile-time оптимизации
- «`h()` — это React-специфичная функция» — `h()` (hyperscript) — концепция Virtual DOM, используемая во Vue, Preact и других фреймворках

### Связанные темы

- `007-chto-takoe-sfc-kakie-problemy-on-reshaet.md`
- `030-chto-takoe-asinhronye-komponenty.md`
