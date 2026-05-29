# Q019. Какие модификаторы поддерживаются в модели (`v-model`)?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

`v-model` поддерживает три встроенных модификатора: **`.lazy`** (синхронизирует по событию `change` вместо `input`), **`.number`** (приводит строковое значение к числу через `parseFloat`), **`.trim`** (обрезает пробелы). В Vue 3 компоненты также поддерживают **кастомные модификаторы**, передаваемые через `modelModifiers`.

---

## Развёрнутый ответ

### Суть и определение

Модификаторы `v-model` — это постфиксы, изменяющие поведение связывания данных с формами. Они позволяют трансформировать значение без ручного написания обработчиков событий.

### Как это работает

#### `.lazy` — синхронизация по `change` вместо `input`

```vue
<template>
  <!-- Без .lazy — обновляет при каждом нажатии клавиши -->
  <input v-model="text" />

  <!-- С .lazy — обновляет при потере фокуса или Enter -->
  <input v-model.lazy="text" />
</template>
```

Полезно для поиска/фильтрации — не делать запрос при каждой букве.

#### `.number` — автоматический парсинг числа

```vue
<script setup lang="ts">
import { ref } from 'vue'

const age = ref(0)
// Без .number: age.value = "25" (строка!)
// С .number: age.value = 25 (число)
</script>

<template>
  <input v-model.number="age" type="number" />
  <p>Тип: {{ typeof age }}</p>
</template>
```

`type="number"` в HTML не гарантирует JS-тип — браузер всё равно возвращает строку через `event.target.value`. `.number` использует `parseFloat` под капотом.

#### `.trim` — удаление пробелов

```vue
<template>
  <!-- " Иван Петров " → "Иван Петров" -->
  <input v-model.trim="username" />
</template>
```

#### Комбинирование модификаторов

```vue
<template>
  <!-- Обрезать пробелы + обновить при blur -->
  <input v-model.trim.lazy="searchQuery" />
</template>
```

#### Кастомные модификаторы (Vue 3)

```vue
<!-- CustomInput.vue — поддержка кастомного модификатора -->
<script setup lang="ts">
const props = defineProps<{
  modelValue: string
  modelModifiers?: { capitalize?: boolean; uppercase?: boolean }
}>()

const emit = defineEmits<{ 'update:modelValue': [value: string] }>()

function handleInput(e: Event) {
  let value = (e.target as HTMLInputElement).value

  if (props.modelModifiers?.capitalize) {
    value = value.charAt(0).toUpperCase() + value.slice(1)
  }
  if (props.modelModifiers?.uppercase) {
    value = value.toUpperCase()
  }

  emit('update:modelValue', value)
}
</script>

<template>
  <input :value="modelValue" @input="handleInput" />
</template>

<!-- Использование кастомного модификатора -->
<CustomInput v-model.capitalize="name" />
<CustomInput v-model.uppercase="code" />
```

#### Модификаторы для именованных `v-model` (Vue 3)

```vue
<!-- Для v-model:title="..." модификаторы приходят в titleModifiers -->
<script setup lang="ts">
const props = defineProps<{
  title: string
  titleModifiers?: { trim?: boolean }
}>()
</script>
```

### Практика и применение

```vue
<script setup lang="ts">
import { ref } from 'vue'

const searchQuery = ref('')
const price = ref(0)
const email = ref('')

// debounce через .lazy — не делает лишних запросов
</script>

<template>
  <form>
    <label>
      Поиск (обновляет при blur):
      <input v-model.lazy.trim="searchQuery" />
    </label>

    <label>
      Цена:
      <input v-model.number="price" type="number" min="0" />
      <!-- price.value — всегда Number, не String -->
    </label>

    <label>
      Email:
      <input v-model.trim="email" type="email" />
    </label>
  </form>
</template>
```

### Важные нюансы и краеугольные камни

- `.number` использует `parseFloat` — если поле пустое, возвращает `NaN`, а не `0` или `null`
- `.lazy` не подходит для реального debounce — это только `change` вместо `input`; для debounce нужен `@input` + функция debounce вручную
- `.trim` не работает с `textarea` для удаления переносов строк — только пробелы в начале и конце
- Кастомные модификаторы с дефолтными значениями: `modelModifiers` может быть `undefined` — всегда проверять

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему нужен `.number` если стоит `type="number"`?** — HTML `input[type="number"]` всё равно возвращает строку в `event.target.value`; `.number` применяет `parseFloat`
- **Как реализовать debounce для поля поиска?** — не через `.lazy`, а через `@input` с `debounce`-функцией из VueUse (`useDebounce`) или вручную
- **Как создать кастомный модификатор?** — через `modelModifiers` prop в компоненте и проверку флагов в обработчике

### Красные флаги (чего не говорить)

- «`.lazy` — это debounce» — это просто событие `change` вместо `input`, никакой задержки
- «`.number` гарантирует число всегда» — пустое поле даст `NaN`
- Не знать про кастомные модификаторы в Vue 3 — это заметный пробел для middle+

### Связанные темы

- `020-kakie-modifikatory-sobytij-predostavlyaet-vue-js.md`
- `012-chto-takoe-propsy-tipy-propsov.md`
