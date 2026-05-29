# Q020. Какие модификаторы событий предоставляет Vue.js?

> **Источник:** [16. vue-js.md](../16.%20vue-js.md) · **Тема:** Vue.js

---

## Короткий ответ

Vue предоставляет модификаторы для `v-on` (или `@`), управляющие поведением DOM-событий: **`.stop`** (`stopPropagation`), **`.prevent`** (`preventDefault`), **`.capture`** (capture-режим), **`.self`** (только сам элемент), **`.once`** (один раз), **`.passive`** (оптимизация скролла). Их можно комбинировать в цепочки: `@click.stop.prevent`.

---

## Развёрнутый ответ

### Суть и определение

Модификаторы событий — это постфиксы к директиве `v-on`, которые добавляют стандартные операции с событиями без дополнительного кода в обработчике. Они делают шаблон декларативным и уменьшают бойлерплейт.

### Полный список модификаторов событий

#### `.stop` — `event.stopPropagation()`

```vue
<template>
  <div @click="outerClick">
    <!-- Клик на кнопке не "всплывёт" к родителю -->
    <button @click.stop="innerClick">Клик</button>
  </div>
</template>
```

#### `.prevent` — `event.preventDefault()`

```vue
<template>
  <!-- Отменяет стандартное поведение формы (перезагрузку страницы) -->
  <form @submit.prevent="handleSubmit">
    <input v-model="email" type="email" />
    <button type="submit">Отправить</button>
  </form>

  <!-- Отменяет открытие ссылки -->
  <a href="/dangerous" @click.prevent="handleClick">Ссылка</a>
</template>
```

#### `.capture` — использовать capture-фазу

```vue
<template>
  <!-- Обработчик вызовется во время фазы ЗАХВАТА (раньше child-элементов) -->
  <div @click.capture="handleCapture">
    <button @click="handleClick">Кнопка</button>
    <!-- Порядок: handleCapture → handleClick -->
  </div>
</template>
```

#### `.self` — только если `event.target === element`

```vue
<template>
  <!-- Сработает только при клике на div, но не на дочерние элементы -->
  <div class="overlay" @click.self="closeModal">
    <div class="modal">Контент модалки</div>
  </div>
</template>
```

#### `.once` — обработчик срабатывает один раз, потом удаляется

```vue
<template>
  <button @click.once="showWelcome">Показать приветствие</button>
  <!-- После первого клика обработчик автоматически удаляется -->
</template>
```

#### `.passive` — `{ passive: true }` для addEventListener

```vue
<template>
  <!-- Сообщает браузеру, что preventDefault не вызовется — можно оптимизировать скролл -->
  <div @scroll.passive="handleScroll">Контент</div>
</template>
```

`passive: true` позволяет браузеру начать прокрутку немедленно, не ожидая выполнения обработчика.

#### Комбинирование модификаторов

```vue
<template>
  <!-- Порядок имеет значение! -->

  <!-- .prevent.stop: сначала preventDefault, потом stopPropagation -->
  <a @click.prevent.stop="handleAction">Ссылка</a>

  <!-- .stop.prevent: то же, порядок для событий одинаков -->
  <button @click.stop.prevent="save">Сохранить</button>
</template>
```

#### `.passive` и `.prevent` несовместимы

```vue
<template>
  <!-- ⚠️ Нельзя использовать одновременно — .prevent игнорируется с .passive -->
  <!-- <div @scroll.passive.prevent="..."> — неправильно! -->
</template>
```

### Практика и применение

```vue
<script setup lang="ts">
const closeModal = () => { /* ... */ }
const handleSubmit = (e: Event) => { /* ... */ }
</script>

<template>
  <!-- Паттерн закрытия модалки по клику на оверлей -->
  <div class="modal-overlay" @click.self="closeModal">
    <div class="modal-content" @keydown.esc="closeModal">
      <form @submit.prevent="handleSubmit">
        <!-- ... -->
      </form>
    </div>
  </div>
</template>
```

### Важные нюансы и краеугольные камни

- **`.stop` не предотвращает нативные события** за пределами Vue — только Vue-обработчики в дереве компонентов
- **`.passive` нельзя совмещать с `.prevent`** — браузер игнорирует `preventDefault` для passive-обработчиков
- **`.once` на компонентах**: также работает — обработчик кастомного события удаляется после первого срабатывания
- Для `window`/`document` событий — модификаторы не применимы напрямую; использовать `useEventListener` из VueUse

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Зачем `.passive` и почему он ускоряет скролл?** — браузер оптимизирует прокрутку, если знает, что `preventDefault` не вызовется; без passive браузер ждёт завершения обработчика
- **В чём разница `.stop` и `.self`?** — `.stop` останавливает всплытие события; `.self` фильтрует: обработчик вызывается только если клик был прямо на элементе, а не на его потомке
- **Как правильно использовать `.capture`?** — для перехвата событий до того, как они дойдут до цели; используется редко

### Красные флаги (чего не говорить)

- «`.prevent` и `.stop` — одно и то же» — `.prevent` отменяет дефолтное поведение браузера, `.stop` — останавливает всплытие
- «Модификаторы можно ставить в любом порядке без последствий» — порядок важен: `@click.prevent.stop` и `@click.stop.prevent` семантически одинаковы для click, но для других событий порядок влияет

### Связанные темы

- `021-kakie-modifikatory-knopok-predostavlyaet-vue-js.md`
- `022-kakie-modifikatory-knopok-myshi-predostavlyaet-vue-js.md`
- `019-kakie-modifikatory-podderzhivayutsya-v-modeli-v-model.md`
