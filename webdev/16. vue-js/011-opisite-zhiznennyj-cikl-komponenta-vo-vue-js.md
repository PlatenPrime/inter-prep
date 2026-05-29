# Q011. Опишите жизненный цикл компонента во Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Жизненный цикл компонента Vue состоит из четырёх стадий: **создание** (инициализация реактивных данных), **монтирование** (рендер и вставка в DOM), **обновление** (ре-рендер при изменении данных) и **размонтирование** (удаление из DOM и очистка). На каждой стадии Vue вызывает соответствующие lifecycle hooks, позволяя добавлять логику в нужный момент.

---

## Развёрнутый ответ

### Суть и определение

Жизненный цикл описывает, как Vue создаёт, обновляет и уничтожает экземпляр компонента. Понимание порядка хуков критично для правильной инициализации, очистки ресурсов и отладки.

### Как это работает

#### Полная диаграмма (Vue 3)

```
Вызов setup() / beforeCreate + created (Options API)
           │
           ▼
    Компиляция шаблона (если нужно)
           │
           ▼
     onBeforeMount()
           │
           ▼
    Первый рендер → Virtual DOM → патчинг реального DOM
           │
           ▼
      onMounted()  ◄──── DOM доступен
           │
           ▼
   ┌── Изменение реактивных данных
   │         │
   │         ▼
   │   onBeforeUpdate()
   │         │
   │         ▼
   │   Диффинг VNode + патчинг DOM
   │         │
   │         ▼
   │     onUpdated()
   └──────────┘
           │
           ▼
   onBeforeUnmount()  ◄──── Очистка ресурсов
           │
           ▼
    Удаление DOM + teardown директив
           │
           ▼
      onUnmounted()
```

#### Стадия 1: Создание (Creation)

```typescript
// setup() выполняется синхронно здесь
// - props доступны
// - реактивные данные инициализированы
// - DOM ещё НЕ существует

const props = defineProps<{ id: string }>()
const data = ref(null)

// Аналог created: синхронный код выполняется сразу
console.log('props.id:', props.id) // работает
// console.log(document.querySelector('.card')) // null — DOM не готов
```

#### Стадия 2: Монтирование (Mounting)

```typescript
onBeforeMount(() => {
  // Виртуальный DOM уже вычислен, но в реальный DOM ещё не вставлен
  // Редко нужен — почти всегда используй onMounted
})

onMounted(() => {
  // DOM существует — можно:
  // - работать с template refs ($el, ref="...")
  // - инициализировать сторонние библиотеки (Chart.js, Leaflet)
  // - добавлять event listeners
  // - делать начальные HTTP-запросы (если не нужен SSR)
  initChart()
  window.addEventListener('resize', handleResize)
})
```

#### Стадия 3: Обновление (Updating)

```typescript
onBeforeUpdate(() => {
  // Данные изменились, DOM ещё не обновлён
  // Можно прочитать текущее состояние DOM перед патчем
})

onUpdated(() => {
  // DOM обновлён
  // ⚠️ НЕ изменять реактивные данные здесь — бесконечный цикл обновлений!
  // Для реакции на данные — используй watch/watchEffect
})
```

#### Стадия 4: Размонтирование (Unmounting)

```typescript
onBeforeUnmount(() => {
  // Компонент ещё существует и полностью функционален
  // Лучшее место для очистки:
  window.removeEventListener('resize', handleResize)
  chart.destroy()
  socket.close()
  clearInterval(timer)
})

onUnmounted(() => {
  // Компонент удалён из DOM
  // Директивы и дочерние компоненты уже размонтированы
})
```

### Практика и применение

**Паттерн: автоматическая очистка через composable**

```typescript
// composables/useEventListener.ts
import { onMounted, onBeforeUnmount } from 'vue'

export function useEventListener(
  target: EventTarget,
  event: string,
  handler: EventListener
) {
  onMounted(() => target.addEventListener(event, handler))
  onBeforeUnmount(() => target.removeEventListener(event, handler))
}

// Использование — очистка автоматически
const { useEventListener } from '@/composables/useEventListener'
useEventListener(window, 'resize', handleResize)
```

### Важные нюансы и краеугольные камни

- **Порядок монтирования дочерних компонентов**: родитель `onBeforeMount` → ребёнок `onBeforeMount` → ребёнок `onMounted` → родитель `onMounted`
- **`<KeepAlive>`**: компонент не размонтируется — используются `onActivated`/`onDeactivated` вместо `mounted`/`unmounted`
- **Ошибки в жизненном цикле**: перехватываются через `onErrorCaptured` в родительском компоненте
- При использовании `<Suspense>` с async setup — компонент будет в состоянии pending до разрешения промиса

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда именно DOM доступен?** — только в `onMounted` и после; в `setup()`, `onBeforeMount` DOM не существует
- **Почему нельзя изменять данные в `onUpdated`?** — это вызовет новый цикл обновления, что приведёт к бесконечному циклу
- **Как работает жизненный цикл с `<KeepAlive>`?** — компонент не уничтожается, а кэшируется; `onActivated`/`onDeactivated` заменяют `mounted`/`unmounted`
- **Где лучше делать API-запросы?** — в `onMounted` (для CSR) или прямо в `setup()` с обработкой через `<Suspense>` (для SSR-совместимости)

### Красные флаги (чего не говорить)

- «`created` — лучшее место для DOM-манипуляций» — в `created` DOM не существует
- Не знать порядок хуков родитель/ребёнок — это базовый вопрос на middle
- «Очистка в `onUnmounted` не обязательна» — утечки таймеров и event listeners — реальная production-проблема

### Связанные темы

- `010-nazvajte-huki-zhiznennogo-cikla-komponenta-vo-vue-js.md`
- `029-chto-takoe-dinamicheskie-keep-alive-komponenty.md`
- `030-chto-takoe-asinhronye-komponenty.md`
