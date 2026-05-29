# Q024. Что такое аргументы директивных хуков?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Хуки директив получают четыре аргумента: **`el`** (DOM-элемент), **`binding`** (объект с `value`, `oldValue`, `arg`, `modifiers`, `instance`, `dir`), **`vnode`** (виртуальный узел) и **`prevVnode`** (предыдущий VNode, только в `beforeUpdate`/`updated`). Через `binding` директива получает значение (`v-color="'red'"` → `binding.value = 'red'`), аргумент (`v-color:bg` → `binding.arg = 'bg'`) и модификаторы (`v-color.bold` → `binding.modifiers.bold = true`).

---

## Развёрнутый ответ

### Суть и определение

Аргументы хуков директив — это API для передачи данных и настроек из шаблона в логику директивы. Они позволяют сделать директиву гибкой и переиспользуемой.

### Структура объекта `binding`

```typescript
interface DirectiveBinding<V = any> {
  value: V           // Текущее значение: v-dir="expression" → binding.value
  oldValue: V        // Предыдущее значение (только в beforeUpdate/updated)
  arg?: string       // Аргумент: v-dir:argName → binding.arg = 'argName'
  modifiers: Record<string, boolean> // v-dir.mod1.mod2 → { mod1: true, mod2: true }
  instance: ComponentPublicInstance | null  // Экземпляр компонента
  dir: ObjectDirective<any, V> // Объект самой директивы
}
```

### Как это работает

```vue
<template>
  <!-- binding.value = 'red' -->
  <p v-color="'red'">Красный текст</p>

  <!-- binding.value = color (реактивная переменная) -->
  <p v-color="color">Цвет из переменной</p>

  <!-- binding.arg = 'bg', binding.value = 'blue' -->
  <p v-color:bg="'blue'">Синий фон</p>

  <!-- binding.modifiers = { bold: true, italic: true } -->
  <p v-color.bold.italic="'green'">Жирный курсивный зелёный</p>

  <!-- Динамический аргумент -->
  <p v-color:[colorTarget]="'purple'">Динамический аргумент</p>
</template>
```

```typescript
// directives/vColor.ts
import type { Directive, DirectiveBinding } from 'vue'

export const vColor: Directive<HTMLElement, string> = {
  mounted(el: HTMLElement, binding: DirectiveBinding<string>) {
    applyColor(el, binding)
  },

  updated(el: HTMLElement, binding: DirectiveBinding<string>) {
    applyColor(el, binding)
  },
}

function applyColor(el: HTMLElement, binding: DirectiveBinding<string>) {
  // binding.value — цвет (строка)
  const color = binding.value

  // binding.arg — куда применять ('bg' или текст)
  if (binding.arg === 'bg') {
    el.style.backgroundColor = color
  } else {
    el.style.color = color
  }

  // binding.modifiers — стилевые флаги
  if (binding.modifiers.bold) {
    el.style.fontWeight = 'bold'
  }
  if (binding.modifiers.italic) {
    el.style.fontStyle = 'italic'
  }
}
```

### Практика и применение

**Пример: директива `v-permission`**

```typescript
// directives/vPermission.ts
export const vPermission: Directive<HTMLElement, string | string[]> = {
  mounted(el, binding) {
    const { value: required, modifiers } = binding
    const userPermissions = getCurrentUser().permissions

    const hasPermission = Array.isArray(required)
      ? modifiers.all
        ? required.every(p => userPermissions.includes(p))  // v-permission.all
        : required.some(p => userPermissions.includes(p))   // v-permission (any)
      : userPermissions.includes(required)

    if (!hasPermission) {
      el.style.display = 'none'
      // или el.remove() для полного удаления
    }
  },
}
```

```vue
<template>
  <!-- Любое из прав -->
  <button v-permission="['read', 'write']">Редактировать</button>

  <!-- Все права одновременно -->
  <button v-permission.all="['admin', 'superuser']">Администрирование</button>
</template>
```

**Пример: `el` — работа с DOM напрямую**

```typescript
const vAutoResize: Directive<HTMLTextAreaElement> = {
  mounted(el) {
    el.style.overflow = 'hidden'
    el.style.resize = 'none'

    const resize = () => {
      el.style.height = 'auto'
      el.style.height = `${el.scrollHeight}px`
    }

    el.addEventListener('input', resize)
    resize() // начальный размер

    // Сохраняем cleanup для unmounted
    ;(el as any).__resizeCleanup = () => el.removeEventListener('input', resize)
  },

  unmounted(el) {
    ;(el as any).__resizeCleanup?.()
  },
}
```

**`binding.instance` — доступ к компоненту**

```typescript
const vLog: Directive = {
  mounted(el, binding) {
    console.log('Компонент:', binding.instance?.$options.name)
    console.log('Значение:', binding.value)
  },
}
```

### Важные нюансы и краеугольные камни

- `binding.oldValue` доступен только в `beforeUpdate` и `updated` — в `mounted` всегда `undefined`
- **Динамические аргументы** (`v-dir:[dynamicArg]`) — `binding.arg` обновляется при каждом рендере
- Не хранить состояние в замыкании директивы — каждый экземпляр элемента должен иметь свои данные; используй `el.__myData = ...` или WeakMap
- `binding.instance` может быть `null` при использовании директивы вне компонента

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как передать объект в директиву?** — `v-dir="{ color: 'red', size: 14 }"` → `binding.value = { color: 'red', size: 14 }`
- **Как хранить состояние между хуками директивы?** — сохранять на элементе: `el.__cleanup = fn` или WeakMap; не в замыкании объекта директивы
- **Чем `binding.arg` отличается от `binding.value`?** — `arg` — статическая строка после двоеточия (известна во время компиляции), `value` — динамическое выражение

### Красные флаги (чего не говорить)

- «`binding` — это просто значение директивы» — `binding` — объект с несколькими полями, не только `value`
- Хранить состояние в переменных вне хуков директивы — это вызовет проблемы при использовании нескольких экземпляров элемента

### Связанные темы

- `023-kakie-huki-predostavlyayut-direktivy.md`
