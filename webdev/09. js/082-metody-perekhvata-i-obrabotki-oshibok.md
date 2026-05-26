# Q082. Методы перехвата и обработки ошибок в JavaScript?

> **Источник:** [09. js.md](../09.%20js.md) · **Тема:** JavaScript

---

## Короткий ответ

JavaScript предоставляет **4 основных механизма** обработки ошибок: `try/catch/finally` для синхронного кода, `.catch()` / `async/await` с `try/catch` для промисов, глобальные обработчики `window.onerror` и `window.onunhandledrejection` для «последней линии обороны», и `error boundaries` в React (специфично для фреймворков).

---

## Развёрнутый ответ

### Суть

Ошибки в JS делятся на два класса по типу обработки: **синхронные** (бросаются и ловятся в одном стеке вызовов) и **асинхронные** (связаны с промисами и колбэками — их нельзя поймать обычным `try/catch`).

### try / catch / finally

```javascript
// Базовая конструкция
try {
  const data = JSON.parse(userInput); // может бросить SyntaxError
  processData(data);
} catch (err) {
  // err — объект ошибки (или примитив, если бросили throw 'string')
  console.error('Parsing failed:', err.message);
} finally {
  // Выполняется ВСЕГДА: после try, после catch, даже при return/throw
  cleanup();
}

// finally + return: finally перезаписывает return из try/catch!
function tricky() {
  try {
    return 'try';
  } finally {
    return 'finally'; // вернёт 'finally'!
  }
}
```

### Обработка ошибок в асинхронном коде

**Колбэки (устаревший паттерн Node.js — error-first callbacks):**
```javascript
fs.readFile('file.txt', (err, data) => {
  if (err) {
    console.error(err);
    return; // ранний выход — guard clause
  }
  process(data);
});
```

**Promise `.catch()`:**
```javascript
fetch('/api/data')
  .then(r => r.json())
  .then(data => processData(data))
  .catch(err => {
    if (err instanceof TypeError) {
      console.error('Network error:', err.message);
    } else {
      console.error('Processing error:', err.message);
    }
  })
  .finally(() => setLoading(false)); // аналог finally в синхронном коде
```

**async / await + try / catch:**
```javascript
async function loadUser(id) {
  try {
    const response = await fetch(`/api/users/${id}`);

    if (!response.ok) {
      throw new Error(`HTTP error: ${response.status}`);
    }

    return await response.json();
  } catch (err) {
    // Ловит: ошибки сети, HTTP-ошибки, ошибки парсинга JSON
    console.error('Failed to load user:', err);
    throw err; // перебрасываем — пусть caller решает
  }
}
```

**Важный нюанс: try/catch НЕ ловит ошибки внутри setTimeout:**
```javascript
try {
  setTimeout(() => {
    throw new Error('async error'); // НЕ поймается!
  }, 0);
} catch (err) {
  console.log('Never reached');
}

// Обернуть нужно внутри колбэка:
setTimeout(() => {
  try {
    throw new Error('async error'); // поймается
  } catch (err) {
    console.log('Caught:', err.message);
  }
}, 0);
```

### Глобальные обработчики ошибок

```javascript
// Браузер: необработанные синхронные ошибки
window.onerror = function(message, source, lineno, colno, error) {
  reportError({ message, source, lineno, colno, stack: error?.stack });
  return true; // true подавляет вывод ошибки в консоль
};

// Браузер / Node.js: необработанные отклонённые промисы
window.addEventListener('unhandledrejection', (event) => {
  console.error('Unhandled promise rejection:', event.reason);
  event.preventDefault(); // предотвращает вывод в консоль
});

// Node.js: аналоги
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  process.exit(1); // рекомендуется завершить процесс
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled rejection:', reason);
});
```

### Паттерн Result (Railway-Oriented Programming)

Альтернатива исключениям — явные результаты ошибок:

```javascript
// Без исключений — функция всегда возвращает результат
function safeJsonParse(text) {
  try {
    return { ok: true, value: JSON.parse(text) };
  } catch (err) {
    return { ok: false, error: err };
  }
}

const result = safeJsonParse(userInput);
if (result.ok) {
  processData(result.value);
} else {
  showError(result.error.message);
}
```

### Централизованная обработка ошибок

```javascript
// Утилита для оборачивания async функций
function withErrorHandling(fn) {
  return async (...args) => {
    try {
      return await fn(...args);
    } catch (err) {
      errorReporter.report(err);
      throw err;
    }
  };
}

const safeLoadUser = withErrorHandling(loadUser);
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Что произойдёт если в `finally` бросить новую ошибку?** — Оригинальная ошибка из `catch` теряется, пробрасывается новая. Крайне нежелательная практика.
- **Как поймать ошибку из `Promise.all` если только один из промисов упал?** — Через `.catch()` или `try/catch` с `await`; для частичных результатов — `Promise.allSettled()`.
- **Нужно ли `await` внутри try/catch для перехвата ошибки промиса?** — Да: `try { const data = await fetch() }` — ошибка поймается. Без `await` промис не разворачивается в данном стеке.

### Красные флаги (чего не говорить)

- «`try/catch` ловит ошибки внутри `setTimeout`» — не ловит! Это частая ошибка.
- Не обрабатывать ошибки вообще (глотать в пустом `catch`).

### Связанные темы

- `081-tipy-oshibok-v-javascript.md`
- `076-tipy-taymerov-v-javascript.md`
- `077-kak-rabotaet-kontekst-vypolneniya-execution-context.md`
