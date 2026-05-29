# Q012. Что такое пропсы? Типы пропсов?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Props (пропсы)** — это механизм передачи данных от родительского компонента к дочернему. Они являются однонаправленными (read-only в дочернем компоненте) и формируют «публичный API» компонента. Пропсы могут быть любого типа: `String`, `Number`, `Boolean`, `Array`, `Object`, `Function`, `Symbol`, а также пользовательские классы. Vue валидирует пропсы по типу и дополнительным правилам во время разработки.

---

## Развёрнутый ответ

### Суть и определение

Props — это механизм «props down» в однонаправленном потоке данных Vue. Данные текут только сверху вниз: родитель передаёт → дочерний читает. Изменение prop в дочернем компоненте — антипаттерн, нарушающий предсказуемость данных.

### Как это работает

#### Определение пропсов (Composition API + TypeScript)

```vue
<!-- ChildComponent.vue -->
<script setup lang="ts">
interface Props {
  title: string
  count?: number
  isActive?: boolean
  items: string[]
  config?: Record<string, unknown>
  onAction?: (id: string) => void
}

// Рекомендованный способ в Vue 3 с TypeScript
const props = withDefaults(defineProps<Props>(), {
  count: 0,
  isActive: false,
  config: () => ({}), // для объектов/массивов — factory-функция!
})

// Использование в логике
console.log(props.title)
</script>

<template>
  <div :class="{ active: isActive }">
    <h2>{{ title }}</h2>
    <span>{{ count }}</span>
  </div>
</template>
```

#### Определение пропсов (Options API / без TypeScript)

```javascript
export default {
  props: {
    // Только тип
    title: String,

    // Тип + обязательность
    userId: {
      type: String,
      required: true,
    },

    // Тип + дефолтное значение
    count: {
      type: Number,
      default: 0,
    },

    // Несколько возможных типов
    value: {
      type: [String, Number],
    },

    // Кастомный валидатор
    status: {
      type: String,
      validator(value) {
        return ['active', 'inactive', 'pending'].includes(value)
      },
    },

    // Объект/массив — дефолт через функцию
    items: {
      type: Array,
      default: () => [],
    },
  },
}
```

#### Поддерживаемые типы пропсов

| Тип | Пример | Примечание |
|-----|--------|-----------|
| `String` | `'hello'` | |
| `Number` | `42`, `3.14` | |
| `Boolean` | `true`, `false` | Особое поведение: `:flag` без значения = `true` |
| `Array` | `[1, 2, 3]` | Default через factory `() => []` |
| `Object` | `{ key: val }` | Default через factory `() => ({})` |
| `Function` | `() => {}` | Для callback-пропсов |
| `Symbol` | `Symbol('id')` | |
| `Date` | `new Date()` | |
| Пользовательский класс | `new User()` | Vue использует `instanceof` |
| `null` / `undefined` | | Пропускает проверку типа |

#### Передача пропсов

```vue
<template>
  <!-- Статическое значение (строка) -->
  <UserCard title="Алиса" />

  <!-- Динамическое значение — обязательно : для не-строк -->
  <UserCard :count="userCount" :is-active="true" :items="['a', 'b']" />

  <!-- Boolean prop — :is-active="true" можно сократить до is-active -->
  <UserCard is-active />

  <!-- Передача всего объекта через v-bind -->
  <UserCard v-bind="userProps" />
</template>
```

### Практика и применение

**Паттерн: локальная копия для редактирования**

Нельзя мутировать prop, но можно создать локальную реактивную копию:

```vue
<script setup lang="ts">
const props = defineProps<{ value: string }>()
const emit = defineEmits<{ 'update:value': [value: string] }>()

// Паттерн v-model: computed с getter/setter
const localValue = computed({
  get: () => props.value,
  set: (v) => emit('update:value', v),
})
</script>

<template>
  <input v-model="localValue" />
</template>
```

### Важные нюансы и краеугольные камни

- **Дефолтные значения для объектов/массивов** — обязательно через factory-функцию, иначе все экземпляры компонента разделят один объект
- **Boolean casting**: если тип prop — только `Boolean`, то строка `"false"` будет кастована к `false`; если `[Boolean, String]` — нет
- **camelCase vs kebab-case**: в шаблоне `<Comp :myProp>` и `<Comp :my-prop>` — эквивалентны; в JS всегда camelCase
- **Производительность**: передача больших объектов через props неэффективна — лучше передавать ID и получать данные через composable/store

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что такое «однонаправленный поток данных» и зачем он нужен?** — предсказуемость: родитель контролирует данные, дочерний не может неожиданно их изменить
- **Как реализовать двустороннее связывание через props?** — через `v-model` = `:modelValue` + `@update:modelValue`
- **Зачем дефолтные значения для объектов — через функцию?** — если задать `default: {}`, все экземпляры разделят один объект; factory создаёт новый каждый раз
- **Что такое prop drilling и как его избежать?** — передача пропсов через несколько уровней; решение — `provide/inject` или Pinia

### Красные флаги (чего не говорить)

- «Props можно мутировать напрямую» — Vue выдаст предупреждение в dev-режиме; это антипаттерн
- «Дефолтные значения массивов: `default: []`» — правильно `default: () => []`
- Не знать о Boolean casting — это нюанс, который ломает поведение в prod

### Связанные темы

- `013-raznica-mezhdu-lokalnoj-i-globalnoj-registraciĭ-komponenta.md`
- `014-perechislite-varianty-kommunikacii-komponentov-vo-vue-js.md`
- `015-chto-takoe-slot-vo-vue-js.md`
