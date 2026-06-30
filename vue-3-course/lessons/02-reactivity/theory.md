# Модуль 02 — Реактивность (ядро Vue)

## Цель

Понять Proxy-based реактивность, выбрать между `ref`/`reactive`/`computed`/`watch` и избежать типичных ловушек.

## Как это работает (Vue 3)

Vue 3 оборачивает объекты в `Proxy`. При **чтении** свойства вызывается `track()` (запоминается зависимость), при **записи** — `trigger()` (запускаются эффекты).

Это фундаментальное отличие от React: зависимости **отслеживаются автоматически** при чтении в `computed`, `watchEffect`, render-функции.

## ref

```ts
import { ref } from 'vue'

const count = ref(0)
count.value++           // в <script>
// в <template> count разворачивается автоматически
```

Используйте `ref` для примитивов и когда нужна возможность переприсвоить всё значение целиком.

## reactive

```ts
import { reactive } from 'vue'

const state = reactive({ count: 0, user: { name: 'Ann' } })
state.count++           // без .value
```

**Ловушка:** деструктуризация теряет реактивность:

```ts
const { count } = state        // count — обычное число!
const { count } = toRefs(state) // count — Ref, реактивен
```

## computed

```ts
const filtered = computed(() =>
  tasks.value.filter((t) => t.done === showDoneOnly.value),
)
```

- Ленивый: пересчитывается только при обращении.
- Кэшируется, пока зависимости не изменились.
- React-аналог: `useMemo`, но с автоматическими deps.

## watch vs watchEffect

```ts
// watch — явный источник, доступ к old/new
watch(searchQuery, (newVal, oldVal) => {
  debouncedFetch(newVal)
})

// watchEffect — auto-track deps при первом run
watchEffect(() => {
  document.title = `${count.value} items`
})
```

Для чтения DOM после обновления: `watch(source, cb, { flush: 'post' })`.

## shallowRef / readonly

- `shallowRef` — реактивен только `.value` (не глубоко) — для больших immutable-структур.
- `readonly` — запрет мутации снаружи.

## Примеры

- `examples/02-reactivity/001-ref-counter.vue`
- `examples/02-reactivity/002-computed-filter.ts`
- `examples/02-reactivity/003-watch-debounce.ts`

## Anti-patterns

| Проблема | Решение |
|----------|---------|
| Деструктуризация `reactive` | `toRefs()` |
| Мутация props | emit + родитель обновляет |
| `watch` без cleanup | `onCleanup` в watch callback |
| Дублирование derived state в ref | используйте `computed` |

## React-bridge

Vue **не** вызывает полный re-render компонента при `count.value++`. Обновляются только текстовые узлы / атрибуты, зависящие от `count`.

## Следующий модуль

[03-components/theory.md](../03-components/theory.md)
