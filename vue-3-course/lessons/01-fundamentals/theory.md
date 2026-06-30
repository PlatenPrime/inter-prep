# Модуль 01 — Шаблоны и директивы

## Цель

Освоить декларативный синтаксис шаблонов Vue: привязки, события, условия, списки, двустороннее связывание.

## Интерполяция и v-bind

```vue
<template>
  <p>{{ message }}</p>
  <a :href="url">Link</a>
  <!-- shorthand: v-bind:href → :href -->
</template>
```

React-аналог: `{message}` и `href={url}`.

## v-on (события)

```vue
<button @click="increment">+</button>
<button @click.prevent="submit">Submit</button>
```

Модификаторы:
- `.prevent` — `event.preventDefault()`
- `.stop` — `event.stopPropagation()`
- `.once` — обработчик сработает один раз
- `.enter`, `.esc` — клавиши

## v-if vs v-show

| Директива | Поведение | Когда использовать |
|-----------|-----------|-------------------|
| `v-if` | Создаёт/удаляет DOM | Редкие переключения, тяжёлые поддеревья |
| `v-show` | `display: none` | Частые переключения (табы) |

```vue
<div v-if="isLoggedIn">Dashboard</div>
<div v-show="activeTab === 'settings'">Settings panel</div>
```

React: `v-if` ≈ `{cond && <X />}`; `v-show` ≈ `style={{ display: cond ? 'block' : 'none' }}`.

## v-for и :key

```vue
<li v-for="task in tasks" :key="task.id">
  {{ task.title }}
</li>
```

**Правило:** `:key` — стабильный уникальный id, не индекс (при мутациях списка).

## v-model

Синтаксический сахар для controlled input:

```vue
<input v-model="search" />
<!-- эквивалент :value="search" @input="search = $event.target.value" -->
```

Модификаторы:
- `v-model.lazy` — обновление на `change`, не `input`
- `v-model.number` — приведение к числу
- `v-model.trim` — trim для строк

На компонентах (Vue 3): `v-model` = prop `modelValue` + emit `update:modelValue`. В новом коде используйте `defineModel()` (модуль 03).

## class и style binding

```vue
<div :class="{ active: isActive, disabled: !enabled }" />
<div :style="{ color: textColor }" />
```

## Примеры в репозитории

- `examples/01-fundamentals/001-template-basics.vue`
- `examples/01-fundamentals/002-v-model-input.vue`
- `examples/01-fundamentals/003-v-for-list.vue`

Запуск тестов:

```bash
npx vitest run examples/01-fundamentals
```

## Anti-patterns

- Индекс как `:key` при reorder/delete элементов.
- `v-if` и `v-for` на одном элементе (Vue 3: `v-if` имеет приоритет — лучше обернуть в `<template>`).
- Логика в шаблоне — выносите в `computed`.

## Следующий модуль

[02-reactivity/theory.md](../02-reactivity/theory.md)
