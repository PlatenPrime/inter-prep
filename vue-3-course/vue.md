# Vue 3 через призму React — опорный справочник

> Для разработчика с бэкграундом **React + JavaScript/TypeScript**, который хочет с нуля разобраться во Vue 3
> и быть готовым выполнять рабочие задачи на проекте.
>
> Стек, на который опирается справочник (см. [package.json](./package.json)):
> **Vue 3.5**, только **Composition API + `<script setup>`** (Options API не используется),
> **TypeScript**, **Pinia**, **Pinia Colada** (аналог TanStack Query), **Vue Router 5**, **Zod**, **Vitest + Vue Test Utils**.
>
> Каждый раздел построен по схеме: **Теория → Пример → Аналогия с React → Лучшие практики**.
> Все примеры кода — рабочие сниппеты в стиле проекта, многие ссылаются на реальные файлы в `examples/` и `capstone/`.

---

## Оглавление

0. [Введение и карта соответствий React → Vue](#0-введение-и-карта-соответствий-react--vue)
1. [SFC и `<script setup>`](#1-sfc-и-script-setup)
2. [Реактивность: `ref`, `reactive`, `computed`](#2-реактивность-ref-reactive-computed)
3. [Побочные эффекты: `watch`, `watchEffect`, lifecycle](#3-побочные-эффекты-watch-watcheffect-lifecycle)
4. [Шаблоны вместо JSX](#4-шаблоны-вместо-jsx)
5. [Компоненты: props и events](#5-компоненты-props-и-events)
6. [Слоты](#6-слоты)
7. [`v-model` — двустороннее связывание](#7-v-model--двустороннее-связывание)
8. [Модификаторы событий](#8-модификаторы-событий)
9. [Composables (= custom hooks)](#9-composables--custom-hooks)
10. [`provide` / `inject` (= Context)](#10-provide--inject--context)
11. [Scoped-стили в SFC](#11-scoped-стили-в-sfc)
12. [Pinia — управление состоянием](#12-pinia--управление-состоянием)
13. [Vue Router](#13-vue-router)
14. [Server state: Pinia Colada (= TanStack Query)](#14-server-state-pinia-colada--tanstack-query)
15. [Формы и валидация с Zod](#15-формы-и-валидация-с-zod)
16. [Тестирование: Vitest + Vue Test Utils](#16-тестирование-vitest--vue-test-utils)
17. [Производительность](#17-производительность)
18. [Шпаргалка-ловушки для React-разработчика](#18-шпаргалка-ловушки-для-react-разработчика)

---

## 0. Введение и карта соответствий React → Vue

Если вы знаете React, вы уже знаете ~70% Vue — меняется в основном **синтаксис** и **модель реактивности**.
Главные концептуальные отличия:

- **Реактивность точечная, а не «перерисовка компонента».** В React при `setState` заново выполняется вся функция-компонент.
  Во Vue функция `setup` выполняется **один раз**, а дальше фреймворк отслеживает, какие реактивные значения
  использует шаблон, и обновляет только их. Нет `useCallback`/`useMemo` ради стабильности ссылок, нет «правил хуков»,
  нет проблемы устаревших замыканий (stale closures).
- **Шаблоны вместо JSX.** Разметка описывается в `<template>` с директивами (`v-if`, `v-for`, `@click`), а не через `.map()` и тернарники.
- **Однофайловые компоненты (SFC).** Логика, разметка и стили живут в одном `.vue`-файле.

### Таблица соответствий

| React | Vue 3 (Composition API) | Заметка |
| --- | --- | --- |
| `useState` | `ref()` / `reactive()` | `ref` для примитивов и всего подряд; `reactive` — для объектов |
| Производное значение / `useMemo` | `computed()` | кэшируется, пересчитывается по зависимостям автоматически |
| `useEffect(fn, [deps])` | `watch(source, fn)` | явно указываете источник |
| `useEffect(fn)` (без deps по смыслу «на всё») | `watchEffect(fn)` | зависимости собираются автоматически |
| `useEffect(fn, [])` + cleanup | `onMounted` / `onUnmounted` | монтирование/размонтирование |
| JSX: `.map()`, `? :`, `&&` | `v-for`, `v-if`/`v-else`, `v-show` | директивы в шаблоне |
| `className={x}`, `onClick={fn}` | `:class="x"`, `@click="fn"` | `v-bind` (`:`) и `v-on` (`@`) |
| `props` + callback-пропсы | `defineProps` + `defineEmits` | вниз данные, вверх события |
| `children` / render props | слоты `<slot>`, scoped slots | `<slot>` и `<slot :data="...">` |
| Контролируемый инпут (`value` + `onChange`) | `v-model` | двустороннее связывание из коробки |
| Custom hooks (`useXxx`) | composables (`useXxx`) | та же идея, но с реактивностью Vue |
| `Context` + `Provider` | `provide` / `inject` | внедрение зависимостей по дереву |
| `React.memo` | `v-memo` / компонент по умолчанию не «перерисовывается» | во Vue меньше нужно |
| `useRef` (DOM) | `ref` в шаблоне + `useTemplateRef` | ссылка на DOM-элемент |
| CSS Modules / styled-components | `<style scoped>` | инкапсуляция стилей из коробки |
| Redux / Zustand | Pinia | официальный стор |
| React Router | Vue Router | почти один-в-один по API |
| TanStack Query | Pinia Colada (`@pinia/colada`) | `useQuery` / `useMutation` |

> Официальный туториал: [vuejs.org/tutorial](https://vuejs.org/tutorial/) и гайд [vuejs.org/guide](https://vuejs.org/guide/introduction.html).
> Отдельно полезно [«Vue for React devs»](https://vuejs.org/guide/extras/composition-api-faq.html).

---

## 1. SFC и `<script setup>`

### Теория

Single-File Component (SFC) — файл `.vue` из трёх блоков:

```
<script setup lang="ts">  // логика (JS/TS)
<template>                 // разметка (HTML + директивы)
<style scoped>             // стили (инкапсулированы в компонент)
```

`<script setup>` — это синтаксический сахар: весь код внутри выполняется как функция `setup()` **один раз** при создании
компонента. Всё, что объявлено на верхнем уровне (переменные, функции, импортированные компоненты), автоматически
доступно в `<template>` — не нужно ничего `return`-ить, как в React.

### Пример

См. [examples/01-fundamentals/001-template-basics.vue](./examples/01-fundamentals/001-template-basics.vue):

```vue
<script setup lang="ts">
import { ref } from 'vue'

const message = ref('Hello Vue')
const isVisible = ref(true)
const items = ref(['Vue', 'Vite', 'Pinia'])

function hide() {
  isVisible.value = false
}
</script>

<template>
  <div>
    <p>{{ message }}</p>
    <p v-if="isVisible">Visible block</p>
    <button type="button" @click="hide">Hide</button>
    <ul>
      <li v-for="item in items" :key="item">{{ item }}</li>
    </ul>
  </div>
</template>
```

### Аналогия с React

```tsx
// React: функция-компонент выполняется на каждый рендер
function Demo() {
  const [message] = useState('Hello Vue')
  const [isVisible, setIsVisible] = useState(true)
  const items = ['Vue', 'Vite', 'Pinia']

  return (
    <div>
      <p>{message}</p>
      {isVisible && <p>Visible block</p>}
      <button onClick={() => setIsVisible(false)}>Hide</button>
      <ul>{items.map((i) => <li key={i}>{i}</li>)}</ul>
    </div>
  )
}
```

Ключевое отличие: тело React-компонента запускается **на каждый рендер**, а `<script setup>` — **один раз**.
Поэтому во Vue нет `useCallback`/`useMemo` для стабильности функций и нет проблемы устаревших замыканий.

### Лучшие практики

- Всегда `lang="ts"` — типизация «из коробки» через `defineProps`/`defineEmits`.
- Порядок блоков в проекте: `script` → `template` → `style` (см. существующие примеры).
- Имя компонента задаётся именем файла (`PascalCase.vue`), отдельное объявление имени не нужно.
- Точка входа приложения — [src/main.ts](./src/main.ts): `createApp(App).use(pinia).use(router).mount('#app')`.

---

## 2. Реактивность: `ref`, `reactive`, `computed`

### Теория

Во Vue реактивность — это ядро. Есть три главных инструмента:

- **`ref(value)`** — реактивная «коробка» для любого значения (примитив, объект, массив).
  Доступ к содержимому — через `.value` в `<script>`. В `<template>` `.value` **не пишут** — Vue разворачивает ref автоматически.
- **`reactive(obj)`** — делает реактивным сам объект/массив (без `.value`). Работает только с объектами.
- **`computed(fn)`** — производное значение, которое **кэшируется** и пересчитывается только при изменении зависимостей.

Правило простое: **по умолчанию используйте `ref`**. Он универсален, а `.value` явно показывает, что значение реактивное.

### Пример: `ref`

См. [examples/02-reactivity/001-ref-counter.vue](./examples/02-reactivity/001-ref-counter.vue):

```vue
<script setup lang="ts">
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++ // в <script> — через .value
}
</script>

<template>
  <span>{{ count }}</span>       <!-- в шаблоне без .value -->
  <button @click="increment">+</button>
</template>
```

### Пример: `computed`

См. [examples/02-reactivity/002-computed-filter.ts](./examples/02-reactivity/002-computed-filter.ts):

```ts
import { computed, ref, type Ref } from 'vue'

export function useFilteredTodos(todos: Ref<Todo[]>, showDoneOnly: Ref<boolean>) {
  const filtered = computed(() => {
    if (showDoneOnly.value) return todos.value.filter((t) => t.done)
    return todos.value.filter((t) => !t.done)
  })

  const count = computed(() => filtered.value.length)

  return { filtered, count }
}
```

### `ref` vs `reactive`

```ts
import { ref, reactive } from 'vue'

// ref: универсально, доступ через .value
const count = ref(0)
count.value++

// reactive: только объекты, без .value
const state = reactive({ count: 0, user: { name: 'Mikasa' } })
state.count++
```

Подводный камень `reactive`: при **деструктуризации** он теряет реактивность.

```ts
const state = reactive({ count: 0 })
let { count } = state // ❌ count — обычное число, реактивность потеряна
```

С `ref` такой проблемы нет — значение всегда в `.value`. Поэтому в проекте преобладает `ref`.

### Аналогия с React

```tsx
// React
const [count, setCount] = useState(0)
setCount((c) => c + 1)
const doubled = useMemo(() => count * 2, [count]) // deps вручную

// Vue
const count = ref(0)
count.value++ // мутируем напрямую, без сеттера
const doubled = computed(() => count.value * 2) // deps собираются сами
```

Отличия:
- Во Vue значение **мутируется напрямую** (`count.value++`), сеттера нет.
- `computed` **сам** отслеживает зависимости — не нужно писать массив `deps`.
- `computed` кэшируется: пока зависимости не изменились, повторный доступ не пересчитывает функцию (в отличие от простой функции в шаблоне).

### Лучшие практики

- **По умолчанию `ref`.** `reactive` — точечно, когда объект удобнее держать без `.value` и вы не деструктурируете его.
- Не забывайте `.value` в `<script>` (самая частая ошибка новичков — см. раздел 18).
- Для вычислений в шаблоне используйте `computed`, а не вызов функции — `computed` кэшируется.
- Не мутируйте `props` (см. раздел 5). Производные от props значения — через `computed`.
- Типизация: `ref<Task[]>([])`, `computed<number>(...)` или полагайтесь на вывод типов.

> Документация: [Reactivity Fundamentals](https://vuejs.org/guide/essentials/reactivity-fundamentals.html), [Computed](https://vuejs.org/guide/essentials/computed.html).

---

## 3. Побочные эффекты: `watch`, `watchEffect`, lifecycle

### Теория

Аналог `useEffect` во Vue разбит на несколько более точных инструментов:

- **`watch(source, callback)`** — реагирует на изменение конкретного источника (ref/computed/геттера).
  Даёт `newValue` и `oldValue`. Ближе всего к `useEffect(fn, [deps])`.
- **`watchEffect(callback)`** — запускается сразу и повторно при изменении **любой** реактивной зависимости,
  прочитанной внутри. Зависимости собираются автоматически.
- **Lifecycle-хуки** — `onMounted`, `onUnmounted`, `onUpdated`, `onBeforeMount` и т.д. Точечная замена
  `useEffect(fn, [])` с cleanup.

Опции `watch`: `{ immediate: true }` (запустить сразу), `{ deep: true }` (следить за вложенными полями объекта),
`{ flush: 'post' | 'sync' | 'pre' }` (когда именно запускать колбэк относительно рендера).

### Пример: `watch` с debounce

См. [examples/02-reactivity/003-watch-debounce.ts](./examples/02-reactivity/003-watch-debounce.ts):

```ts
import { ref, watch, type Ref } from 'vue'

export function useDebouncedRef<T>(source: Ref<T>, delayMs: number) {
  const debounced = ref(source.value) as Ref<T>
  let timer: ReturnType<typeof setTimeout> | undefined

  watch(
    source,
    (value) => {
      if (timer) clearTimeout(timer)
      timer = setTimeout(() => {
        debounced.value = value
      }, delayMs)
    },
    { flush: 'sync' },
  )

  return debounced
}
```

### Пример: lifecycle (`onMounted` / `onUnmounted`)

См. [examples/04-composables/useClickOutside.ts](./examples/04-composables/useClickOutside.ts):

```ts
import { onMounted, onUnmounted, type Ref } from 'vue'

export function useClickOutside(target: Ref<HTMLElement | null>, handler: () => void) {
  function onClick(event: MouseEvent) {
    const el = target.value
    if (el && !el.contains(event.target as Node)) handler()
  }

  onMounted(() => document.addEventListener('click', onClick))
  onUnmounted(() => document.removeEventListener('click', onClick))
}
```

### `watch` с cleanup

Внутри `watch`/`watchEffect` можно зарегистрировать очистку через `onCleanup` — аналог `return () => {}` в `useEffect`:

```ts
import { watch, ref } from 'vue'

const id = ref(1)

watch(id, (newId, _oldId, onCleanup) => {
  const controller = new AbortController()
  fetch(`/api/item/${newId}`, { signal: controller.signal })
  onCleanup(() => controller.abort()) // вызовется перед следующим запуском/размонтированием
})
```

### Аналогия с React

```tsx
// React
useEffect(() => {
  const t = setTimeout(() => setDebounced(value), 300)
  return () => clearTimeout(t)
}, [value])

useEffect(() => {
  document.addEventListener('click', onClick)
  return () => document.removeEventListener('click', onClick)
}, [])
```

```ts
// Vue
watch(value, (v, _old, onCleanup) => {
  const t = setTimeout(() => (debounced.value = v), 300)
  onCleanup(() => clearTimeout(t))
})

onMounted(() => document.addEventListener('click', onClick))
onUnmounted(() => document.removeEventListener('click', onClick))
```

Разница: у `useEffect` один хук на всё; во Vue вы явно выбираете инструмент под задачу
(реакция на данные → `watch`/`watchEffect`; работа с DOM/жизненным циклом → lifecycle-хуки). Нет массива зависимостей и связанных с ним багов.

### Когда что использовать

| Задача | Инструмент |
| --- | --- |
| Реакция на конкретное значение, нужен old/new | `watch(source, cb)` |
| Эффект зависит от нескольких значений, лень перечислять | `watchEffect(cb)` |
| Подписка/инициализация при монтировании | `onMounted` |
| Очистка подписок/таймеров | `onUnmounted` или `onCleanup` |
| Синхронизация с localStorage | `watch(data, ..., { deep: true })` (см. `useLocalStorage`) |

### Лучшие практики

- Предпочитайте `watch` с явным источником — он предсказуемее, чем `watchEffect`.
- Для наблюдения за полем объекта используйте геттер: `watch(() => props.id, ...)`.
- `deep: true` только когда действительно нужно следить за вложенностью — это дороже.
- Побочные эффекты и подписки чаще выносите в **composable** (см. раздел 9), а не держите в компоненте.

> Документация: [Watchers](https://vuejs.org/guide/essentials/watchers.html), [Lifecycle Hooks](https://vuejs.org/guide/essentials/lifecycle.html).

---

## 4. Шаблоны вместо JSX

### Теория

Вместо JSX Vue использует HTML-шаблоны с **директивами** — специальными атрибутами `v-*`:

| Директива | Что делает | Аналог в React/JSX |
| --- | --- | --- |
| `{{ expr }}` | интерполяция текста | `{expr}` |
| `v-bind:attr` / `:attr` | привязка атрибута/пропса | `attr={expr}` |
| `v-on:event` / `@event` | обработчик события | `onEvent={fn}` |
| `v-if` / `v-else-if` / `v-else` | условный рендер (элемент не создаётся) | `cond ? <A/> : <B/>` |
| `v-show` | переключение через `display: none` | нет прямого аналога |
| `v-for` | рендер списка | `.map()` |
| `v-html` | вставка raw HTML | `dangerouslySetInnerHTML` |

### Интерполяция и `v-bind` / `v-on`

```vue
<template>
  <!-- текст -->
  <p>{{ user.name }}</p>

  <!-- v-bind: динамический атрибут. :href — сокращение v-bind:href -->
  <a :href="url" :class="{ active: isActive }">link</a>

  <!-- v-on: событие. @click — сокращение v-on:click -->
  <button @click="handleClick">Click</button>

  <!-- передача аргумента в обработчик -->
  <button @click="toggle(task.id)">Toggle</button>
</template>
```

`:class` и `:style` поддерживают объектный и массивный синтаксис — очень удобно:

```vue
<div :class="{ active: isActive, disabled: isDisabled }" />
<div :class="[baseClass, isActive ? 'active' : '']" />
<div :style="{ color: textColor, fontSize: size + 'px' }" />
```

### `v-if` / `v-show` / `v-for`

См. [examples/01-fundamentals/003-v-for-list.vue](./examples/01-fundamentals/003-v-for-list.vue):

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface Task { id: string; title: string; done: boolean }

const tasks = ref<Task[]>([
  { id: '1', title: 'Learn Vue', done: false },
  { id: '2', title: 'Build feature', done: true },
])

function toggle(id: string) {
  const task = tasks.value.find((t) => t.id === id)
  if (task) task.done = !task.done
}
</script>

<template>
  <ul>
    <li v-for="task in tasks" :key="task.id" :data-done="task.done">
      <span>{{ task.title }}</span>
      <button type="button" @click="toggle(task.id)">Toggle</button>
    </li>
  </ul>
</template>
```

`v-if` vs `v-show`:
- `v-if` — реально добавляет/удаляет элемент из DOM (дешевле, если условие редко меняется).
- `v-show` — всегда рендерит, лишь переключает `display: none` (дешевле при частом переключении).

`v-for` с индексом и по объекту:

```vue
<li v-for="(item, index) in items" :key="item.id">{{ index }}: {{ item.title }}</li>
<li v-for="(value, key) in someObject" :key="key">{{ key }}: {{ value }}</li>
```

### Аналогия с React

```tsx
// React (JSX)
<ul>
  {tasks.map((task) => (
    <li key={task.id} data-done={task.done}>
      <span>{task.title}</span>
      <button onClick={() => toggle(task.id)}>Toggle</button>
    </li>
  ))}
</ul>

{isVisible ? <A /> : <B />}
{isLoggedIn && <Profile />}
```

Соответствие: `.map()` → `v-for`, `? :` → `v-if`/`v-else`, `&&` → `v-if`, `key` → `:key`.

### Лучшие практики

- **Всегда указывайте `:key`** в `v-for` (стабильный уникальный id, не индекс) — как и в React.
- **Не сочетайте `v-if` и `v-for` на одном элементе** — используйте обёртку `<template v-if>` или предварительно отфильтруйте через `computed`.
- Для группировки без лишнего DOM-узла используйте `<template>` (аналог `<>...</>`):
  ```vue
  <template v-if="isReady">
    <Header />
    <Content />
  </template>
  ```
- Логику держите в `<script>` (computed/методы), а шаблон — максимально декларативным. Избегайте сложных выражений прямо в шаблоне.
- `v-html` — только для доверенного контента (риск XSS).

> Документация: [Template Syntax](https://vuejs.org/guide/essentials/template-syntax.html), [List Rendering](https://vuejs.org/guide/essentials/list.html), [Conditional Rendering](https://vuejs.org/guide/essentials/conditional.html).

---

## 5. Компоненты: props и events

### Теория

Однонаправленный поток данных, как в React: **данные вниз через props, события вверх через emits**.

- **`defineProps<T>()`** — объявляет входные props. Это макрос компилятора, импортировать не нужно.
- **`defineEmits<T>()`** — объявляет события, которые компонент испускает наверх.
- Вместо callback-пропсов (`onSubmit={fn}`) Vue использует **события** (`@submit="fn"`). Это идиоматичнее.

### Пример: props + emits

См. [examples/03-components/001-props-emits.vue](./examples/03-components/001-props-emits.vue):

```vue
<script setup lang="ts">
const { label } = defineProps<{
  label: string
}>()

const emit = defineEmits<{
  action: [payload: string] // имя события: [тип аргументов]
}>()

function handleClick() {
  emit('action', label)
}
</script>

<template>
  <button type="button" @click="handleClick">{{ label }}</button>
</template>
```

Использование родителем:

```vue
<template>
  <MyButton label="Save" @action="onAction" />
</template>
```

### Значения по умолчанию

С деструктуризацией props (Vue 3.5+) дефолты задаются нативно:

```ts
const { size = 'md', disabled = false } = defineProps<{
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}>()
```

Старый способ — `withDefaults(defineProps<...>(), { ... })`, но нативные дефолты предпочтительнее в 3.5+.

### Аналогия с React

```tsx
// React: props + callback-проп
type Props = { label: string; onAction: (payload: string) => void }

function MyButton({ label, onAction }: Props) {
  return <button onClick={() => onAction(label)}>{label}</button>
}

// <MyButton label="Save" onAction={onAction} />
```

Соответствие: `props` → `defineProps`, callback `onAction` → событие `emit('action', ...)` + `@action`.

Важно: во Vue props **read-only**. Мутировать проп напрямую нельзя (в React вы это и так не делаете).
Нужна локальная копия — заведите `ref`/`computed` или используйте `v-model` (раздел 7).

### Лучшие практики

- Типизируйте props и emits через дженерики (`defineProps<{...}>()`), а не runtime-объявления.
- Именуйте события в `camelCase` при объявлении, в шаблоне слушайте через `@kebab-case` или `@camelCase` (оба работают).
- Событие вместо callback-пропа: `@submit` идиоматичнее, чем проп `onSubmit`.
- Не мутируйте props. Производные данные — через `computed(() => props.x)`.
- Реальный пример из проекта — [capstone/src/components/TaskForm.vue](./capstone/src/components/TaskForm.vue): `emit('submit', result.data)`.

> Документация: [Props](https://vuejs.org/guide/components/props.html), [Events](https://vuejs.org/guide/components/events.html).

---

## 6. Слоты

### Теория

Слоты — механизм вставки контента от родителя внутрь дочернего компонента. Это аналог `children` и render props из React.

- **`<slot />`** — дефолтный слот (аналог `props.children`).
- **`<slot name="header" />`** — именованный слот (несколько «дырок» для контента).
- **`<slot :data="value" />`** — scoped slot: компонент передаёт данные наверх в слот (аналог render props).

### Пример

См. [examples/03-components/003-slots.vue](./examples/03-components/003-slots.vue):

```vue
<script setup lang="ts">
defineProps<{ title: string }>()
</script>

<template>
  <article class="panel">
    <header><slot name="header" /></header>
    <main><slot /></main>                    <!-- дефолтный слот -->
    <footer><slot name="footer" :year="2026" /></footer> <!-- scoped slot -->
  </article>
</template>
```

Использование родителем:

```vue
<template>
  <Panel title="Demo">
    <template #header><h2>Заголовок</h2></template>

    <p>Основной контент (попадёт в дефолтный слот)</p>

    <!-- scoped slot: получаем данные из дочернего компонента -->
    <template #footer="{ year }">© {{ year }}</template>
  </Panel>
</template>
```

`#header` — сокращение `v-slot:header`. `#footer="{ year }"` — деструктуризация переданных слоту данных.

### Аналогия с React

```tsx
// Дефолтный слот ≈ children
function Panel({ children }: { children: React.ReactNode }) {
  return <main>{children}</main>
}

// Именованные слоты ≈ проп с ReactNode
function Panel({ header, footer }: { header: React.ReactNode; footer: React.ReactNode }) {
  return <><header>{header}</header><footer>{footer}</footer></>
}

// Scoped slot ≈ render prop
function List({ renderItem }: { renderItem: (item: Item) => React.ReactNode }) {
  return <ul>{items.map(renderItem)}</ul>
}
```

Соответствие: `children` → `<slot />`, «слот-пропсы» с ReactNode → named slots, render props → scoped slots.

### Лучшие практики

- Дефолтный слот — для основного контента, именованные — для «плейсхолдеров» (header/footer/actions).
- Scoped slots — когда родителю нужны данные из дочернего компонента (строка таблицы, элемент списка).
- Можно задавать fallback-контент: `<slot>Нет данных</slot>` отрендерит текст, если слот не передан.
- Проверить наличие переданного слота: объект `useSlots()` (например, `if (slots.footer)`).

> Документация: [Slots](https://vuejs.org/guide/components/slots.html).

---

## 7. `v-model` — двустороннее связывание

> В React прямого аналога нет — это одна из самых заметных фишек Vue, активно используется в формах.

### Теория

`v-model` — синтаксический сахар для «value + обработчик изменения» одновременно. Он связывает состояние
и элемент **в обе стороны**: правишь состояние — обновляется input, печатаешь в input — обновляется состояние.

`v-model="x"` на нативном `<input>` разворачивается примерно в `:value="x"` + `@input="x = $event.target.value"`.

### Пример на инпутах

См. [examples/01-fundamentals/002-v-model-input.vue](./examples/01-fundamentals/002-v-model-input.vue):

```vue
<script setup lang="ts">
import { ref } from 'vue'

const search = ref('')
const quantity = ref(1)
</script>

<template>
  <input v-model="search" type="text" />
  <p>{{ search }}</p>

  <!-- .number приводит значение к числу -->
  <input v-model.number="quantity" type="number" />
  <span>{{ quantity }}</span>
</template>
```

### Модификаторы `v-model`

| Модификатор | Действие |
| --- | --- |
| `.trim` | обрезает пробелы по краям |
| `.number` | приводит к числу |
| `.lazy` | синхронизирует на `change`, а не `input` (после потери фокуса) |

```vue
<input v-model.trim="name" />
<input v-model.lazy="comment" />
```

`v-model` работает и с чекбоксами, radio, select:

```vue
<input type="checkbox" v-model="isDone" />              <!-- boolean -->
<input type="checkbox" v-model="tags" value="vue" />    <!-- массив при нескольких -->
<select v-model="selected">
  <option value="a">A</option>
</select>
```

### `defineModel()` — `v-model` на своём компоненте

Чтобы родитель мог писать `<MyInput v-model="text" />`, компонент объявляет модель через `defineModel()`.

См. [examples/03-components/002-define-model.vue](./examples/03-components/002-define-model.vue):

```vue
<script setup lang="ts">
const model = defineModel<string>({ default: '' })
</script>

<template>
  <input v-model="model" type="text" />
</template>
```

`model` — это `ref`, запись в `model.value` автоматически синхронизируется с родителем. Под капотом это
проп `modelValue` + событие `update:modelValue`, но `defineModel()` скрывает эту механику.

Несколько моделей (именованные):

```vue
<script setup lang="ts">
const firstName = defineModel<string>('firstName')
const lastName = defineModel<string>('lastName')
</script>

<!-- родитель: -->
<UserName v-model:first-name="first" v-model:last-name="last" />
```

### Аналогия с React

```tsx
// React: контролируемый инпут — value + onChange вручную
const [search, setSearch] = useState('')
<input value={search} onChange={(e) => setSearch(e.target.value)} />

// Кастомный «v-model» в React делают через value + onChange пропсы:
<MyInput value={text} onChange={setText} />
```

`v-model` = связка `value` + `onChange` «из коробки», плюс модификаторы (`.trim`, `.number`), которые в React пишешь руками.

### Лучшие практики

- Для форм с несколькими полями держите объект в `ref` и биндите `v-model="form.email"` (см. раздел 15).
- Используйте `.trim` для текстовых полей и `.number` для числовых — меньше ручной нормализации.
- В своих компонентах — `defineModel()`, а не ручной проп `modelValue` + emit.

> Документация: [v-model на формах](https://vuejs.org/guide/essentials/forms.html), [Component v-model](https://vuejs.org/guide/components/v-model.html).

---

## 8. Модификаторы событий

> Ещё одна вещь, которой нет в React: декларативные модификаторы прямо в шаблоне.

### Теория

Модификаторы событий — постфиксы к `@event`, которые заменяют шаблонный код вроде `e.preventDefault()` или `e.stopPropagation()`.

| Модификатор | Эквивалент |
| --- | --- |
| `@submit.prevent` | `e.preventDefault()` |
| `@click.stop` | `e.stopPropagation()` |
| `@click.self` | сработает, только если клик по самому элементу, не по потомку |
| `@click.once` | обработчик сработает один раз |
| `@click.capture` | фаза перехвата (capture) |
| `@click.prevent.stop` | комбинируются |

Key-модификаторы для клавиатуры:

```vue
<input @keyup.enter="submit" />
<input @keyup.esc="cancel" />
<input @keydown.ctrl.s.prevent="save" />
```

### Пример

Из [examples/07-forms/001-login-form.vue](./examples/07-forms/001-login-form.vue) и
[capstone/src/components/TaskForm.vue](./capstone/src/components/TaskForm.vue):

```vue
<template>
  <!-- .prevent убирает перезагрузку страницы при submit -->
  <form @submit.prevent="onSubmit">
    <input v-model="title" />
    <button type="submit">Add task</button>
  </form>
</template>
```

### Аналогия с React

```tsx
// React: вызываешь preventDefault вручную
<form onSubmit={(e) => { e.preventDefault(); onSubmit() }}>

<input onKeyUp={(e) => { if (e.key === 'Enter') submit() }} />
```

Vue делает это декларативно: `@submit.prevent="onSubmit"`, `@keyup.enter="submit"` — меньше шаблонного кода и ошибок.

### Лучшие практики

- Для форм почти всегда `@submit.prevent`.
- `@click.stop` — точечно; чрезмерное «глушение» всплытия усложняет отладку.
- Key-модификаторы (`.enter`, `.esc`) читабельнее ручной проверки `event.key`.

> Документация: [Event Modifiers](https://vuejs.org/guide/essentials/event-handling.html#event-modifiers).

---

## 9. Composables (= custom hooks)

### Теория

Composable — это функция `useXxx`, инкапсулирующая переиспользуемую **реактивную** логику. Идея та же, что у custom hooks в React:
вынести состояние + эффекты + методы в отдельную функцию и переиспользовать между компонентами.

Отличия от React-хуков:
- Нет «правил хуков» (можно вызывать в условиях/циклах — но обычно вызывают на верхнем уровне `setup`).
- Возвращают `ref`/`computed`/функции; вызывающий сам решает, что деструктурировать.
- Lifecycle-хуки (`onMounted`, `onUnmounted`) внутри composable «привязываются» к компоненту, который его вызвал.

### Пример: простое состояние

См. [examples/04-composables/useToggle.ts](./examples/04-composables/useToggle.ts):

```ts
import { ref } from 'vue'

export function useToggle(initial = false) {
  const isOpen = ref(initial)

  function toggle() { isOpen.value = !isOpen.value }
  function open() { isOpen.value = true }
  function close() { isOpen.value = false }

  return { isOpen, toggle, open, close }
}
```

Использование:

```vue
<script setup lang="ts">
import { useToggle } from '@/composables/useToggle'
const { isOpen, toggle } = useToggle()
</script>
```

### Пример: состояние + эффект (localStorage)

См. [examples/04-composables/useLocalStorage.ts](./examples/04-composables/useLocalStorage.ts):

```ts
import { ref, watch, type Ref } from 'vue'

export function useLocalStorage<T>(key: string, defaultValue: T): Ref<T> {
  const stored = localStorage.getItem(key)
  const initial = stored !== null ? (JSON.parse(stored) as T) : defaultValue
  const data = ref(initial) as Ref<T>

  watch(data, (value) => localStorage.setItem(key, JSON.stringify(value)), {
    deep: true,
    flush: 'sync',
  })

  return data
}
```

### Пример: DOM-подписка с очисткой

[examples/04-composables/useClickOutside.ts](./examples/04-composables/useClickOutside.ts) (см. раздел 3) — регистрирует
слушатель в `onMounted` и снимает в `onUnmounted`. Так же, как custom hook в React с cleanup.

### Пример из проекта: производный список

[capstone/src/composables/useFilteredTasks.ts](./capstone/src/composables/useFilteredTasks.ts) — принимает
реактивные `Ref` и возвращает `computed`:

```ts
import { computed, type Ref } from 'vue'

export function useFilteredTasks(
  tasks: Ref<Task[] | undefined>,
  filter: Ref<TaskFilter>,
  search: Ref<string>,
) {
  return computed(() => {
    const list = tasks.value ?? []
    const q = search.value.trim().toLowerCase()
    return list.filter((task) => {
      const matchesFilter =
        filter.value === 'all' ||
        (filter.value === 'active' && !task.done) ||
        (filter.value === 'done' && task.done)
      const matchesSearch = q.length === 0 || task.title.toLowerCase().includes(q)
      return matchesFilter && matchesSearch
    })
  })
}
```

### Аналогия с React

```tsx
// React custom hook
function useToggle(initial = false) {
  const [isOpen, setIsOpen] = useState(initial)
  const toggle = useCallback(() => setIsOpen((v) => !v), [])
  return { isOpen, toggle }
}
```

Соответствие практически прямое. Но во Vue не нужен `useCallback` (функции стабильны — `setup` выполняется раз),
и вы возвращаете реактивные `ref`, а не пару `[value, setter]`.

### Лучшие практики

- Имя всегда с префикса `use` (`useToggle`, `useFilteredTasks`).
- Принимайте `Ref`-аргументы, если composable должен реагировать на изменения снаружи (как `useFilteredTasks`).
- Возвращайте объект из `ref`/`computed`/функций — вызывающий деструктурирует нужное.
- **Не деструктурируйте `reactive` при возврате** — потеряете реактивность (возвращайте `ref`/`computed` или `toRefs`).
- Эффекты и подписки регистрируйте через lifecycle-хуки — они сами очистятся при размонтировании компонента.

> Документация: [Composables](https://vuejs.org/guide/reusability/composables.html).

---

## 10. `provide` / `inject` (= Context)

### Теория

`provide` / `inject` — механизм передачи данных вглубь дерева компонентов без «prop drilling».
Прямой аналог React Context (`Provider` + `useContext`).

- Родитель (или любой предок) вызывает `provide(key, value)`.
- Любой потомок вызывает `inject(key)` и получает значение.
- Значение может быть реактивным (`ref`/`computed`/`reactive`) — тогда обновления «долетают» до потребителей.

### Пример

```ts
// keys.ts — типобезопасные ключи
import type { InjectionKey, Ref } from 'vue'

export interface Theme {
  color: Ref<string>
  toggle: () => void
}

export const themeKey: InjectionKey<Theme> = Symbol('theme')
```

```vue
<!-- Provider (предок) -->
<script setup lang="ts">
import { provide, ref } from 'vue'
import { themeKey } from './keys'

const color = ref('light')
function toggle() {
  color.value = color.value === 'light' ? 'dark' : 'light'
}

provide(themeKey, { color, toggle })
</script>
```

```vue
<!-- Consumer (любой потомок) -->
<script setup lang="ts">
import { inject } from 'vue'
import { themeKey } from './keys'

const theme = inject(themeKey)
// theme?.color.value, theme?.toggle()
</script>
```

### Аналогия с React

```tsx
// React
const ThemeContext = createContext<Theme | null>(null)

// Provider
<ThemeContext.Provider value={{ color, toggle }}>{children}</ThemeContext.Provider>

// Consumer
const theme = useContext(ThemeContext)
```

Соответствие: `createContext` + `Provider` → `provide(key, value)`; `useContext` → `inject(key)`.
`InjectionKey<T>` даёт типобезопасность (в React тип задаётся в `createContext<T>`).

### Лучшие практики

- Используйте типизированный `InjectionKey<T>` (через `Symbol`) — избегаете коллизий и получаете типы.
- Оборачивайте `provide`/`inject` в composable (`useTheme()`), который делает `inject` и кидает ошибку, если провайдер отсутствует:
  ```ts
  export function useTheme() {
    const theme = inject(themeKey)
    if (!theme) throw new Error('useTheme must be used within a theme provider')
    return theme
  }
  ```
- Для **глобального** состояния приложения предпочитайте Pinia (раздел 12), а `provide`/`inject` — для локального внедрения зависимостей в поддерево.

> Документация: [Provide / Inject](https://vuejs.org/guide/components/provide-inject.html).

---

## 11. Scoped-стили в SFC

> Ещё одна вещь «из коробки», которой в React нет без дополнительных инструментов.

### Теория

Блок `<style scoped>` в SFC автоматически инкапсулирует стили: они применяются **только** к текущему компоненту.
Vue добавляет каждому элементу компонента уникальный атрибут (`data-v-xxxxxxx`) и дописывает его в CSS-селекторы,
поэтому классы не «протекают» на другие компоненты — не нужны БЭМ-неймспейсы или CSS-in-JS.

### Пример

Из [capstone/src/components/TaskForm.vue](./capstone/src/components/TaskForm.vue):

```vue
<template>
  <form class="task-form">...</form>
</template>

<style scoped>
.task-form {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

input {
  padding: 0.5rem 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
}
</style>
```

Селектор `input` затронет только инпуты внутри этого компонента, а не по всему приложению.

### Достучаться до дочернего компонента: `:deep()`

Scoped-стили не проникают в дочерние компоненты. Чтобы стилизовать их элементы намеренно, используйте `:deep()`:

```vue
<style scoped>
.wrapper :deep(.child-class) {
  color: red;
}
</style>
```

Полезные псевдоклассы: `:slotted(...)` (для контента слотов), `:global(...)` (глобальное правило внутри scoped-блока).

### CSS-модули и `v-bind` в стилях

```vue
<script setup lang="ts">
const color = ref('#42b883')
</script>

<style scoped>
button { background: v-bind(color); } /* реактивная CSS-переменная */
</style>
```

Также доступен `<style module>` (CSS Modules) с доступом через объект `$style`.

### Аналогия с React

| React | Vue |
| --- | --- |
| CSS Modules (`styles.button`) | `<style scoped>` (просто пишете класс) |
| styled-components / emotion | `<style scoped>` + `v-bind()` в CSS |
| глобальный CSS | `<style>` без `scoped` |

Во Vue инкапсуляция «бесплатна» — не нужен отдельный пакет или соглашение об именовании.

### Лучшие практики

- По умолчанию — `<style scoped>` в каждом компоненте.
- Глобальные стили (reset, темы) держите в отдельном файле (в проекте — `src/assets/main.css`, подключается в [src/main.ts](./src/main.ts)).
- `:deep()` — точечно и осознанно; злоупотребление ломает инкапсуляцию.
- `v-bind()` в CSS — удобно для динамических тем без inline-стилей.

> Документация: [SFC CSS Features](https://vuejs.org/api/sfc-css-features.html).

---

## 12. Pinia — управление состоянием

### Теория

Pinia — официальный стор Vue (замена Vuex). Аналог Zustand/Redux Toolkit. В проекте используется **setup-стиль**:
`defineStore` принимает функцию, где вы объявляете `ref` (state), `computed` (getters) и функции (actions) —
ровно как в composable, только это singleton на всё приложение.

Соответствие с частями стора:
- `ref()` → **state**
- `computed()` → **getters** (производное состояние)
- обычные функции → **actions** (изменение состояния, в т.ч. асинхронное)

### Пример

См. [examples/06-pinia/useCartStore.ts](./examples/06-pinia/useCartStore.ts):

```ts
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

export const useCartStore = defineStore('cart', () => {
  const items = ref<CartItem[]>([])

  const total = computed(() =>
    items.value.reduce((sum, item) => sum + item.price * item.qty, 0),
  )

  function addItem(item: Omit<CartItem, 'qty'>, qty = 1) {
    const existing = items.value.find((i) => i.id === item.id)
    if (existing) { existing.qty += qty; return }
    items.value.push({ ...item, qty })
  }

  function clear() { items.value = [] }

  return { items, total, addItem, clear }
})
```

Пример из проекта — [capstone/src/stores/taskFilters.ts](./capstone/src/stores/taskFilters.ts) (фильтры списка задач).

### Использование в компоненте

```vue
<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCartStore } from '@/stores/cart'

const cart = useCartStore()

// state и getters нужно доставать через storeToRefs, чтобы сохранить реактивность
const { items, total } = storeToRefs(cart)

// actions можно деструктурировать напрямую — они не реактивные значения
const { addItem, clear } = cart
</script>

<template>
  <p>Итого: {{ total }}</p>
  <button @click="clear">Очистить</button>
</template>
```

Подключение — один раз в [src/main.ts](./src/main.ts): `app.use(createPinia())`.

### Аналогия с React

```ts
// Zustand
const useCartStore = create((set, get) => ({
  items: [],
  addItem: (item) => set((s) => ({ items: [...s.items, item] })),
}))
```

Соответствие: `create` → `defineStore`, состояние в `set/get` → `ref`, селекторы → `computed`/`storeToRefs`.
Отличие: в Pinia состояние **мутируется напрямую** (`items.value.push(...)`), без иммутабельных `set`.

### Лучшие практики

- Setup-стиль (`defineStore('id', () => {...})`) — как в проекте; читается как composable.
- Доставайте state/getters через **`storeToRefs`**, иначе при деструктуризации потеряете реактивность (частая ошибка).
- Actions деструктурируйте напрямую (они методы, не реактивные значения).
- Разбивайте на несколько маленьких сторов по домену, а не один гигантский.
- Для серверных данных (fetch/кэш) используйте Pinia Colada (раздел 14), а не «ручной» стор.

> Документация: [pinia.vuejs.org](https://pinia.vuejs.org/).

---

## 13. Vue Router

### Теория

Официальный роутер, по API очень близок к React Router. Маршруты описываются массивом объектов
`{ path, name, component }`, поддерживаются вложенные маршруты, динамические параметры и ленивая загрузка.

### Пример: определение маршрутов

См. [src/router/index.ts](./src/router/index.ts):

```ts
import { createRouter, createWebHistory } from 'vue-router'
import CourseHomeView from '../views/CourseHomeView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', name: 'course-home', component: CourseHomeView },
    // ленивая загрузка (code-splitting) — аналог React.lazy
    { path: '/tasks', name: 'tasks', component: () => import('@capstone/views/TaskListView.vue') },
    // динамический параметр :id
    { path: '/tasks/:id', name: 'task-detail', component: () => import('@capstone/views/TaskDetailView.vue') },
    // 404 (catch-all)
    { path: '/:pathMatch(.*)*', name: 'not-found', component: () => import('../views/NotFoundView.vue') },
  ],
})

export default router
```

### Навигация в шаблоне и коде

```vue
<script setup lang="ts">
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()   // текущий маршрут (params, query)
const router = useRouter() // программная навигация

const id = route.params.id

function goToTasks() {
  router.push({ name: 'tasks' })
}
</script>

<template>
  <!-- декларативная навигация -->
  <RouterLink :to="{ name: 'task-detail', params: { id: '1' } }">Открыть</RouterLink>
  <RouterView /> <!-- сюда рендерится компонент активного маршрута -->
</template>
```

Вложенные маршруты — через `children` + `<RouterView />` в родительском layout-компоненте
(см. [examples/05-routing/001-nested-router.test.ts](./examples/05-routing/001-nested-router.test.ts)).

### Аналогия с React Router

| React Router | Vue Router |
| --- | --- |
| `<Routes>` / `createBrowserRouter` | `createRouter` + `createWebHistory` |
| `<Route path element>` | объект `{ path, component }` |
| `<Link to>` | `<RouterLink :to>` |
| `<Outlet />` | `<RouterView />` |
| `useNavigate()` | `useRouter().push()` |
| `useParams()` | `useRoute().params` |
| `React.lazy(() => import(...))` | `component: () => import(...)` |

### Лучшие практики

- Именуйте маршруты (`name`) и навигируйте по имени — устойчивее к изменению путей.
- Ленивая загрузка `() => import(...)` для всех «тяжёлых»/некорневых страниц.
- Guard-логика (авторизация) — через `router.beforeEach`.
- Подключение — один раз в [src/main.ts](./src/main.ts): `app.use(router)`.

> Документация: [router.vuejs.org](https://router.vuejs.org/).

---

## 14. Server state: Pinia Colada (= TanStack Query)

### Теория

`@pinia/colada` — слой для работы с серверным состоянием: кэширование, дедупликация запросов, статусы загрузки,
инвалидация. По духу и API — как TanStack Query. `useQuery` для чтения, `useMutation` для изменений.

### Пример: `useQuery`

Из [examples/08-server-state/useTasksQuery.test.ts](./examples/08-server-state/useTasksQuery.test.ts)
(API — [examples/08-server-state/tasksApi.ts](./examples/08-server-state/tasksApi.ts)):

```vue
<script setup lang="ts">
import { useQuery } from '@pinia/colada'
import { fetchTasks } from './tasksApi'

const { data, isPending, error } = useQuery({
  key: ['tasks'],          // ключ кэша
  query: () => fetchTasks(), // функция-загрузчик
})
</script>

<template>
  <p v-if="isPending">Loading…</p>
  <p v-else-if="error">Ошибка</p>
  <ul v-else>
    <li v-for="t in data" :key="t.id">{{ t.title }}</li>
  </ul>
</template>
```

### Пример: `useMutation`

```vue
<script setup lang="ts">
import { useMutation, useQueryCache } from '@pinia/colada'
import { createTask } from './tasksApi'

const cache = useQueryCache()

const { mutate, isLoading } = useMutation({
  mutation: (title: string) => createTask(title),
  onSettled: () => cache.invalidateQueries({ key: ['tasks'] }), // рефетч после мутации
})
</script>
```

### Аналогия с TanStack Query

| TanStack Query | Pinia Colada |
| --- | --- |
| `useQuery({ queryKey, queryFn })` | `useQuery({ key, query })` |
| `useMutation({ mutationFn })` | `useMutation({ mutation })` |
| `isLoading` / `isPending` | `isPending` / `isLoading` |
| `queryClient.invalidateQueries` | `useQueryCache().invalidateQueries` |

Идея та же: не держите серверные данные в обычном сторе вручную — пусть за кэш и статусы отвечает библиотека.

### Лучшие практики

- Стабильные и осмысленные `key` (массивы), включайте в ключ параметры (`['tasks', filter]`).
- Разделяйте **серверное** состояние (Pinia Colada) и **клиентское** UI-состояние (Pinia, раздел 12).
- Инвалидация/рефетч после мутаций через `invalidateQueries`.
- Подключение — плагин в [src/main.ts](./src/main.ts): `app.use(PiniaColada)` (после `createPinia()`).

> Документация: [pinia-colada.esm.dev](https://pinia-colada.esm.dev/).

---

## 15. Формы и валидация с Zod

### Теория

Vue не навязывает форм-библиотеку: `v-model` покрывает связывание, а **Zod** даёт схему + вывод типов + сообщения об ошибках.
Типичный паттерн: держать данные формы в `ref`, а на submit — `schema.safeParse(...)`.

### Пример: схема

См. [capstone/src/schemas/task.ts](./capstone/src/schemas/task.ts):

```ts
import { z } from 'zod'

export const createTaskSchema = z.object({
  title: z.string().trim().min(1, 'Title is required').max(100, 'Max 100 characters'),
})

export type CreateTaskInput = z.infer<typeof createTaskSchema> // тип выводится из схемы
```

### Пример: форма (одно поле)

См. [capstone/src/components/TaskForm.vue](./capstone/src/components/TaskForm.vue):

```vue
<script setup lang="ts">
import { ref } from 'vue'
import { createTaskSchema, type CreateTaskInput } from '@capstone/schemas/task'

const emit = defineEmits<{ submit: [data: CreateTaskInput] }>()

const title = ref('')
const error = ref<string | null>(null)

function onSubmit() {
  const result = createTaskSchema.safeParse({ title: title.value })
  if (!result.success) {
    error.value = result.error.issues[0]?.message ?? 'Invalid'
    return
  }
  error.value = null
  emit('submit', result.data)
  title.value = ''
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="title" :aria-invalid="!!error" />
    <p v-if="error" role="alert">{{ error }}</p>
    <button type="submit">Add task</button>
  </form>
</template>
```

### Пример: несколько полей + карта ошибок

См. [examples/07-forms/001-login-form.vue](./examples/07-forms/001-login-form.vue) и
[examples/07-forms/loginSchema.ts](./examples/07-forms/loginSchema.ts):

```ts
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Min 8 characters'),
})

export function flattenZodErrors(error: z.ZodError): Record<string, string> {
  const result: Record<string, string> = {}
  for (const issue of error.issues) {
    const key = issue.path[0]
    if (typeof key === 'string' && !result[key]) result[key] = issue.message
  }
  return result
}
```

```vue
<script setup lang="ts">
const form = ref<LoginForm>({ email: '', password: '' })
const errors = ref<Record<string, string>>({})

function onSubmit() {
  const result = loginSchema.safeParse(form.value)
  if (!result.success) { errors.value = flattenZodErrors(result.error); return }
  errors.value = {}
  emit('submit', result.data)
}
</script>

<template>
  <form @submit.prevent="onSubmit">
    <input v-model="form.email" :aria-invalid="!!errors.email" />
    <p v-if="errors.email" role="alert">{{ errors.email }}</p>
    <input v-model="form.password" type="password" :aria-invalid="!!errors.password" />
    <p v-if="errors.password" role="alert">{{ errors.password }}</p>
    <button type="submit">Sign in</button>
  </form>
</template>
```

### Аналогия с React

```tsx
// React: React Hook Form + zodResolver
const { register, handleSubmit, formState: { errors } } =
  useForm({ resolver: zodResolver(loginSchema) })
```

Во Vue связывание проще (`v-model` вместо `register`), а Zod используется так же. Для сложных форм есть
`vee-validate` (аналог React Hook Form), но для большинства задач хватает `v-model` + `safeParse`.

### Лучшие практики

- Выводите типы из схемы через `z.infer<typeof schema>` — единый источник истины.
- Используйте `safeParse` (не `parse`) и обрабатывайте `result.success`.
- Держите объект формы в одном `ref` и биндите `v-model="form.field"`.
- Ошибки — реактивный объект `Record<string, string>`, показывайте через `v-if` + `role="alert"` и `:aria-invalid`.
- `.trim()`/`.min()` в схеме заменяют ручную нормализацию.

> Документация: [Zod](https://zod.dev/), [Vue Forms](https://vuejs.org/guide/essentials/forms.html).

---

## 16. Тестирование: Vitest + Vue Test Utils

### Теория

Стек тестов в проекте — **Vitest** (раннер, API как у Jest) + **Vue Test Utils** (`@vue/test-utils`, монтирование компонентов).
Аналог React Testing Library: монтируете компонент, взаимодействуете, проверяете DOM/эмиты.

Ключевые API VTU:
- `mount(Component, options)` — монтирует компонент.
- `wrapper.get(selector)` / `wrapper.find(selector)` — поиск элемента (`get` бросает, если нет; `find` возвращает пустышку).
- `wrapper.trigger('event')`, `wrapper.setValue(v)` — взаимодействие.
- `wrapper.emitted('event')` — какие события испустил компонент.
- `await nextTick()` / `await wrapper.trigger(...)` — дождаться обновления DOM (реактивность асинхронна).

### Пример

См. [capstone/src/components/TaskForm.test.ts](./capstone/src/components/TaskForm.test.ts):

```ts
import { describe, it, expect } from 'vitest'
import { mount } from '@vue/test-utils'
import TaskForm from '@capstone/components/TaskForm.vue'

describe('TaskForm', () => {
  it('shows validation error for empty title', async () => {
    const wrapper = mount(TaskForm)
    await wrapper.get('[data-testid="task-form"]').trigger('submit.prevent')
    expect(wrapper.get('[data-testid="title-error"]').text()).toContain('required')
  })

  it('emits submit with valid title', async () => {
    const wrapper = mount(TaskForm)
    await wrapper.get('[data-testid="title-input"]').setValue('Ship feature')
    await wrapper.get('[data-testid="task-form"]').trigger('submit.prevent')
    expect(wrapper.emitted('submit')?.[0]).toEqual([{ title: 'Ship feature' }])
  })
})
```

### Тесты с плагинами (Pinia, Router, Colada)

Плагины подключаются через `global.plugins` (см. [examples/08-server-state/useTasksQuery.test.ts](./examples/08-server-state/useTasksQuery.test.ts)
и [examples/05-routing/001-nested-router.test.ts](./examples/05-routing/001-nested-router.test.ts)):

```ts
import { createPinia } from 'pinia'
import { PiniaColada } from '@pinia/colada'

const wrapper = mount(Component, {
  global: { plugins: [createPinia(), PiniaColada] },
})
```

### Аналогия с React

| React Testing Library | Vue Test Utils |
| --- | --- |
| `render(<Comp />)` | `mount(Comp)` |
| `screen.getByTestId` | `wrapper.get('[data-testid=…]')` |
| `fireEvent` / `userEvent` | `wrapper.trigger(...)`, `setValue(...)` |
| `waitFor` | `await nextTick()` / `await wrapper.trigger` |
| проверка колбэка (мок) | `wrapper.emitted('event')` |

### Лучшие практики

- Ищите по `data-testid`, а не по классам/тексту (устойчивее к рефакторингу) — так сделано во всех примерах проекта.
- **`await`** триггеры/`nextTick` — реактивность применяется асинхронно, без ожидания DOM не обновится.
- Проверяйте контракт компонента через `emitted()`, а не внутренности.
- Composables можно тестировать изолированно, оборачивая в тестовый компонент или монтируя.
- Запуск: `npm run test` (см. [package.json](./package.json)).

> Документация: [Vue Testing Guide](https://vuejs.org/guide/scaling-up/testing.html), [Vue Test Utils](https://test-utils.vuejs.org/), [Vitest](https://vitest.dev/).

---

## 17. Производительность

### Теория

Vue уже эффективен: `setup` выполняется один раз, а обновляются только те части DOM, которые зависят от изменившихся
реактивных значений. Поэтому «ручной мемоизации» нужно заметно меньше, чем в React. Инструменты, когда всё же нужно:

- **`computed`** — кэширует производные значения (используйте вместо вызова функций в шаблоне).
- **`v-memo`** — пропускает повторный рендер поддерева, пока указанные зависимости не изменились (для больших списков).
- **`v-once`** — рендерит элемент один раз и больше не обновляет.
- **`shallowRef` / `shallowReactive`** — поверхностная реактивность для больших структур, где глубокое отслеживание избыточно.
- **`defineAsyncComponent`** и ленивые маршруты — code-splitting.

### Пример: `v-memo`

См. [examples/09-performance/001-v-memo-list.vue](./examples/09-performance/001-v-memo-list.vue):

```vue
<template>
  <ul>
    <!-- строка перерисуется только при смене row.id или row.selected -->
    <li v-for="row in rows" :key="row.id" v-memo="[row.id, row.selected]">
      <span>{{ row.label }}</span>
      <button @click="toggle(row.id)">Toggle</button>
    </li>
  </ul>
</template>
```

### Ленивые компоненты

```ts
import { defineAsyncComponent } from 'vue'

const HeavyChart = defineAsyncComponent(() => import('./HeavyChart.vue'))
```

Плюс ленивые маршруты `component: () => import(...)` (см. раздел 13).

### Аналогия с React

| React | Vue |
| --- | --- |
| `useMemo` | `computed` |
| `React.memo` | `v-memo` (точечно) / поведение по умолчанию |
| `useCallback` | не нужен (функции стабильны) |
| `React.lazy` + `Suspense` | `defineAsyncComponent` + `<Suspense>` |

Важно: во Vue **не** нужно оборачивать функции в `useCallback` и значения в `useMemo` ради стабильности ссылок —
это следствие того, что `setup` не перезапускается.

### Лучшие практики

- Сначала измерьте (Vue DevTools), потом оптимизируйте — не добавляйте `v-memo` «на всякий случай».
- `computed` вместо тяжёлых выражений/функций в шаблоне.
- `v-memo` — для длинных списков с редко меняющимися строками.
- Ленивая загрузка тяжёлых страниц/компонентов.
- `shallowRef` для больших неизменяемых-по-вложенности структур (например, инстанс сторонней библиотеки).

> Документация: [Performance](https://vuejs.org/guide/best-practices/performance.html).

---

## 18. Шпаргалка-ловушки для React-разработчика

Частые ошибки при переходе с React и как их избежать.

1. **Забытый `.value`.**
   В `<script>` к `ref` обращаются через `.value`. `count++` вместо `count.value++` — тихий баг.
   В `<template>` `.value` наоборот **не** пишут.

2. **Деструктуризация `reactive` ломает реактивность.**
   ```ts
   const state = reactive({ count: 0 })
   const { count } = state // ❌ потеряна реактивность
   ```
   Решение: используйте `ref`, либо `toRefs(state)`, либо обращайтесь через `state.count`.

3. **Деструктуризация стора без `storeToRefs`.**
   ```ts
   const { items } = useCartStore() // ❌ не реактивно
   const { items } = storeToRefs(useCartStore()) // ✅
   ```

4. **Мутация `props`.** Props read-only. Нужна локальная версия — заведите `ref`/`computed` или используйте `v-model` + `defineModel`.

5. **Реактивность асинхронна.** После изменения состояния DOM обновится не мгновенно.
   В тестах — `await nextTick()`; в коде, если нужно прочитать обновлённый DOM — тоже `await nextTick()`.

6. **`v-if` + `v-for` на одном элементе.** Не делайте так — выносите `v-if` на `<template>` или фильтруйте через `computed`.

7. **Индекс как `:key`.** Как и в React, для динамических списков используйте стабильный `id`, а не индекс.

8. **Ожидание «правил хуков».** Их нет, но `ref`/`computed`/lifecycle-хуки принято объявлять на верхнем уровне `setup`.

9. **`computed` должен быть чистым.** Не создавайте в нём побочных эффектов и не мутируйте состояние — только вычисляйте.

10. **`watch` по объекту без `deep`.** Изменение вложенного поля не триггерит `watch(obj, ...)` без `{ deep: true }`
    (или наблюдайте конкретный геттер `() => obj.field`).

11. **Реактивность массивов/объектов.** С `ref`/`reactive` работают привычные мутации (`push`, присваивание по индексу,
    добавление ключей) — иммутабельность, как в React, не требуется.

12. **`useCallback`/`useMemo` по привычке.** Не нужны: функции в `setup` стабильны, для кэширования значений есть `computed`.

### Быстрый чеклист перед рабочей задачей

- [ ] Компонент — `<script setup lang="ts">`, состояние — `ref`, производное — `computed`.
- [ ] Эффекты — `watch`/`watchEffect`; подписки — `onMounted`/`onUnmounted`.
- [ ] Разметка — директивы (`v-if`/`v-for`/`@`/`:`), у списков — стабильный `:key`.
- [ ] Данные вниз — `defineProps`; события вверх — `defineEmits`; формы — `v-model` (+ `.trim`/`.number`).
- [ ] Переиспользуемая логика — composable `useXxx`; клиентское состояние — Pinia; серверное — Pinia Colada.
- [ ] Валидация — Zod (`safeParse` + `z.infer`).
- [ ] Стили — `<style scoped>`.
- [ ] Тесты — `mount` + `data-testid` + `await`.

---

## Что учить дальше

- Пройдите официальный интерактивный туториал: [vuejs.org/tutorial](https://vuejs.org/tutorial/).
- Прочитайте гайд целиком: [vuejs.org/guide](https://vuejs.org/guide/introduction.html).
- Разберите примеры в этом репозитории по папкам `examples/01-fundamentals` … `examples/09-performance`
  и капстоун-приложение `capstone/` — они покрывают все темы выше на рабочем коде с тестами.

Удачи на проекте!
