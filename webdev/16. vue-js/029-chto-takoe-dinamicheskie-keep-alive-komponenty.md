# Q029. Что такое динамические (`<keep-alive>`) компоненты?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

**Динамические компоненты** — это механизм переключения между компонентами через `<component :is="currentComponent">`. **`<KeepAlive>`** — это встроенный компонент-обёртка, который кэширует размонтированные компоненты в памяти вместо их уничтожения. При возврате к закэшированному компоненту его состояние сохраняется, вместо `mounted`/`unmounted` вызываются `onActivated`/`onDeactivated`.

---

## Развёрнутый ответ

### Суть и определение

Динамические компоненты — паттерн для переключения между несколькими компонентами в одном месте шаблона без множества `v-if`.

`<KeepAlive>` решает проблему потери состояния: без него каждое переключение полностью пересоздаёт компонент — теряются данные форм, позиция скролла, результаты запросов.

### Как это работает

#### Динамические компоненты без KeepAlive

```vue
<script setup lang="ts">
import { ref, shallowRef } from 'vue'
import TabHome from '@/views/TabHome.vue'
import TabPosts from '@/views/TabPosts.vue'
import TabArchive from '@/views/TabArchive.vue'

const tabs = [
  { name: 'home', label: 'Главная', component: TabHome },
  { name: 'posts', label: 'Посты', component: TabPosts },
  { name: 'archive', label: 'Архив', component: TabArchive },
]

// shallowRef — компоненты не делать реактивными рекурсивно
const activeTab = shallowRef(TabHome)
</script>

<template>
  <div class="tabs">
    <button
      v-for="tab in tabs"
      :key="tab.name"
      @click="activeTab = tab.component"
    >
      {{ tab.label }}
    </button>

    <!-- При каждом переключении компонент пересоздаётся -->
    <component :is="activeTab" />
  </div>
</template>
```

#### `<KeepAlive>` — кэширование компонентов

```vue
<template>
  <div class="tabs">
    <nav>...</nav>

    <!-- Компоненты не уничтожаются при переключении -->
    <KeepAlive>
      <component :is="activeTab" />
    </KeepAlive>
  </div>
</template>
```

#### `include` / `exclude` — выборочное кэширование

```vue
<template>
  <!-- Кэшировать только TabPosts и TabHome по имени компонента -->
  <KeepAlive include="TabPosts,TabHome">
    <component :is="activeTab" />
  </KeepAlive>

  <!-- Исключить TabArchive из кэша -->
  <KeepAlive :exclude="['TabArchive']">
    <component :is="activeTab" />
  </KeepAlive>

  <!-- Через RegExp -->
  <KeepAlive :include="/^Tab/">
    <component :is="activeTab" />
  </KeepAlive>
</template>
```

#### `max` — ограничение размера кэша (LRU)

```vue
<template>
  <!-- Хранить не более 5 компонентов; старейшие удаляются -->
  <KeepAlive :max="5">
    <component :is="activeTab" />
  </KeepAlive>
</template>
```

#### Хуки `onActivated` / `onDeactivated`

```vue
<!-- TabPosts.vue — компонент внутри KeepAlive -->
<script setup lang="ts">
import { ref, onActivated, onDeactivated, onMounted } from 'vue'

const posts = ref([])

// Вызывается один раз при первом монтировании
onMounted(() => {
  console.log('KeepAlive: первоначальное монтирование')
  loadPosts()
})

// Вызывается каждый раз при показе компонента
onActivated(() => {
  console.log('KeepAlive: компонент активирован')
  // Обновить данные при возврате (если нужно)
  refreshIfStale()
})

// Вызывается при скрытии компонента
onDeactivated(() => {
  console.log('KeepAlive: компонент деактивирован')
  // Пауза видео, остановка таймеров
  pauseVideo()
})
</script>
```

### Практика и применение

**Кейс: Таб с формой, которую не нужно сбрасывать**

```vue
<template>
  <!-- Форма в TabSearch сохранит введённые данные при переключении табов -->
  <KeepAlive :include="['TabSearch']">
    <component :is="activeTab" />
  </KeepAlive>
</template>
```

**Кейс: Виртуальный скролл и KeepAlive**

```vue
<template>
  <!-- Позиция скролла сохраняется между переключениями -->
  <KeepAlive :max="3">
    <RouterView />
  </KeepAlive>
</template>
```

`<KeepAlive>` хорошо работает с `<RouterView>` для кэширования страниц роутера.

### Важные нюансы и краеугольные камни

- `include`/`exclude` матчат по **`name` опции компонента** (в SFC — имя файла или явно указанный `name`). Нет `name` — `KeepAlive include` не работает
- **Память**: кэшированные компоненты держат DOM-узлы в памяти. `max` обязателен для предотвращения утечек при большом количестве компонентов
- `<KeepAlive>` работает только с **одним прямым дочерним компонентом** — нельзя передать несколько детей
- Компоненты в `<KeepAlive>` **не получают** `onMounted`/`onUnmounted` при повторных активациях — только `onActivated`/`onDeactivated`

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Когда использовать KeepAlive, когда v-show?** — KeepAlive для компонентов с тяжёлой инициализацией и сложным состоянием; v-show для простого CSS скрытия без сохранения состояния
- **Что происходит с дочерними компонентами при деактивации KeepAlive?** — они тоже деактивируются (получают `onDeactivated`), но не размонтируются
- **Как очистить кэш KeepAlive программно?** — через `:key` на `<KeepAlive>` (изменение key сбрасывает кэш) или через `max`
- **`include` по имени — что если имя не задано?** — имя берётся из имени файла SFC; явно задать через `defineOptions({ name: 'MyComp' })`

### Красные флаги (чего не говорить)

- «KeepAlive хранит копию HTML» — нет, он держит экземпляр компонента с его VNode-деревом и состоянием в памяти
- «onMounted вызывается при каждой активации KeepAlive» — нет, только `onActivated`

### Связанные темы

- `018-raznica-mezhdu-direktivami-v-show-i-v-if.md`
- `010-nazvajte-huki-zhiznennogo-cikla-komponenta-vo-vue-js.md`
- `030-chto-takoe-asinhronye-komponenty.md`
