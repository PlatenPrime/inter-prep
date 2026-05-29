# Q045. Как отрендерить HTML код в React-компоненте?

> **Источник:** [15. react.md](../15.%20react.md) · **Тема:** React

---

## Короткий ответ

Используйте prop `dangerouslySetInnerHTML={{ __html: htmlString }}` — React намеренно требует этот verbose API, чтобы разработчик осознанно брал ответственность за XSS-риски. Альтернатива — парсить HTML в React-элементы через библиотеки типа `html-react-parser`. Никогда не передавайте в `__html` неочищенный пользовательский ввод.

---

## Развёрнутый ответ

### Суть и определение

React по умолчанию **экранирует** все строки в JSX — это защита от XSS. Для вставки сырого HTML нужен обходной путь с явным указанием «я знаю, что делаю».

### Способы рендеринга HTML

**1. dangerouslySetInnerHTML — встроенный способ**

```tsx
interface RichTextProps {
  html: string;
}

const RichText: React.FC<RichTextProps> = ({ html }) => (
  <div dangerouslySetInnerHTML={{ __html: html }} />
);
```

⚠️ Двойные фигурные скобки — не опечатка: внешние `{}` — JSX-выражение, внутренние `{}` — объект с полем `__html`. Поле `__html` — намеренно длинное имя как предупреждение.

**2. html-react-parser — конвертация в React-элементы**

```tsx
import parse from 'html-react-parser';

const ArticleContent: React.FC<{ html: string }> = ({ html }) => (
  <article>{parse(html)}</article>
);

// html-react-parser поддерживает replace для кастомизации тегов:
import parse, { domToReact, DOMNode, Element } from 'html-react-parser';

const renderHtml = (html: string) =>
  parse(html, {
    replace: (domNode) => {
      if (domNode instanceof Element && domNode.name === 'a') {
        return (
          <a
            href={domNode.attribs.href}
            target="_blank"
            rel="noopener noreferrer"
          >
            {domToReact(domNode.children as DOMNode[])}
          </a>
        );
      }
    },
  });
```

**3. Очистка HTML перед вставкой (DOMPurify)**

```tsx
import DOMPurify from 'dompurify';

const SafeHtml: React.FC<{ rawHtml: string }> = ({ rawHtml }) => {
  const cleanHtml = DOMPurify.sanitize(rawHtml, {
    ALLOWED_TAGS: ['p', 'strong', 'em', 'ul', 'li', 'a', 'h1', 'h2', 'h3'],
    ALLOWED_ATTR: ['href', 'rel', 'target'],
  });

  return <div dangerouslySetInnerHTML={{ __html: cleanHtml }} />;
};
```

### Практика и применение

- **CMS-контент**: статьи из Headless CMS (WordPress, Contentful) содержат HTML — нужно рендерить
- **Rich text editors**: TipTap, Quill, Draft.js — сохраняют HTML; рендер для просмотра
- **Email templates preview**: preview HTML-письма
- **Legacy системы**: интеграция с HTML из старых WYSIWYG

### Важные нюансы и краеугольные камни

- **XSS-атака**: `<img onerror="alert(document.cookie)" src="x" />` — если передать без очистки, выполнится JS
- `dangerouslySetInnerHTML` **не работает** для `<script>` тегов (браузер не выполняет скрипты вставленные через innerHTML)
- `dangerouslySetInnerHTML` и `children` **несовместимы** — React выдаст ошибку
- **Server-side rendering (Next.js)**: DOMPurify нужен в браузерном окружении; для SSR — `isomorphic-dompurify` или серверная очистка
- `html-react-parser` лучше для случаев, когда нужно стилизовать/интерактировать с элементами HTML

### Примеры

```tsx
// Полная цепочка: получить → очистить → отрендерить
import DOMPurify from 'dompurify';

const BlogPost: React.FC<{ title: string; htmlContent: string }> = ({ title, htmlContent }) => {
  // Очистка происходит один раз при рендере компонента
  const safeHtml = useMemo(
    () => DOMPurify.sanitize(htmlContent),
    [htmlContent]
  );

  return (
    <article>
      <h1>{title}</h1>
      <div
        className="prose"
        dangerouslySetInnerHTML={{ __html: safeHtml }}
      />
    </article>
  );
};

// Для Next.js (SSR) — серверная очистка
// pages/post.tsx
export async function getStaticProps() {
  const post = await fetchPost();
  const safeHtml = sanitizeHtml(post.content, { /* allowedTags */ });
  return { props: { ...post, content: safeHtml } };
}
```

---

## На что обратить внимание на собеседовании

### Каверзные follow-up (что спросят дальше)

- **Почему prop называется dangerouslySetInnerHTML?** — намеренное предупреждение; `__html` ключ — ещё один сигнал «это опасно»
- **Как защититься от XSS?** — DOMPurify.sanitize перед вставкой; Content-Security-Policy заголовок на сервере
- **Чем html-react-parser лучше dangerouslySetInnerHTML?** — возвращает React-элементы с возможностью кастомизации и привязкой хуков

### Красные флаги (чего не говорить)

- «dangerouslySetInnerHTML безопасен для любого HTML» — только для доверенного или очищенного HTML
- «Пользовательский ввод можно вставлять напрямую» — это прямая XSS-уязвимость

### Связанные темы

- `005-chto-takoe-jsx.md`
- `006-raznica-mezhdu-jsx-i-html.md`
- `063-luchshie-praktiki-bezopasnosti-v-react.md`
