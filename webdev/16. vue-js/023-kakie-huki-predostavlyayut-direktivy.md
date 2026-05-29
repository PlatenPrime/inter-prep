# Q023. Какие хуки предоставляют директивы?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Пользовательские директивы Vue 3 предоставляют 7 хуков жизненного цикла: **`created`**, **`beforeMount`**, **`mounted`**, **`beforeUpdate`**, **`updated`**, **`beforeUnmount`**, **`unmounted`**. Они позволяют императивно взаимодействовать с DOM-элементом на каждом этапе его существования. Синтаксис хуков директив в Vue 3 был переименован для соответствия хукам компонентов.

---

## Развёрнутый ответ

### Суть и определение

Кастомные директивы — это механизм для прямого манипулирования DOM, когда встроенных директив (`v-model`, `v-show`, `v-bind`) недостаточно. Их хуки вызываются синхронно и привязаны к жизненному циклу элемента.

### Полный список хуков (Vue 3)

```typescript
import type { DirectiveBinding, Directive } from 'vue'

const vMyDirective: Directive = {
  // Вызывается до того, как атрибуты/обработчики события применены к элементу
  // Полезно для добавления атрибутов/обработчиков до рендера
  created(el, binding, vnode) {
    console.log('created — элемент создан, DOM ещё не вставлен')
  },

  // Вызывается перед монтированием элемента в DOM
  beforeMount(el, binding, vnode) {
    console.log('beforeMount — перед вставкой в DOM')
  },

  // Вызывается после вставки элемента в DOM (аналог onMounted)
  mounted(el, binding, vnode) {
    console.log('mounted — элемент в DOM, можно работать с ним')
    el.focus() // пример: автофокус
  },

  // Вызывается перед обновлением VNode родительского компонента
  beforeUpdate(el, binding, vnode, prevVnode) {
    console.log('beforeUpdate — перед обновлением DOM')
  },

  // Вызывается после обновления VNode и VNode дочерних элементов
  updated(el, binding, vnode, prevVnode) {
    console.log('updated — после обновления DOM')
  },

  // Вызывается перед размонтированием родительского компонента
  beforeUnmount(el, binding, vnode) {
    console.log('beforeUnmount — элемент ещё в DOM')
  },

  // Вызывается после удаления элемента из DOM
  unmounted(el, binding, vnode) {
    console.log('unmounted — очистка ресурсов')
  },
}
```

### Практика и применение

**Пример: директива автофокуса**

```typescript
// directives/vFocus.ts
import type { Directive } from 'vue'

export const vFocus: Directive<HTMLElement> = {
  mounted(el) {
    el.focus()
  },
}
```

```vue
<script setup lang="ts">
import { vFocus } from '@/directives/vFocus'
</script>

<template>
  <!-- Инпут получит фокус при монтировании -->
  <input v-focus type="text" />
</template>
```

**Пример: директива tooltip**

```typescript
// directives/vTooltip.ts
import type { Directive } from 'vue'

export const vTooltip: Directive<HTMLElement, string> = {
  mounted(el, binding) {
    el.setAttribute('title', binding.value)
    el.addEventListener('mouseenter', showTooltip)
    el.addEventListener('mouseleave', hideTooltip)
  },

  updated(el, binding) {
    el.setAttribute('title', binding.value)
  },

  unmounted(el) {
    el.removeEventListener('mouseenter', showTooltip)
    el.removeEventListener('mouseleave', hideTooltip)
  },
}

function showTooltip(e: Event) { /* ... */ }
function hideTooltip(e: Event) { /* ... */ }
```

**Пример: директива с `beforeUpdate` для анимации**

```typescript
const vHighlight: Directive<HTMLElement, string> = {
  beforeUpdate(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.classList.remove('highlight')
    }
  },
  updated(el, binding) {
    if (binding.value !== binding.oldValue) {
      el.classList.add('highlight')
    }
  },
}
```

**Краткий синтаксис** — если нужны только `mounted` и `updated`:

```typescript
// Функциональная форма вместо объекта
app.directive('color', (el, binding) => {
  el.style.color = binding.value
})
```

### Важные нюансы и краеугольные камни

- **Именование в Vue 2 vs Vue 3**: `bind`→`created`, `inserted`→`mounted`, `update`→`updated`, `componentUpdated`→`updated`, `unbind`→`unmounted`
- `created` вызывается **до** нативных обработчиков событий на элементе — полезно для добавления обработчиков с наивысшим приоритетом
- В `<script setup>` директивы, начинающиеся с `v`, автоматически доступны без регистрации: `import { vFocus } from '...'` — и сразу `v-focus` в шаблоне
- **SSR**: хуки `beforeMount` и `mounted` не вызываются на сервере; директивы, работающие только с DOM, не сработают при SSR

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем хук `created` в директиве, если есть `beforeMount`?** — `created` вызывается до применения нативных атрибутов; нужен, если директива должна добавить обработчики до того, как Vue применит `v-on`
- **Как зарегистрировать директиву локально?** — в `<script setup>` через импорт с префиксом `v`; в Options API через `directives: { myDir }`
- **Когда использовать директиву вместо composable?** — директива работает с конкретным DOM-элементом; composable — с логикой без привязки к конкретному элементу

### Красные флаги (чего не говорить)

- Называть Vue 2 хуки (`bind`, `inserted`) для Vue 3 — это устаревший синтаксис
- «Директивы — то же самое что компоненты» — директивы работают с существующим DOM-элементом, компоненты создают собственный

### Связанные темы

- `024-chto-takoe-argumenty-direktivnyh-hukov.md`
- `009-chto-takoe-komponent.md`
