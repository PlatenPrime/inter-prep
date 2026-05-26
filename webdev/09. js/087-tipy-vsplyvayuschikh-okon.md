# Q087. Типы всплывающих окон в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

В JavaScript существуют **4 типа встроенных диалоговых окон** (Web API): `alert()` — показывает сообщение, `confirm()` — возвращает `true`/`false` по кнопкам OK/Cancel, `prompt()` — запрашивает текстовый ввод (возвращает строку или `null`), и `window.open()` — открывает новое окно/вкладку. Все они **блокируют** JavaScript поток выполнения (synchronous, blocking). В современных приложениях заменяются кастомными модальными окнами.

---

## Развёрнутый ответ

### Суть

Все три диалога (`alert`, `confirm`, `prompt`) — это методы объекта `window`. Они **блокируют event loop** браузера до закрытия диалога, что плохо для UX и невозможно для стилизации. Поэтому в modern web они практически не используются в production.

### `alert(message)` — информационное сообщение

```javascript
// Показывает диалог с кнопкой OK
alert('Сохранение завершено!');
// Всегда возвращает undefined

// Преобразует аргумент в строку
alert(42);       // "42"
alert([1, 2, 3]); // "1,2,3"
alert(null);     // "null"
```

### `confirm(message)` — подтверждение действия

```javascript
// Показывает диалог с кнопками OK (true) и Cancel (false)
const isConfirmed = confirm('Удалить запись?');

if (isConfirmed) {
  deleteRecord();
} else {
  console.log('Отмена');
}

// При нажатии ESC или закрытии → false
```

### `prompt(message, defaultValue?)` — ввод данных

```javascript
// Показывает диалог с полем ввода
const name = prompt('Введите ваше имя:', 'Аноним');

// Результат:
// - Строка с введённым значением (OK)
// - '' — если поле пустое и нажат OK
// - null — если нажат Cancel или ESC

if (name !== null) {
  console.log(`Привет, ${name || 'незнакомец'}!`);
}

// Всегда возвращает строку или null (не number!)
const age = Number(prompt('Введите возраст:'));
```

### `window.open(url, target, features)` — новое окно/вкладка

```javascript
// Открыть в новой вкладке
window.open('https://example.com', '_blank');

// Открыть в новом окне с размерами
const popup = window.open(
  'https://example.com',
  'popup',
  'width=400,height=300,scrollbars=yes'
);

// Ссылка на открытое окно
if (popup) {
  popup.focus();
} else {
  alert('Разрешите всплывающие окна в браузере');
}

// Закрыть окно из родительского скрипта
popup.close();
```

### Проблемы встроенных диалогов

1. **Блокируют поток** — JavaScript не выполняется пока диалог открыт.
2. **Нельзя стилизовать** — внешний вид зависит от браузера.
3. **UX** — пользователи привыкли их игнорировать/закрывать.
4. **Безопасность** — браузеры могут блокировать диалоги при частом вызове.
5. **Нет async** — не работают с промисами нативно.

### Современная альтернатива: кастомные модальные окна

```javascript
// React: кастомный dialog
function ConfirmDialog({ message, onConfirm, onCancel }) {
  return (
    <dialog open>
      <p>{message}</p>
      <button onClick={onConfirm}>OK</button>
      <button onClick={onCancel}>Отмена</button>
    </dialog>
  );
}

// Promise-based confirm (аналог нативного confirm)
function showConfirm(message) {
  return new Promise((resolve) => {
    const dialog = document.createElement('dialog');
    dialog.innerHTML = `
      <p>${message}</p>
      <button id="ok">OK</button>
      <button id="cancel">Отмена</button>
    `;

    dialog.querySelector('#ok').onclick = () => {
      dialog.close();
      resolve(true);
    };

    dialog.querySelector('#cancel').onclick = () => {
      dialog.close();
      resolve(false);
    };

    document.body.appendChild(dialog);
    dialog.showModal(); // нативный HTML <dialog>
  });
}

// Использование как обычный confirm, но async
const confirmed = await showConfirm('Удалить запись?');
if (confirmed) deleteRecord();
```

### HTML `<dialog>` — нативный элемент (современный стандарт)

```javascript
const dialog = document.querySelector('#my-dialog');

// Открыть
dialog.showModal(); // блокирует фон (модальный)
dialog.show();      // не блокирует фон (немодальный)

// Закрыть
dialog.close();
dialog.close('result'); // передать результат

// Событие закрытия
dialog.addEventListener('close', () => {
  console.log(dialog.returnValue); // значение из close()
});
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему `alert` блокирует event loop?** — Диалог управляется операционной системой, браузер ждёт ответа пользователя перед возвратом управления JavaScript.
- **Что вернёт `prompt`, если пользователь нажмёт Cancel?** — `null` (не пустую строку), нужно проверять `=== null`.
- **Какой нативный HTML-элемент заменяет кастомные модалки?** — `<dialog>` с методами `showModal()` и `show()`.

### Красные флаги (чего не говорить)

- Предлагать `alert`/`confirm` для production UI — только для отладки.
- Путать `null` (Cancel в prompt) и `''` (пустой ввод + OK).

### Связанные темы

- `076-tipy-taymerov-v-javascript.md`
- `082-metody-perekhvata-i-obrabotki-oshibok.md`
