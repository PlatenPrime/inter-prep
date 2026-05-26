# Q063. Для чего используется тэг `<dialog>` в HTML?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

`<dialog>` — нативный HTML-элемент для создания модальных и немодальных диалоговых окон. Он предоставляет встроенные методы `show()`, `showModal()`, `close()`, поддерживает атрибут `open`, псевдоэлемент `::backdrop` для затемнения фона и обеспечивает доступность (focus trap, ARIA role="dialog") без JavaScript-библиотек.

---

## Развёрнутый ответ

### Суть и определение

До `<dialog>` модальные окна реализовались исключительно через div + CSS + JS с ручным управлением фокусом, ARIA-атрибутами и backdrop. `<dialog>` стандартизирует этот паттерн на уровне браузера.

Элемент по умолчанию скрыт (не имеет атрибута `open`) и отображается только после вызова одного из методов.

### Как это работает

**Методы:**
- `dialog.show()` — открывает немодальный диалог (фон остаётся интерактивным).
- `dialog.showModal()` — открывает модальный диалог: фон блокируется, элемент помещается в top layer (над всем остальным, включая `z-index`), фокус захватывается внутри.
- `dialog.close(returnValue?)` — закрывает диалог; опциональный `returnValue` сохраняется в `dialog.returnValue`.

**Атрибут `open`:** присутствие атрибута делает диалог видимым (аналог вызова `show()`), отсутствие — скрывает. Не рекомендуется управлять им напрямую вместо методов — теряется focus management.

**`::backdrop`:** псевдоэлемент, автоматически создаваемый браузером при `showModal()`. Находится в top layer под диалогом, стилизуется через CSS.

**`form[method="dialog"]`:** форма внутри диалога с `method="dialog"` при сабмите закрывает диалог и записывает value нажатой кнопки в `dialog.returnValue`.

### Практика и применение

- Подтверждение действий (удаление, выход без сохранения).
- Формы входа/регистрации в оверлее.
- Превью изображений, lightbox.
- Уведомления и алерты с акцентом на действие пользователя.
- Замена `window.confirm()` / `window.alert()` кастомным UI.

### Важные нюансы и краеугольные камни

- **Top layer** — `showModal()` помещает диалог в специальный слой браузера, поэтому `z-index` родительских элементов не влияет. Это решает классическую проблему «модал под другим элементом».
- **Focus trap** реализован автоматически в `showModal()`: Tab и Shift+Tab цикличны внутри диалога; фокус возвращается на триггер при закрытии.
- **Закрытие по Escape** встроено в `showModal()` — вызывает `close()` без дополнительного кода.
- **Анимация** — диалог нельзя анимировать CSS transitions на `display`, но можно через `@starting-style` (Chrome 117+) или классы.
- Атрибут `open` выставленный напрямую (не через `showModal`) не активирует backdrop и focus trap — частая ошибка.
- Поддержка браузеров: все современные браузеры (Chrome 37+, Firefox 98+, Safari 15.4+).

### Примеры

```html
<!-- Разметка диалога -->
<dialog id="confirm-dialog">
  <h2>Подтвердите удаление</h2>
  <p>Это действие необратимо. Продолжить?</p>

  <!-- form[method="dialog"] закрывает диалог при сабмите -->
  <form method="dialog">
    <button value="cancel">Отмена</button>
    <button value="confirm">Удалить</button>
  </form>
</dialog>

<button id="open-btn">Открыть диалог</button>

<script>
  const dialog = document.getElementById('confirm-dialog');
  const openBtn = document.getElementById('open-btn');

  openBtn.addEventListener('click', () => dialog.showModal());

  dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'confirm') {
      console.log('Удаление подтверждено');
    }
  });
</script>

<style>
  /* Стилизация backdrop */
  dialog::backdrop {
    background: rgb(0 0 0 / 60%);
    backdrop-filter: blur(4px);
  }

  dialog {
    border: none;
    border-radius: 8px;
    padding: 1.5rem;
    max-width: 400px;
  }
</style>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- В чём разница между `show()` и `showModal()`? (top layer, focus trap, backdrop, блокировка фона)
- Почему нельзя просто добавить атрибут `open` для модального диалога? (нет focus trap и backdrop)
- Как `<dialog>` помогает с доступностью по сравнению с div? (встроенный `role="dialog"`, focus management, Escape)
- Как реализовать анимацию появления диалога? (`@starting-style`, CSS transitions + классы)
- Что такое top layer и какие ещё элементы туда попадают? (`<dialog>`, Fullscreen API, Popover API)

### Красные флаги (чего не говорить)

- «Для модального окна мне всё равно нужна библиотека» — нативный `<dialog>` решает 90% задач.
- «`z-index: 9999` решит проблему перекрытия» — не решит, top layer выше любого z-index.
- «`open` атрибут и `showModal()` — одно и то же» — принципиально разные механизмы.

### Связанные темы

- [`062-teg-template.md`](./062-teg-template.md) — template часто используется для содержимого диалога
- [`065-skryt-element-bez-css-js.md`](./065-skryt-element-bez-css-js.md) — другие способы скрытия элементов
