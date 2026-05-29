# Q022. Какие модификаторы кнопок мыши предоставляет Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Vue предоставляет три модификатора кнопок мыши: **`.left`** (левая кнопка), **`.right`** (правая кнопка), **`.middle`** (средняя кнопка / колёсико). Они применяются к событиям `@click`, `@mousedown`, `@mouseup` и ограничивают срабатывание обработчика конкретной кнопкой мыши.

---

## Развёрнутый ответ

### Суть и определение

Модификаторы кнопок мыши фильтруют события по `event.button`: 0 (левая), 1 (средняя), 2 (правая). Vue предоставляет именованные алиасы вместо ручной проверки.

### Как это работает

```vue
<script setup lang="ts">
const handleLeftClick = () => console.log('Левая кнопка')
const handleRightClick = () => console.log('Правая кнопка')
const handleMiddleClick = () => console.log('Средняя кнопка')
</script>

<template>
  <!-- Только левая кнопка мыши (event.button === 0) -->
  <div @click.left="handleLeftClick">Левый клик</div>

  <!-- Только правая кнопка (event.button === 2) -->
  <!-- .prevent отменяет контекстное меню браузера -->
  <div @click.right.prevent="handleRightClick">Правый клик</div>

  <!-- Средняя кнопка / колёсико (event.button === 1) -->
  <a @click.middle="openInNewTab">Открыть в новой вкладке</a>
</template>
```

**Таблица соответствия:**

| Модификатор | `event.button` | Кнопка |
|-------------|---------------|--------|
| `.left` | `0` | Левая |
| `.middle` | `1` | Колёсико / средняя |
| `.right` | `2` | Правая |

### Практика и применение

```vue
<script setup lang="ts">
import { ref } from 'vue'

interface ContextMenuItem {
  label: string
  action: () => void
}

const contextMenuItems = ref<ContextMenuItem[]>([])
const contextMenuPos = ref({ x: 0, y: 0 })
const isContextMenuOpen = ref(false)

function openContextMenu(e: MouseEvent) {
  contextMenuPos.value = { x: e.clientX, y: e.clientY }
  isContextMenuOpen.value = true
  contextMenuItems.value = [
    { label: 'Копировать', action: () => copy() },
    { label: 'Вставить', action: () => paste() },
  ]
}

function copy() {}
function paste() {}
</script>

<template>
  <!-- Кастомное контекстное меню -->
  <div
    class="workspace"
    @click.right.prevent="openContextMenu"
    @click.left="isContextMenuOpen = false"
  >
    Рабочая область
  </div>

  <ContextMenu
    v-if="isContextMenuOpen"
    :items="contextMenuItems"
    :position="contextMenuPos"
  />
</template>
```

### Важные нюансы и краеугольные камни

- **`.right` и браузерное контекстное меню**: `@click.right` без `.prevent` откроет и контекстное меню, и запустит обработчик; обычно нужно `.prevent`
- **`.left` — избыточен** в большинстве случаев: обычный `@click` и так срабатывает только на левую кнопку; `.left` полезен для явности или в сочетании с `.right`/`.middle` на одном элементе
- **Средняя кнопка в браузерах**: `click` на средней кнопке ведёт себя по-разному — на ссылках открывает новую вкладку; `.prevent` отменяет это поведение
- **Touch-устройства**: модификаторы кнопок не применимы к тач-событиям

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как создать кастомное контекстное меню?** — `@contextmenu.prevent` (аналог `@click.right.prevent`) + позиционирование по `event.clientX/Y`
- **Зачем `.left` если @click и так левый?** — для явности в коде, или когда на одном элементе несколько обработчиков для разных кнопок
- **Как обработать одновременно `@contextmenu` и `@click.right`?** — предпочесть `@contextmenu.prevent` — это семантически правильнее

### Красные флаги (чего не говорить)

- «Правая кнопка — это `event.button === 2`, поэтому нужно проверять вручную» — Vue предоставляет `.right` именно для этого

### Связанные темы

- `020-kakie-modifikatory-sobytij-predostavlyaet-vue-js.md`
- `021-kakie-modifikatory-knopok-predostavlyaet-vue-js.md`
