# Q068. Что такое атрибут `target`? Какие значения он принимает?

> **Источник:** [05. html.md](../05.%20html.md) · **Тема:** HTML

---

## Короткий ответ

Атрибут `target` указывает browsing context (контекст просмотра), в котором откроется связанный ресурс. Применяется к элементам `<a>`, `<form>`, `<base>`, `<area>` и `<iframe>`. Ключевые значения: `_self` (текущий контекст, по умолчанию), `_blank` (новая вкладка/окно), `_parent` (родительский контекст), `_top` (верхний контекст). При использовании `_blank` обязательно добавлять `rel="noopener noreferrer"` для безопасности.

---

## Развёрнутый ответ

### Суть и определение

Browsing context — среда, в которой отображается документ: вкладка браузера, окно или iframe. `target` определяет, в какую из этих сред будет загружен ресурс при переходе по ссылке или отправке формы.

Если значение не совпадает ни с одним зарезервированным именем (`_self`, `_blank`, `_parent`, `_top`, `_unfencedTop`), браузер интерпретирует его как **имя контекста**: найдёт iframe или окно с таким именем, или создаст новое.

### Как это работает

**Зарезервированные значения:**

| Значение | Поведение |
|----------|-----------|
| `_self` | Загрузить в текущем browsing context (значение по умолчанию) |
| `_blank` | Загрузить в новой вкладке или окне |
| `_parent` | Загрузить в родительском контексте; если нет родителя — как `_self` |
| `_top` | Загрузить в контексте верхнего уровня; если нет iframe-иерархии — как `_self` |
| `_unfencedTop` | Выйти из fenced frame на верхний уровень (Ads API, экспериментально) |

**Именованный target:**
```html
<a href="/page.html" target="preview-frame">Открыть в превью</a>
<iframe name="preview-frame" src="about:blank"></iframe>
```
Ссылка загрузит `/page.html` в iframe с именем `preview-frame`.

**`target` на `<base>`:**
```html
<base target="_blank" />
```
Устанавливает target по умолчанию для всех ссылок на странице — применяется если у элемента нет собственного `target`.

### Практика и применение

- `_blank` — открытие внешних ресурсов чтобы не уводить пользователя с сайта.
- `_top` — выход из iframe-иерархии (например, OAuth завершает в `_top` чтобы выйти из попапа).
- `_parent` — в многоуровневых iframe (framesets — legacy).
- Именованный target — встроенные превью, IDE-like интерфейсы (редактор + предпросмотр).

### Важные нюансы и краеугольные камни

- **`_blank` и безопасность (tabnabbing):** страница, открытая в `_blank`, получает доступ к `window.opener` родителя и может выполнить `window.opener.location = 'phishing-site.com'`. Решение: `rel="noopener"`.
- **`rel="noreferrer"`** неявно включает `noopener` и дополнительно убирает заголовок `Referer`.
- Современные браузеры (Chrome 88+, Firefox, Safari) автоматически применяют `noopener` к `_blank`-ссылкам — но явное указание остаётся best practice для совместимости.
- `target="_blank"` без `rel="noopener"` — частая находка в аудитах безопасности.
- С точки зрения UX следует использовать `_blank` осторожно — неожиданное открытие новой вкладки снижает предсказуемость интерфейса; для accessibility стоит предупреждать через `aria-label` или визуальный индикатор.

### Примеры

```html
<!-- _self: явно указан, поведение по умолчанию -->
<a href="/about" target="_self">О нас</a>

<!-- _blank: безопасно с rel -->
<a
  href="https://external.example.com"
  target="_blank"
  rel="noopener noreferrer"
  aria-label="Внешний ресурс (откроется в новой вкладке)"
>
  Документация
</a>

<!-- Именованный контекст: ссылка → iframe -->
<nav>
  <a href="/docs/intro.html" target="doc-viewer">Введение</a>
  <a href="/docs/api.html" target="doc-viewer">API</a>
</nav>
<iframe name="doc-viewer" src="/docs/intro.html" width="800" height="600"></iframe>

<!-- _top: выход из iframe на верхний уровень -->
<a href="/dashboard" target="_top">Вернуться в приложение</a>

<!-- base: все ссылки страницы открываются в _blank -->
<head>
  <base href="https://docs.example.com/" target="_blank" />
</head>

<!-- form: target на форме -->
<form action="/search" method="get" target="_blank">
  <input type="search" name="q" />
  <button type="submit">Поиск</button>
</form>
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up

- Что такое tabnabbing и как `rel="noopener"` от него защищает? (opener access → redirect; noopener nullifies window.opener)
- Чем `noopener` отличается от `noreferrer`? (noreferrer убирает Referer-заголовок + неявный noopener)
- На каких элементах работает `target`? (`<a>`, `<form>`, `<base>`, `<area>`, `<iframe>`)
- Что произойдёт если `target` равен несуществующему имени? (создастся новый browsing context с этим именем)
- Почему `<base target="_blank">` может быть опасен? (все ссылки страницы внезапно открываются в новой вкладке)

### Красные флаги (чего не говорить)

- «`target="_blank"` всегда безопасен» — без `rel="noopener"` уязвим к tabnabbing.
- «`_parent` и `_top` — одно и то же» — `_parent` — ближайший родитель, `_top` — самый верхний.
- «`target` работает только на `<a>`» — работает на `<form>`, `<base>`, `<area>`, `<iframe>` тоже.

### Связанные темы

- [`067-atribut-rel-nofollow.md`](./067-atribut-rel-nofollow.md) — атрибут rel и его значения
- [`061-iframe-vs-embed.md`](./061-iframe-vs-embed.md) — browsing context в iframe
