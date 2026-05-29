# Q021. Какие модификаторы кнопок предоставляет Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Vue предоставляет **key modifiers** — модификаторы клавиш клавиатуры для `@keyup`, `@keydown`, `@keypress`: именованные алиасы (`.enter`, `.tab`, `.delete`, `.esc`, `.space`, `.up`, `.down`, `.left`, `.right`) и **системные модификаторы** (`.ctrl`, `.alt`, `.shift`, `.meta`) для комбинаций клавиш. Также есть `.exact` — требует точного совпадения нажатых модификаторов.

---

## Развёрнутый ответ

### Суть и определение

Модификаторы клавиш позволяют декларативно реагировать на нажатие конкретных клавиш без проверки `event.key` вручную в обработчике.

### Полный список

#### Алиасы клавиш (key aliases)

```vue
<template>
  <!-- .enter — клавиша Enter -->
  <input @keyup.enter="submitForm" />

  <!-- .tab — клавиша Tab -->
  <input @keydown.tab="handleTab" />

  <!-- .delete — Delete и Backspace -->
  <input @keyup.delete="clearField" />

  <!-- .esc — Escape -->
  <div @keydown.esc="closeModal" />

  <!-- .space — пробел -->
  <button @keyup.space="togglePlay" />

  <!-- Стрелки навигации -->
  <div @keydown.up="moveUp" />
  <div @keydown.down="moveDown" />
  <div @keydown.left="moveLeft" />
  <div @keydown.right="moveRight" />
</template>
```

#### Прямое использование key-кодов (kebab-case из `KeyboardEvent.key`)

```vue
<template>
  <!-- Любая клавиша из KeyboardEvent.key, в kebab-case -->
  <input @keyup.page-down="nextPage" />
  <input @keyup.home="scrollToTop" />
  <input @keyup.end="scrollToBottom" />
  <input @keyup.f1="openHelp" />
</template>
```

#### Системные модификаторы — комбинации клавиш

```vue
<template>
  <!-- Ctrl+C / Cmd+C -->
  <div @keyup.ctrl.c="copy" />

  <!-- Alt+Enter -->
  <input @keyup.alt.enter="insertNewLine" />

  <!-- Shift+Delete -->
  <input @keyup.shift.delete="forceDelete" />

  <!-- Meta (Win/Cmd) + S -->
  <div @keydown.meta.s.prevent="saveDocument" />

  <!-- Ctrl+Shift+Z (redo) -->
  <div @keydown.ctrl.shift.z="redo" />
</template>
```

#### `.exact` — точное совпадение модификаторов

```vue
<template>
  <!-- Сработает ТОЛЬКО при Ctrl+Click (не при Ctrl+Shift+Click) -->
  <button @click.ctrl.exact="handleCtrlClick">Кнопка</button>

  <!-- Сработает только без системных модификаторов -->
  <button @click.exact="handleSimpleClick">Кнопка</button>
</template>
```

### Практика и применение

```vue
<script setup lang="ts">
const submit = () => { /* ... */ }
const cancel = () => { /* ... */ }
const saveDocument = () => { /* ... */ }
</script>

<template>
  <!-- Форма: Enter для отправки, Escape для отмены -->
  <form @submit.prevent="submit">
    <input
      type="text"
      @keyup.enter="submit"
      @keyup.esc="cancel"
    />
  </form>

  <!-- Горячие клавиши на уровне компонента -->
  <div
    tabindex="0"
    @keydown.ctrl.s.prevent="saveDocument"
    @keydown.ctrl.z="undo"
    @keydown.ctrl.shift.z="redo"
  >
    Редактор
  </div>
</template>
```

### Важные нюансы и краеугольные камни

- **`.keyCode` модификаторы удалены в Vue 3** — нельзя `@keyup.13` (Enter по числовому коду); используй алиасы или `.enter`
- **`.meta`** — это Cmd на macOS и Win-клавиша на Windows; для кроссплатформенных горячих клавиш нужно обрабатывать оба: `@keydown.ctrl.s @keydown.meta.s`
- **Системные модификаторы** (`.ctrl`, `.alt`, etc.) используют `event.ctrlKey/altKey` — срабатывают при нажатии основной клавиши, даже если системная нажата
- **`tabindex="0"`** — необходим для `@keydown` на non-input элементах, чтобы они могли получить фокус

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Как сделать `Ctrl+S` на macOS и Windows одновременно?** — `@keydown.ctrl.s @keydown.meta.s` или обработчик с `event.ctrlKey || event.metaKey`
- **Зачем `.exact`?** — без него `@click.ctrl` сработает и при `Ctrl+Shift+Click`; с `.exact` — только при точном наборе модификаторов
- **Как слушать глобальные горячие клавиши (не привязанные к элементу)?** — `useEventListener(document, 'keydown', handler)` через VueUse или в `onMounted`

### Красные флаги (чего не говорить)

- «Использую числовые keyCodes: `@keyup.13`» — keyCode API устарел и удалён в Vue 3
- «`.meta` — это Ctrl на всех платформах» — `.meta` это Cmd/Win, `.ctrl` — это Ctrl

### Связанные темы

- `020-kakie-modifikatory-sobytij-predostavlyaet-vue-js.md`
- `022-kakie-modifikatory-knopok-myshi-predostavlyaet-vue-js.md`
