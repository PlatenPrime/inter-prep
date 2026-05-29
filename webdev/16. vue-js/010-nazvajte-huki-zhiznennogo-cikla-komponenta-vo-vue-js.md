# Q010. Назовите хуки жизненного цикла компонента во Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Vue предоставляет хуки жизненного цикла для каждой стадии существования компонента. В Composition API (Vue 3): `onBeforeMount`, `onMounted`, `onBeforeUpdate`, `onUpdated`, `onBeforeUnmount`, `onUnmounted`, а также `onErrorCaptured`, `onRenderTracked`, `onRenderTriggered`. Хуки `beforeCreate` и `created` из Options API в Composition API заменяет сам `setup()`.

---

## Развёрнутый ответ

### Суть и определение

Хуки жизненного цикла — это функции, которые Vue вызывает в определённые моменты существования компонента: создание, монтирование в DOM, обновление данных, размонтирование.

### Полный список хуков

#### Composition API (Vue 3) — рекомендованный способ

| Хук | Когда вызывается |
|-----|-----------------|
| `setup()` | Замена `beforeCreate` + `created` |
| `onBeforeMount()` | Перед первым рендером в DOM |
| `onMounted()` | После монтирования в DOM |
| `onBeforeUpdate()` | Перед обновлением DOM при изменении данных |
| `onUpdated()` | После обновления DOM |
| `onBeforeUnmount()` | Перед удалением компонента из DOM |
| `onUnmounted()` | После удаления из DOM |
| `onErrorCaptured()` | При ошибке в потомке |
| `onRenderTracked()` | При добавлении реактивной зависимости |
| `onRenderTriggered()` | При триггере ре-рендера |
| `onActivated()` | При активации `<KeepAlive>` |
| `onDeactivated()` | При деактивации `<KeepAlive>` |

#### Options API (Vue 2 / совместимость Vue 3)

```
beforeCreate → created → beforeMount → mounted →
beforeUpdate → updated →
beforeUnmount → unmounted
```

### Как это работает

```vue
<script setup lang="ts">
import {
  onBeforeMount,
  onMounted,
  onBeforeUpdate,
  onUpdated,
  onBeforeUnmount,
  onUnmounted,
  ref
} from 'vue'

const count = ref(0)

// setup() выполняется здесь — реактивные данные уже доступны, DOM — нет
console.log('setup: DOM не смонтирован')

onBeforeMount(() => {
  // Реактивные данные готовы, DOM ещё не создан
  console.log('onBeforeMount')
})

onMounted(() => {
  // DOM доступен — можно работать с refs, сторонними библиотеками
  console.log('onMounted')
})

onBeforeUpdate(() => {
  // Данные изменились, DOM ещё старый
  console.log('onBeforeUpdate')
})

onUpdated(() => {
  // DOM обновлён — не изменять данные здесь (бесконечный цикл!)
  console.log('onUpdated')
})

onBeforeUnmount(() => {
  // Очистка: отписка от событий, таймеры, WebSocket
  console.log('onBeforeUnmount — очищаем ресурсы')
})

onUnmounted(() => {
  // Компонент удалён
  console.log('onUnmounted')
})
</script>
```

### Практика и применение

**Типичные сценарии использования:**

- `onMounted` — инициализация сторонних библиотек (charts, maps), fetch начальных данных, установка event listeners
- `onBeforeUnmount` / `onUnmounted` — очистка: `clearInterval`, отписка от WebSocket, `removeEventListener`, отмена pending HTTP-запросов
- `onUpdated` — реакция на изменение DOM после обновления (редко нужен, обычно лучше `watch`)
- `onErrorCaptured` — аналог Error Boundary в React для перехвата ошибок в дочерних компонентах

```vue
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'

let intervalId: ReturnType<typeof setInterval>

onMounted(() => {
  intervalId = setInterval(() => {
    console.log('tick')
  }, 1000)
})

onUnmounted(() => {
  clearInterval(intervalId) // Обязательная очистка!
})
</script>
```

### Важные нюансы и краеугольные камни

- В `<script setup>` хук `created` не нужен — весь синхронный код выполняется как в `setup()`/`created`
- **Несколько вызовов одного хука**: в Composition API можно вызвать `onMounted` несколько раз — все коллбэки выполнятся. В Options API только один `mounted`
- `onUpdated` вызывается для любого обновления DOM — используй `watch` для реакции на конкретные данные
- **Порядок в родитель/дитя**: `parent:beforeMount` → `child:beforeMount` → `child:mounted` → `parent:mounted`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему в Composition API нет `beforeCreate`/`created`?** — `setup()` выполняется на той же стадии; нет смысла в отдельных хуках
- **Можно ли делать асинхронные запросы в `setup()`?** — да, но `await` приостанавливает setup, что требует `<Suspense>` для обработки загрузочного состояния
- **Что такое `onActivated`/`onDeactivated`?** — хуки для компонентов внутри `<KeepAlive>` — вызываются при показе/скрытии вместо монтирования/размонтирования
- **Где делать `fetch` начальных данных?** — обычно в `onMounted`, чтобы избежать SSR-проблем; или прямо в `setup()` для показа лоадера

### Красные флаги (чего не говорить)

- «`created` — это то же самое, что `mounted`» — `created` срабатывает до рендера DOM, `mounted` — после
- Не упомянуть необходимость очистки в `onBeforeUnmount` — утечки памяти через таймеры и event listeners — типичная production-ошибка
- «В Vue нет аналога `componentDidMount`» — `onMounted` — прямой аналог

### Связанные темы

- `011-opisite-zhiznennyj-cikl-komponenta-vo-vue-js.md`
- `029-chto-takoe-dinamicheskie-keep-alive-komponenty.md`
